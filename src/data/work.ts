export interface WorkItem {
  key: string;
  num: string;
  url?: string;
  modal?: "halo";
}

export const WORK_ITEMS: WorkItem[] = [
  { key: "halo", num: "N° 01", modal: "halo" },
  { key: "lattice", num: "N° 02", url: "https://www.expensify.com" },
  { key: "meridian", num: "N° 03", url: "https://www.epam.com" },
  { key: "figment", num: "N° 04", url: "https://www.epam.com" },
  { key: "prism", num: "N° 05", url: "https://rs.school" },
];

export interface HaloProject {
  key: string;
  url: string;
  year: string;
}

export const HALO_PROJECTS: HaloProject[] = [
  { key: "collecta", url: "https://zhenjahorbach.github.io/collecta/", year: "2025" },
];
