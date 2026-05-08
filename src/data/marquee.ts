export interface MarqueeItem {
  label: string;
  italic?: boolean;
}

const BASE: MarqueeItem[] = [
  { label: "React Native" },
  { label: "TypeScript", italic: true },
  { label: "Expo" },
  { label: "Reanimated", italic: true },
  { label: "Maestro" },
  { label: "Claude API", italic: true },
  { label: "RAG" },
  { label: "Supabase", italic: true },
];

export const MARQUEE_ITEMS: MarqueeItem[] = BASE;
