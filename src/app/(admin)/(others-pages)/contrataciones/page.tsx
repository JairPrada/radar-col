"use client";

import { BarChart } from "@/components/contrataciones/Bar";
import MapCard from "@/components/contrataciones/Mapa";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import { ChevronDownIcon } from "@/icons";
import React from "react";

export default function BlankPage() {
  const [year, setYear] = React.useState<number>(new Date().getFullYear(),);
  const options = [
    { value: "2025", label: "2025" },
    { value: "2024", label: "2024" },
    { value: "2023", label: "2023" },
    { value: "2022", label: "2022" },
    { value: "2021", label: "2021" },
    { value: "2020", label: "2020" },
    { value: "2019", label: "2019" },
    { value: "2018", label: "2018" },
  ];
  const handleSelectChange = (value: string) => {
    setYear(+value);
    console.log("Selected value:", value);
  };
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6 relative">
      <div className="col-span-12 sticky top-20 z-10 text-gray-700 dark:bg-gray-900 dark:text-gray-400 p-4 rounded-lg shadow-sm border dark:border-gray-700">
        <div>
          <Label>Seleccion el año</Label>
          <div className="relative">
            <Select
              options={options}
              placeholder="Seleccion el año"
              onChange={handleSelectChange}
              className="dark:bg-dark-900"
              defaultValue={year.toString()}
            />
            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
              <ChevronDownIcon />
            </span>
          </div>
        </div>
      </div>
      <div className="col-span-12 space-y-6 xl:col-span-6">
        <MapCard
          year={year}
          title={`Contratos por departamento en ${year}`}
          description="Número de contratos por departamento"
        />
      </div>
      <div className="col-span-12 xl:col-span-6 flex flex-col gap-2">
        <BarChart
          year={year}
          type="line"
        />
        <BarChart
          year={year}
          type="bar"
        />
      </div>


      <div className="col-span-12">
      </div>

      <div className="col-span-12 xl:col-span-5">
      </div>

      <div className="col-span-12 xl:col-span-7">
      </div>
    </div>
  );
}



