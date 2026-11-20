// tools/check-data.mjs – kontrola obsahových dat.
// Spuštění z kořene projektu:  node tools/check-data.mjs
// Musí skončit hláškou „Data jsou v pořádku.“ Jinak vypíše chyby a skončí kódem 1.

import { readFile } from 'node:fs/promises';
import { KATEGORIE, OBJEKTY, OTAZKY, TRASY, SADY, VETRELEC, OBKLIKNUTI, MNEMO } from '../js/data.js';
import { moznostiABCD } from '../js/otazky.js';

const chyby = [];
const chyba = (t) => chyby.push(t);
const index = new Map();
const kategorie = new Set(KATEGORIE.map((k) => k.id));
const TVARY = new Set(['bod', 'oblast', 'linie', 'reka', 'jezero', 'stat']);
const TYPY = new Set(['spojuje', 'oddeluje', 'mezi', 'usti', 'pramen', 'protece', 'soucast', 'stat', 'lezi', 'zpet', 'fakt']);
const bodOk = (p) => Array.isArray(p) && p.length === 2 && p[0] >= -180 && p[0] <= 180 && p[1] >= -90 && p[1] <= 90;

for (const o of OBJEKTY) {
  if (index.has(o.id)) chyba(`Duplicitní id ${o.id}`);
  index.set(o.id, o);
  if (!kategorie.has(o.kat)) chyba(`${o.id}: neznámá kategorie ${o.kat}`);
  if (!TVARY.has(o.tvar)) chyba(`${o.id}: neznámý tvar ${o.tvar}`);
  if (!o.pomocny && typeof o.tucne !== 'boolean') chyba(`${o.id}: chybí tucne`);
  if (o.body !== null && (!Array.isArray(o.body) || !o.body.every(bodOk))) chyba(`${o.id}: špatné body`);
  if (!o.pomocny && !o.body) chyba(`${o.id}: objekt ze seznamu musí mít body`);
  if (o.tvar === 'stat' && !(o.a3 && o.a3.length)) chyba(`${o.id}: stát bez a3`);
  if (o.tvar === 'linie' && o.body && o.body.length < 2) chyba(`${o.id}: linie potřebuje aspoň 2 body`);
}
const existuje = (id, kde) => { if (!index.has(id)) chyba(`${kde}: neexistující id ${id}`); };

for (const o of OBJEKTY) {
  if (o.tvar !== 'reka' || !o.tucne) continue;
  if (!bodOk(o.pramen) || !bodOk(o.usti)) chyba(`${o.id}: řeka bez pramen/usti`);
  existuje(o.ustiDo, o.id);
  for (const s of o.staty || []) existuje(s, o.id);
}

OTAZKY.forEach((q, i) => {
  const kde = `OTAZKY[${i}]`;
  existuje(q.o, kde);
  if (!TYPY.has(q.t)) chyba(`${kde}: neznámý typ ${q.t}`);
  if (q.text) {
    if (!(Array.isArray(q.spatne) && q.spatne.length === 3)) chyba(`${kde}: text musí mít přesně 3 špatné možnosti`);
  } else {
    if (!(Array.isArray(q.a) && (q.a.length === 1 || q.a.length === 2))) chyba(`${kde}: a musí mít 1 nebo 2 ID`);
    (q.a || []).forEach((id) => existuje(id, kde));
    (q.nep || []).forEach((id) => existuje(id, kde));
    (q.pool || []).forEach((id) => existuje(id, kde));
    if (q.a && q.a.every((id) => index.has(id))) {
      for (let k = 0; k < 20; k++) {
        const m = moznostiABCD(q, index);
        if (!m || m.length < 2) { chyba(`${kde}: nedá se vytvořit ABCD`); break; }
        if (m.filter((x) => x.spravne).length !== 1) { chyba(`${kde}: ABCD nemá právě 1 správnou možnost`); break; }
        if (new Set(m.map((x) => x.text)).size !== m.length) { chyba(`${kde}: ABCD má duplicitní možnosti`); break; }
      }
    }
  }
});

TRASY.forEach((t) => t.kroky.forEach((id) => existuje(id, t.id)));
SADY.forEach((s) => s.skupiny.forEach((g) => g.polozky.forEach((id) => existuje(id, s.id))));
VETRELEC.forEach((v) => [...v.clenove, ...v.vetrelci].forEach((id) => existuje(id, 'VETRELEC ' + v.nazev)));
OBKLIKNUTI.forEach((u) => [...u.cil, ...u.tol].forEach((id) => existuje(id, 'OBKLIKNUTI ' + u.zadani)));
MNEMO.forEach((m) => m.objekty.forEach((id) => existuje(id, 'MNEMO ' + m.co)));
for (const t of TRASY) for (const id of t.kroky) if (index.has(id) && !index.get(id).body) chyba(`${t.id}: krok ${id} nemá body (loď by neměla kam plout)`);

// Kontrola proti mapovým datům.
try {
  const zaklad = JSON.parse(await readFile('data/zaklad.json', 'utf8'));
  const a3 = new Set(zaklad.staty.map((f) => f.properties.a3));
  const reky = new Set(zaklad.reky.map((f) => f.properties.id));
  for (const o of OBJEKTY) {
    if (o.tvar === 'stat') o.a3.forEach((k) => { if (!a3.has(k)) chyba(`${o.id}: a3 ${k} není v data/zaklad.json`); });
    if (o.tvar === 'reka' && !reky.has(o.id)) chyba(`${o.id}: řeka nemá geometrii v data/zaklad.json`);
  }
} catch (e) {
  chyba('Nelze načíst data/zaklad.json – nejdřív spusť node tools/prepare-data.mjs');
}

const tucnych = OBJEKTY.filter((o) => o.tucne && o.kat !== 'stat' && !o.pomocny).length;
const statu = OBJEKTY.filter((o) => o.kat === 'stat').length;
console.log(`Objektů: ${OBJEKTY.length} (tučných pojmů ${tucnych}, států ${statu}), otázek: ${OTAZKY.length}`);
if (chyby.length) { console.error(chyby.join('\n')); process.exit(1); }
console.log('Data jsou v pořádku.');
