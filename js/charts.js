/* ============================================================
   charts.js — Mini graphiques en SVG pur (aucune dépendance)
   Conçus pour repérer des tendances/corrélations dans le temps.
   ============================================================ */

const W = 320;       // viewBox width
const H = 120;       // viewBox height
const PAD_L = 22;
const PAD_R = 8;
const PAD_T = 10;
const PAD_B = 18;

function x(i, n) {
  if (n <= 1) return PAD_L + (W - PAD_L - PAD_R) / 2;
  return PAD_L + (i / (n - 1)) * (W - PAD_L - PAD_R);
}
function y(v, min, max) {
  const span = max - min || 1;
  return PAD_T + (1 - (v - min) / span) * (H - PAD_T - PAD_B);
}

function gridlines(min, max, ticks = 3) {
  let g = '';
  for (let t = 0; t <= ticks; t++) {
    const val = min + (t / ticks) * (max - min);
    const yy = y(val, min, max);
    g += `<line x1="${PAD_L}" y1="${yy.toFixed(1)}" x2="${W - PAD_R}" y2="${yy.toFixed(1)}" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>`;
    g += `<text class="chart-axis" x="${PAD_L - 5}" y="${(yy + 3).toFixed(1)}" text-anchor="end">${Math.round(val)}</text>`;
  }
  return g;
}

function dayLabels(points) {
  const n = points.length;
  if (!n) return '';
  const idxs = n <= 7 ? points.map((_, i) => i) : [0, Math.floor((n - 1) / 2), n - 1];
  return idxs.map(i => {
    const d = new Date(points[i].key + 'T12:00:00');
    const lbl = d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'numeric' });
    const anchor = i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle';
    return `<text class="chart-axis" x="${x(i, n).toFixed(1)}" y="${H - 4}" text-anchor="${anchor}">${lbl}</text>`;
  }).join('');
}

/**
 * Graphe en ligne (lissé) avec dégradé sous la courbe.
 * points: [{ key, value | null }]
 */
export function lineChart(points, { color = '#7c6af7', min, max, fill = true } = {}) {
  const valued = points.map((p, i) => ({ i, v: p.value })).filter(p => p.v != null && !isNaN(p.v));
  const n = points.length;
  const id = 'g' + Math.random().toString(36).slice(2, 8);

  if (valued.length === 0) {
    return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet"><text x="${W/2}" y="${H/2}" text-anchor="middle" class="chart-axis">Pas encore de données</text></svg>`;
  }

  const vals = valued.map(p => p.v);
  const lo = min != null ? min : Math.min(...vals);
  const hi = max != null ? max : Math.max(...vals);
  const pad = (hi - lo) * 0.12 || 1;
  const mn = min != null ? min : lo - pad;
  const mx = max != null ? max : hi + pad;

  const coords = valued.map(p => [x(p.i, n), y(p.v, mn, mx)]);
  const line = smoothPath(coords);
  const area = fill ? `${line} L ${coords[coords.length-1][0].toFixed(1)} ${(H-PAD_B).toFixed(1)} L ${coords[0][0].toFixed(1)} ${(H-PAD_B).toFixed(1)} Z` : '';
  const dots = coords.map(([cx, cy]) => `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="2.6" fill="${color}"/>`).join('');
  const last = coords[coords.length - 1];

  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet">
    <defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${color}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
    </linearGradient></defs>
    ${gridlines(mn, mx)}
    ${fill ? `<path d="${area}" fill="url(#${id})"/>` : ''}
    <path d="${line}" fill="none" stroke="${color}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
    ${dots}
    <circle cx="${last[0].toFixed(1)}" cy="${last[1].toFixed(1)}" r="4" fill="${color}" stroke="#ffffff" stroke-width="2"/>
    ${dayLabels(points)}
  </svg>`;
}

/**
 * Graphe en barres. points: [{ key, value | null }]
 */
export function barChart(points, { color = '#38bdf8', min = 0, max, goal } = {}) {
  const n = points.length;
  const vals = points.map(p => p.value).filter(v => v != null && !isNaN(v));
  if (vals.length === 0) {
    return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet"><text x="${W/2}" y="${H/2}" text-anchor="middle" class="chart-axis">Pas encore de données</text></svg>`;
  }
  const mx = max != null ? max : Math.max(...vals) * 1.1;
  const bw = Math.max(6, (W - PAD_L - PAD_R) / n * 0.6);
  let bars = '';
  points.forEach((p, i) => {
    if (p.value == null || isNaN(p.value)) return;
    const cx = x(i, n);
    const yy = y(p.value, min, mx);
    const h = (H - PAD_B) - yy;
    bars += `<rect x="${(cx - bw/2).toFixed(1)}" y="${yy.toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(0,h).toFixed(1)}" rx="3" fill="${color}" opacity="0.92"/>`;
  });
  let goalLine = '';
  if (goal != null) {
    const gy = y(goal, min, mx);
    goalLine = `<line x1="${PAD_L}" y1="${gy.toFixed(1)}" x2="${W-PAD_R}" y2="${gy.toFixed(1)}" stroke="#22c55e" stroke-width="1.4" stroke-dasharray="4 4"/>`;
  }
  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet">
    ${gridlines(min, mx)}
    ${bars}
    ${goalLine}
    ${dayLabels(points)}
  </svg>`;
}

/* Courbe lissée (Catmull-Rom -> Bézier) */
function smoothPath(pts) {
  if (pts.length === 1) {
    const [cx, cy] = pts[0];
    return `M ${cx.toFixed(1)} ${cy.toFixed(1)} L ${cx.toFixed(1)} ${cy.toFixed(1)}`;
  }
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}
