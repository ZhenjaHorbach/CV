import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import * as THREE from "three";
import { formatDate, getTerrainAxis, getTerrainStartDate, toLocalDateKey } from "../i18n/dates";
import type { Lang } from "../i18n";
import { useTheme } from "../theme/ThemeContext";
import { fetchContributions } from "../api/github";
import { GITHUB_USER } from "../data/github";
import { RawHtml } from "./RawHtml";

const COLS = 53;
const ROWS = 7;

const THEME_COLORS = {
  dark: { plate: 0x1a1812, empty: "#3a342a" },
  light: { plate: 0xe9e2d4, empty: "#c9bfa9" },
} as const;

function generateSyntheticData(): number[][] {
  let r = 0xc0ffee >>> 0;
  const rand = () => {
    r = (Math.imul(r, 1103515245) + 12345) >>> 0;
    return (r & 0x7fffffff) / 0x7fffffff;
  };
  const data: number[][] = [];
  for (let w = 0; w < COLS; w++) {
    const burst = rand() < 0.16;
    const ramp = 0.3 + Math.min(0.45, w / 90);
    const col: number[] = [];
    for (let d = 0; d < ROWS; d++) {
      const weekend = d === 0 || d === 6;
      let v = 0;
      const p = weekend ? ramp * 0.5 : ramp;
      if (rand() < p) v = Math.floor(rand() * (burst ? 16 : 8)) + 1;
      col.push(v);
    }
    data.push(col);
  }
  for (let i = 0; i < 12; i++) {
    const w = COLS - 1 - Math.floor(i / ROWS);
    const d = ROWS - 1 - (i % ROWS);
    if (w >= 0) data[w][d] = Math.max(data[w][d], 2 + Math.floor(rand() * 6));
  }
  return data;
}

function buildGridFromContributions(
  contributions: { date: string; count: number }[],
  startDate: Date
): { grid: number[][]; dateGrid: string[][] } {
  const map = new Map<string, number>();
  contributions.forEach((c) => map.set(c.date, c.count));
  const grid: number[][] = Array.from({ length: COLS }, () => new Array(ROWS).fill(0));
  const dateGrid: string[][] = Array.from({ length: COLS }, () => new Array(ROWS).fill(""));
  for (let w = 0; w < COLS; w++) {
    for (let d = 0; d < ROWS; d++) {
      const dayDate = new Date(startDate);
      dayDate.setDate(startDate.getDate() + w * 7 + d);
      const key = toLocalDateKey(dayDate);
      dateGrid[w][d] = key;
      grid[w][d] = map.get(key) ?? 0;
    }
  }
  return { grid, dateGrid };
}

function buildSyntheticDateGrid(startDate: Date): string[][] {
  const dateGrid: string[][] = Array.from({ length: COLS }, () => new Array(ROWS).fill(""));
  for (let w = 0; w < COLS; w++) {
    for (let d = 0; d < ROWS; d++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + w * 7 + d);
      dateGrid[w][d] = toLocalDateKey(day);
    }
  }
  return dateGrid;
}

