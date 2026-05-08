export interface HeroStat {
  to: number;
  labelKey: string;
  suffix?: string;
}

export const HERO_STATS: HeroStat[] = [
  { to: 5, labelKey: "hero.stat.yearsLabel" },
  { to: 100, labelKey: "hero.stat.prsLabel", suffix: "+" },
  { to: 3, labelKey: "hero.stat.fullStackLabel" },
];
