// js/stranky/slepa.js – hry na slepé mapě (krok 8).

import {
  zalozky, prepinac, hodnota, spustUlohy, uklid, esc, prvek, naslouchej, vPoli, pozdeji, opakuj, zastav,
  cipKategorie, cipyKategorii, polozkaSpravne, textVysledku, datum,
} from '../komponenty.js';
import { vyberNahodne, zamichej, porovnejText, tvaryObjektu, vzdalenostKm } from '../util.js';
import { skoreZasahu, najdiVBode, bodStitku } from '../zasah.js';

const HRY = [['najdi', 'Najdi'], ['pojmenuj', 'Pojmenuj'], ['popis', 'Popiš mapu'], ['sprint', 'Sprint'], ['reka', 'Řeka od pramene k ústí']];
const POCTY = [['10', '10'], ['20', '20'], ['vse', 'Vše']];

export function vykresli(el, ctx) {
  let hra = 'najdi';
  let zastavHru = null;
  el.innerHTML = '<h1>Slepá mapa</h1>';
  el.append(zalozky(HRY, hra, (id) => { hra = id; nastaveni(); }));
  // Filtr: co procvičovat (sdílí se s ostatními stránkami). Řeka na něm nezávisí.
  const filtrEl = prvek('<div class="filtr-slepa"><div class="slepa-cipy"></div><p class="maly slepa-pocet"></p></div>');
  const nastaveniEl = prvek('<div class="ovladani nastaveni-hry"></div>');
  const plocha = prvek('<div class="hra-plocha"></div>');
  el.append(filtrEl, nastaveniEl, plocha);
  const pocetEl = filtrEl.querySelector('.slepa-pocet');
  function aktualizujFiltr() {
    const n = ctx.objektyVRozsahu().length;
    pocetEl.textContent = `Vybráno ${n} pojmů.` + (zastavHru ? ' Nový výběr platí od dalšího Začít.' : '');
    const tl = nastaveniEl.querySelector('.tl-zacit');
    if (tl && hra !== 'reka') tl.disabled = n === 0;
  }
  cipyKategorii(filtrEl.querySelector('.slepa-cipy'), ctx, aktualizujFiltr);

  // Enter = „Další“ / „Další krok“ (pro hry mimo společné kolo)
  const enter = (e) => {
    if (e.key !== 'Enter' || vPoli(e) || (e.target instanceof HTMLElement && e.target.tagName === 'BUTTON')) return;
    const d = plocha.querySelector('.tl-dalsi');
    if (d && !d.disabled) { e.preventDefault(); d.click(); }
  };

  // Ukončí běžící hru: zastaví časovače a odebere posluchače (Enter se přidá znovu).
  function ukonciHru() {
    if (zastavHru) { zastavHru(); zastavHru = null; }
    uklid();
    naslouchej('keydown', enter);
  }

  // Úvodní stav před „Začít“: prázdná mapa a krátký text.
  function nahled(text) {
    plocha.innerHTML = `<div class="rozlozeni"><div class="mapa"></div><div class="karta panel"><p>${text}</p></div></div>`;
    ctx.mapa(plocha.querySelector('.mapa'));
  }

  function nastaveni() {
    ukonciHru();
    filtrEl.hidden = hra === 'reka';
    const objekty = ctx.objektyVRozsahu();
    let html = '';
    if (hra === 'najdi' || hra === 'pojmenuj') {
      html += `<span class="volba-radek">Počet: ${prepinac('pocet', POCTY, '10')}</span>`;
      if (hra === 'pojmenuj') html += `<span class="volba-radek">Odpověď: ${prepinac('format', [['napis', 'psát'], ['abcd', 'ABCD']], 'napis')}</span>`;
    }
    if (hra === 'sprint') html += '<span>Za 60 sekund najdi co nejvíc pojmů.</span>';
    if (hra === 'reka') html += '<span>Všechny tučné řeky: pramen, ústí a státy, kterými protéká.</span>';
    if (hra === 'popis') html += '<span>15 čísel na mapě – napiš nebo přiřaď názvy.</span>';
    nastaveniEl.innerHTML = `${html}<button type="button" class="hlavni tl-zacit">Začít</button>`;
    const tl = nastaveniEl.querySelector('.tl-zacit');
    if (hra !== 'reka' && !objekty.length) {
      tl.disabled = true;
      nahled('Ve vybraném rozsahu nejsou žádné pojmy. Vyber kategorie nahoře.');
    }
    tl.addEventListener('click', () => {
      ukonciHru();
      const pocet = hodnota(nastaveniEl, 'pocet');
      const n = pocet === 'vse' ? Infinity : Number(pocet);
      if (hra === 'najdi') najdi(vyberNahodne(ctx.objektyVRozsahu(), n));
      if (hra === 'pojmenuj') pojmenuj(vyberNahodne(ctx.objektyVRozsahu(), n), hodnota(nastaveniEl, 'format'));
      if (hra === 'popis') popis();
      if (hra === 'sprint') sprint();
      if (hra === 'reka') reka();
      aktualizujFiltr();
      window.scrollTo({ top: plocha.getBoundingClientRect().top + window.scrollY - 64, behavior: 'smooth' });
    });
    if (objekty.length || hra === 'reka') nahled('Mapa je bez popisků. Vyber kategorie, nastav hru a klikni na <strong>Začít</strong>.');
    aktualizujFiltr();
  }

  // ---------- 8.2 Najdi ----------
  function najdi(objekty) {
    ukonciHru();
    zastavHru = spustUlohy(plocha, ctx, objekty.map((o) => ({ typ: 'najdi', o })), {
      nazev: 'Slepá mapa – Najdi',
      priZnovu: () => najdi(vyberNahodne(ctx.objektyVRozsahu(), objekty.length)),
      priChybach: (chybne) => najdi(chybne.map((p) => p.o)),
    });
  }

  // ---------- 8.3 Pojmenuj ----------
  function pojmenuj(objekty, format) {
    ukonciHru();
    zastavHru = spustUlohy(plocha, ctx, objekty.map((o) => ({ typ: 'pojmenuj', o, format })), {
      nazev: 'Slepá mapa – Pojmenuj',
      priZnovu: () => pojmenuj(vyberNahodne(ctx.objektyVRozsahu(), objekty.length), format),
      priChybach: (chybne) => najdi(chybne.map((p) => p.o)),
    });
  }

  // ---------- 8.4 Popiš mapu ----------
  function popis() {
    const objekty = vyberNahodne(ctx.objektyVRozsahu(), 15);
    const n = objekty.length;
    plocha.innerHTML = `
      <div class="rozlozeni">
        <div><div class="mapa"></div><div class="pod-mapou"><button type="button" class="tl-cela">Celá mapa</button></div></div>
        <div class="karta panel popis-panel">
          <div class="ovladani">${prepinac('rezim', [['klik', 'přiřazovat klikáním'], ['psat', 'psát']], 'psat')}</div>
          <div class="popis-obsah"></div>
          <div class="popis-vysledek" aria-live="polite"></div>
        </div>
      </div>`;
    const panel = plocha.querySelector('.popis-panel');
    const obsah = panel.querySelector('.popis-obsah');
    const vysledekEl = panel.querySelector('.popis-vysledek');
    const m = ctx.mapa(plocha.querySelector('.mapa'));
    plocha.querySelector('.tl-cela').addEventListener('click', () => m.celaMapa());
    m.hranice(objekty.some((o) => o.kat === 'stat'));

    const napsane = Array(n).fill('');
    const prirazeni = Array(n).fill(null);  // index objektu, jehož název je přiřazen k číslu
    let vybranyCip = null;                  // index objektu (název) vybraný v zásobníku
    let aktivni = null;                     // aktivní řádek
    let odevzdano = false;
    const poradiCipu = zamichej(objekty.map((_, i) => i));

    const piny = objekty.map((o, i) => {
      const p = m.pin(bodStitku(o, ctx.geo), String(i + 1));
      p.style.cursor = 'pointer';
      p.addEventListener('click', (e) => { e.stopPropagation(); klikNaCislo(i); });
      return p;
    });
    const nastavPin = (i, styl) => piny[i].setAttribute('class', `pin ${styl}`.trim());
    const rezim = () => hodnota(panel, 'rezim');

    function klikNaCislo(i) {
      if (odevzdano) return;
      if (rezim() === 'psat') {
        const input = obsah.querySelector(`input[data-i="${i}"]`);
        if (input) input.focus();
        zvyrazniRadek(i);
      } else {
        prirad(i);
      }
    }
    function zvyrazniRadek(i) {
      aktivni = i;
      obsah.querySelectorAll('.radek-popis').forEach((r) => r.classList.toggle('aktivni', Number(r.dataset.i) === i));
      piny.forEach((_, j) => nastavPin(j, j === i ? 'aktivni' : ''));
    }
    function prirad(i) {
      if (prirazeni[i] !== null) {
        prirazeni[i] = null;          // vrátí název mezi čipy
      } else if (vybranyCip !== null) {
        prirazeni[i] = vybranyCip;
        vybranyCip = null;
      } else {
        ctx.toast('Nejdřív vyber název nahoře.');
        return;
      }
      vykresliObsah();
    }

    function vykresliObsah() {
      if (rezim() === 'psat') {
        obsah.innerHTML = `<div class="popis-radky">${objekty.map((_, i) => `
          <label class="radek-popis" data-i="${i}"><span class="cislo">${i + 1}.</span>
            <input type="text" data-i="${i}" autocomplete="off" autocapitalize="off" spellcheck="false" value="${esc(napsane[i])}" ${odevzdano ? 'readonly' : ''}>
          </label><div class="radek-vazba" data-i="${i}"></div>`).join('')}</div>`;
        obsah.querySelectorAll('input').forEach((inp) => {
          inp.addEventListener('input', () => { napsane[Number(inp.dataset.i)] = inp.value; });
          inp.addEventListener('focus', () => zvyrazniRadek(Number(inp.dataset.i)));
        });
      } else {
        const volne = poradiCipu.filter((j) => !prirazeni.includes(j));
        obsah.innerHTML = `
          <div class="cipy zasobnik-popis">${volne.map((j) => `<button type="button" class="cip bez-tecky" data-j="${j}" aria-pressed="${vybranyCip === j}">${esc(objekty[j].nazev)}</button>`).join('') || '<span class="maly">Všechny názvy jsou přiřazené.</span>'}</div>
          <div class="popis-radky">${objekty.map((_, i) => `
            <button type="button" class="radek-popis radek-klik" data-i="${i}" ${odevzdano ? 'disabled' : ''}><span class="cislo">${i + 1}.</span>
              <span class="prirazeno">${prirazeni[i] !== null ? esc(objekty[prirazeni[i]].nazev) : '____'}</span></button>
            <div class="radek-vazba" data-i="${i}"></div>`).join('')}</div>`;
        obsah.querySelectorAll('.zasobnik-popis .cip').forEach((c) => c.addEventListener('click', () => {
          if (odevzdano) return;
          const j = Number(c.dataset.j);
          vybranyCip = vybranyCip === j ? null : j;
          vykresliObsah();
        }));
        obsah.querySelectorAll('.radek-klik').forEach((r) => r.addEventListener('click', () => prirad(Number(r.dataset.i))));
      }
      if (!odevzdano) {
        const tl = prvek('<button type="button" class="hlavni tl-odevzdat">Odevzdat</button>');
        tl.addEventListener('click', odevzdat);
        obsah.append(tl);
      } else {
        obarvi();
      }
    }

    let hodnoceni = null; // [{ stav: 'ok'|'skoro'|'spatne' }]
    function odevzdat() {
      odevzdano = true;
      const psat = rezim() === 'psat';
      hodnoceni = objekty.map((o, i) => {
        if (psat) {
          const s = porovnejText(napsane[i], tvaryObjektu(o));
          return { stav: polozkaSpravne(s, ctx) ? (s === 'diakritika' ? 'skoro' : 'ok') : 'spatne' };
        }
        return { stav: prirazeni[i] === i ? 'ok' : 'spatne' };
      });
      panel.querySelectorAll('input[name="rezim"]').forEach((r) => { r.disabled = true; });
      vykresliObsah();
      const x = hodnoceni.filter((h) => h.stav !== 'spatne').length;
      const p = Math.round((x / n) * 100);
      const chyby = objekty.filter((_, i) => hodnoceni[i].stav === 'spatne').map((o) => o.nazev);
      vysledekEl.innerHTML = `<div class="karta-vysledek"><p class="vysledek-skore">${x} / ${n} správně (${p} %)</p>
        <div class="radek-tlacitek vlevo"><button type="button" class="hlavni tl-nove">Nové kolo</button><button type="button" class="tl-kop">Zkopírovat výsledek</button></div></div>`;
      vysledekEl.querySelector('.tl-nove').addEventListener('click', popis);
      vysledekEl.querySelector('.tl-kop').addEventListener('click', () => ctx.kopiruj(textVysledku('Slepá mapa – Popiš mapu', x, n, p, chyby)));
    }
    function obarvi() {
      objekty.forEach((o, i) => {
        const h = hodnoceni[i];
        nastavPin(i, h.stav === 'spatne' ? 'spatne' : 'spravne');
        const r = obsah.querySelector(`.radek-popis[data-i="${i}"]`);
        r.classList.add(h.stav === 'spatne' ? 'spatne' : 'spravne');
        const v = obsah.querySelector(`.radek-vazba[data-i="${i}"]`);
        v.innerHTML = h.stav === 'ok' ? '<span class="ok-text">Správně.</span>'
          : h.stav === 'skoro' ? `<span class="skoro-text">Správně, ale pozor na diakritiku: <strong>${esc(o.nazev)}</strong>.</span>`
          : `<span class="chyba-text">Špatně. Správně je: <strong>${esc(o.nazev)}</strong>.</span>`;
      });
    }

    panel.querySelectorAll('input[name="rezim"]').forEach((r) => r.addEventListener('change', () => { vybranyCip = null; vykresliObsah(); }));
    vykresliObsah();
  }

  // ---------- 8.5 Sprint ----------
  function sprint() {
    plocha.innerHTML = `
      <div class="rozlozeni">
        <div><div class="mapa"></div><div class="pod-mapou"><button type="button" class="tl-cela">Celá mapa</button></div></div>
        <div class="karta panel">
          <p class="odpocet" aria-live="off">0:60</p>
          <div class="sprint-uloha"></div>
          <div class="vazba-misto" aria-live="polite"></div>
        </div>
      </div>`;
    const panel = plocha.querySelector('.panel');
    const uloha = panel.querySelector('.sprint-uloha');
    const fb = panel.querySelector('.vazba-misto');
    const odpocet = panel.querySelector('.odpocet');
    const fronta = zamichej(ctx.objektyVRozsahu());
    const vse = ctx.objektyVRozsahu();
    let cil = null, ceka = false, nalezeno = 0, zbyva = 60;
    const nenasel = [];
    const m = ctx.mapa(plocha.querySelector('.mapa'), {
      priKliku: (ll) => {
        if (!cil || ceka) return;
        ceka = true;
        if (skoreZasahu(cil, ll, ctx.geo) !== null) {
          nalezeno++;
          m.zvyrazni(cil, 'spravne');
          fb.innerHTML = '<div class="vazba-ok">Správně!</div>';
          pozdeji(dalsi, 400);
        } else {
          nenasel.push(cil.nazev);
          const x = najdiVBode(ll, vse, ctx.geo);
          if (x && x !== cil) m.zvyrazni(x, 'spatne'); else m.pin(ll, '×', 'spatne');
          m.zvyrazni(cil, 'spravne');
          fb.innerHTML = `<div class="vazba-chyba">Špatně. <strong>${esc(cil.nazev)}</strong> je zeleně.</div>`;
          pozdeji(dalsi, 600);
        }
      },
    });
    plocha.querySelector('.tl-cela').addEventListener('click', () => m.celaMapa());
    m.hranice(vse.some((o) => o.kat === 'stat'));

    function dalsi() {
      m.smazZvyrazneni(); m.smazPiny();
      fb.innerHTML = '';
      ceka = false;
      if (!fronta.length) { konec(); return; }
      cil = fronta.shift();
      uloha.innerHTML = `<p class="nadpis-ulohy">Najdi: <strong>${esc(cil.nazev)}</strong></p><p>${cipKategorie(ctx, cil.kat)}</p>
        <p class="maly">Nalezeno: ${nalezeno}</p><button type="button" class="tl-preskoc">Přeskočit</button>`;
      uloha.querySelector('.tl-preskoc').addEventListener('click', () => {
        if (ceka) return;
        nenasel.push(cil.nazev);
        dalsi();
      });
    }
    const casovac = opakuj(() => {
      zbyva--;
      odpocet.textContent = `0:${String(zbyva).padStart(2, '0')}`;
      if (zbyva <= 0) konec();
    }, 1000);
    let skonceno = false;
    function konec() {
      if (skonceno) return;
      skonceno = true;
      zastav(casovac);
      cil = null;
      m.smazZvyrazneni(); m.smazPiny();
      odpocet.textContent = '0:00';
      uloha.innerHTML = '';
      fb.innerHTML = `
        <h2>Čas! Našel jsi ${nalezeno} pojmů.</h2>
        ${nenasel.length ? `<h3>Nenašel jsi:</h3><ul class="seznam-chyb">${nenasel.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
        <div class="radek-tlacitek vlevo"><button type="button" class="hlavni tl-znovu">Znovu</button><button type="button" class="tl-kop">Zkopírovat výsledek</button></div>`;
      fb.querySelector('.tl-znovu').addEventListener('click', () => { ukonciHru(); sprint(); });
      fb.querySelector('.tl-kop').addEventListener('click', () => ctx.kopiruj(
        `Asie naslepo – Slepá mapa – Sprint\nDatum: ${datum()}\nVýsledek: ${nalezeno} nalezených pojmů za 60 s\nChyby: ${nenasel.length ? nenasel.join('; ') : 'žádné'}`));
    }
    zastavHru = () => { zastav(casovac); skonceno = true; };
    dalsi();
  }

  // ---------- 8.6 Řeka od pramene k ústí ----------
  function reka() {
    const reky = zamichej(ctx.OBJEKTY.filter((o) => o.pramen && o.tucne));
    const max = reky.reduce((s, o) => s + (o.staty ? 3 : 2), 0);
    let body = 0, iReka = 0, krok = 0;
    const chybne = new Set();
    plocha.innerHTML = `
      <div class="reka-hlava"></div>
      <div class="rozlozeni">
        <div><div class="mapa"></div><div class="pod-mapou"><button type="button" class="tl-cela">Celá mapa</button></div></div>
        <div class="karta panel"><div class="reka-uloha"></div><div class="vazba-misto" aria-live="polite"></div></div>
      </div>`;
    const hlava = plocha.querySelector('.reka-hlava');
    const uloha = plocha.querySelector('.reka-uloha');
    const fb = plocha.querySelector('.vazba-misto');
    let ceka = false;
    const m = ctx.mapa(plocha.querySelector('.mapa'), {
      priKliku: (ll) => {
        if (ceka || krok > 1) return;
        const o = reky[iReka];
        ceka = true;
        const pramen = krok === 0;
        const bod = pramen ? o.pramen : o.usti;
        const sp = vzdalenostKm(ll, bod) <= (pramen ? 250 : 150);
        m.pin(bod, pramen ? 'P' : 'Ú', sp ? 'spravne' : 'spatne');
        m.zvyrazni(o, 'spravne');
        vyhodnotKrok(sp, sp ? 'Správně!' : (pramen ? 'Vedle – pramen je u zeleného P.' : 'Vedle – ústí je u zeleného Ú.'));
      },
    });
    plocha.querySelector('.tl-cela').addEventListener('click', () => m.celaMapa());

    function vyhodnotKrok(sp, text) {
      if (sp) body++; else chybne.add(reky[iReka].nazev);
      fb.innerHTML = `<div class="${sp ? 'vazba-ok' : 'vazba-chyba'}">${sp ? '' : 'Špatně. '}${esc(text)}</div>`;
      const b = prvek('<button type="button" class="hlavni tl-dalsi">Další krok</button>');
      b.addEventListener('click', () => { b.disabled = true; dalsiKrok(); });
      fb.append(b);
      setTimeout(() => b.focus({ preventScroll: true }), 0);
      vykresliHlavu();
    }
    function vykresliHlavu() {
      hlava.innerHTML = `<p class="prubeh-text">Řeka ${Math.min(iReka + 1, reky.length)} / ${reky.length} · Body: ${body} / ${max}</p>
        <div class="prubeh"><div style="width: ${(iReka / reky.length) * 100}%"></div></div>`;
    }
    function dalsiKrok() {
      const o = reky[iReka];
      krok++;
      if (krok > 2 || (krok === 2 && !o.staty)) { iReka++; krok = 0; }
      zobrazKrok();
    }
    function zobrazKrok() {
      fb.innerHTML = '';
      ceka = false;
      vykresliHlavu();
      if (iReka >= reky.length) { konec(); return; }
      const o = reky[iReka];
      if (krok === 0) { m.smazZvyrazneni(); m.smazPiny(); }
      if (krok === 0) uloha.innerHTML = `<p class="nadpis-ulohy">Klikni na <strong>pramen</strong> řeky ${esc(o.nazev)}.</p>`;
      if (krok === 1) uloha.innerHTML = `<p class="nadpis-ulohy">Klikni na <strong>ústí</strong> řeky ${esc(o.nazev)}.</p>`;
      if (krok === 2) razeni(o);
    }
    function razeni(o) {
      const rada = [];
      const zasobnik = zamichej(o.staty);
      uloha.innerHTML = `<p class="nadpis-ulohy">Seřaď státy, kterými ${esc(o.nazev)} protéká – od pramene.</p>
        <div class="rada-statu" aria-live="polite"></div><div class="cipy zasobnik-statu"></div>
        <div class="radek-tlacitek vlevo"><button type="button" class="tl-zpet">Zpět</button><button type="button" class="hlavni tl-kontrola">Zkontrolovat</button></div>`;
      const radaEl = uloha.querySelector('.rada-statu');
      const zasEl = uloha.querySelector('.zasobnik-statu');
      const kontrola = uloha.querySelector('.tl-kontrola');
      const zpet = uloha.querySelector('.tl-zpet');
      const nazev = (id) => esc(ctx.index.get(id).nazev);
      function prekresli() {
        radaEl.innerHTML = rada.length ? rada.map((id, i) => `<span class="cip staticky bez-tecky">${i + 1}. ${nazev(id)}</span>`).join(' → ') : '<span class="maly">Klikej na státy v pořadí od pramene.</span>';
        zasEl.innerHTML = zasobnik.filter((id) => !rada.includes(id)).map((id) => `<button type="button" class="cip bez-tecky" data-id="${id}">${nazev(id)}</button>`).join('');
        zasEl.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => { if (!ceka) { rada.push(b.dataset.id); prekresli(); } }));
        kontrola.disabled = ceka || rada.length !== o.staty.length;
        zpet.disabled = ceka || !rada.length;
      }
      zpet.addEventListener('click', () => { rada.pop(); prekresli(); });
      kontrola.addEventListener('click', () => {
        ceka = true;
        const sp = rada.every((id, i) => id === o.staty[i]);
        m.zvyrazni(o, 'spravne');
        prekresli();
        vyhodnotKrok(sp, sp ? 'Správně!' : `Vedle – správně: ${o.staty.map((id) => ctx.index.get(id).nazev).join(' → ')}.`);
      });
      prekresli();
    }
    function konec() {
      const p = Math.round((body / max) * 100);
      plocha.innerHTML = `<div class="karta vysledek">
        <h2>Hotovo!</h2>
        <p class="vysledek-skore">${body} / ${max} bodů</p>
        ${chybne.size ? `<h3>Řeky s chybou:</h3><ul class="seznam-chyb">${[...chybne].map((t) => `<li>${esc(t)}</li>`).join('')}</ul>` : '<p>Bez chyby.</p>'}
        <div class="radek-tlacitek vlevo"><button type="button" class="hlavni tl-znovu">Znovu</button><button type="button" class="tl-kop">Zkopírovat výsledek</button></div></div>`;
      plocha.querySelector('.tl-znovu').addEventListener('click', reka);
      plocha.querySelector('.tl-kop').addEventListener('click', () => ctx.kopiruj(textVysledku('Slepá mapa – Řeky', body, max, p, [...chybne])));
    }
    zobrazKrok();
  }

  nastaveni();
  return () => { if (zastavHru) zastavHru(); uklid(); };
}
