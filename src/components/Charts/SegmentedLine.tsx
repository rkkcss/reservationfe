import React, { useEffect, useState } from 'react';
import { Column, ColumnConfig } from '@ant-design/plots';
import { useStatistic } from '../../context/StatisticContext';
import dayjs from 'dayjs';
import { Spin, Empty } from 'antd';
import API from '../../utils/API';
import { useAppSelector } from '../../store/hooks';
import Loading from '../Loading';

const IncomeHistogram: React.FC = () => {
    const { dateRange, selectedEmployeeFilter } = useStatistic();
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState<boolean>(true);
    const { selectedBusinessEmployee } = useAppSelector(state => state.userStore);

    useEffect(() => {
        const fetchData = async () => {
            if (!selectedBusinessEmployee?.business.id) return;
            setLoading(true);
            try {
                const response = await API.get(`/api/statistic/business/${selectedBusinessEmployee.business.id}/income`, {
                    params: {
                        from: dateRange.from,
                        to: dateRange.to,
                        businessEmployeeSearch: selectedEmployeeFilter,
                    },
                });
                setChartData(response.data);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [dateRange, selectedEmployeeFilter, selectedBusinessEmployee]);

    const config: ColumnConfig = {
        data: chartData,
        xField: 'time',
        yField: 'value',
        // --- Histogram style ---
        columnWidthRatio: 0.95,
        theme: 'light',
        style: {
            fill: '#7c3aed',
            fillOpacity: 0.8,
            stroke: '#5b21b6',
            lineWidth: 1,
        },
        state: {
            active: {
                style: { fillOpacity: 1, stroke: '#4c1d95', lineWidth: 2 }
            }
        },
        axis: {
            x: {
                labelFormatter: (val: string) => dayjs(val).format('MM.DD.'),
                tickCount: 10,
            },
            y: {
                labelFormatter: (val: number) => `${(val / 1000).toLocaleString()}k`,
            }
        },
        tooltip: {
            title: (d) => dayjs(d.time).format('YYYY. MMMM D.'),
            items: [{
                channel: 'y',
                name: 'Bevétel',
                valueFormatter: (v) => new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF', maximumFractionDigits: 0 }).format(v)
            }]
        },
        interaction: {
            elementHighlight: true,
        },
    };

    return (
        <>
            <Spin spinning={loading} indicator={<Loading size={30} />} >
                {chartData.length === 0 &&
                    <div>
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </div>
                }
                <Column {...config} />
            </Spin>
        </>
    );
};

export default IncomeHistogram;