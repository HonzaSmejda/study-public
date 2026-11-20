// js/util.js – obecné pomocné funkce. Použij přesně tento kód.

// Vrátí NOVÉ pole s náhodným pořadím (Fisher–Yates).
export function zamichej(pole) {
  const a = pole.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Vrátí n náhodných prvků (bez opakování).
export function vyberNahodne(pole, n) {
  return zamichej(pole).slice(0, n);
}

// Odstraní diakritiku: „Žluté“ → „Zlute“.
export function bezDiakritiky(s) {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// Obecná slova, která se při porovnání odpovědí ignorují
// („Perský“ = „Perský záliv“, „Kaspické“ = „Kaspické moře“).
// Porovnávají se bez diakritiky, takže se ignoruje i „zaliv“ nebo „more“.
const OBECNA_SLOVA = new Set(['more', 'pruliv', 'prulivy', 'zaliv', 'poloostrov', 'nizina', 'rovina',
  'plosina', 'pohori', 'vysocina', 'hory', 'hora', 'poust', 'jezero', 'ostrovy', 'ostrov',
  'souostrovi', 'reka', 'kotlina', 'prolaklina', 'panev', 'pahorkatina', 'mt']);

// Převede text na tvar pro porovnání: malá písmena, bez uvozovek, pomlčky a tečky jako mezery,
// bez obecných slov, jednoduché mezery.
export function zakladTextu(s) {
  const slova = s.toLowerCase()
    .replace(/[„“”"'’‚()]/g, '')
    .replace(/[-–—.,/]/g, ' ')
    .split(/\s+/)
    .filter((w) => w && !OBECNA_SLOVA.has(bezDiakritiky(w)));
  return slova.join(' ');
}

// Porovná napsanou odpověď se seznamem přijatelných tvarů.
// Vrací 'ok' (správně), 'diakritika' (správně, ale chybí/špatná diakritika) nebo 'spatne'.
export function porovnejText(napsano, prijatelne) {
  const n = zakladTextu(napsano);
  if (!n) return 'spatne';
  const tvary = prijatelne.map(zakladTextu).filter(Boolean);
  if (tvary.includes(n)) return 'ok';
  const nBez = bezDiakritiky(n);
  if (tvary.some((t) => bezDiakritiky(t) === nBez)) return 'diakritika';
  return 'spatne';
}

// Přijatelné tvary názvu objektu (název + varianty).
export function tvaryObjektu(o) {
  return [o.nazev, ...(o.var || [])];
}

// Vzdálenost dvou bodů [délka, šířka] v km (haversine).
export function vzdalenostKm(a, b) {
  const R = 6371;
  const rad = Math.PI / 180;
  const dLat = (b[1] - a[1]) * rad;
  const dLon = (b[0] - a[0]) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a[1] * rad) * Math.cos(b[1] * rad) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

// Vzdálenost bodu p od úsečky a–b v km (přibližně, v lokální rovině kolem p; funguje i přes 180. poledník).
export function vzdalenostKUseckceKm(p, a, b) {
  const kx = 111.32 * Math.cos(p[1] * Math.PI / 180);
  const ky = 110.57;
  const dx = (lon) => { let d = lon - p[0]; if (d > 180) d -= 360; if (d < -180) d += 360; return d * kx; };
  const ax = dx(a[0]), ay = (a[1] - p[1]) * ky;
  const bx = dx(b[0]), by = (b[1] - p[1]) * ky;
  const vx = bx - ax, vy = by - ay;
  const delka2 = vx * vx + vy * vy;
  let t = delka2 === 0 ? 0 : -(ax * vx + ay * vy) / delka2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(ax + t * vx, ay + t * vy);
}

// Nejmenší vzdálenost bodu p od lomené čáry (pole bodů) v km.
export function vzdalenostKLinieKm(p, body) {
  if (body.length === 1) return vzdalenostKm(p, body[0]);
  let min = Infinity;
  for (let i = 0; i < body.length - 1; i++) min = Math.min(min, vzdalenostKUseckceKm(p, body[i], body[i + 1]));
  return min;
}
