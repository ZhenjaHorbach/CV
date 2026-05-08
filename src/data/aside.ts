export interface ContactAside {
  labelKey: string;
  bodyKey: string;
  highlight?: boolean;
}

export const CONTACT_ASIDES: ContactAside[] = [
  { labelKey: "contact.aside.currentlyLabel", bodyKey: "contact.aside.currentlyBody", highlight: true },
  { labelKey: "contact.aside.basedInLabel", bodyKey: "contact.aside.basedInBody" },
  { labelKey: "contact.aside.languagesLabel", bodyKey: "contact.aside.languagesBody" },
];
