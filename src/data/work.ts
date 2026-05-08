export interface WorkItem {
  key: string;
  num: string;
  url?: string;
}

export const WORK_ITEMS: WorkItem[] = [
  { key: "halo", num: "N° 01" },
  { key: "lattice", num: "N° 02", url: "https://www.expensify.com" },
  { key: "meridian", num: "N° 03", url: "https://www.epam.com" },
  { key: "figment", num: "N° 04", url: "https://www.epam.com" },
  { key: "prism", num: "N° 05", url: "https://rs.school" },
];
