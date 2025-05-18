function getMaxValue(data: Record<string, number>) {
  return Object.entries(data).reduce(
    (max, entry) => (entry[1] > max[1] ? entry : max),
    ["", -Infinity]
  );
}
function formatNumberAbbreviated(value: number) {
  if (value >= 1_000_000_000)
    return (value / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + " billones";
  if (value >= 1_000_000)
    return (value / 1_000_000).toFixed(1).replace(/\.0$/, "") + " millones";
  if (value >= 1_000)
    return (value / 1_000).toFixed(1).replace(/\.0$/, "") + " mil";
  return value.toString();
}
export { getMaxValue, formatNumberAbbreviated };
