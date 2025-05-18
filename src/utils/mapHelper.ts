type InputData = { [key: string]: string };
type IsoMap = { [key: string]: string };

const defaultIsoMap: IsoMap = {
  "Distrito Capital de Bogotá": "CO-BOL",
  Antioquia: "CO-ANT",
  "Valle del Cauca": "CO-VAC",
  Cundinamarca: "CO-DC",
  Santander: "CO-SAN",
  Atlántico: "CO-ATL",
  Bolívar: "CO-BOY",
  Magdalena: "CO-MAG",
  Nariño: "CO-NAR",
  Boyacá: "CO-CAL",
  Tolima: "CO-TOL",
  "Norte de Santander": "CO-NSA",
  Caldas: "CO-CAQ",
  Huila: "CO-HUI",
  Meta: "CO-MET",
  Risaralda: "CO-RIS",
  Quindío: "CO-QUI",
  Cauca: "CO-CES",
  Casanare: "CO-CAU",
  Cesar: "CO-COR",
  Córdoba: "CO-CHO",
  Putumayo: "CO-PUT",
  Sucre: "CO-SUC",
  "La Guajira": "CO-LAG",
  Caquetá: "CO-CAS",
  Arauca: "CO-ARA",
  "San Andrés, Providencia y Santa Catalina": "CO-SAP",
  Chocó: "CO-CUN",
  Amazonas: "CO-AMA",
  Vichada: "CO-VID",
  Guaviare: "CO-GUV",
  Vaupés: "CO-VAU",
  Guainía: "CO-GUA",
};

function mapToISOObject<T extends InputData>(
  data: T[],
  labelKey: keyof T,
  valueKey: keyof T,
  map: IsoMap = defaultIsoMap
): Record<string, number> {
  return data.reduce(
    (acc, item) => {
      const name = item[labelKey] as string;
      const iso = map[name];
      if (iso) {
        acc[iso] = parseInt(item[valueKey] as string, 10);
      }
      return acc;
    },
    {} as Record<string, number>
  );
}

export default mapToISOObject;
