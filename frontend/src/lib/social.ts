/**
 * Social accounts of the «قيم تجمعنا» media program. The site links to them but hosts no
 * media itself, embeds nothing and tracks nothing: these are plain links. The footer and the
 * home page show nothing while this list is empty, so no dead links ship.
 */
export type SocialId = "x" | "youtube" | "instagram";

export const PROGRAM_SOCIAL_LINKS: { id: SocialId; label: string; url: string }[] = [
  { id: "x", label: "X", url: "https://x.com/LuminousValues" },
  {
    id: "youtube",
    label: "YouTube",
    url: "https://www.youtube.com/channel/UCca69WQD5QFMBbTbLaygCqQ",
  },
  { id: "instagram", label: "Instagram", url: "https://www.instagram.com/luminous.values/" },
];
