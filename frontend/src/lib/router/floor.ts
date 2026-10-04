import { normalizeText } from "../text/normalize";

export function createFloor(phrases: {
  ar: string[];
  en: string[];
}): (text: string) => boolean {
  const needles = [...phrases.ar, ...phrases.en]
    .map(normalizeText)
    .filter((phrase) => phrase.length > 0);

  return (text: string): boolean => {
    const haystack = normalizeText(text);
    return needles.some((needle) => haystack.includes(needle));
  };
}
