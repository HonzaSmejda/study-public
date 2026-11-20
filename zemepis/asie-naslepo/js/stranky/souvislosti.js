// js/stranky/souvislosti.js – otázky na souvislosti a minihry (krok 9).

import {
  zalozky, prepinac, hodnota, spustUlohy, uklid, esc, prvek, naslouchej, vPoli, abcd, cipyKategorii,
} from '../komponenty.js';
import { vyberNahodne, zamichej } from '../util.js';
import { moznostiABCD, pravdaNepravda } from '../otazky.js';
import { bodStitku } from '../zasah.js';

const HRY = [['otazky', 'Otázky'], ['lod', 'Cesta lodí'], ['usti', 'Kam teče řeka?'], ['trideni', 'Třídění'], ['vetrelec', 'Vetřelec'], ['obkliknuti', 'Obkliknutí']];

// Formát otázky při volbě „mix“ (9.2).
function formatMix(q, ctx) {
  const r = Math.random();
  if (r < 0.4) return moznostiABCD(q, ctx.index) ? { format: 'abcd' } : { format: 'napis' };
  if (r < 0.7) return { format: 'napis' };
  if (r < 0.9) {
    const o = q.a && q.a.length === 1 ? ctx.index.get(q.a[0]) : null;
    return o && o.body && o.kat !== 'ocean' && o.kat !== 'pevnina' ? { format: 'klik' } : { format: 'napis' };
  }
  const pn = pravdaNepravda(q, ctx.index);
  return pn ? { format: 'pn', pn } : { format: 'napis' };
}

