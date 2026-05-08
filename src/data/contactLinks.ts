export interface ContactLink {
  key: "email" | "phone" | "github" | "linkedin" | "download";
  href: string;
  display: string;
}

export const CONTACT_LINKS: ContactLink[] = [
  { key: "email", href: "mailto:horbachevgen@gmail.com", display: "horbachevgen@gmail.com" },
  { key: "phone", href: "tel:+48575145771", display: "+48 575 145 771" },
  { key: "github", href: "https://github.com/ZhenjaHorbach", display: "github.com/ZhenjaHorbach" },
  { key: "linkedin", href: "https://www.linkedin.com/in/yauheni-horbach-b53874171/", display: "linkedin.com/in/yauheni-horbach" },
  {
    key: "download",
    href: "https://drive.google.com/uc?export=download&id=1unySPQKnaF-ph1qhJdu5pDkRH4LgP3E3",
    display: "",
  },
];
