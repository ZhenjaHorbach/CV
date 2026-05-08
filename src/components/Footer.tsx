import { useTranslation } from "react-i18next";
import { getCurrentMonthNum, getCurrentYear } from "../i18n/dates";

export function Footer() {
  const { t } = useTranslation();
  const year = getCurrentYear();
  const month = getCurrentMonthNum();
  return (
    <footer>
      <div className="wrap">
        <div>{t("footer.copyright", { year })}</div>
        <div style={{ textAlign: "center" }}>{t("footer.center")}</div>
        <div className="right">{t("footer.updated", { year, month })}</div>
      </div>
    </footer>
  );
}
