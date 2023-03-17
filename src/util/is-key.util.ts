// Then handles promise-usage
export const isKey = (val: unknown): val is string =>
  typeof val === "string" && val.toString() !== "then";
