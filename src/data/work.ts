export type PreviewVariant = "default" | "amber" | "green" | "blue" | "violet";

export interface WorkItem {
  key: string;
  num: string;
  url?: string;
  previewLabel?: string;
  previewVariant?: PreviewVariant;
}

export const WORK_ITEMS: WorkItem[] = [
  { key: "halo", num: "N° 01" },
  {
    key: "lattice",
    num: "N° 02",
    url: "https://www.expensify.com",
    previewLabel: "Expensify",
    previewVariant: "amber",
  },
  {
    key: "meridian",
    num: "N° 03",
    url: "https://www.epam.com",
    previewLabel: "EPAM",
    previewVariant: "green",
  },
  {
    key: "figment",
    num: "N° 04",
    url: "https://www.epam.com",
    previewLabel: "EPAM",
    previewVariant: "blue",
  },
  {
    key: "prism",
    num: "N° 05",
    url: "https://rs.school",
    previewLabel: "RS School",
    previewVariant: "violet",
  },
];
