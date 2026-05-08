import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { LANG_ORDER, type Lang } from "../i18n";
import { useTheme } from "../theme/ThemeContext";
import { NAV_LINKS } from "../data/nav";

const fmt = (n: number) => String(n).padStart(2, "0");

export function Chrome() {
  const { t, i18n } = useTranslation();
  const { theme, toggle } = useTheme();
  const [time, setTime] = useState("— · —");

  useEffect(() => {
    const update = () => {
      const d = new Date(
        new Date().toLocaleString("en-US", { timeZone: "Europe/Warsaw" })
      );
      setTime(`${t("clock.city")} · ${fmt(d.getHours())}:${fmt(d.getMinutes())}:${fmt(d.getSeconds())}`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [t]);

  const cycleLang = () => {
    const cur = (i18n.language as Lang) || "en";
    const idx = Math.max(0, LANG_ORDER.indexOf(cur));
    i18n.changeLanguage(LANG_ORDER[(idx + 1) % LANG_ORDER.length]);
  };

  return (
    <header className="chrome">
      <a href="#top" className="brand">
        <span className="glyph" />
        <span>Yauheni Horbach</span>
      </a>
      <nav>
        {NAV_LINKS.map((link) => (
          <a key={link.href} href={link.href} data-cur="link">
            {t(link.labelKey)}
          </a>
        ))}
      </nav>
      <div className="chrome-right">
        <button className="tog" type="button" onClick={cycleLang} data-cur="link" aria-label="Toggle language">
          <span>{t("lang.code")}</span>
        </button>
        <button
          className="tog tog-icon"
          type="button"
          onClick={toggle}
          data-cur="link"
          aria-label="Toggle theme"
          aria-pressed={theme === "light"}
        >
          <svg className="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="3.5" />
            <path d="M12 2.5v2.5M12 19v2.5M2.5 12h2.5M19 12h2.5M5 5l1.8 1.8M17.2 17.2L19 19M5 19l1.8-1.8M17.2 6.8L19 5" />
          </svg>
          <svg className="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
          </svg>
        </button>
        <div className="clock">{time}</div>
      </div>
    </header>
  );
}
