import { useTranslation } from "react-i18next";
import { CONTACT_LINKS } from "../data/contactLinks";
import { CONTACT_ASIDES } from "../data/aside";
import { getCurrentYear } from "../i18n/dates";
import { RawHtml } from "./RawHtml";

export function Contact() {
  const { t } = useTranslation();

  return (
    <section className="contact wrap" id="contact">
      <div className="sec-head reveal">
        <div className="num">{t("contact.num")}</div>
        <RawHtml as="h2" html={t("contact.heading")} />
        <div className="right">{t("contact.right")}</div>
      </div>

      <RawHtml as="div" className="big reveal" html={t("contact.big")} />

      <div className="row">
        <div className="links">
          {CONTACT_LINKS.map((link) => {
            const isDownload = link.key === "download";
            const display = isDownload ? t("contact.links.downloadLabel") : link.display;
            const right = isDownload
              ? t("contact.links.downloadYear", { year: getCurrentYear() })
              : t(`contact.links.${link.key}`);
            const isExternal = link.href.startsWith("http");
            return (
              <a
                key={link.key}
                href={link.href}
                className="link"
                data-cur="link"
                {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                <span className="l">
                  <span className="arr">→</span> {display}
                </span>
                <span className="h">{right}</span>
              </a>
            );
          })}
        </div>

        <div className="aside">
          {CONTACT_ASIDES.map((aside) => (
            <div key={aside.labelKey}>
              <div className="label">{t(aside.labelKey)}</div>
              <div className={aside.highlight ? "biggie" : undefined}>{t(aside.bodyKey)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
