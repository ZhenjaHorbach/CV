import { useTranslation } from "react-i18next";
import { ORBITAL_AXES, chipPosition } from "../data/orbital";
import { SKILL_GROUPS } from "../data/skills";
import { RawHtml } from "./RawHtml";

const ORBIT_RINGS = ["r1", "r2", "r3", "r4"] as const;

export function Skills() {
  const { t } = useTranslation();

  return (
    <section className="skills wrap" id="skills">
      <div className="sec-head reveal">
        <div className="num">{t("skills.num")}</div>
        <RawHtml as="h2" html={t("skills.heading")} />
        <div className="right">{t("skills.right")}</div>
      </div>

      <div className="skills-wrap">
        <div className="skills-list reveal">
          {SKILL_GROUPS.map((g) => (
            <div className="group" key={g}>
              <div className="label">{t(`skills.groups.${g}.label`)}</div>
              <div className="items">
                {t(`skills.groups.${g}.primary`)}{" "}
                <span>{t(`skills.groups.${g}.secondary`)}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="orbit reveal">
          {ORBIT_RINGS.map((r) => (
            <div key={r} className={`ring ${r}`} />
          ))}

          {ORBITAL_AXES.map((axis) => (
            <div className={`axis ${axis.className}`} key={axis.className}>
              {axis.chips.map((chip, i) => (
                <div
                  key={chip.label}
                  className={`chip${chip.hot ? " hot" : ""}`}
                  style={chipPosition(axis.radius, axis.startAngle ?? 0, i, axis.chips.length)}
                >
                  {chip.label}
                </div>
              ))}
            </div>
          ))}

          <div className="core">{t("skills.core")}</div>
        </div>
      </div>
    </section>
  );
}
