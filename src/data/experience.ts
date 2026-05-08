export const XP_CELLS = ["epam", "expensify", "ai", "rs"] as const;
export type XpCellKey = (typeof XP_CELLS)[number];
