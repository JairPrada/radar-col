import React, { useEffect, useState } from "react";
import CustomBarChartOne from "../charts/bar/CustomBarChart"
import fetchDepartmentProcess from "@/services/contrataciones";
type PopulationRawData = Record<string, number>;

interface PieChartProps {
    year: number;
}

export const PieChart: React.FC<PieChartProps> = ({ year }) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<PopulationRawData>({});
    async function fetchData() {
        setLoading(true);
        const response = await fetchDepartmentProcess("procesos_por_departamento", year);
        setData(response);
        setLoading(false);
    }

    useEffect(() => {
        (async () => {
            await fetchData();
        })()
    }, [year])


    if (Object.keys(data).length === 0 || loading) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="flex justify-center items-center h-full">
                    <p className="text-gray-500 dark:text-gray-400">Cargando...</p>
                </div>
            </div>
        );

    }

    const state = Object.keys(data).length === 0 ? {} : {
        series: [{
            name: "Procesos",
            data: Object.values(data)
        }],
        options: {
            chart: {
                width: 380,
                type: 'pie' as const,
            },
            labels: Object.keys(data),
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }]
        },
    }
    return (
        <CustomBarChartOne
            title={`Contratos por mes en ${year}`}
            chartType="pie"
            chartHeight={300}
            options={state.options} series={state.series}
            dropdownItems={[
                {
                    label: "Exportar PDF",
                    onClick: () => alert("Exportando PDF..."),
                },
                {
                    label: "Comparar años",
                    onClick: () => alert("Comparando años..."),
                    className: "text-blue-500 hover:bg-blue-50",
                },
            ]}
        />
    )
}