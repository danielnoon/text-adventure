import YAML from "yaml";

export function getMeta<T>(md: string): { meta: T | null; body: string } {
  const trimmed = md.trim();
  if (trimmed.slice(0, 3) === "---") {
    const v = trimmed.indexOf("---", 3);
    const fm = trimmed.slice(3, v).trim();
    const meta = YAML.parse(fm) as T;
    const body = trimmed.slice(v + 3).trim();
    return {
      meta,
      body,
    };
  } else {
    return {
      meta: null,
      body: trimmed,
    };
  }
}
