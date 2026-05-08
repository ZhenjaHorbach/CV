import { useEffect, type RefObject } from "react";
import { useTranslation } from "react-i18next";
import { getCurrentYear } from "../i18n/dates";
import { WORK_ITEMS } from "../data/work";
import { RawHtml } from "./RawHtml";

const SCRAMBLE_CHARS = "!<>-_\\/[]{}—=+*^?#________";

function scramble(el: HTMLElement) {
  const original = el.dataset.text || el.textContent || "";
  el.dataset.text = original;
  let frame = 0;
  const queue: { from: string; to: string; start: number; end: number; char: string }[] = [];
  for (let i = 0; i < original.length; i++) {
    const start = Math.floor(Math.random() * 12);
    const end = start + Math.floor(Math.random() * 12);
    queue.push({ from: original[i], to: original[i], start, end, char: "" });
  }
  const _f = (el as any)._f as number | undefined;
  if (_f) cancelAnimationFrame(_f);
  const update = () => {
    let out = "";
    let complete = 0;
    for (let i = 0; i < queue.length; i++) {
      const q = queue[i];
      if (frame >= q.end) { complete++; out += q.to; }
      else if (frame >= q.start) {
        if (!q.char || Math.random() < 0.28) q.char = SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        out += q.char;
      } else {
        out += q.from;
      }
    }
    el.textContent = out;
    if (complete < queue.length) {
      frame++;
      (el as any)._f = requestAnimationFrame(update);
    }
  };
  update();
}

interface Props {
  previewRef: RefObject<HTMLDivElement>;
}

export function Work({ previewRef }: Props) {
  const { t } = useTranslation();

  useEffect(() => {
    const preview = previewRef.current;
    if (!preview) return;
    const previews = preview.querySelectorAll<HTMLDivElement>(".pv");

    let pvX = 0, pvY = 0, pvTX = 0, pvTY = 0;
    let raf = 0;
    const tick = () => {
      pvX += (pvTX - pvX) * 0.16;
      pvY += (pvTY - pvY) * 0.16;
      preview.style.left = pvX + "px";
      preview.style.top = pvY + "px";
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    type Handlers = { enter: () => void; leave: () => void; move: (e: MouseEvent) => void };
    const rows = document.querySelectorAll<HTMLAnchorElement>(".work-row");
    const all: [HTMLAnchorElement, Handlers][] = [];
    rows.forEach((row) => {
      const hasPreview = row.dataset.preview === "1";
      const enter = () => {
        const titleEl = row.querySelector<HTMLElement>(".title");
        if (titleEl) scramble(titleEl);
        if (!hasPreview) return;
        preview.classList.add("show");
        previews.forEach((p) => p.classList.toggle("active", p.dataset.key === row.dataset.key));
      };
      const leave = () => preview.classList.remove("show");
      const move = (e: MouseEvent) => { pvTX = e.clientX + 60; pvTY = e.clientY + 40; };
      row.addEventListener("mouseenter", enter);
      row.addEventListener("mouseleave", leave);
      row.addEventListener("mousemove", move);
      all.push([row, { enter, leave, move }]);
    });

    return () => {
      cancelAnimationFrame(raf);
      all.forEach(([row, h]) => {
        row.removeEventListener("mouseenter", h.enter);
        row.removeEventListener("mouseleave", h.leave);
        row.removeEventListener("mousemove", h.move);
      });
    };
  }, [previewRef, t]);

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
              data-preview={item.previewLabel ? "1" : "0"}
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
