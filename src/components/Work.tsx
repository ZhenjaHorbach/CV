import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getCurrentYear } from "../i18n/dates";
import { WORK_ITEMS } from "../data/work";
import { RawHtml } from "./RawHtml";

const SCRAMBLE_CHARS = "!<>-_\\/[]{}—=+*^?#________";

const ESCAPE_MAP: Record<string, string> = { "<": "&lt;", ">": "&gt;", "&": "&amp;" };
const escapeHtml = (s: string) => s.replace(/[<>&]/g, (c) => ESCAPE_MAP[c]);

function scramble(el: HTMLElement) {
  // If a previous scramble was running, cancel it and restore its HTML so we
  // read a fresh, fully-coloured innerHTML below.
  const prevRaf = (el as any)._f as number | undefined;
  if (prevRaf) cancelAnimationFrame(prevRaf);
  const prevHtml = (el as any)._origHtml as string | undefined;
  if (prevHtml) el.innerHTML = prevHtml;

  const original = el.textContent || "";
  const originalHtml = el.innerHTML;
  (el as any)._origHtml = originalHtml;

  let frame = 0;
  const queue: { from: string; to: string; start: number; end: number; char: string }[] = [];
  for (let i = 0; i < original.length; i++) {
    const start = Math.floor(Math.random() * 22);
    const end = start + Math.floor(Math.random() * 22);
    queue.push({ from: original[i], to: original[i], start, end, char: "" });
  }

  const update = () => {
    let html = "";
    let complete = 0;
    for (let i = 0; i < queue.length; i++) {
      const q = queue[i];
      if (frame >= q.end) {
        complete++;
        html += escapeHtml(q.to);
      } else if (frame >= q.start) {
        if (!q.char || Math.random() < 0.18) q.char = SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        html += `<span class="scramble-active">${escapeHtml(q.char)}</span>`;
      } else {
        html += escapeHtml(q.from);
      }
    }
    if (complete < queue.length) {
      el.innerHTML = html;
      frame++;
      (el as any)._f = requestAnimationFrame(update);
    } else {
      el.innerHTML = originalHtml;
      (el as any)._origHtml = undefined;
      (el as any)._f = undefined;
    }
  };
  update();
}

export function Work() {
  const { t } = useTranslation();

  useEffect(() => {
    const rows = document.querySelectorAll<HTMLAnchorElement>(".work-row");
    const handlers: [HTMLAnchorElement, () => void][] = [];
    rows.forEach((row) => {
      const onEnter = () => {
        const titleEl = row.querySelector<HTMLElement>(".title");
        if (titleEl) scramble(titleEl);
      };
      row.addEventListener("mouseenter", onEnter);
      handlers.push([row, onEnter]);
    });
    return () => {
      handlers.forEach(([row, h]) => row.removeEventListener("mouseenter", h));
      rows.forEach((row) => {
        const titleEl = row.querySelector<HTMLElement>(".title");
        if (!titleEl) return;
        const raf = (titleEl as any)._f as number | undefined;
        if (raf) cancelAnimationFrame(raf);
        (titleEl as any)._f = undefined;
        (titleEl as any)._origHtml = undefined;
      });
    };
  }, [t]);

  const now = t("xp.now");

  return (
    <section className="work wrap" id="work">
      <div className="sec-head reveal">
        <div className="num">{t("work.num")}</div>
        <RawHtml as="h2" html={t("work.heading")} />
        <div className="right">{t("work.right", { year: getCurrentYear() })}</div>
      </div>

      <div className="work-list">
        {WORK_ITEMS.map((item) => {
          const external = !!item.url;
          return (
            <a
              key={item.key}
              href={item.url ?? "#"}
              className={`work-row${external ? "" : " work-row-disabled"}`}
              data-key={item.key}
              data-cur="link"
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : { onClick: (e) => e.preventDefault() })}
            >
              <span className="num">{item.num}</span>
              <RawHtml className="title" html={t(`work.items.${item.key}.title`)} />
              <span className="role">{t(`work.items.${item.key}.role`)}</span>
              <span className="year">{t(`work.items.${item.key}.year`, { now })}</span>
              <span className="arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
}
