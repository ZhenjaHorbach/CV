import { useTranslation } from "react-i18next";
import { RawHtml } from "./RawHtml";

export function About() {
  const { t } = useTranslation();
  return (
    <section className="manifesto wrap" id="about">
      <div className="sec-head reveal">
        <div className="num">{t("about.num")}</div>
        <RawHtml as="h2" html={t("about.heading")} />
        <div className="right">{t("about.coords")}</div>
      </div>
      <div className="body reveal">
        <RawHtml as="p" html={t("about.p1")} />
        <RawHtml as="p" html={t("about.p2")} />
        <RawHtml as="p" html={t("about.p3")} />
      </div>
    </section>
  );
}
