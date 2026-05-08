export interface OrbitChip {
  label: string;
  hot?: boolean;
}

export interface OrbitAxis {
  className: "a1" | "a2" | "a3" | "a4";
  radius: number;
  startAngle?: number;
  chips: OrbitChip[];
}

export const ORBITAL_AXES: OrbitAxis[] = [
  {
    className: "a1",
    radius: 50,
    startAngle: 90,
    chips: [
      { label: "React Native", hot: true },
      { label: "React" },
      { label: "TypeScript" },
      { label: "Claude API", hot: true },
    ],
  },
  {
    className: "a2",
    radius: 38,
    startAngle: 45,
    chips: [
      { label: "Expo" },
      { label: "Reanimated" },
      { label: "Supabase" },
      { label: "Node.js", hot: true },
    ],
  },
  {
    className: "a3",
    radius: 22,
    startAngle: 0,
    chips: [
      { label: "GraphQL" },
      { label: "Redux" },
      { label: "Zustand" },
      { label: "Gesture Handler" },
    ],
  },
  {
    className: "a4",
    radius: 14,
    startAngle: 90,
    chips: [
      { label: "Next.js" },
      { label: "RN Navigation" },
      { label: "GH Actions" },
    ],
  },
];

export function chipPosition(
  radius: number,
  startAngleDeg: number,
  idx: number,
  total: number
): { left: string; top: string } {
  const angle = ((startAngleDeg + (idx / total) * 360) * Math.PI) / 180;
  const x = 50 + radius * Math.cos(angle);
  const y = 50 - radius * Math.sin(angle);
  return { left: `${x}%`, top: `${y}%` };
}
