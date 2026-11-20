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

// Jednoduché čárové ikony (SVG) místo emoji. Barvu berou z textu (currentColor).
const CESTY_IKON = {
  nastaveni: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  cas: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9 2h6"/>',
  hledat: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  misto: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  tisk: '<path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v7H6z"/>',
};
export function ikona(nazev, velikost = 18) {
  return `<svg class="ikona" viewBox="0 0 24 24" width="${velikost}" height="${velikost}" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${CESTY_IKON[nazev]}</svg>`;
}
