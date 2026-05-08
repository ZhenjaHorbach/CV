import { useEffect, useRef, useState } from "react";

export function ScrollProgress() {
  const barRef = useRef<HTMLElement>(null);
  const [pct, setPct] = useState("000");

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      const p = Math.max(0, Math.min(1, scrollY / max));
      barRef.current?.style.setProperty("--p", String(p));
      setPct(String(Math.round(p * 100)).padStart(3, "0"));
    };
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="scroll-prog">
      <span>{pct}</span>
      <span className="bar">
        <i ref={barRef} />
      </span>
    </div>
  );
}
