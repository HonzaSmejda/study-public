// js/app.js – start aplikace, sdílený kontext a přepínání stránek. Použij přesně tento kód.

import * as DATA from './data.js';
import { pripravGeo } from './zasah.js';
import { vytvorMapu } from './mapa.js';
import { otevriNastaveni } from './nastaveni.js';
import * as start from './stranky/start.js';
import * as mapa from './stranky/mapa.js';
import * as slepa from './stranky/slepa.js';
import * as souvislosti from './stranky/souvislosti.js';
import * as kviz from './stranky/kviz.js';
import * as karticky from './stranky/karticky.js';
import * as test from './stranky/test.js';
import * as tahak from './stranky/tahak.js';
import * as trenink from './stranky/trenink.js';

const STRANKY = { '': start, mapa, slepa, souvislosti, kviz, karticky, test, tahak, trenink };
const NAZVY = { '': 'Start', mapa: 'Mapa', slepa: 'Slepá mapa', souvislosti: 'Souvislosti', kviz: 'Kvíz ABCD', karticky: 'Kartičky', test: 'Test nanečisto', tahak: 'Tahák', trenink: 'Rychlý trénink' };

// ---------- sdílený kontext (předává se každé stránce) ----------
const index = new Map(DATA.OBJEKTY.map((o) => [o.id, o]));
const barvy = Object.fromEntries(DATA.KATEGORIE.map((k) => [k.id, k.barva]));

const ctx = {
  ...DATA,                 // KATEGORIE, OBJEKTY, OTAZKY, TRASY, SADY, VETRELEC, OBKLIKNUTI, MNEMO
  index,                   // Map id → objekt
  barvy,                   // { idKategorie: barva }
  geo: null,               // doplní se po načtení data/zaklad.json
  // Nastavení – platí jen do zavření stránky (nic se neukládá).
  nastaveni: {
    rozsah: 'tucne',           // 'tucne' = jen tučné pojmy (výchozí) | 'vse' = i netučné (rozšíření)
    diakritika: 'tolerantni',  // 'tolerantni' = chybějící diakritika je „skoro správně“ | 'prisna' = je to chyba
    stupnice: [90, 75, 50, 30],// hranice v % pro známky 1, 2, 3, 4 (méně = 5)
    tema: 'auto',              // 'auto' | 'svetle' | 'tmave'
  },
  // Vybrané kategorie (čipy na Startu). Výchozí: všechny nepomocné kategorie.
  aktivniKategorie: new Set(DATA.KATEGORIE.filter((k) => !k.pomocna).map((k) => k.id)),

  // Objekty, které se právě procvičují (rozsah + vybrané kategorie). Nikdy pomocné.
  objektyVRozsahu() {
    return DATA.OBJEKTY.filter((o) => !o.pomocny && ctx.aktivniKategorie.has(o.kat) && (o.tucne || ctx.nastaveni.rozsah === 'vse'));
  },
  // Otázky na souvislosti k objektům v rozsahu.
  otazkyVRozsahu() {
    const ids = new Set(ctx.objektyVRozsahu().map((o) => o.id));
    return DATA.OTAZKY.filter((q) => ids.has(q.o));
  },
  // Nová mapa v daném prvku (každá stránka si vytváří vlastní).
  mapa(kontejner, volby) { return vytvorMapu(kontejner, ctx.geo, barvy, volby); },
  // Krátké oznámení dole na obrazovce.
  toast(text) {
    const t = document.createElement('div');
    t.className = 'toast'; t.setAttribute('role', 'status'); t.textContent = text;
    document.body.append(t);
    setTimeout(() => t.remove(), 2200);
  },
  // Zkopíruje text do schránky a ukáže „Zkopírováno“.
  async kopiruj(text) {
    try { await navigator.clipboard.writeText(text); ctx.toast('Zkopírováno'); }
    catch { ctx.toast('Kopírování se nepovedlo – označ text ručně.'); }
  },
  // Chyby z posledního testu nebo kvízu (pole ID objektů a otázek) – pro „Procvič jen chyby“.
  posledniChyby: { objekty: [], otazky: [] },
  // Známka z procent podle nastavené stupnice.
  znamka(procenta) {
    const s = ctx.nastaveni.stupnice;
    return procenta >= s[0] ? 1 : procenta >= s[1] ? 2 : procenta >= s[2] ? 3 : procenta >= s[3] ? 4 : 5;
  },
};
window.ASIE = ctx; // jen pro ladění v konzoli

// ---------- směrování podle adresy (#/mapa?id=…) ----------
let uklid = null;

function zobraz() {
  const [cesta, dotaz] = location.hash.replace(/^#\/?/, '').split('?');
  const nazev = STRANKY[cesta] ? cesta : '';
  const parametry = new URLSearchParams(dotaz || '');
  if (uklid) { uklid(); uklid = null; }
  const el = document.getElementById('stranka');
  el.innerHTML = '';
  document.querySelectorAll('.menu a').forEach((a) => {
    if (a.getAttribute('href') === '#/' + nazev) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  document.title = (nazev ? NAZVY[nazev] + ' – ' : '') + 'Asie naslepo';
  uklid = STRANKY[nazev].vykresli(el, ctx, parametry) || null;
  el.focus({ preventScroll: true });
  window.scrollTo(0, 0);
}

async function spust() {
  try {
    const odpoved = await fetch('data/zaklad.json');
    if (!odpoved.ok) throw new Error('HTTP ' + odpoved.status);
    ctx.geo = pripravGeo(await odpoved.json());
  } catch (e) {
    document.getElementById('stranka').innerHTML =
      '<div class="karta vazba-chyba"><h2>Mapu se nepodařilo načíst</h2><p>Zkontroluj připojení k internetu a obnov stránku.</p></div>';
    return;
  }
  document.getElementById('tlacitko-nastaveni').addEventListener('click', () => otevriNastaveni(ctx, zobraz));
  window.addEventListener('hashchange', zobraz);
  zobraz();
}

spust();
