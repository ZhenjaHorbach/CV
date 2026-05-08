export interface MarqueeItem {
  label: string;
  italic?: boolean;
}

const BASE: MarqueeItem[] = [
  { label: "React Native" },
  { label: "TypeScript", italic: true },
  { label: "Expo" },
  { label: "Reanimated", italic: true },
  { label: "Claude API" },
  { label: "MCP", italic: true },
  { label: "Supabase" },
  { label: "Mapbox", italic: true },
];

export const MARQUEE_ITEMS: MarqueeItem[] = BASE;
