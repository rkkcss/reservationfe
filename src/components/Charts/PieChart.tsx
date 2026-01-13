import React, { useEffect, useState } from 'react';
import { Pie, PieConfig } from '@ant-design/plots';
interface DataItem {
    type: string;
    value: number;
}

const PieChart: React.FC = () => {
    const [data, setData] = useState<DataItem[]>([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setData([
                { type: 'Foglalt', value: 10 },
                { type: 'Szabad', value: 25 },
                { type: 'Lemondva', value: 18 }
            ]);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const config: PieConfig = {
        data,
        angleField: 'value',
        colorField: 'type',
        tooltip: {
            title: '',
            items: [
                (d: DataItem) => ({
                    name: d.type,
                    value: d.value,
                }),
            ],
        },
        label: {
            text: 'value',
            style: {
                fontWeight: 'bold',
            },
        },
        legend: {
            color: {
                position: 'right',
                rowPadding: 5,
            },
        },
    };

    return <Pie {...config} />;
};

export default PieChart;