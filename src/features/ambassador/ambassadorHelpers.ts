export function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

export function normalizeArray(values: string[]) {
  return values
    .map((v) => v.trim())
    .filter(Boolean)
    .filter(
      (v, idx, arr) =>
        arr.findIndex((x) => x.toLowerCase() === v.toLowerCase()) === idx
    );
}