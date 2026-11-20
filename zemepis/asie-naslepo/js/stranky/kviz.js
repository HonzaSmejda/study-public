// js/stranky/kviz.js – Kvíz ABCD (krok 10).

import {
  cipyKategorii, prepinac, hodnota, abcd, zpetnaVazba, vysledekKola, spustUlohy, uklid, esc, prvek,
  naslouchej, vPoli, opakuj, zastav, vysvetleni, textOdpovedi, cipKategorie, jeMaly,
} from '../komponenty.js';
import { Kolo } from '../kolo.js';
import { vyberNahodne, zamichej, ikona } from '../util.js';
import { moznostiABCD, otazkaPojmenuj, blizkeObjekty } from '../otazky.js';
import { bodStitku } from '../zasah.js';

// Nastavení kvízu platí do zavření stránky (nic se neukládá).
const volby = { pocet: '15', typ: 'mix', obtiznost: 'normalni', cas: 'ne' };

const POMER = { lehka: 0.7, normalni: 0.5, tezka: 0.3 };

function sestav(ctx) {
  const n = Number(volby.pocet);
  const idx = ctx.index;
  const objekty = ctx.objektyVRozsahu().filter((o) => moznostiABCD(otazkaPojmenuj(o, idx), idx));
  let otazky = ctx.otazkyVRozsahu().filter((q) => moznostiABCD(q, idx));
  if (volby.obtiznost === 'lehka') otazky = otazky.filter((q) => q.text || q.a.length === 1);
  otazky = zamichej(otazky);
  if (volby.obtiznost === 'tezka') otazky.sort((a, b) => (b.a?.length === 2) - (a.a?.length === 2));

  let nPoloha = volby.typ === 'poloha' ? n : volby.typ === 'souvislosti' ? 0 : Math.round(n * POMER[volby.obtiznost]);
  let nSouv = n - nPoloha;
  if (nSouv > otazky.length) { if (volby.typ === 'mix') nPoloha += nSouv - otazky.length; nSouv = otazky.length; }
  if (nPoloha > objekty.length) { if (volby.typ === 'mix') nSouv = Math.min(otazky.length, nSouv + nPoloha - objekty.length); nPoloha = objekty.length; }

  const polozky = [];
  for (const o of vyberNahodne(objekty, nPoloha)) {
    if (Math.random() < 0.5) {
      const blizke = blizkeObjekty(o, idx, 3);
      if (blizke.length >= 2) { polozky.push({ typ: 'nm', o, piny: zamichej([o, ...blizke]) }); continue; }
    }
    polozky.push({ typ: 'mn', o });
  }
  otazky.slice(0, nSouv).forEach((q) => polozky.push({ typ: 's', q }));
  return zamichej(polozky);
}

