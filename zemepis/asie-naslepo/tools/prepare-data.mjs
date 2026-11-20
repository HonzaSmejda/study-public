// tools/prepare-data.mjs
// Jednorázová příprava mapových dat z Natural Earth (public domain).
// Spuštění z kořene projektu:  node tools/prepare-data.mjs
// Potřebuje Node.js 18 nebo novější (kvůli vestavěnému fetch). Žádné npm balíčky.
// Výstup: data/zaklad.json  (cca 1 MB, na serveru se komprimuje gzipem na cca 300 kB)

import { writeFile, mkdir } from 'node:fs/promises';

const ZDROJ = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/';
const SOUBORY = {
  staty: 'ne_50m_admin_0_countries.geojson',
  jezera: 'ne_50m_lakes.geojson',
  reky: 'ne_50m_rivers_lake_centerlines.geojson',
};

// Oblast, kterou ponecháme (Asie + okolí). Polygon/čára se ponechá,
// pokud aspoň jeden její bod leží v oblasti.
const vOblasti = ([x, y]) => (x >= 15 || x <= -160) && y >= -20 && y <= 85;

// Řeky: ID objektu → hodnoty vlastnosti name_en v Natural Earth (mezery se normalizují).
const REKY = {
  're-huang-he': ['Huang', 'Yellow'],
  're-chang-jiang': ['Yangtze', 'Tongtian', 'Tuotuo'],
  're-xi-jiang': ['Xi', 'Hongshui', 'Nanpan'],
  're-mekong': ['Mekong'],
  're-brahmaputra': ['Brahmaputra', 'Dihang'],
  're-ganga': ['Ganges'],
  're-indus': ['Indus'],
  're-tigris': ['Tigris', 'Dicle'],
  're-eufrat': ['Euphrates', 'Al Furat', 'Firat'],
  're-jordan': ['Jordan'],
  're-amudarja': ['Amu Darya', 'Panj', 'Pamir'],
  're-syrdarja': ['Syr Darya', 'Naryn'],
  're-irtys': ['Irtysh', 'Ertis'],
  're-ob': ['Ob'],
  're-jenisej': ['Yenisey', 'Verkhniy Yenisey'],
  're-angara': ['Angara'],
  're-niznaja-tunguska': ['Nizhnyaya Tunguska'],
  're-lena': ['Lena'],
  're-indigirka': ['Indigirka'],
  're-kolyma': ['Kolyma'],
  're-amur': ['Amur'],
};

// Jezera: ID objektu → hodnoty vlastnosti name v Natural Earth.
const JEZERA = {
  'je-bajkal': ['Lake Baikal'],
  'je-mrtve': ['Dead Sea'],
  'je-aralske': ['North Aral Sea', 'South Aral Sea'],
  'je-kukunor': ['Qinghai Hu'],
  'je-tonlesap': ['Tonlé Sap'],
  'je-urmijske': ['Lake Urmia'],
  'je-vanske': ['Lake Van'],
  'je-tuz': ['Lake Tuz'],
  'je-issyk-kul': ['Issyk-Kul'],
  'je-balchas': ['Lake Balkhash'],
};

const norm = (s) => (s || '').replace(/\s+/g, ' ').trim();
const r2 = (v) => Math.round(v * 100) / 100;

// Zaokrouhlí na 2 desetinná místa a vynechá body blíž než 0,04° k předchozímu.
function proridit(body, uzavrena) {
  const out = [];
  for (const p of body) {
    const q = [r2(p[0]), r2(p[1])];
    const l = out[out.length - 1];
    if (!l || Math.abs(l[0] - q[0]) + Math.abs(l[1] - q[1]) >= 0.04) out.push(q);
  }
  if (uzavrena) {
    const f = out[0], l = out[out.length - 1];
    if (f[0] !== l[0] || f[1] !== l[1]) out.push([f[0], f[1]]);
    return out.length >= 4 ? out : null;
  }
  return out.length >= 2 ? out : null;
}

function polygony(g) {
  const seznam = g.type === 'Polygon' ? [g.coordinates] : g.type === 'MultiPolygon' ? g.coordinates : [];
  const ps = seznam
    .filter((p) => p[0].some(vOblasti))
    .map((p) => p.map((kruh) => proridit(kruh, true)).filter(Boolean))
    .filter((p) => p.length);
  return ps.length ? { type: 'MultiPolygon', coordinates: ps } : null;
}

function cary(g) {
  const seznam = g.type === 'LineString' ? [g.coordinates] : g.type === 'MultiLineString' ? g.coordinates : [];
  const ls = seznam.filter((l) => l.some(vOblasti)).map((l) => proridit(l, false)).filter(Boolean);
  return ls.length ? { type: 'MultiLineString', coordinates: ls } : null;
}

function najdiId(tabulka, nazev) {
  for (const [id, nazvy] of Object.entries(tabulka)) if (nazvy.includes(nazev)) return id;
  return null;
}

async function nacti(soubor) {
  const res = await fetch(ZDROJ + soubor);
  if (!res.ok) throw new Error(`Nepodařilo se stáhnout ${soubor}: HTTP ${res.status}`);
  return res.json();
}

const [staty, jezera, reky] = await Promise.all([
  nacti(SOUBORY.staty), nacti(SOUBORY.jezera), nacti(SOUBORY.reky),
]);

const vystup = { staty: [], jezera: [], reky: [] };

for (const f of staty.features) {
  const g = f.geometry && polygony(f.geometry);
  if (g) vystup.staty.push({ type: 'Feature', properties: { a3: f.properties.ADM0_A3 }, geometry: g });
}
for (const f of jezera.features) {
  const g = f.geometry && polygony(f.geometry);
  if (g) vystup.jezera.push({ type: 'Feature', properties: { id: najdiId(JEZERA, norm(f.properties.name)) }, geometry: g });
}
for (const f of reky.features) {
  const g = f.geometry && cary(f.geometry);
  if (!g) continue;
  // Řeka Jordan musí ležet na Blízkém východě (pojistka proti stejnojmenným řekám).
  let id = najdiId(REKY, norm(f.properties.name_en));
  if (id === 're-jordan' && !g.coordinates[0].every(([x]) => x > 34 && x < 37)) id = null;
  vystup.reky.push({ type: 'Feature', properties: { id }, geometry: g });
}

// Kontrola: každá řeka a jezero z tabulek musí mít aspoň jednu geometrii.
const chybi = [];
for (const id of Object.keys(REKY)) if (!vystup.reky.some((f) => f.properties.id === id)) chybi.push(id);
for (const id of Object.keys(JEZERA)) if (!vystup.jezera.some((f) => f.properties.id === id)) chybi.push(id);
if (chybi.length) throw new Error('Chybí geometrie pro: ' + chybi.join(', '));

await mkdir('data', { recursive: true });
const json = JSON.stringify(vystup);
await writeFile('data/zaklad.json', json);
console.log(`Hotovo: data/zaklad.json (${(json.length / 1024).toFixed(0)} kB) – států ${vystup.staty.length}, jezer ${vystup.jezera.length}, řek ${vystup.reky.length}`);
