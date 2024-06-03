import {useEffect, useState} from "react";
import Checkbox from "@/components/checkbox/checkbox";
import CollapseIc from "@/assets/dropdown-arrow.png"
import ExpandIc from "@/assets/right-arrow.png"
import Image from "next/image";
export enum CheckboxState {
    DEFAULT = 0,
    CHECKED = 1,
    INDETERMINATE = -1
}
export type CheckBoxes = {
    label: string
    checked: CheckboxState
    items: CheckBoxes[]
}

type CheckBoxesState = {
    label: string
    checked: CheckboxState
    items: CheckBoxesState[]
    expand: boolean
}

type NestedCheckboxesProps = {
    data: CheckBoxes[]
}

export default function NestedCheckboxes({data}: NestedCheckboxesProps) {
    const [dataCheckBoxes, setDataCheckBoxes] = useState(prepareCheckBoxState(data))

    function prepareCheckBoxState(data: CheckBoxes[]): CheckBoxesState[] {
        return data.map(item => {
            return {
                ...item,
                expand: [CheckboxState.CHECKED, CheckboxState.INDETERMINATE].includes(item.checked) ?? false,
                items: item.items.length > 0 ? prepareCheckBoxState(item.items) : []
            }
        })
    }
    function handleCheckBoxExpand (key: string) {
        const indexesStr = key.split("checkboxes-")[1]
        const indexes = indexesStr.split('-').map(Number)
        let updatedData = [...dataCheckBoxes]
        let currentItem
        for (let i = 0; i < indexes.length; i++) {
            if (!currentItem) currentItem = updatedData[indexes[i]]
            else currentItem = currentItem.items[indexes[i]]
            if (i === indexes.length - 1) {
                currentItem.expand = !currentItem.expand
            }
        }
        setDataCheckBoxes(updatedData)
    }

    function handleCheckBoxChange (key: string) {
        function handleCheckItem (data: CheckBoxesState) {
            data.checked = CheckboxState.CHECKED
            if (data.items.length > 0) {
                data.expand = true
                data.items.forEach(item => handleCheckItem(item))
            }
        }
        function handleUncheckItem (data: CheckBoxesState) {
            data.checked = CheckboxState.DEFAULT
            if (data.items.length > 0) {
                data.items.forEach(item => handleUncheckItem(item))
            }
        }

        function computeStatus(data: CheckBoxesState[]) {
            let checked = 0
            let indeterminate = 0
            data.forEach(item => {
                if (item.checked === CheckboxState.CHECKED) checked++
                if (item.checked === CheckboxState.INDETERMINATE) indeterminate++
            })
            if (checked === data.length) return CheckboxState.CHECKED
            else if (checked > 0 || indeterminate > 0) return CheckboxState.INDETERMINATE
            return CheckboxState.DEFAULT
        }

        function handleParentStatus(data: CheckBoxesState[]) {
            if (data.length > 0) {
                const lastItem = data.pop()
                if (lastItem && lastItem.items.length > 0) {
                    lastItem.checked = computeStatus(lastItem.items)
                }
                handleParentStatus(data)
            }
        }

        const indexesStr = key.split("checkboxes-")[1]
        const indexes = indexesStr.split('-').map(Number)
        let updatedData = [...dataCheckBoxes]
        let parentItems = []
        let currentItem
        for (let i = 0; i < indexes.length; i++) {
            if (!currentItem) currentItem = updatedData[indexes[i]]
            else currentItem = currentItem.items[indexes[i]]
            if (i === indexes.length - 1 && currentItem) {
                switch (currentItem.checked) {
                    case CheckboxState.CHECKED:
                        handleUncheckItem(currentItem)
                        break
                    default:
                        handleCheckItem(currentItem)
                        break
                }
                handleParentStatus(parentItems)
            } else parentItems.push(currentItem)
        }
        setDataCheckBoxes(updatedData)
    }

    function renderNestedItem(input: {data: CheckBoxesState[], currentKey?: string, parentKey?: string}) {
        const {data= [], parentKey = ''} = input
        return <ul key={parentKey}>
            {data.map((item: CheckBoxesState, index: number) => {
                const key = parentKey ? `${parentKey}-${index}` : `checkboxes-${index}`
                    return <li key={ key } className={`px-8`}>
                        <div className={"relative"}>
                            {
                                item.items.length > 0 &&
                                <button
                                    className={"absolute top-1.5 -left-4"}
                                    onClick={() => handleCheckBoxExpand(key)}>
                                    {
                                        item.expand ?
                                        <Image width={12} height={12} src={CollapseIc} alt={"collapse-ic"}/>:
                                        <Image width={12} height={12} src={ExpandIc} alt={"expand-ic"}/>
                                    }
                                    </button>
                            }
                            <Checkbox
                                checked={item.checked === CheckboxState.CHECKED}
                                onChange={() => handleCheckBoxChange(key)}
                                label={item.label}
                                indeterminate={item.checked === CheckboxState.INDETERMINATE}
                            />
                        </div>
                        {
                            item.expand && item.items && item.items.length > 0 &&
                            renderNestedItem({
                                data: item.items,
                                parentKey: key,
                            })
                        }
                    </li>
                })}
        </ul>
    }
    return (
        <div className={"text-black flex"}>
            {
                renderNestedItem({
                    data: dataCheckBoxes,
                })
            }
        </div>
    );
}