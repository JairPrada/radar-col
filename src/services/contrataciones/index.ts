import mapToISOObject from "@/utils/mapHelper";
import { buildSoqlQuery } from "./queries";
import { QueryType } from "./queries/types";

const BASE_URL = "https://www.datos.gov.co/resource/p6dx-8zbt.json";

async function fetchDepartmentProcess(type: QueryType, year?: number) {
  const query = buildSoqlQuery(type, year);
  const url = `${BASE_URL}${query}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Error al obtener datos");
  const data = await response.json();
  console.log(data);
  const mapData = mapToISOObject(data, "departamento_entidad", "cantidad");
  return mapData;
}

export async function fetchProcessByYear(type: QueryType, year?: number) {
  const query = buildSoqlQuery(type, year);
  const url = `${BASE_URL}${query}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Error al obtener datos");
  const data = await response.json();
  console.log(data);
  return data;
}

export default fetchDepartmentProcess;
