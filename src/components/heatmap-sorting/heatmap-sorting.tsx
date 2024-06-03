import React, { useEffect, useState } from 'react';

export type Node = {
    name: string;
    value: number;
};

export type Rectangle = {
    x: number;
    y: number;
    width: number;
    height: number;
    value: number;
    name: string;
};

type HeatmapSortingProps = {
    items: Node[];
    width: number;
    height: number;
};

const HeatmapSorting: React.FC<HeatmapSortingProps> = ({ items, width, height }) => {
    const [rectangles, setRectangles] = useState<Rectangle[]>([]);

    useEffect(() => {
        if (!items || items.length === 0) return;

        // Sort items by absolute value
        const sortedItems = [...items].sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
        const totalValue = sortedItems.reduce((sum, node) => sum + Math.abs(node.value), 0);

        const squarify = (children: Node[], row: Node[], x: number, y: number, width: number, height: number): void => {
            if (children.length === 0) {
                if (row.length > 0) layoutRow(row, x, y, width, height);
                return;
            }

            const rowWithChild = [...row, children[0]];

            if (row.length === 0 || worst(row, width, height) >= worst(rowWithChild, width, height)) {
                children.shift();
                squarify(children, rowWithChild, x, y, width, height);
            } else {
                const [newX, newY, newWidth, newHeight] = layoutRow(row, x, y, width, height);
                squarify(children, [], newX, newY, newWidth, newHeight);
            }
        };

        const worst = (row: Node[], width: number, height: number): number => {
            const rowValueSum = row.reduce((sum, node) => sum + Math.abs(node.value), 0);
            const rowArea = (width * height) * (rowValueSum / totalValue);
            let maxAspectRatio = 0;

            for (const node of row) {
                const nodeArea = (Math.abs(node.value) / rowValueSum) * rowArea;
                const aspectRatio = width > height ? Math.max(nodeArea / height, height / nodeArea) : Math.max(nodeArea / width, width / nodeArea);
                maxAspectRatio = Math.max(maxAspectRatio, aspectRatio);
            }

            return maxAspectRatio;
        };

        const layoutRow = (row: Node[], x: number, y: number, width: number, height: number): [number, number, number, number] => {
            const rowValueSum = row.reduce((sum, node) => sum + Math.abs(node.value), 0);
            const rowArea = (width * height) * (rowValueSum / totalValue);
            const isHorizontal = width > height;
            const rowHeight = isHorizontal ? (rowArea / width) : height;
            const rowWidth = isHorizontal ? width : (rowArea / height);

            let offsetX = x;
            let offsetY = y;

            const rowRectangles = row.map(node => {
                const nodeArea = (Math.abs(node.value) / rowValueSum) * rowArea;
                const nodeWidth = isHorizontal ? (nodeArea / rowHeight) : rowWidth;
                const nodeHeight = isHorizontal ? rowHeight : (nodeArea / rowWidth);

                const rect = {
                    x: offsetX,
                    y: offsetY,
                    width: nodeWidth,
                    height: nodeHeight,
                    value: node.value,
                    name: node.name,
                };

                if (isHorizontal) {
                    offsetX += nodeWidth;
                } else {
                    offsetY += nodeHeight;
                }

                return rect;
            });

            setRectangles(prev => [...prev, ...rowRectangles]);

            return isHorizontal ? [x, y + rowHeight, width, height - rowHeight] : [x + rowWidth, y, width - rowWidth, height];
        };

        squarify(sortedItems, [], 0, 0, width, height);

    }, [items, width, height]);

    const getColor = (value: number) => {
        const intensity = Math.min(Math.abs(value) / Math.max(...items.map(item => Math.abs(item.value))), 1);
        const red = value < 0 ? Math.floor(255 * intensity) : 0;
        const green = value > 0 ? Math.floor(255 * intensity) : 0;
        return `rgb(${red}, ${green}, 0)`;
    };

    const getFontSize = (width: number, height: number) => {
        const area = width * height;
        return Math.max(8, Math.min(20, Math.sqrt(area) / 5)); // Adjust the divisor for desired scaling
    };

    return (
        <div className="relative bg-gray-200 w-full h-full">
            {rectangles.map((rectangle, index) => (
                <div
                    key={index}
                    className="absolute border border-gray-400"
                    style={{
                        top: `${rectangle.y}px`,
                        left: `${rectangle.x}px`,
                        width: `${rectangle.width}px`,
                        height: `${rectangle.height}px`,
                        backgroundColor: getColor(rectangle.value),
                        overflow: 'hidden',
                    }}
                >
                    <span style={{
                        color: 'white',
                        fontSize: `${getFontSize(rectangle.width, rectangle.height)}px`,
                        position: 'absolute',
                        top: '5px',
                        left: '5px'
                    }}>
                        {rectangle.name}
                    </span>
                    <span style={{
                        color: 'white',
                        fontSize: `${getFontSize(rectangle.width, rectangle.height)}px`,
                        position: 'absolute',
                        bottom: '5px',
                        right: '5px'
                    }}>
                        {rectangle.value}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default HeatmapSorting