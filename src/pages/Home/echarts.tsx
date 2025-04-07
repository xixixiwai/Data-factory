import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';

interface InterfaceData {
    id: string;
    name: string;
    status: number;
    category: string;
}

const DataVisualization: React.FC = () => {
    const [interfaceData, setInterfaceData] = useState<InterfaceData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // 模拟从接口模块获取数据
    useEffect(() => {
        const fetchInterfaceData = async () => {
            try {
                // 这里替换为实际的 API 调用
                const mockData: InterfaceData[] = [
                    { id: '1', name: '数据资产1', status: 1, category: '分类1' },
                    { id: '2', name: '数据资产2', status: 0, category: '分类1' },
                    { id: '3', name: '数据资产3', status: 1, category: '分类2' },
                    { id: '4', name: '数据资产4', status: 1, category: '分类2' },
                    { id: '5', name: '数据资产5', status: 0, category: '分类3' },
                ];
                setInterfaceData(mockData);
            } catch (error) {
                console.error('获取接口数据失败', error);
            } finally {
                setLoading(false);
            }
        };

        fetchInterfaceData();
    }, []);

    // 处理数据
    const getCategoryCounts = () => {
        const counts: Record<string, number> = {};
        interfaceData.forEach(item => {
            counts[item.category] = (counts[item.category] || 0) + 1;
        });
        return counts;
    };

    const getStatusCounts = () => {
        const counts: Record<string, number> = {};
        interfaceData.forEach(item => {
            counts[item.status ? '启用' : '停用'] = (counts[item.status ? '启用' : '停用'] || 0) + 1;
        });
        return counts;
    };

    // 图表配置
    const getCategoryChartOption = () => {
        const counts = getCategoryCounts();
        const categories = Object.keys(counts);
        const values = Object.values(counts);

        return {
            title: {
                text: '接口分类统计',
            },
            tooltip: {
                trigger: 'axis',
            },
            xAxis: {
                type: 'category',
                data: categories,
            },
            yAxis: {
                type: 'value',
            },
            series: [
                {
                    data: values,
                    type: 'bar',
                    color: ['#5470c6'],
                },
            ],
        };
    };

    const getStatusChartOption = () => {
        const counts = getStatusCounts();
        const categories = Object.keys(counts);
        const values = Object.values(counts);

        return {
            title: {
                text: '接口状态分布',
            },
            tooltip: {
                trigger: 'item',
            },
            series: [
                {
                    name: '状态',
                    type: 'pie',
                    radius: '50%',
                    data: categories.map((category, index) => ({
                        name: category,
                        value: values[index],
                    })),
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)',
                        },
                    },
                },
            ],
        };
    };

    if (loading) {
        return <div>加载中...</div>;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <ReactECharts option={getCategoryChartOption()} style={{ height: '400px' }} />
            <ReactECharts option={getStatusChartOption()} style={{ height: '400px' }} />
        </div>
    );
};

export default DataVisualization;