export function vykresli(el, ctx, parametry) {
  const idx = ctx.index;
  let zastavKolo = null;

  function ukonci() {
    if (zastavKolo) { zastavKolo(); zastavKolo = null; }
    uklid();
  }

  // ---------- 10.1 úvodní nastavení ----------
  function uvod() {
    ukonci();
    el.innerHTML = `
      <h1>Kvíz ABCD</h1>
      <div class="karta formular-kvizu">
        <div class="radek-nastaveni"><span class="popis-nastaveni">Počet otázek:</span>${prepinac('pocet', [['10', '10'], ['15', '15'], ['20', '20'], ['30', '30']], volby.pocet)}</div>
        <div class="radek-nastaveni"><span class="popis-nastaveni">Kategorie:</span><div class="kviz-cipy"></div></div>
        <div class="radek-nastaveni"><span class="popis-nastaveni">Typ otázek:</span>${prepinac('typ', [['poloha', 'poloha'], ['souvislosti', 'souvislosti'], ['mix', 'mix']], volby.typ)}</div>
        <div class="radek-nastaveni"><span class="popis-nastaveni">Obtížnost:</span>${prepinac('obtiznost', [['lehka', 'lehká'], ['normalni', 'normální'], ['tezka', 'těžká']], volby.obtiznost)}</div>
        <div class="radek-nastaveni"><span class="popis-nastaveni">Na čas:</span>${prepinac('cas', [['ne', 'ne'], ['20', '20 s na otázku']], volby.cas)}</div>
        <div class="radek-tlacitek"><button type="button" class="hlavni tl-start">Začít kvíz</button></div>
      </div>`;
    cipyKategorii(el.querySelector('.kviz-cipy'), ctx);
    el.querySelector('.tl-start').addEventListener('click', () => {
      for (const k of Object.keys(volby)) volby[k] = hodnota(el, k);
      kviz();
    });
  }

  // ---------- 10.3 průběh ----------
  function kviz() {
    ukonci();
    const polozky = sestav(ctx);
    if (!polozky.length) {
      ctx.toast('Pro vybrané kategorie nejsou žádné otázky.');
      uvod();
      return;
    }
    const kolo = new Kolo(polozky, { opakovatChyby: false });
    const kats = ctx.KATEGORIE.filter((k) => !k.pomocna && ctx.aktivniKategorie.has(k.id) && ctx.objektyVRozsahu().some((o) => o.kat === k.id));
    const nazevKvizu = kats.length > 4 ? `${kats.length} kategorií` : kats.map((k) => k.nazev).join(' + ');
    el.innerHTML = `
      <div class="kviz">
        <div class="kviz-hlava">
          <span class="kviz-nazev">Kvíz: ${esc(nazevKvizu)}</span>
          <span class="kviz-poradi"></span>
          <span class="kviz-skore"></span>
          <span class="kviz-cas" ${volby.cas === 'ne' ? 'hidden' : ''}></span>
        </div>
        <div class="prubeh"><div style="width: 0%"></div></div>
        <div class="rozlozeni kviz-telo">
          <div class="kviz-mapa-sloupec"></div>
          <div class="karta panel kviz-otazka"></div>
        </div>
      </div>`;
    const mapaDiv = prvek('<div class="mapa"></div>');
    el.querySelector('.kviz-mapa-sloupec').append(mapaDiv);
    let priKlikuNaPin = null;
    const m = ctx.mapa(mapaDiv);
    const telo = el.querySelector('.kviz-otazka');
    const casEl = el.querySelector('.kviz-cas');
    let cislo = 0;
    let casovac = null;
    const odeberEnter = naslouchej('keydown', (e) => {
      if (e.key !== 'Enter' || vPoli(e) || (e.target instanceof HTMLElement && e.target.tagName === 'BUTTON')) return;
      const d = telo.querySelector('.tl-dalsi');
      if (d && !d.disabled) { e.preventDefault(); d.click(); }
    });
    zastavKolo = () => { odeberEnter(); if (casovac) zastav(casovac); };

    function hlava() {
      const spravne = [...kolo.prvni.values()].filter((v) => v.spravne).length;
      el.querySelector('.kviz-poradi').textContent = `Otázka ${cislo} / ${kolo.maxSkore}`;
      el.querySelector('.kviz-skore').textContent = `Správně: ${spravne} · Chyby: ${kolo.chyby.length}`;
      el.querySelector('.kviz > .prubeh > div').style.width = `${(kolo.hotovoPrvnich / kolo.maxSkore) * 100}%`;
    }

    function dalsi() {
      if (casovac) { zastav(casovac); casovac = null; }
      m.smazZvyrazneni(); m.smazPiny(); m.smazCary();
      const p = kolo.dalsi();
      if (!p) { konec(); return; }
      cislo++;
      hlava();
      let hotovo = false;
      let napoveda = false;
      const jeStat = p.typ !== 's' && p.o.kat === 'stat';
      m.hranice(jeStat);

      // mapa je vždy vlevo, otázka vpravo (vše na jedné obrazovce)
      if (p.typ === 's') m.celaMapa();

      let textOtazky, moznosti, textSpravne, proc = '', popisOtazky;
      if (p.typ === 'mn') {
        m.zvyrazni(p.o, 'cil');
        if (jeMaly(p.o, true)) m.priblizNa(p.o); else m.celaMapa();
        textOtazky = 'Jak se jmenuje vyznačený objekt?';
        moznosti = moznostiABCD(otazkaPojmenuj(p.o, idx), idx);
        textSpravne = p.o.nazev;
        popisOtazky = 'Vyznačený objekt';
      } else if (p.typ === 'nm') {
        textOtazky = `Kde leží <strong>${esc(p.o.nazev)}</strong>?`;
        moznosti = p.piny.map((x) => ({ text: '', spravne: x === p.o }));
        textSpravne = `špendlík ${'ABCD'[p.piny.indexOf(p.o)]}`;
        popisOtazky = `Kde leží ${p.o.nazev}?`;
        const body = p.piny.map((x) => bodStitku(x, ctx.geo));
        p.uzly = body.map((b, i) => {
          const g = m.pin(b, 'ABCD'[i]);
          g.style.cursor = 'pointer';
          g.addEventListener('click', (e) => { e.stopPropagation(); if (priKlikuNaPin) priKlikuNaPin(i); });
          return g;
        });
        m.priblizNa({ tvar: 'oblast', body });
      } else {
        textOtazky = esc(p.q.q);
        moznosti = moznostiABCD(p.q, idx);
        textSpravne = textOdpovedi(p.q, ctx);
        proc = vysvetleni(p.q, ctx);
        popisOtazky = p.q.q;
      }

      telo.innerHTML = `
        <p class="nadpis-ulohy">${textOtazky}</p>
        ${p.typ !== 's' ? `<p>${cipKategorie(ctx, p.o.kat)}</p>` : ''}
        <div class="odpoved-misto"></div>
        <div class="kviz-pata">
          <button type="button" class="tl-napoveda">Nápověda (stojí půl bodu)</button>
          <span class="maly">Klávesy 1–4 / A–D</span>
        </div>
        <div class="napoveda-text"></div>
        <div class="vazba-misto" aria-live="polite"></div>`;
      const fb = telo.querySelector('.vazba-misto');
      const tlNapoveda = telo.querySelector('.tl-napoveda');
      tlNapoveda.addEventListener('click', () => {
        napoveda = true;
        tlNapoveda.disabled = true;
        let t;
        if (p.typ === 's') {
          const o = idx.get(p.q.o);
          t = `Nápověda: ${o.kde || ctx.KATEGORIE.find((k) => k.id === o.kat).nazev}`;
        } else {
          t = p.o.kde ? `Leží: ${p.o.kde}` : `Kategorie: ${ctx.KATEGORIE.find((k) => k.id === p.o.kat).nazev}`;
        }
        telo.querySelector('.napoveda-text').innerHTML = `<p class="napoveda">${esc(t)}</p>`;
      });

      function po(spravne, odpoved, iZvolene) {
        if (hotovo) return;
        hotovo = true;
        priKlikuNaPin = null;
        if (casovac) { zastav(casovac); casovac = null; }
        tlNapoveda.disabled = true;
        const detail = spravne ? null : {
          popis: odpoved === null ? `${popisOtazky} – čas vypršel` : `${popisOtazky} – tvoje odpověď: ${odpoved}, správně: ${textSpravne}`,
          objekt: p.typ !== 's' ? p.o.id : null,
          otazka: p.typ === 's' ? p.q : null,
        };
        kolo.odpoved(spravne, detail, napoveda ? 0.5 : 1);
        zpetnaVazba(fb, spravne, textSpravne, proc);
        if (p.typ === 'mn') { m.smazZvyrazneni(); m.zvyrazni(p.o, spravne ? 'spravne' : 'spatne'); }
        if (p.typ === 'nm') {
          p.uzly.forEach((g, i) => {
            const ok = p.piny[i] === p.o;
            g.setAttribute('class', `pin ${ok ? 'spravne' : i === iZvolene ? 'spatne' : ''}`.trim());
          });
          m.zvyrazni(p.o, 'spravne');
        }
        if (p.typ === 's') {
          const o = idx.get(p.q.o);
          if (o) m.zvyrazni(o, 'vybrane');
          if (p.q.a) {
            const sBody = p.q.a.map((id) => idx.get(id)).filter((x) => x.body || x.tvar === 'stat');
            sBody.forEach((x) => m.zvyrazni(x, 'spravne'));
            if (sBody.length === 1 && o && o.body) m.priblizNa(o);
          }
        }
        hlava();
        const b = prvek('<button type="button" class="hlavni tl-dalsi">Další</button>');
        b.addEventListener('click', () => { b.disabled = true; dalsi(); });
        fb.append(b);
        setTimeout(() => b.focus({ preventScroll: true }), 0);
      }

      const api = abcd(telo.querySelector('.odpoved-misto'), moznosti, (sp, text, i) => {
        po(sp, p.typ === 'nm' ? `špendlík ${'ABCD'[i]}` : text, i);
      }, { bezTextu: p.typ === 'nm' });
      if (p.typ === 'nm') priKlikuNaPin = (i) => api.vyber(i);

      if (volby.cas !== 'ne') {
        let zbyva = 20;
        casEl.innerHTML = `${ikona('cas', 16)} ${zbyva}`;
        casovac = opakuj(() => {
          zbyva--;
          casEl.innerHTML = `${ikona('cas', 16)} ${zbyva}`;
          if (zbyva <= 0) {
            api.prozrad();
            po(false, null, -1);
          }
        }, 1000);
      }
    }

    function konec() {
      zastavKolo();
      zastavKolo = null;
      const chyby = kolo.chyby.map((c) => c.detail);
      ctx.posledniChyby = {
        objekty: chyby.filter((d) => d.objekt).map((d) => d.objekt),
        otazky: chyby.filter((d) => d.otazka).map((d) => d.otazka),
      };
      el.innerHTML = '<h1>Kvíz ABCD</h1><div class="vysledek-misto"></div>';
      vysledekKola(el.querySelector('.vysledek-misto'), kolo, {
        nazev: 'Kvíz ABCD',
        priZnovu: kviz,
        priChybach: () => procvicChyby(ctx.posledniChyby),
      }, ctx);
    }

    dalsi();
  }

  // „Procvič jen chyby“ – jinou formou: polohy jako Najdi, souvislosti jako Napiš.
  function procvicChyby(chyby) {
    ukonci();
    const polozky = zamichej([
      ...chyby.objekty.map((id) => ({ typ: 'najdi', o: idx.get(id) })),
      ...chyby.otazky.map((q) => ({ typ: 'otazka', q, format: 'napis' })),
    ]);
    el.innerHTML = '<h1>Kvíz ABCD – procvičení chyb</h1><div class="kolo-misto"></div>';
    const vse = ctx.OBJEKTY.filter((o) => !o.pomocny);
    zastavKolo = spustUlohy(el.querySelector('.kolo-misto'), ctx, polozky, {
      nazev: 'Kvíz ABCD – procvičení chyb',
      priZnovu: uvod,
      priChybach: (chybne) => procvicChyby({
        objekty: chybne.filter((p) => p.typ === 'najdi').map((p) => p.o.id),
        otazky: chybne.filter((p) => p.typ === 'otazka').map((p) => p.q),
      }),
      kandidati: () => vse,
    });
  }

  if (parametry.get('chyby') === '1' && (ctx.posledniChyby.objekty.length || ctx.posledniChyby.otazky.length)) {
    procvicChyby(ctx.posledniChyby);
  } else {
    uvod();
  }
  return () => { ukonci(); };
}
