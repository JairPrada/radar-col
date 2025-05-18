import { defaultIsoMap } from "../constants";
import { InputData, IsoMap } from "../types";

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
