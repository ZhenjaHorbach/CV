export const SKILL_GROUPS = ["frontend", "ai", "backend", "tooling"] as const;
export type SkillGroupKey = (typeof SKILL_GROUPS)[number];
