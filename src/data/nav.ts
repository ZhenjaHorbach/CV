export interface NavLink {
  href: string;
  labelKey: string;
}

export const NAV_LINKS: NavLink[] = [
  { href: "#work", labelKey: "nav.work" },
  { href: "#xp", labelKey: "nav.experience" },
  { href: "#github", labelKey: "nav.github" },
  { href: "#skills", labelKey: "nav.stack" },
  { href: "#contact", labelKey: "nav.contact" },
];
