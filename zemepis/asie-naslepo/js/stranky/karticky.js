// js/stranky/karticky.js – kartičky Umím / Neumím (krok 11).

import {
  cipyKategorii, prepinac, hodnota, uklid, esc, prvek, naslouchej, vPoli, textOdpovedi, vysvetleni,
  cipKategorie, jeMaly, textVysledku,
} from '../komponenty.js';
import { zamichej } from '../util.js';

const TYPY = [
  ['mn', 'mapa → název', true],
  ['ps', 'pojem → souvislost', true],
  ['sp', 'souvislost → pojem', false],
];

// Volby platí do zavření stránky.
const volby = { typy: new Set(TYPY.filter((t) => t[2]).map((t) => t[0])), pocet: '50' };

// Všechny kartičky zvolených typů z aktuálního rozsahu.
function vsechnyKarticky(ctx, typy) {
  const objekty = ctx.objektyVRozsahu().filter((o) => o.body);
  const otazky = ctx.otazkyVRozsahu();
  const k = [];
  if (typy.has('mn')) objekty.forEach((o) => k.push({ typ: 'mn', o }));
  if (typy.has('ps')) otazky.filter((q) => q.t !== 'zpet').forEach((q) => k.push({ typ: 'ps', q }));
  if (typy.has('sp')) otazky.filter((q) => q.t === 'zpet').forEach((q) => k.push({ typ: 'sp', q }));
  return k;
}

// Krátký popis kartičky (pro výsledky a seznam „Neumím“).
function popisKarticky(k) {
  if (k.typ === 'mn') return `${k.o.nazev} (mapa → název)`;
  return k.q.q;
}

// Text bez tabulátorů a konců řádků (export).
const cisty = (s) => String(s).replace(/[\t\r\n]+/g, ' ').trim();

