const OVERRIDES: Record<string, string> = {
  cn: "zh-CN",
  xx: "und",
};

const langDisplay = new Intl.DisplayNames(undefined, { type: "language" });

export default function formatLanguage(code: string): string {
  const tag = OVERRIDES[code] ?? code;
  return langDisplay.of(tag) ?? code;
}
