import { QueryType } from "./types";

export function buildSoqlQuery(type: QueryType, year?: number): string {
  const yearFilter = year
    ? `date_extract_y(fecha_de_publicacion_del)=${year}`
    : "";

  const baseFilter = `fecha_de_publicacion_del IS NOT NULL${year ? ` AND ${yearFilter}` : ""
    }`;

  switch (type) {
    case "procesos_por_mes":
      return `?$select=date_trunc_ym(fecha_de_publicacion_del) as mes,count(*) as cantidad` +
        `&$where=${baseFilter}` +
        `&$group=mes&$order=mes`;

    case "estado_procesos":
      return `?$select=estado_del_proceso,count(*) as cantidad` +
        `&$where=estado_del_proceso IS NOT NULL${year ? ` AND ${yearFilter}` : ""}` +
        `&$group=estado_del_proceso&$order=cantidad DESC`;

    case "procesos_por_modalidad":
      return `?$select=modalidad_de_contratacion,count(*) as cantidad` +
        `&$where=modalidad_de_contratacion IS NOT NULL${year ? ` AND ${yearFilter}` : ""}` +
        `&$group=modalidad_de_contratacion&$order=cantidad DESC`;

    case "procesos_por_tipo":
      return `?$select=tipo_de_contrato,count(*) as cantidad` +
        `&$where=tipo_de_contrato IS NOT NULL${year ? ` AND ${yearFilter}` : ""}` +
        `&$group=tipo_de_contrato&$order=cantidad DESC`;

    case "procesos_por_regimen":
      return `?$select=regimen_contratacion,count(*) as cantidad` +
        `&$where=regimen_contratacion IS NOT NULL${year ? ` AND ${yearFilter}` : ""}` +
        `&$group=regimen_contratacion&$order=cantidad DESC`;

    case "procesos_por_entidad":
      return `?$select=nombre_entidad,count(*) as cantidad` +
        `&$where=nombre_entidad IS NOT NULL${year ? ` AND ${yearFilter}` : ""}` +
        `&$group=nombre_entidad&$order=cantidad DESC&$limit=10`;

    case "procesos_por_departamento":
      return `?$select=departamento_entidad,count(*) as cantidad` +
        `&$where=departamento_entidad IS NOT NULL${year ? ` AND ${yearFilter}` : ""}` +
        `&$group=departamento_entidad&$order=cantidad DESC`;

    case "procesos_por_valor":
      return `?$select=departamento_entidad,sum(valor_estimado) as total` +
        `&$where=valor_estimado IS NOT NULL${year ? ` AND ${yearFilter}` : ""}` +
        `&$group=departamento_entidad&$order=total DESC&$limit=10`;

    default:
      return "";
  }
}