export function vykresli(el, ctx) {
  function uvod() {
    uklid();
    el.innerHTML = `
      <h1>Kartičky</h1>
      <div class="karta formular-kvizu">
        <div class="radek-nastaveni"><span class="popis-nastaveni">Typy kartiček:</span>
          <span class="zaskrtavatka">${TYPY.map(([id, text]) => `<label><input type="checkbox" value="${id}" ${volby.typy.has(id) ? 'checked' : ''}> ${text}</label>`).join('')}</span></div>
        <div class="radek-nastaveni"><span class="popis-nastaveni">Kategorie:</span><div class="kart-cipy"></div></div>
        <div class="radek-nastaveni"><span class="popis-nastaveni">Počet:</span>${prepinac('pocet', [['20', '20'], ['50', '50'], ['vse', 'Vše']], volby.pocet)}</div>
        <div class="radek-tlacitek"><button type="button" class="tl-export">Export pro Anki/Quizlet</button><button type="button" class="hlavni tl-start">Začít</button></div>
      </div>`;
    cipyKategorii(el.querySelector('.kart-cipy'), ctx);
    const boxy = [...el.querySelectorAll('.zaskrtavatka input')];
    boxy.forEach((b) => b.addEventListener('change', () => {
      if (!boxy.some((x) => x.checked)) { b.checked = true; ctx.toast('Nech zapnutý aspoň jeden typ kartiček.'); }
    }));
    el.querySelector('.tl-export').addEventListener('click', exportuj);
    el.querySelector('.tl-start').addEventListener('click', () => {
      volby.typy = new Set(boxy.filter((b) => b.checked).map((b) => b.value));
      volby.pocet = hodnota(el, 'pocet');
      const k = zamichej(vsechnyKarticky(ctx, volby.typy));
      const balicek = volby.pocet === 'vse' ? k : k.slice(0, Number(volby.pocet));
      if (!balicek.length) { ctx.toast('Pro vybrané kategorie a typy nejsou žádné kartičky.'); return; }
      hraj(balicek);
    });
  }

  // ---------- 11.3 ovládání ----------
  function hraj(karticky) {
    uklid();
    const n = karticky.length;
    const balicek = karticky.slice();
    const neumim = new Set();
    let aktualni = null;
    let otocena = false;

    el.innerHTML = `
      <h1>Kartičky</h1>
      <div class="kart-hlava"><p class="prubeh-text"></p><div class="prubeh"><div></div></div></div>
      <div class="karticka" tabindex="-1">
        <div class="karticka-vnitrek">
          <div class="strana predni"></div>
          <div class="strana zadni"></div>
        </div>
      </div>
      <p class="maly napoveda-otoceni">Klikni na kartičku nebo stiskni mezerník – kartička se otočí.</p>
      <div class="radek-tlacitek stred kart-tlacitka">
        <button type="button" class="tl-otocit">Otočit</button>
        <button type="button" class="tl-neumim" disabled>Neumím</button>
        <button type="button" class="hlavni tl-umim" disabled>Umím</button>
      </div>`;
    const kartaEl = el.querySelector('.karticka');
    const predni = el.querySelector('.predni');
    const zadni = el.querySelector('.zadni');
    const tlUmim = el.querySelector('.tl-umim');
    const tlNeumim = el.querySelector('.tl-neumim');
    const mapaDiv = prvek('<div class="mapa mapa-karticky"></div>');
    predni.append(mapaDiv);
    const m = ctx.mapa(mapaDiv);

    function otoc() {
      if (!aktualni) return;
      otocena = !otocena;
      kartaEl.classList.toggle('otocena', otocena);
      if (otocena) { tlUmim.disabled = false; tlNeumim.disabled = false; }
    }

    function zobraz() {
      el.querySelector('.prubeh-text').textContent = `Zbývá: ${balicek.length}`;
      el.querySelector('.kart-hlava .prubeh > div').style.width = `${((n - balicek.length) / n) * 100}%`;
      aktualni = balicek[0];
      if (!aktualni) { konec(); return; }
      otocena = false;
      kartaEl.classList.remove('otocena');
      tlUmim.disabled = true; tlNeumim.disabled = true;
      m.smazZvyrazneni();
      const k = aktualni;
      const strana = (s, html, sMapou) => {
        s.innerHTML = `<div class="strana-obsah">${html}</div>`;
        s.classList.toggle('s-mapou', sMapou);
        if (sMapou) s.prepend(mapaDiv);
      };
      if (k.typ === 'mn') {
        // Vpředu mapa s otázkou, vzadu odpověď slovy.
        strana(predni, `<p class="karticka-popisek">Co je vyznačené na mapě? ${cipKategorie(ctx, k.o.kat)}</p>`, true);
        strana(zadni, `<p class="karticka-nazev">${esc(k.o.nazev)}</p><p>${cipKategorie(ctx, k.o.kat)}</p>${k.o.kde ? `<p>Kde: ${esc(k.o.kde)}</p>` : ''}${k.o.souv ? `<p class="maly">${esc(k.o.souv)}</p>` : ''}`, false);
        m.hranice(k.o.kat === 'stat');
        m.zvyrazni(k.o, 'cil');
        if (jeMaly(k.o, true)) m.priblizNa(k.o); else m.celaMapa();
      } else {
        const proc = k.typ === 'ps' ? vysvetleni(k.q, ctx) : '';
        strana(predni, `<p class="karticka-otazka">${esc(k.q.q)}</p>`, false);
        strana(zadni, `<p class="karticka-nazev">${esc(textOdpovedi(k.q, ctx))}</p>${proc ? `<p class="maly">Proč: ${esc(proc)}</p>` : ''}`, false);
      }
    }

    function umim() {
      if (!otocena) return;
      balicek.shift();
      zobraz();
    }
    function neumimFn() {
      if (!otocena) return;
      const k = balicek.shift();
      neumim.add(k);
      const od = Math.min(2, balicek.length);
      const pozice = od + Math.floor(Math.random() * (balicek.length - od + 1));
      balicek.splice(pozice, 0, k);
      zobraz();
    }

    kartaEl.addEventListener('click', (e) => { if (!e.target.closest('.mapa')) otoc(); });
    el.querySelector('.tl-otocit').addEventListener('click', otoc);
    tlUmim.addEventListener('click', umim);
    tlNeumim.addEventListener('click', neumimFn);
    naslouchej('keydown', (e) => {
      if (vPoli(e) || e.ctrlKey || e.metaKey || e.altKey || !aktualni) return;
      if (e.key === ' ') { e.preventDefault(); otoc(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); umim(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); neumimFn(); }
    });

    function konec() {
      uklid();
      aktualni = null;
      const napoprve = n - neumim.size;
      const seznam = [...neumim];
      el.innerHTML = `
        <h1>Kartičky</h1>
        <div class="karta vysledek">
          <h2>Hotovo!</h2>
          <p class="vysledek-skore">Umím napoprvé: ${napoprve} / ${n}</p>
          ${seznam.length ? `<h3>Aspoň jednou „Neumím“:</h3><ul class="seznam-chyb">${seznam.map((k) => `<li>${esc(popisKarticky(k))}</li>`).join('')}</ul>` : '<p>Bez chyby.</p>'}
          <div class="radek-tlacitek vlevo"></div>
        </div>`;
      const radek = el.querySelector('.radek-tlacitek');
      if (seznam.length) {
        const b = prvek('<button type="button" class="hlavni">Znovu jen Neumím</button>');
        b.addEventListener('click', () => hraj(zamichej(seznam)));
        radek.append(b);
      }
      const vse = prvek('<button type="button">Znovu vše</button>');
      vse.addEventListener('click', () => hraj(zamichej(karticky)));
      const kop = prvek('<button type="button">Zkopírovat výsledek</button>');
      kop.addEventListener('click', () => ctx.kopiruj(textVysledku('Kartičky', napoprve, n, Math.round((napoprve / n) * 100), seznam.map(popisKarticky))));
      const exp = prvek('<button type="button">Export pro Anki/Quizlet</button>');
      exp.addEventListener('click', exportuj);
      const nast = prvek('<button type="button">Nastavení</button>');
      nast.addEventListener('click', uvod);
      radek.append(vse, kop, exp, nast);
    }

    zobraz();
  }

  // ---------- 11.4 export ----------
  function exportuj() {
    const radky = [];
    for (const q of ctx.otazkyVRozsahu()) radky.push(`${cisty(q.q)}\t${cisty(textOdpovedi(q, ctx))}`);
    for (const o of ctx.objektyVRozsahu()) if (o.kde) radky.push(`${cisty(`Kde leží ${o.nazev}?`)}\t${cisty(o.kde)}`);
    let d = el.querySelector('dialog.export');
    if (!d) { d = prvek('<dialog class="export"></dialog>'); el.append(d); }
    d.innerHTML = `
      <h2>Export pro Anki/Quizlet</h2>
      <p class="maly">Jedna kartička na řádek: přední strana, tabulátor, zadní strana. Celkem ${radky.length} kartiček.</p>
      <textarea readonly rows="12" class="export-text"></textarea>
      <div class="radek-tlacitek"><button type="button" class="tl-zavrit">Zavřít</button><button type="button" class="hlavni tl-kop">Zkopírovat</button></div>`;
    d.querySelector('textarea').value = radky.join('\n');
    d.querySelector('.tl-zavrit').addEventListener('click', () => d.close());
    d.querySelector('.tl-kop').addEventListener('click', () => ctx.kopiruj(radky.join('\n')));
    d.showModal();
  }

  uvod();
  return uklid;
}
