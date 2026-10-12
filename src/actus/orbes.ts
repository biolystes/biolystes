/* Les orbes animées de l’orbital, reprises à l’identique du widget de
   lystes.ai (public/woo-product-chat.js, brandOrbDraw : préréglage 64,
   vitesse 1.885, substrat clair). Même dessin, pour que l’orbital de
   biolystes.com soit celui que le widget posera ensuite. */

const OPTS = { orbitN: 12, ghostN: 40, ghostR: 0.9, ghostA: 0.5, particles: 3, partR: 1.2, partRDepth: 1.6, rsPow: 0.6, rMin: 0.3 };
export const VITESSE_ORBES = 1.885;

type Point = { x: number; y: number; z: number; r: number; white: number; a?: number };

function hash(a: number, b: number) {
  const h = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453;
  return h - Math.floor(h);
}

function projection(yaw: number, tilt: number, cx: number, cy: number, scale: number) {
  const st = Math.sin(tilt), ct = Math.cos(tilt), sy = Math.sin(yaw), cyw = Math.cos(yaw);
  return (x: number, y: number, z: number): [number, number, number] => {
    const x1 = x * cyw + z * sy;
    const z1 = -x * sy + z * cyw;
    const y1 = y * ct - z1 * st;
    const z2 = y * st + z1 * ct;
    return [cx + x1 * scale, cy - y1 * scale, z2];
  };
}

function peindre(ctx: CanvasRenderingContext2D, points: Point[]) {
  points.sort((a, b) => a.z - b.z);
  for (const d of points) {
    const alpha = d.a == null ? 1 : d.a;
    if (alpha < 0.02) continue;
    const g = Math.round(Math.min(1, Math.max(0, d.white)) * 255);
    ctx.fillStyle = `rgba(${g},${g},${g},${alpha})`;
    ctx.beginPath();
    ctx.arc(d.x, d.y, Math.max(OPTS.rMin, d.r), 0, Math.PI * 2);
    ctx.fill();
  }
}

export function dessinerOrbes(ctx: CanvasRenderingContext2D, size: number, t: number) {
  const o = OPTS;
  const cx = size / 2, cy = size / 2, R = (size / 2) * 0.82;
  const pt = projection(t * 0.12, 0.3, cx, cy, 1);
  const rs = Math.pow(size / 300, o.rsPow);
  const points: Point[] = [];
  for (let orb = 0; orb < o.orbitN; orb++) {
    const h1 = hash(orb, 1.7), h2 = hash(orb, 5.2), h3 = hash(orb, 8.9);
    const ro = R * (0.45 + 0.52 * h1);
    const th = h1 * 2 * Math.PI;
    const phi = Math.acos(2 * h2 - 1);
    const nx = Math.sin(phi) * Math.cos(th), ny = Math.cos(phi), nz = Math.sin(phi) * Math.sin(th);
    let ux = -ny, uy = nx;
    const uz = 0;
    const ul = Math.max(1e-6, Math.sqrt(ux * ux + uy * uy));
    ux /= ul; uy /= ul;
    const vx = ny * uz - nz * uy, vy = nz * ux - nx * uz, vz = nx * uy - ny * ux;
    const speed = (0.25 + 0.55 * h3) * (h3 > 0.5 ? 1 : -1);
    for (let k = 0; k < o.ghostN; k++) {
      const a = (k / o.ghostN) * 2 * Math.PI;
      const p = pt((ux * Math.cos(a) + vx * Math.sin(a)) * ro, (uy * Math.cos(a) + vy * Math.sin(a)) * ro, (uz * Math.cos(a) + vz * Math.sin(a)) * ro);
      const depth = (p[2] / ro + 1) / 2;
      points.push({ x: p[0], y: p[1], z: p[2], r: o.ghostR * rs, white: 0.72, a: o.ghostA * (0.4 + 0.6 * depth) });
    }
    for (let m = 0; m < o.particles; m++) {
      const a = t * speed + (m / o.particles) * 2 * Math.PI + h2 * 6;
      const p = pt((ux * Math.cos(a) + vx * Math.sin(a)) * ro, (uy * Math.cos(a) + vy * Math.sin(a)) * ro, (uz * Math.cos(a) + vz * Math.sin(a)) * ro);
      const depth = (p[2] / ro + 1) / 2;
      points.push({ x: p[0], y: p[1], z: p[2], r: (o.partR + o.partRDepth * depth) * rs, white: 0.3 - 0.22 * depth });
    }
  }
  peindre(ctx, points);
}