function animateNum(el: HTMLElement, to: number, dur = 1400) {
  const start = performance.now();
  const step = (t: number) => {
    const k = Math.min(1, (t - start) / dur);
    const eased = 1 - Math.pow(1 - k, 3);
    el.textContent = Math.round(eased * to).toLocaleString();
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function profileUrlForDate(dateKey: string): string {
  return `https://github.com/${GITHUB_USER}?tab=overview&from=${dateKey}&to=${dateKey}`;
}

export function GitHubTerrain() {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const lang = (i18n.language as Lang) || "en";

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const totalRef = useRef<HTMLSpanElement>(null);
  const longRef = useRef<HTMLSpanElement>(null);
  const curRef = useRef<HTMLSpanElement>(null);
  const plateMatRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const emptyCellsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const langRef = useRef(lang);
  langRef.current = lang;
  const tRef = useRef(t);
  tRef.current = t;
  const initialThemeRef = useRef(theme);

  useEffect(() => {
    const colors = THEME_COLORS[theme];
    if (plateMatRef.current) {
      plateMatRef.current.color.setHex(colors.plate);
    }
    emptyCellsRef.current.forEach((mat) => {
      mat.color.set(colors.empty);
    });
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const tipEl = tipRef.current;
    if (!canvas || !tipEl) return;

    const startDate = getTerrainStartDate(COLS * ROWS);
    let data = generateSyntheticData();
    let dateGrid = buildSyntheticDateGrid(startDate);

    let cancelled = false;
    let cells: THREE.Mesh[] = [];
    let materialsByCell: THREE.MeshStandardMaterial[] = [];
    let baseGeo: THREE.BoxGeometry;
    let plate: THREE.Mesh;
    let renderer: THREE.WebGLRenderer;
    let raf = 0;
    let statsIO: IntersectionObserver | undefined;

    const flatOf = (g: number[][]) => {
      const out: number[] = [];
      for (let w = 0; w < COLS; w++) for (let d = 0; d < ROWS; d++) out.push(g[w][d]);
      return out;
    };

    const computeStats = (g: number[][]) => {
      const flat = flatOf(g);
      let total = 0, longest = 0, current = 0, run = 0;
      flat.forEach((v) => {
        total += v;
        if (v > 0) {
          run++;
          longest = Math.max(longest, run);
        } else run = 0;
      });
      for (let i = flat.length - 1; i >= 0; i--) {
        if (flat[i] > 0) current++;
        else break;
      }
      return { total, longest, current, flat };
    };

    let stats = computeStats(data);

    const initialColors = THEME_COLORS[initialThemeRef.current];
    const colorFor = (v: number, max: number) => {
      if (v === 0) return new THREE.Color(initialColors.empty);
      const x = v / max;
      const c1 = new THREE.Color("#5a4524");
      const c2 = new THREE.Color("#d68a3a");
      const c3 = new THREE.Color("#ffc36b");
      if (x < 0.5) return c1.clone().lerp(c2, x / 0.5);
      return c2.clone().lerp(c3, (x - 0.5) / 0.5);
    };

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 200);

    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const dir = new THREE.DirectionalLight(0xfff1d0, 1.1);
    dir.position.set(8, 14, 6);
    scene.add(dir);
    const rim = new THREE.DirectionalLight(0xff9d4d, 0.6);
    rim.position.set(-6, 6, -4);
    scene.add(rim);

    const root = new THREE.Group();
    scene.add(root);

    const cellSize = 0.9;
    const gap = 0.12;
    const totalW = COLS * (cellSize + gap);
    const totalD = ROWS * (cellSize + gap);

    const plateMat = new THREE.MeshStandardMaterial({
      color: initialColors.plate,
      roughness: 0.9,
      metalness: 0,
    });
    plateMatRef.current = plateMat;
    plate = new THREE.Mesh(new THREE.BoxGeometry(totalW + 1.2, 0.2, totalD + 1.2), plateMat);
    plate.position.y = -0.1;
    root.add(plate);

    baseGeo = new THREE.BoxGeometry(cellSize, 1, cellSize);

    const buildCells = () => {
      cells.forEach((c) => {
        root.remove(c);
        (c.material as THREE.Material).dispose();
      });
      cells = [];
      materialsByCell = [];
      const empty: THREE.MeshStandardMaterial[] = [];
      const max = Math.max(1, ...stats.flat);
      for (let w = 0; w < COLS; w++) {
        for (let d = 0; d < ROWS; d++) {
          const v = data[w][d];
          const h = 0.12 + (v / max) * 4.0;
          const col = colorFor(v, max);
          const mat = new THREE.MeshStandardMaterial({
            color: col,
            roughness: 0.55,
            metalness: 0.05,
            emissive: v > 0 ? col : new THREE.Color("#000000"),
            emissiveIntensity: v > 0 ? 0.06 + (v / max) * 0.18 : 0,
          });
          const mesh = new THREE.Mesh(baseGeo, mat);
          mesh.scale.y = 0.001;
          mesh.position.set(
            (w - COLS / 2 + 0.5) * (cellSize + gap),
            0,
            (d - ROWS / 2 + 0.5) * (cellSize + gap)
          );
          mesh.userData = {
            w,
            d,
            v,
            targetH: h,
            baseY: 0,
            hover: false,
            dateKey: dateGrid[w][d],
          };
          root.add(mesh);
          cells.push(mesh);
          materialsByCell.push(mat);
          if (v === 0) empty.push(mat);
        }
      }
      emptyCellsRef.current = empty;
    };

    buildCells();

    fetchContributions()
      .then((response) => {
        if (cancelled) return;
        const built = buildGridFromContributions(response.contributions, startDate);
        data = built.grid;
        dateGrid = built.dateGrid;
        stats = computeStats(data);
        buildCells();
        if (totalRef.current) animateNum(totalRef.current, stats.total);
        if (longRef.current) animateNum(longRef.current, stats.longest, 1100);
        if (curRef.current) animateNum(curRef.current, stats.current, 900);
      })
      .catch(() => {});

    const stage = canvas.parentElement!;
    let viewportZoom = 1;
    const fitCamera = () => {
      const rect = stage.getBoundingClientRect();
      renderer.setSize(rect.width, rect.height, false);
      camera.aspect = rect.width / rect.height;
      camera.updateProjectionMatrix();
      viewportZoom = Math.max(1, 2.0 / Math.max(0.6, camera.aspect));
    };
    const camBase = new THREE.Vector3(0, 9, 14);
    let zoom = 1.4, zoomTarget = 1.4;
    const applyCam = () => camera.position.copy(camBase).multiplyScalar(zoom * viewportZoom);
    fitCamera();
    applyCam();
    camera.lookAt(0, 0, 0);
    addEventListener("resize", fitCamera);

    statsIO = new IntersectionObserver(
      (es) => {
        es.forEach((e) => {
          if (!e.isIntersecting) return;
          if (totalRef.current) animateNum(totalRef.current, stats.total);
          if (longRef.current) animateNum(longRef.current, stats.longest, 1100);
          if (curRef.current) animateNum(curRef.current, stats.current, 900);
          statsIO?.disconnect();
        });
      },
      { threshold: 0.3 }
    );
    statsIO.observe(canvas);

    let dragging = false, lx = 0, ly = 0, ry = -0.35, rx = 0.62;
    let autoRot = true;
    let downX = 0, downY = 0;
    const pointers = new Map<number, { x: number; y: number }>();
    let pinchStart = 0, pinchZoom = 1;

    const onPointerDown = (e: PointerEvent) => {
      dragging = true;
      autoRot = false;
      lx = e.clientX;
      ly = e.clientY;
      downX = e.clientX;
      downY = e.clientY;
      canvas.setPointerCapture(e.pointerId);
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size === 2) {
        const p = [...pointers.values()];
        pinchStart = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y);
        pinchZoom = zoomTarget;
        dragging = false;
      }
    };
    const onPointerUp = (e: PointerEvent) => {
      const dx = e.clientX - downX;
      const dy = e.clientY - downY;
      const wasClick = Math.hypot(dx, dy) < 5;
      dragging = false;
      pointers.delete(e.pointerId);
      if (pointers.size < 2) pinchStart = 0;
      if (wasClick) handleClick(e);
    };
    const onPointerCancel = (e: PointerEvent) => {
      pointers.delete(e.pointerId);
      if (pointers.size < 2) pinchStart = 0;
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY * 0.0015;
      zoomTarget = Math.max(0.45, Math.min(4.0, zoomTarget * (1 + delta)));
    };

    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    let hovered: THREE.Mesh | null = null;

    const handleClick = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(ndc, camera);
      const hits = raycaster.intersectObjects(cells, false);
      if (!hits.length) return;
      const m = hits[0].object as THREE.Mesh;
      const { dateKey } = m.userData as { dateKey: string };
      if (!dateKey) return;
      window.open(profileUrlForDate(dateKey), "_blank", "noopener,noreferrer");
    };

    const updateHover = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(ndc, camera);
      const hits = raycaster.intersectObjects(cells, false);
      if (hits.length) {
        const m = hits[0].object as THREE.Mesh;
        if (hovered !== m) {
          if (hovered) hovered.userData.hover = false;
          hovered = m;
          hovered.userData.hover = true;
        }
        const { v, dateKey } = m.userData as { v: number; dateKey: string };
        const [y, mo, d] = dateKey.split("-").map((s) => parseInt(s, 10));
        const day = new Date(y, mo - 1, d);
        const dateStr = formatDate(langRef.current, day);
        tipEl.innerHTML = tRef.current("github.tip", { count: v, date: dateStr });
        tipEl.style.left = e.clientX - rect.left + "px";
        tipEl.style.top = e.clientY - rect.top + "px";
        tipEl.classList.add("show");
      } else {
        if (hovered) {
          hovered.userData.hover = false;
          hovered = null;
        }
        tipEl.classList.remove("show");
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (pointers.has(e.pointerId)) pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size === 2 && pinchStart > 0) {
        const p = [...pointers.values()];
        const d = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y);
        zoomTarget = Math.max(0.45, Math.min(4.0, pinchZoom * (pinchStart / d)));
      }
      if (dragging) {
        ry += (e.clientX - lx) * 0.008;
        rx += (e.clientY - ly) * 0.005;
        rx = Math.max(0.22, Math.min(1.1, rx));
        lx = e.clientX;
        ly = e.clientY;
      }
      updateHover(e);
    };

    const onPointerLeave = () => {
      tipEl.classList.remove("show");
      hovered = null;
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerCancel);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);

    let isVisible = false;
    const visIO = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0].isIntersecting;
      },
      { threshold: 0.05 }
    );
    visIO.observe(canvas);

    const t0 = performance.now();
    const loop = (now: number) => {
      if (isVisible) {
        const tt = (now - t0) / 1000;
        cells.forEach((c) => {
          const u = c.userData as { w: number; d: number; targetH: number; hover: boolean };
          const delay = u.w * 0.018 + u.d * 0.04;
          const k = Math.max(0, Math.min(1, (tt - delay) / 0.9));
          const eased = 1 - Math.pow(1 - k, 3);
          const targetScale = eased * u.targetH + 0.001;
          const hoverBoost = u.hover ? 1.25 : 1.0;
          c.scale.y += (targetScale * hoverBoost - c.scale.y) * 0.18;
          c.position.y = c.scale.y / 2;
        });
        if (autoRot) ry += 0.0014;
        root.rotation.y += (ry - root.rotation.y) * 0.1;
        root.rotation.x += (rx - root.rotation.x) * 0.1;
        zoom += (zoomTarget - zoom) * 0.12;
        applyCam();
        camera.lookAt(0, 0, 0);
        renderer.render(scene, camera);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      removeEventListener("resize", fitCamera);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerCancel);
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      visIO.disconnect();
      statsIO?.disconnect();
      cells.forEach((c) => (c.material as THREE.Material).dispose());
      baseGeo.dispose();
      (plate.material as THREE.Material).dispose();
      plate.geometry.dispose();
      renderer.dispose();
    };
  }, []);

  const axis = getTerrainAxis(lang);

  return (
    <section className="github wrap" id="github">
      <div className="sec-head reveal">
        <div className="num">{t("github.num")}</div>
        <RawHtml as="h2" html={t("github.heading")} />
        <div className="right">{t("github.right")}</div>
      </div>

      <div className="terrain-wrap reveal">
        <div className="terrain-meta">
          <div className="tm">
            <div className="tm-label">{t("github.totalLabel")}</div>
            <div className="tm-value"><span ref={totalRef}>0</span></div>
          </div>
          <div className="tm">
            <div className="tm-label">{t("github.longestLabel")}</div>
            <div className="tm-value"><span ref={longRef}>0</span><span className="tm-sub">{t("github.days")}</span></div>
          </div>
          <div className="tm">
            <div className="tm-label">{t("github.currentLabel")}</div>
            <div className="tm-value"><span ref={curRef}>0</span><span className="tm-sub">{t("github.days")}</span></div>
          </div>
          <div className="tm">
            <div className="tm-label">{t("github.topLanguageLabel")}</div>
            <div className="tm-value" style={{ fontSize: 28 }}>TypeScript</div>
          </div>
          <div className="tm tm-hint">
            <div className="tm-label">{t("github.hintLabel")}</div>
            <div className="tm-sub" style={{ lineHeight: 1.4, maxWidth: 220 }}>{t("github.hintBody")}</div>
          </div>
        </div>
        <div className="terrain-stage">
          <canvas ref={canvasRef} />
          <div className="terrain-tip" ref={tipRef} />
          <div className="terrain-axis">
            {axis.map((label, i) => (
              <span key={i}>{label}</span>
            ))}
          </div>
          <div className="terrain-legend">
            <span>{t("github.less")}</span>
            <i className="terrain-legend-empty" />
            <i style={{ background: "oklch(0.62 0.10 65)" }} />
            <i style={{ background: "oklch(0.74 0.15 65)" }} />
            <i style={{ background: "oklch(0.85 0.18 70)" }} />
            <span>{t("github.more")}</span>
          </div>
        </div>
      </div>

    </section>
  );
}
