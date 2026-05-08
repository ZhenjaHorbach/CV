import { useEffect, useRef } from "react";

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current!;
    const ring = ringRef.current!;
    let cx = innerWidth / 2;
    let cy = innerHeight / 2;
    let rx = cx;
    let ry = cy;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      cx = e.clientX;
      cy = e.clientY;
    };
    addEventListener("pointermove", onMove);

    const tick = () => {
      rx += (cx - rx) * 0.18;
      ry += (cy - ry) * 0.18;
      dot.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%)`;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const enterHandlers: Array<[Element, () => void, () => void]> = [];
    document.querySelectorAll<HTMLElement>("[data-cur]").forEach((el) => {
      const cls = "cur-" + el.dataset.cur;
      const enter = () => document.body.classList.add(cls);
      const leave = () => document.body.classList.remove(cls);
      el.addEventListener("mouseenter", enter);
      el.addEventListener("mouseleave", leave);
      enterHandlers.push([el, enter, leave]);
    });

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("pointermove", onMove);
      enterHandlers.forEach(([el, enter, leave]) => {
        el.removeEventListener("mouseenter", enter as EventListener);
        el.removeEventListener("mouseleave", leave as EventListener);
      });
    };
  }, []);

  return (
    <>
      <div className="cursor-ring" ref={ringRef} />
      <div className="cursor-dot" ref={dotRef} />
    </>
  );
}
