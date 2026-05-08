import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { XP_CELLS } from "../data/experience";
import { RawHtml } from "./RawHtml";

export function Experience() {
  const { t } = useTranslation();

  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-tilt]");
    const handlers: Array<[HTMLElement, (e: MouseEvent) => void]> = [];
    els.forEach((el) => {
      const onMove = (e: MouseEvent) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", ((e.clientX - r.left) / r.width) * 100 + "%");
        el.style.setProperty("--my", ((e.clientY - r.top) / r.height) * 100 + "%");
      };
      el.addEventListener("mousemove", onMove);
      handlers.push([el, onMove]);
    });
    return () => handlers.forEach(([el, h]) => el.removeEventListener("mousemove", h));
  }, []);

  const now = t("xp.now");
  const remote = t("xp.remote");
  const warsaw = t("xp.warsaw");

  return (
    <section className="xp wrap" id="xp">
      <div className="sec-head reveal">
        <div className="num">{t("xp.num")}</div>
        <RawHtml as="h2" html={t("xp.heading")} />
        <div className="right">{t("xp.right")}</div>
      </div>

      <div className="xp-grid">
        {XP_CELLS.map((key) => {
          const tags = t(`xp.cells.${key}.tags`, { returnObjects: true }) as string[];
          return (
            <div className="xp-cell" data-tilt key={key}>
              <div className="when">{t(`xp.cells.${key}.when`, { now, remote, warsaw })}</div>
              <RawHtml className="where" html={t(`xp.cells.${key}.where`)} />
              <div className="what">{t(`xp.cells.${key}.what`)}</div>
              <div className="tags">
                {tags.map((tag) => (
                  <span className="tag" key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
