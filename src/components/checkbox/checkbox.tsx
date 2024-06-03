import {ChangeEventHandler, useEffect, useRef} from "react";
type CheckboxProps = {
    onChange:  ChangeEventHandler<HTMLInputElement>
    indeterminate: boolean
    checked: boolean
    label: string
}

export default function Checkbox({indeterminate = false, onChange, checked, label, ...props}: CheckboxProps) {
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.indeterminate = indeterminate
            inputRef.current.checked = checked
        }
    }, [indeterminate, checked]);

    return <div className={"flex items-center"}>
        <input
            ref={inputRef}
            onChange={onChange}
            type={"checkbox"}
            checked={checked}
        />
        <label className={"px-1"}>{label}</label>
    </div>
}