export function vykresli(el, ctx) {
  let hra = 'otazky';
  let zastavHru = null;
  el.innerHTML = '<h1>Souvislosti</h1>';
  el.append(zalozky(HRY, hra, (id) => { hra = id; zobraz(); }));
  const plocha = prvek('<div class="hra-plocha"></div>');
  el.append(plocha);
  const idx = ctx.index;

  const enter = (e) => {
    if (e.key !== 'Enter' || vPoli(e) || (e.target instanceof HTMLElement && e.target.tagName === 'BUTTON')) return;
    const d = plocha.querySelector('.tl-dalsi');
    if (d && !d.disabled) { e.preventDefault(); d.click(); }
  };
  function ukonciHru() {
    if (zastavHru) { zastavHru(); zastavHru = null; }
    uklid();
    naslouchej('keydown', enter);
  }

  function zobraz() {
    ukonciHru();
    ({ otazky, lod, usti: () => trideni('sa-usti'), trideni: () => trideni(null), vetrelec, obkliknuti })[hra]();
  }

  // ---------- 9.2 Otázky ----------
  function otazky() {
    plocha.innerHTML = `
      <div class="ovladani-blok">
        <div class="souv-cipy"></div>
        <div class="ovladani">
          <span class="volba-radek">Počet: ${prepinac('pocet', [['10', '10'], ['20', '20'], ['vse', 'Vše']], '10')}</span>
          <span class="volba-radek">Formát: ${prepinac('format', [['mix', 'mix'], ['abcd', 'ABCD'], ['napis', 'psát']], 'mix')}</span>
          <button type="button" class="hlavni tl-zacit">Začít</button>
        </div>
        <p class="info-pocet maly"></p>
      </div>
      <div class="kolo-misto"></div>`;
    const info = plocha.querySelector('.info-pocet');
    const tl = plocha.querySelector('.tl-zacit');
    const misto = plocha.querySelector('.kolo-misto');
    const obnov = () => {
      const n = ctx.otazkyVRozsahu().length;
      tl.disabled = n === 0;
      info.textContent = n ? `K dispozici ${n} otázek.` : 'Pro vybrané kategorie nejsou otázky na souvislosti. Vyber jiné kategorie.';
    };
    cipyKategorii(plocha.querySelector('.souv-cipy'), ctx, obnov);
    obnov();
    tl.addEventListener('click', () => {
      const pocet = hodnota(plocha, 'pocet');
      const format = hodnota(plocha, 'format');
      const vybrane = vyberNahodne(ctx.otazkyVRozsahu(), pocet === 'vse' ? Infinity : Number(pocet));
      plocha.querySelector('.ovladani-blok').hidden = true;
      spust(vybrane.map((q) => ({ typ: 'otazka', q, ...(format === 'mix' ? formatMix(q, ctx) : { format }) })));
    });
    function spust(polozky) {
      if (zastavHru) zastavHru();
      zastavHru = spustUlohy(misto, ctx, polozky, {
        nazev: 'Souvislosti – otázky',
        priZnovu: () => { zastavHru && zastavHru(); otazky(); },
        priChybach: (chybne) => spust(zamichej(chybne).map((p) => ({ typ: 'otazka', q: p.q, format: 'napis' }))),
      });
    }
  }

  // ---------- 9.3 Cesta lodí ----------
  function lod() {
    plocha.innerHTML = `
      <p>Vyber trasu:</p>
      <div class="karty-tras">${ctx.TRASY.map((t) => `
        <button type="button" class="karta karta-trasy" data-id="${t.id}">
          <span class="trasa-nazev">${esc(t.nazev)}</span><span class="maly">${t.kroky.length} kroků</span>
        </button>`).join('')}</div>`;
    plocha.querySelectorAll('.karta-trasy').forEach((b) => b.addEventListener('click', () => plavba(ctx.TRASY.find((t) => t.id === b.dataset.id))));
  }

  function plavba(trasa) {
    ukonciHru();
    plocha.innerHTML = `
      <h2>${esc(trasa.nazev)}</h2>
      <div class="rozlozeni">
        <div><div class="mapa"></div><div class="pod-mapou"><button type="button" class="tl-cela">Celá mapa</button></div></div>
        <div class="karta panel"><div class="lod-uloha"></div><div class="vazba-misto" aria-live="polite"></div></div>
      </div>`;
    const m = ctx.mapa(plocha.querySelector('.mapa'));
    plocha.querySelector('.tl-cela').addEventListener('click', () => m.celaMapa());
    const uloha = plocha.querySelector('.lod-uloha');
    const fb = plocha.querySelector('.vazba-misto');
    const kroky = trasa.kroky.map((id) => idx.get(id));
    let i = 0, chyb = 0;
    m.lod(bodStitku(kroky[0], ctx.geo));
    m.zvyrazni(kroky[0], 'vybrane');

    function krok() {
      const aktualni = kroky[i];
      if (i === kroky.length - 1) {
        uloha.innerHTML = '';
        fb.innerHTML = `<div class="vazba-ok"><strong>Doplul jsi! Chyb: ${chyb}.</strong></div>
          ${trasa.pozn ? `<p class="maly">${esc(trasa.pozn)}</p>` : ''}
          <div class="radek-tlacitek vlevo"><button type="button" class="tl-jina">Jiná trasa</button><button type="button" class="hlavni tl-znovu">Znovu</button></div>`;
        fb.querySelector('.tl-jina').addEventListener('click', () => { ukonciHru(); lod(); });
        fb.querySelector('.tl-znovu').addEventListener('click', () => plavba(trasa));
        return;
      }
      const dalsi = kroky[i + 1];
      const navstivene = kroky.slice(0, i + 1).map((o) => o.id);
      const moznosti = moznostiABCD({ o: aktualni.id, a: [dalsi.id], nep: navstivene }, idx);
      uloha.innerHTML = `<p class="nadpis-ulohy">Jsi v: <strong>${esc(aktualni.nazev)}</strong>. Kam pluješ dál?</p>
        <p class="maly">Krok ${i + 1} / ${kroky.length - 1} · Chyb: ${chyb}</p>`;
      fb.innerHTML = '';
      abcd(uloha, moznosti, (sp) => {
        if (!sp) {
          chyb++;
          uloha.querySelector('.maly').textContent = `Krok ${i + 1} / ${kroky.length - 1} · Chyb: ${chyb}`;
          fb.innerHTML = '<div class="vazba-chyba">Špatně. Tudy to nejde – zkus to znovu.</div>';
          return;
        }
        m.cara([bodStitku(aktualni, ctx.geo), bodStitku(dalsi, ctx.geo)], 'trasa');
        m.lod(bodStitku(dalsi, ctx.geo));
        m.zvyrazni(dalsi, 'vybrane');
        i++;
        krok();
      }, { opakovat: true });
    }
    krok();
  }

  // ---------- 9.4 Kam teče řeka? a Třídění ----------
  function trideni(idSady) {
    if (!idSady) {
      const sady = ctx.SADY.filter((s) => s.id !== 'sa-usti');
      plocha.innerHTML = `<p>Vyber sadu:</p><div class="karty-tras">${sady.map((s) => `
        <button type="button" class="karta karta-trasy" data-id="${s.id}"><span class="trasa-nazev">${esc(s.nazev)}</span></button>`).join('')}</div>`;
      plocha.querySelectorAll('.karta-trasy').forEach((b) => b.addEventListener('click', () => trideni(b.dataset.id)));
      return;
    }
    const sada = ctx.SADY.find((s) => s.id === idSady);
    const viditelna = (id) => idx.get(id).tucne || ctx.nastaveni.rozsah === 'vse';
    const skupiny = sada.skupiny.map((g) => ({ nazev: g.nazev, polozky: g.polozky.filter(viditelna) })).filter((g) => g.polozky.length);
    const spravnaSkupina = new Map();
    skupiny.forEach((g, gi) => g.polozky.forEach((id) => spravnaSkupina.set(id, gi)));
    const vsechny = zamichej([...spravnaSkupina.keys()]);
    const umisteni = new Map(); // id → index skupiny
    let vybrany = null;
    let zkontrolovano = false;

    plocha.innerHTML = `
      <h2>${esc(sada.nazev)}</h2>
      <div class="karta trideni">
        <h3>Zásobník</h3>
        <div class="cipy zasobnik" data-g="-1"></div>
        <div class="sloupce"></div>
        <div class="vazba-misto" aria-live="polite"></div>
        <div class="radek-tlacitek vlevo"><button type="button" class="hlavni tl-kontrola">Zkontrolovat</button></div>
      </div>
      <div class="mapa mapa-trideni"></div>`;
    const zasobnik = plocha.querySelector('.zasobnik');
    const sloupce = plocha.querySelector('.sloupce');
    const fb = plocha.querySelector('.vazba-misto');
    const kontrola = plocha.querySelector('.tl-kontrola');
    const m = ctx.mapa(plocha.querySelector('.mapa-trideni'));
    m.hranice(false);

    const cip = (id) => {
      const o = idx.get(id);
      let trida = 'cip';
      let pozn = '';
      if (zkontrolovano) {
        const ok = umisteni.get(id) === spravnaSkupina.get(id);
        trida += ok ? ' cip-ok' : ' cip-chyba';
        if (!ok) pozn = ` <span class="pozn">→ ${esc(skupiny[spravnaSkupina.get(id)].nazev)}</span>`;
      }
      return `<button type="button" class="${trida}" data-id="${id}" draggable="${!zkontrolovano}" aria-pressed="${vybrany === id}" style="--barva: ${ctx.barvy[o.kat]}" ${zkontrolovano ? 'disabled' : ''}>${esc(o.nazev)}${pozn}</button>`;
    };

    function presun(id, g) {
      if (zkontrolovano) return;
      if (g < 0) umisteni.delete(id); else umisteni.set(id, g);
      vybrany = null;
      prekresli();
    }

    function prekresli() {
      zasobnik.innerHTML = vsechny.filter((id) => !umisteni.has(id)).map(cip).join('') || '<span class="maly">Prázdný – můžeš zkontrolovat.</span>';
      sloupce.innerHTML = skupiny.map((g, gi) => `
        <div class="sloupec" data-g="${gi}" role="button" tabindex="0" aria-label="Přesunout do: ${esc(g.nazev)}">
          <h4>${esc(g.nazev)}</h4>
          <div class="cipy">${vsechny.filter((id) => umisteni.get(id) === gi).map(cip).join('')}</div>
        </div>`).join('');
      kontrola.disabled = zkontrolovano || umisteni.size !== vsechny.length;
      plocha.querySelectorAll('.trideni .cip').forEach((c) => {
        c.addEventListener('click', (e) => {
          e.stopPropagation();
          const id = c.dataset.id;
          if (umisteni.has(id)) presun(id, -1);
          else { vybrany = vybrany === id ? null : id; prekresli(); }
        });
        c.addEventListener('dragstart', (e) => { e.dataTransfer.setData('text/plain', c.dataset.id); });
      });
      plocha.querySelectorAll('.sloupec, .zasobnik').forEach((s) => {
        const g = Number(s.dataset.g);
        const akce = () => { if (vybrany && g >= 0) presun(vybrany, g); };
        s.addEventListener('click', akce);
        s.addEventListener('keydown', (e) => { if ((e.key === 'Enter' || e.key === ' ') && e.target === s) { e.preventDefault(); akce(); } });
        s.addEventListener('dragover', (e) => e.preventDefault());
        s.addEventListener('drop', (e) => { e.preventDefault(); const id = e.dataTransfer.getData('text/plain'); if (id) presun(id, g); });
      });
    }

    kontrola.addEventListener('click', () => {
      zkontrolovano = true;
      vybrany = null;
      prekresli();
      const x = vsechny.filter((id) => umisteni.get(id) === spravnaSkupina.get(id)).length;
      m.smazZvyrazneni();
      vsechny.forEach((id) => m.zvyrazni(idx.get(id), umisteni.get(id) === spravnaSkupina.get(id) ? 'spravne' : 'spatne'));
      fb.innerHTML = `<div class="${x === vsechny.length ? 'vazba-ok' : 'vazba-chyba'}">${x === vsechny.length ? 'Správně.' : 'Některé položky jsou špatně.'} ${x} / ${vsechny.length} správně</div>`;
      const radek = kontrola.parentElement;
      radek.innerHTML = '';
      const znovu = prvek('<button type="button" class="hlavni">Znovu</button>');
      znovu.addEventListener('click', () => trideni(idSady));
      radek.append(znovu);
      if (idSady !== 'sa-usti') {
        const jina = prvek('<button type="button">Jiná sada</button>');
        jina.addEventListener('click', () => trideni(null));
        radek.append(jina);
      }
    });
    prekresli();
  }

  // ---------- 9.5 Vetřelec ----------
  function vetrelec() {
    const zaznamy = [];
    let zasoba = [];
    for (let i = 0; i < 8; i++) {
      if (!zasoba.length) zasoba = zamichej(ctx.VETRELEC);
      const z = zasoba.shift();
      const clenove = vyberNahodne(z.clenove, 3);
      const v = vyberNahodne(z.vetrelci, 1)[0];
      zaznamy.push({ typ: 'vetrelec', zaznam: z, clenove, vetrelec: v, poradi: zamichej([...clenove, v]) });
    }
    zastavHru = spustUlohy(plocha, ctx, zaznamy, {
      nazev: 'Souvislosti – vetřelec',
      priZnovu: () => { ukonciHru(); vetrelec(); },
      priChybach: (chybne) => { ukonciHru(); zastavHru = spustUlohy(plocha, ctx, chybne, { nazev: 'Souvislosti – vetřelec', priZnovu: () => { ukonciHru(); vetrelec(); } }); },
      kandidati: () => ctx.OBJEKTY.filter((o) => !o.pomocny),
    });
  }

  // ---------- 9.6 Obkliknutí ----------
  function obkliknuti() {
    const polozky = zamichej(ctx.OBKLIKNUTI).map((ukol) => ({ typ: 'obkliknuti', ukol }));
    zastavHru = spustUlohy(plocha, ctx, polozky, {
      nazev: 'Souvislosti – obkliknutí',
      priZnovu: () => { ukonciHru(); obkliknuti(); },
      priChybach: (chybne) => { ukonciHru(); zastavHru = spustUlohy(plocha, ctx, chybne, { nazev: 'Souvislosti – obkliknutí', priZnovu: () => { ukonciHru(); obkliknuti(); } }); },
    });
  }

  zobraz();
  return () => { if (zastavHru) zastavHru(); uklid(); };
}
