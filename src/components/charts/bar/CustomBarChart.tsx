"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { MoreDotIcon } from "@/icons";
import { useState } from "react";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";

// Dynamic import for better performance
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
    loading: () => <div className="min-h-[180px] flex items-center justify-center">Loading chart...</div>
});

const defaultOptions: ApexOptions = {
    colors: ["#465fff"],
    chart: {
        fontFamily: "Outfit, sans-serif",
        type: "bar",
        toolbar: { show: false },
        animations: { enabled: true }
    },
    plotOptions: {
        bar: {
            horizontal: false,
            columnWidth: "39%",
            borderRadius: 5,
            borderRadiusApplication: "end",
        },
    },
    dataLabels: { enabled: false },
    stroke: {
        show: true,
        width: 3,
        colors: ["transparent"],
    },
    xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: { show: true }
    },
    yaxis: {
        title: { text: undefined },
        labels: { show: true }
    },
    grid: {
        show: true,
        borderColor: "#f1f1f1",
        strokeDashArray: 5,
        yaxis: { lines: { show: true } }
    },
    fill: { opacity: 1 },
    tooltip: {
        enabled: true,
        x: { show: false },
        y: { formatter: (val: number) => val.toString() }
    },
    legend: {
        show: true,
        position: "top",
        horizontalAlign: "left",
        fontFamily: "Outfit",
    }
};

const defaultSeries: ApexAxisChartSeries = [{
    name: "Sales",
    data: [168, 385, 201, 298, 187, 195, 291, 110, 215, 390, 280, 112]
}];

interface DropdownItemConfig {
    label: string;
    onClick: () => void;
    className?: string;
    icon?: React.ReactNode;
}

interface CustomBarChartOneProps {
    title?: string;
    options?: ApexOptions;
    series?: ApexAxisChartSeries;
    dropdownItems?: DropdownItemConfig[];
    className?: string;
    chartHeight?: number;
    showDropdown?: boolean;
    chartType?: "bar" | "line" | "area" | "pie" | "radar" | "scatter";
    isLoading?: boolean;
    onRefresh?: () => void;
}

export default function CustomBarChartOne({
    title = "Monthly Sales",
    options = defaultOptions,
    series = defaultSeries,
    dropdownItems = [
        {
            label: "View More",
            onClick: () => console.log("View More clicked"),
            className: "flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300",
        },
        {
            label: "Delete",
            onClick: () => console.log("Delete clicked"),
            className: "flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300",
        },
    ],
    className = "overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6",
    chartHeight = 180,
    showDropdown = true,
    chartType = "bar",
    isLoading = false,
    onRefresh
}: CustomBarChartOneProps) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
    const closeDropdown = () => setDropdownOpen(false);
    return (
        <div className={className}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                    {title}
                </h3>
                {showDropdown && (
                    <div className="relative">
                        <button
                            onClick={toggleDropdown}
                            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center "
                            aria-label="Chart options"
                            aria-expanded={dropdownOpen}
                        >
                            <MoreDotIcon className="w-5 h-5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
                        </button>

                        <Dropdown
                            isOpen={dropdownOpen}
                            onClose={closeDropdown}
                            className="absolute right-0 mt-2 w-48 origin-top-right z-10"
                        >
                            {dropdownItems.map((item, index) => (
                                <DropdownItem
                                    key={`dropdown-item-${index}`}
                                    onClick={() => {
                                        item.onClick();
                                        closeDropdown();
                                    }}
                                    className={item.className}
                                >
                                    {item.icon && <span className="mr-2">{item.icon}</span>}
                                    {item.label}
                                </DropdownItem>
                            ))}
                            {onRefresh && (
                                <DropdownItem
                                    onClick={() => {
                                        onRefresh();
                                        closeDropdown();
                                    }}
                                    className="flex items-center text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5"
                                >
                                    <span className="mr-2">↻</span>
                                    Refresh Data
                                </DropdownItem>
                            )}
                        </Dropdown>
                    </div>
                )}
            </div>
            <div className="relative">
                {isLoading ? (
                    <div className="flex items-center justify-center" style={{ height: chartHeight }}>
                        <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-4 w-full"></div>
                    </div>
                ) : (
                    <div className="overflow-x-auto custom-scrollbar">
                        <div className="min-w-[650px] xl:min-w-full">
                            <ReactApexChart
                                options={options}
                                series={series}
                                type={chartType}
                                height={chartHeight}
                                width="100%"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}