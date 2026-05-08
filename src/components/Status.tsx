import { useTranslation } from "react-i18next";
import { getCurrentMonthLong, getCurrentYear } from "../i18n/dates";
import type { Lang } from "../i18n";

export function Status() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language as Lang) || "en";
  return (
    <div className="status">
      <span className="dot" />
      <span>{t("status", { month: getCurrentMonthLong(lang), year: getCurrentYear() })}</span>
    </div>
  );
}
