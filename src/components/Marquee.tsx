import { MARQUEE_ITEMS } from "../data/marquee";

export function Marquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="track">
        {MARQUEE_ITEMS.map((item, i) => (
          <span key={i} className={item.italic ? "it" : undefined}>
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}
