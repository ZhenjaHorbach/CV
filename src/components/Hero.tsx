import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { HERO_STATS } from "../data/heroStats";
import { getCurrentYear } from "../i18n/dates";
import { RawHtml } from "./RawHtml";

function useCountUp() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target as HTMLElement;
          const to = parseInt(el.dataset.to || "0", 10);
          const start = performance.now();
          const dur = 1400;
          const step = (t: number) => {
            const k = Math.min(1, (t - start) / dur);
            const eased = 1 - Math.pow(1 - k, 3);
            el.textContent = String(Math.round(eased * to));
            if (k < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          io.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    document.querySelectorAll("[data-to]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const { t } = useTranslation();
  useCountUp();

  useEffect(() => {
    requestAnimationFrame(() => heroRef.current?.classList.add("in"));
  }, []);

  return (
    <section className="hero" id="top" ref={heroRef}>
      <div className="wrap">
        <div className="meta-row reveal">
          <div>{t("hero.cv", { year: getCurrentYear() })}</div>
          <div className="center-line" />
          <div className="right">{t("hero.location")}</div>
        </div>

        <RawHtml as="h1" id="heroH1" html={t("hero.h1")} />

        <div className="sub reveal">
          <RawHtml as="p" className="lede" html={t("hero.lede")} />
          <div className="stats">
            {HERO_STATS.map((s) => (
              <div className="stat" key={s.labelKey}>
                <div className="v">
                  <span className="num" data-to={s.to}>0</span>
                  {s.suffix && (
                    <span style={{ fontSize: ".6em", color: "var(--accent)" }}>{s.suffix}</span>
                  )}
                </div>
                <div className="l">{t(s.labelKey)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
