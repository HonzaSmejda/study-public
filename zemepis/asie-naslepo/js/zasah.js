// js/zasah.js – vyhodnocení kliknutí do mapy. Použij přesně tento kód.
// Potřebuje globální d3 (d3.geoContains) a geodata načtená přes pripravGeo().

import { vzdalenostKm, vzdalenostKLinieKm } from './util.js';

// Z data/zaklad.json připraví rychlé vyhledávání:
// geo.staty: Map a3 → [Feature], geo.jezera: Map id → [Feature], geo.reky: Map id → [Feature]
export function pripravGeo(zaklad) {
  const geo = { staty: new Map(), jezera: new Map(), reky: new Map(), zaklad };
  const pridej = (mapa, klic, f) => { if (!klic) return; if (!mapa.has(klic)) mapa.set(klic, []); mapa.get(klic).push(f); };
  for (const f of zaklad.staty) pridej(geo.staty, f.properties.a3, f);
  for (const f of zaklad.jezera) pridej(geo.jezera, f.properties.id, f);
  for (const f of zaklad.reky) pridej(geo.reky, f.properties.id, f);
  return geo;
}

// Všechny lomené čáry řeky jako pole polí bodů.
export function caryReky(id, geo) {
  return (geo.reky.get(id) || []).flatMap((f) => f.geometry.coordinates);
}

// Vrátí „skóre zásahu“ objektu o pro klik [délka, šířka]:
//   0       = klik je uvnitř polygonu (stát, jezero)
//   0 až 1  = klik je ve vzdálenosti (vzdálenost / o.r) od objektu
//   null    = objekt nebyl zasažen
export function skoreZasahu(o, klik, geo) {
  if (o.tvar === 'stat') {
    for (const a3 of o.a3) for (const f of geo.staty.get(a3) || []) if (d3.geoContains(f, klik)) return 0;
  }
  if (o.tvar === 'jezero') {
    for (const f of geo.jezera.get(o.id) || []) if (d3.geoContains(f, klik)) return 0;
  }
  if (!o.body || !o.r) return null;
  let km;
  if (o.tvar === 'reka') {
    const cary = caryReky(o.id, geo);
    km = cary.length ? Math.min(...cary.map((c) => vzdalenostKLinieKm(klik, c))) : vzdalenostKm(klik, o.body[0]);
  } else if (o.tvar === 'linie') {
    km = vzdalenostKLinieKm(klik, o.body);
  } else {
    km = Math.min(...o.body.map((b) => vzdalenostKm(klik, b)));
  }
  return km <= o.r ? km / o.r : null;
}

// Najde objekt, na který uživatel klikl. kandidati = pole objektů.
// Vyhrává nejmenší skóre. Při shodě má přednost objekt, který není stát
// (jezero leží uvnitř polygonu státu), a pak objekt s menším r (malé objekty).
export function najdiVBode(klik, kandidati, geo) {
  let nejlepsi = null, nejKlic = null;
  for (const o of kandidati) {
    const s = skoreZasahu(o, klik, geo);
    if (s === null) continue;
    const klic = [s, o.tvar === 'stat' ? 1 : 0, o.r];
    const lepsi = !nejKlic || klic[0] < nejKlic[0] || (klic[0] === nejKlic[0] && (klic[1] < nejKlic[1] || (klic[1] === nejKlic[1] && klic[2] < nejKlic[2])));
    if (lepsi) { nejlepsi = o; nejKlic = klic; }
  }
  return nejlepsi;
}

// Bod, kam se kreslí štítek / číslo objektu.
// Řeka: bod v polovině délky její nejdelší čáry. Ostatní: prostřední bod z body.
export function bodStitku(o, geo) {
  if (o.tvar === 'reka') {
    const cary = caryReky(o.id, geo);
    if (cary.length) {
      const delka = (c) => c.slice(1).reduce((s, p, i) => s + vzdalenostKm(c[i], p), 0);
      const c = cary.reduce((a, b) => (delka(b) > delka(a) ? b : a));
      const pul = delka(c) / 2;
      let s = 0;
      for (let i = 1; i < c.length; i++) { s += vzdalenostKm(c[i - 1], c[i]); if (s >= pul) return c[i]; }
      return c[c.length - 1];
    }
  }
  return o.body[Math.floor(o.body.length / 2)];
}
