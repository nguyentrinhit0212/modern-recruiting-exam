import NestedCheckboxes, {CheckBoxes, CheckboxState} from "@/components/nested-checkboxes/nested-checkboxes";
import HeatmapSorting, {Node} from "@/components/heatmap-sorting/heatmap-sorting";

const checkBoxesModel: CheckBoxes[] = [
    {
        label: 'Country A',
        checked: CheckboxState.DEFAULT,
        items: [
            {
                label: 'State A',
                checked: CheckboxState.DEFAULT,
                items: [
                    {
                        label: 'County A',
                        checked: CheckboxState.DEFAULT,
                        items: []
                    }
                ]
            },
            {
                label: 'State B',
                checked: CheckboxState.DEFAULT,
                items: []
            }
        ]
    },
    {
        label: 'Country B',
        checked: CheckboxState.INDETERMINATE,
        items: [
            {
                label: 'State C',
                checked: CheckboxState.CHECKED,
                items: []
            },
            {
                label: 'State D',
                checked: CheckboxState.DEFAULT,
                items: []
            }
        ]
    },
    {
        label: 'Country C',
        checked: CheckboxState.DEFAULT,
        items: []
    },
    {
        label: 'Country D',
        checked: CheckboxState.DEFAULT,
        items: []
    },
    {
        label: 'Country E',
        checked: CheckboxState.DEFAULT,
        items: []
    }
]

export default function HomePage() {
    const generateData = (count: number): Node[] => {
        const data: Node[] = [];
        const names = ['AAPL', 'MSFT', 'AMZN', 'GOOGL', 'TSLA', 'FB', 'BRK-A', 'JNJ', 'JPM', 'V', 'WMT', 'PG', 'MA', 'UNH', 'HD'];

        for (let i = 0; i < count; i++) {
            const randomValue = Math.floor(Math.random() * 40) - 20; // Random value from -20 to 19
            const randomIndex = Math.floor(Math.random() * names.length); // Randomly select a name from the array
            const newItem: Node = {
                name: names[randomIndex],
                value: randomValue
            };
            data.push(newItem);
        }
        return data;
    };


    return <div className="min-h-screen bg-white">
        <NestedCheckboxes data={checkBoxesModel}/>
        <HeatmapSorting items={generateData(20)} height={800} width={1200}/>
    </div>
}