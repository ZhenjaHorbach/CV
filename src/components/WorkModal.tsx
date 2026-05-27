import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { HALO_PROJECTS } from "../data/work";
import { RawHtml } from "./RawHtml";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function WorkModal({ open, onClose }: Props) {
  const { t } = useTranslation();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  return (
    <div className={`work-modal${open ? " is-open" : ""}`} aria-hidden={!open}>
      <div className="work-modal-backdrop" onClick={onClose} data-cur="link" />
      <aside className="work-modal-panel" role="dialog" aria-modal="true" aria-label="AI Side Projects">
        <button
          type="button"
          className="work-modal-back"
          onClick={onClose}
          aria-label={t("work.items.halo.modal.close")}
          data-cur="link"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M19 12H5M11 18l-6-6 6-6" />
          </svg>
          <span>{t("work.items.halo.modal.back")}</span>
        </button>

        <header className="work-modal-head">
          <div className="work-modal-eyebrow">{t("work.items.halo.modal.eyebrow")}</div>
          <RawHtml as="h3" className="work-modal-title" html={t("work.items.halo.modal.title")} />
        </header>

        <p className="work-modal-sub">{t("work.items.halo.modal.subtitle")}</p>

        <div className="work-modal-list">
          {HALO_PROJECTS.map((p) => (
            <a
              key={p.key}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="work-modal-item"
              data-cur="link"
            >
              <div className="work-modal-item-top">
                <RawHtml className="work-modal-item-name" html={t(`work.items.halo.modal.projects.${p.key}.name`)} />
                <span className="work-modal-item-year">{p.year}</span>
              </div>
              <div className="work-modal-item-desc">
                {t(`work.items.halo.modal.projects.${p.key}.desc`)}
              </div>
              <div className="work-modal-item-foot">
                <span className="work-modal-item-url">{p.url.replace(/^https?:\/\//, "")}</span>
                <span className="work-modal-item-arrow">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M7 17L17 7M9 7h8v8" />
                  </svg>
                </span>
              </div>
            </a>
          ))}
        </div>
      </aside>
    </div>
  );
}
