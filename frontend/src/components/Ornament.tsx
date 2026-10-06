import { useId } from "react";

/*
 * Islamic-geometry ornaments, drawn inline from the ornament-* tokens so they
 * follow the active theme. Every ornament pairs a deep green and a light green
 * and closes with exactly one gold detail. Ornament frames a section (band,
 * divider, hero arch); it never sits behind reading text.
 */

/** Eight-point star path: `ro` tip radius, `ri` valley radius, `rot` degrees. */
function star(cx: number, cy: number, ro: number, ri: number, rot = 0) {
  const pts: string[] = [];
  for (let i = 0; i < 16; i++) {
    const r = i % 2 === 0 ? ro : ri;
    const a = ((-90 + rot + i * 22.5) * Math.PI) / 180;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`);
  }
  return `M${pts.join("L")}Z`;
}

/** Khatam on a 48-unit tile: deep star, light star turned 22.5deg, gold centre. */
function KhatamShapes({ cx = 24, cy = 24 }: { cx?: number; cy?: number }) {
  return (
    <>
      <path className="fill-ornament-deep" d={star(cx, cy, 20, 12)} />
      <path className="fill-ornament-light" d={star(cx, cy, 15, 9, 22.5)} />
      <path className="fill-ornament-gold" d={star(cx, cy, 8, 4.4)} />
    </>
  );
}

/** A single khatam, for dividers and as a small mark. */
export function Khatam({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="4 4 40 40"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <KhatamShapes />
    </svg>
  );
}

/** Repeating star lattice on a 48px grid. Transparent, so it sits on any ground. */
export function OrnamentBand({ height = 48, className = "" }: { height?: number; className?: string }) {
  const id = useId();
  const corner = (x: number, y: number) => (
    <path key={`${x}-${y}`} className="fill-ornament-deep" d={star(x, y, 11, 6.5)} />
  );
  return (
    <svg
      width="100%"
      height={height}
      aria-hidden="true"
      focusable="false"
      className={`block ${className}`}
    >
      <defs>
        <pattern id={id} width="48" height="48" patternUnits="userSpaceOnUse">
          <KhatamShapes />
          {corner(0, 0)}
          {corner(48, 0)}
          {corner(0, 48)}
          {corner(48, 48)}
        </pattern>
      </defs>
      <rect width="100%" height={height} fill={`url(#${id})`} />
    </svg>
  );
}

/** Hairline, khatam, hairline. The star carries the single gold detail. */
export function OrnamentDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-4 ${className}`} aria-hidden="true">
      <span className="h-px flex-1 bg-ornament-light" />
      <Khatam size={28} />
      <span className="h-px flex-1 bg-ornament-light" />
    </div>
  );
}

function archPath(inset: number) {
  const l = inset;
  const r = 240 - inset;
  const spring = 120 + inset * 0.3;
  return (
    `M${l} 300V${spring}` +
    `C${l} ${60 + inset} ${60 + inset} ${20 + inset} 120 ${inset}` +
    `C${180 - inset} ${20 + inset} ${r} ${60 + inset} ${r} ${spring}V300Z`
  );
}

/** Mihrab arch nested three deep (deep, light, ground) with one gold star at the crown. */
export function HeroArch({
  className = "",
  groundClassName = "fill-surface-100",
}: {
  className?: string;
  groundClassName?: string;
}) {
  return (
    <svg
      viewBox="0 0 240 300"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path className="fill-ornament-deep" d={archPath(0)} />
      <path className="fill-ornament-light" d={archPath(14)} />
      <path className={groundClassName} d={archPath(28)} />
      <path className="fill-ornament-gold" d={star(120, 62, 12, 6.5)} />
    </svg>
  );
}
