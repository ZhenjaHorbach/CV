export interface NavLink {
  href: string;
  labelKey: string;
}

export const NAV_LINKS: NavLink[] = [
  { href: "#about", labelKey: "nav.about" },
  { href: "#work", labelKey: "nav.work" },
  { href: "#xp", labelKey: "nav.experience" },
  { href: "#skills", labelKey: "nav.stack" },
  { href: "#github", labelKey: "nav.github" },
  { href: "#contact", labelKey: "nav.contact" },
];
