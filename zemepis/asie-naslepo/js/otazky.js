// js/otazky.js – tvorba možností ABCD a kontrola odpovědí. Použij přesně tento kód.

import { zamichej, vzdalenostKm, porovnejText, tvaryObjektu } from './util.js';

// Kandidáti na špatnou možnost za správnou odpověď s ID idSpravne.
// Bere objekty stejné kategorie (nebo otazka.pool), vynechá správné odpovědi a otazka.nep,
// vynechá i objekt, na který se otázka ptá (otazka.o), pokud sám není správnou odpovědí,
// seřadí je podle vzdálenosti od správné odpovědi a vrátí 6 nejbližších v náhodném pořadí.
function kandidati(otazka, idSpravne, index) {
  const spravny = index.get(idSpravne);
  const zakazane = new Set([...otazka.a, ...(otazka.nep || [])]);
  if (!otazka.a.includes(otazka.o)) zakazane.add(otazka.o);
  const zdroj = otazka.pool
    ? otazka.pool.map((id) => index.get(id))
    : [...index.values()].filter((o) => o.kat === spravny.kat);
  const seznam = zdroj.filter((o) => !zakazane.has(o.id));
  const vzd = (o) => (spravny.body && o.body ? vzdalenostKm(spravny.body[0], o.body[0]) : Infinity);
  const serazene = zamichej(seznam).sort((x, y) => vzd(x) - vzd(y));
  return zamichej(serazene.slice(0, 6));
}

const nazvy = (ids, index) => ids.map((id) => index.get(id).nazev).join(' + ');
const klic = (ids) => ids.slice().sort().join('|');

// Vrátí pole možností { text, spravne } v náhodném pořadí.
// Délka 4; méně (min. 2) jen tehdy, když víc věrohodných možností neexistuje. null = otázku do ABCD nedávat.
export function moznostiABCD(otazka, index) {
  if (otazka.text) {
    return zamichej([{ text: otazka.text, spravne: true }, ...otazka.spatne.map((t) => ({ text: t, spravne: false }))]);
  }
  const spravne = { text: nazvy(otazka.a, index), spravne: true };
  let spatne = [];
  if (otazka.a.length === 1) {
    spatne = kandidati(otazka, otazka.a[0], index).slice(0, 3).map((o) => [o.id]);
  } else {
    const [x, y] = otazka.a;
    const kx = kandidati(otazka, x, index).map((o) => o.id);
    const ky = kandidati(otazka, y, index).map((o) => o.id);
    // Pořadí kombinací: jedna polovina správně (oba směry), pak obě špatně.
    const kombinace = [];
    for (let i = 0; i < 6; i++) {
      if (ky[i]) kombinace.push([x, ky[i]]);
      if (kx[i]) kombinace.push([kx[i], y]);
    }
    for (let i = 0; i < 6; i++) for (let j = 0; j < 6; j++) if (kx[i] && ky[j]) kombinace.push([kx[i], ky[j]]);
    const videne = new Set([klic(otazka.a)]);
    for (const k of kombinace) {
      if (k[0] === k[1] || videne.has(klic(k))) continue;
      videne.add(klic(k));
      spatne.push(k);
      if (spatne.length === 3) break;
    }
  }
  if (spatne.length === 0) return null;
  return zamichej([spravne, ...spatne.map((ids) => ({ text: nazvy(ids, index), spravne: false }))]);
}

// Kontrola napsané odpovědi.
// napsane = pole řetězců (1 políčko, nebo 2 políčka u otázek se 2 odpověďmi).
// Vrací { body: počet správných položek, max, polozky: [{ napsano, stav: 'ok'|'diakritika'|'spatne', spravne: název }] }
export function zkontrolujNapsane(otazka, napsane, index) {
  if (otazka.text) {
    const stav = porovnejText(napsane[0] || '', [otazka.text]);
    return { body: stav === 'spatne' ? 0 : 1, max: 1, polozky: [{ napsano: napsane[0] || '', stav, spravne: otazka.text }] };
  }
  const zbyva = otazka.a.map((id) => index.get(id));
  const polozky = [];
  for (const n of napsane) {
    let nalez = null, stavNalezu = 'spatne';
    for (const o of zbyva) {
      const s = porovnejText(n || '', tvaryObjektu(o));
      if (s === 'ok' || (s === 'diakritika' && stavNalezu === 'spatne')) { nalez = o; stavNalezu = s; if (s === 'ok') break; }
    }
    if (nalez) zbyva.splice(zbyva.indexOf(nalez), 1);
    polozky.push({ napsano: n || '', stav: stavNalezu, spravne: nalez ? nalez.nazev : null });
  }
  // Položkám bez shody doplň chybějící správné názvy.
  for (const p of polozky) if (!p.spravne) p.spravne = zbyva.shift()?.nazev ?? '';
  const body = polozky.filter((p) => p.stav !== 'spatne').length;
  return { body, max: otazka.a.length, polozky };
}

// Otázka „pravda / nepravda“: ukáže se otázka a jedna nabídnutá odpověď.
// S pravděpodobností 50 % je nabídnutá odpověď správná. Vrací { otazka, nabidka, pravda } nebo null.
export function pravdaNepravda(otazka, index) {
  const m = moznostiABCD(otazka, index);
  if (!m) return null;
  const pravda = Math.random() < 0.5;
  const nabidka = pravda ? m.find((x) => x.spravne) : m.find((x) => !x.spravne);
  return { otazka, nabidka: nabidka.text, pravda };
}

// Objekty, které se překrývají (celek ↔ část). U otázek na polohu se nesmí nabízet jako špatná možnost.
const CELEK_CAST = [
  ['os-japonske', 'os-honsu', 'os-hokkaido', 'os-sikoku', 'os-kjusu'],
  ['os-velke-sundy', 'os-sumatra', 'os-java', 'os-borneo', 'os-celebes'],
  ['os-male-sundy', 'os-timor', 'os-flores'],
  ['os-filipiny', 'os-luzon', 'os-mindanao'],
  ['mo-stredozemni', 'mo-egejske'],
  ['po-zadni-indie', 'po-malajsky'],
];
function prekryvajiciSe(id) {
  const skupina = CELEK_CAST.find((s) => s.includes(id));
  if (!skupina) return [];
  return skupina[0] === id ? skupina.slice(1) : [skupina[0]];
}

// Otázka „Pojmenuj“ (poloha → název) pro objekt o – lze ji předat do moznostiABCD / zkontrolujNapsane.
// Špatné možnosti jsou jen objekty ze seznamu (žádné pomocné) a nikdy celek/část téhož místa.
export function otazkaPojmenuj(o, index) {
  const pomocne = index ? [...index.values()].filter((x) => x.pomocny).map((x) => x.id) : [];
  return { o: o.id, t: 'zpet', q: 'Jak se jmenuje vyznačený objekt?', a: [o.id], nep: [...prekryvajiciSe(o.id), ...pomocne] };
}

// Objekty pro špatné možnosti u otázky „Kde leží X?“ (kvíz – 4 špendlíky A–D v mapě).
// Vrací až `pocet` objektů stejné kategorie blízko o, všechny s body.
export function blizkeObjekty(o, index, pocet = 3) {
  return kandidati(otazkaPojmenuj(o, index), o.id, index).filter((x) => x.body).slice(0, pocet);
}
