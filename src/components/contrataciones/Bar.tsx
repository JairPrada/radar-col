import { fetchProcessByYear } from "@/services/contrataciones";
import React, { useEffect } from "react";
import CustomBarChartOne from "../charts/bar/CustomBarChart";

interface BarChartProps {
    year: number;
    type: "bar" | "line" | "area" | "pie" | "radar" | "scatter";
}

interface DataItem {
    cantidad: number;
    mes: string;
}

export const BarChart = ({ year, type }: BarChartProps) => {
    const [data, setData] = React.useState<DataItem[]>([]);
    const [loading, setLoading] = React.useState<boolean>(false);
    async function fetchData() {
        setLoading(true);
        const response = await fetchProcessByYear("procesos_por_mes", year);
        setData(response);
        setLoading(false);
    }

    useEffect(() => {
        (async () => {
            await fetchData();
        })()
    }, [year]);

    if (Object.keys(data).length === 0 || loading) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="flex justify-center items-center h-full">
                    <p className="text-gray-500 dark:text-gray-400">Cargando...</p>
                </div>
            </div>
        );
    }
    return (
        <CustomBarChartOne
            title={`Contratos por mes en ${year}`}
            chartType={type}
            chartHeight={300}
            series={[
                {
                    name: "2023",
                    data: data.map((item) => item.cantidad),
                },
            ]}
            options={{
                colors: ["#3b82f6"],
                plotOptions: {
                    bar: {
                        horizontal: false,
                        columnWidth: "39%",
                        borderRadius: 5,
                        borderRadiusApplication: "end",
                    },
                },
                xaxis: {
                    title: {
                        text: "Contratos",
                        offsetX: 0,
                        offsetY: 0,
                        style: {
                            color: undefined,
                            fontSize: '12px',
                            fontFamily: 'Helvetica, Arial, sans-serif',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-title',
                        },
                    },
                    categories: data.map((item) => {
                        const date = new Date(item.mes).toLocaleString("es-ES", { month: "long" });
                        return date[0].toUpperCase() + date.slice(1);
                    }),
                },
                dataLabels: {
                    enabled: false,
                    formatter: (val) => `$${val.toLocaleString()}`
                }
            }}
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