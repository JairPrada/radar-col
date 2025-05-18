"use client";

import Image from "next/image";

import { useEffect, useState } from "react";
import { ArrowRightIcon, MoreDotIcon } from "@/icons";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import ColombiaMap from "../maps/ColombiaMap";
import { formatNumberAbbreviated, getMaxValue } from "@/utils/helpers";
import fetchDepartmentProcess from "@/services/contrataciones";
import { flagsWithIsoCodes, NameDepartments } from "../maps/colombia/constants";
import Button from "../ui/button/Button";

// Paginación
const PAGE_SIZE = 4;

type PopulationRawData = Record<string, number>;
interface MapCardProps {
    title?: string;
    description?: string;
    year: number;
}

export default function MapCard({
    title = "Customers Demographic",
    description = "Number of customer based on country",
    year
}: MapCardProps) {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<PopulationRawData>({});
    const [, maxValue] = getMaxValue(data);
    const [isOpen, setIsOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

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
    }, [year]);

    function toggleDropdown() {
        setIsOpen(!isOpen);
    }

    function closeDropdown() {
        setIsOpen(false);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handelRegionTipShow = (_: unknown, label: any, code: string) => {
        const population: string =
            data?.[code]?.toLocaleString("es-CO") || "Desconocido";
        label.html(`
                                  <div style="text-align: center; font-weight: bold; min-width: 120px bg-[black]">
                                    ${label.html()}<br>
                                    Contratos: ${population}
                                  </div>
                                `);
    }

    const seriesConfig = !loading &&
    {
        regions: [
            {
                scale: ["#D0E8FF", "#0057B7"],
                attribute: "fill",
                values: data,
                min: 0,
                max: maxValue,
                normalizeFunction: "linear",
                legend: {
                    vertical: true,
                    title: "Contratos",
                    labelRender: formatNumberAbbreviated,
                },
            },
        ],
    };

    // Paginación: obtener claves y datos paginados
    const keys = Object.keys(data);
    const totalPages = Math.ceil(keys.length / PAGE_SIZE);
    const paginatedKeys = keys.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

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
        <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            {/* Informacion de las estadisticas */}
            <div className="flex justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                        {title}
                    </h3>
                    <p className="text-theme-sm mt-1 text-gray-500 dark:text-gray-400">
                        {description}
                    </p>
                </div>

                {/* TODO: MEJORAR OPCIONES PARA CARD DE MAPA PERZONALIZADASNumber of customer based on country */}
                <div className="relative inline-block">
                    <button onClick={toggleDropdown} className="dropdown-toggle">
                        <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
                    </button>
                    <Dropdown
                        isOpen={isOpen}
                        onClose={closeDropdown}
                        className="w-40 p-2"
                    >
                        <DropdownItem
                            onItemClick={closeDropdown}
                            className="flex w-full rounded-lg text-left font-normal text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                        >
                            View More
                        </DropdownItem>
                        <DropdownItem
                            onItemClick={closeDropdown}
                            className="flex w-full rounded-lg text-left font-normal text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                        >
                            Delete
                        </DropdownItem>
                    </Dropdown>
                </div>
            </div>
            {/* Seccion del Mapa */}
            <div className="border-gary-200 my-6 overflow-hidden rounded-2xl border bg-gray-50 px-4 py-6 sm:px-6 dark:border-gray-800 dark:bg-gray-900">
                <div
                    id="mapOne"
                    className="mapOne map-btn 2xsm:w-[307px] xsm:w-[358px] -mx-4 -my-6 h-[300px] w-[252px] sm:-mx-6 md:w-[668px] lg:w-[634px] xl:w-[393px] 2xl:w-[554px]"
                >
                    <ColombiaMap
                        onRegionTipShow={handelRegionTipShow}
                        series={seriesConfig ? { regions: seriesConfig.regions } : undefined}
                    />
                </div>
            </div>
            <div className="space-y-5">
                {paginatedKeys.map((key: string) => {
                    const total = Object.values(data).reduce(
                        (acc, curr) => acc + curr,
                        0
                    );
                    const value = data[key];
                    const percentage = Math.round((value / total) * 100);
                    return (
                        <CountryStatsCard
                            key={key}
                            image={`/flags/colombia/departments/${flagsWithIsoCodes?.[key as keyof typeof flagsWithIsoCodes] || "Flag_of_Bogota.svg"}`}
                            title={
                                NameDepartments[key as keyof typeof NameDepartments] ||
                                "Desconocido"
                            }
                            subTitle={`${formatNumberAbbreviated(value)} contratos`}
                            percentage={percentage}
                            onClick={() => alert(`Clicked on ${key}`)}
                        />
                    );
                })}
            </div>
            {/* Controles de paginación */}
            <PaginationControls
                totalPages={totalPages}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
        </div>
    );
}


interface PaginationControlsProps {
    totalPages: number;
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const PaginationControls = ({
    totalPages,
    currentPage,
    setCurrentPage,
}: PaginationControlsProps) => {
    return (
        <>
            {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-end gap-2">
                    {!(currentPage === 1) && <Button
                        size="xs" variant="primary" endIcon={<ArrowRightIcon className="rotate-180" />}
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                    />}
                    <span className="mx-2 text-gray-700 dark:text-gray-200">
                        Página {currentPage} de {totalPages}
                    </span>
                    <Button onClick={() => setCurrentPage((p: number) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} size="xs" variant="primary" endIcon={<ArrowRightIcon />} />
                </div>
            )}
        </>
    )
}

const CountryStatsCard = ({
    image = "/images/country/country-01.svg",
    title = "USA",
    subTitle = "2,379 Customers",
    percentage = 90,
    onClick = () => { },
}) => {
    return (
        <div className="flex items-center justify-between cursor-pointer hover:bg-gray-200/80 hover:dark:bg-gray-800/80 duration-150 p-2 rounded-[4px]" onClick={onClick}>
            <div className="flex items-center gap-3">
                <div className="hidden h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gray-200 sm:flex dark:bg-gray-800">
                    <Image
                        width={60}
                        height={25}
                        src={image}
                        alt={title}
                        className="h-full w-full rounded-full object-cover object-center"
                    />
                </div>
                <div>
                    <p className="text-theme-sm font-semibold text-gray-800 dark:text-white/90">
                        {title}
                    </p>
                    <span className="text-theme-xs block text-gray-500 dark:text-gray-400">
                        {subTitle}
                    </span>
                </div>
            </div>

            <div className="flex w-full max-w-[140px] items-center gap-3">
                <div className="relative block h-2 w-full max-w-[100px] rounded-sm bg-gray-200 dark:bg-gray-800">
                    <div
                        style={{ width: `${percentage}%` }}
                        className={`bg-brand-500 absolute top-0 left-0 flex h-full items-center justify-center rounded-sm text-xs font-medium text-white`}
                    ></div>
                </div>
                <p className="text-theme-sm font-medium text-gray-800 dark:text-white/90">
                    {percentage}%
                </p>
            </div>
        </div >
    );
};
