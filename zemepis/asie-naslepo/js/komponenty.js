// js/komponenty.js – společné komponenty stránek (kapitola 5) a společný běh kola úloh na mapě.

import { Kolo } from './kolo.js';
import { skoreZasahu, najdiVBode } from './zasah.js';
import { moznostiABCD, zkontrolujNapsane, pravdaNepravda, otazkaPojmenuj } from './otazky.js';

// ---------- drobnosti ----------

// Escapování textu do HTML.
export function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// Vytvoří prvek z HTML řetězce (první prvek).
export function prvek(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

// Je událost z textového pole? (Klávesové zkratky se v polích nespouštějí.)
export function vPoli(e) {
  const t = e.target;
  return t instanceof HTMLElement && (t.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName));
}

// Číslo s desetinnou čárkou (celá čísla bez desetin): 11.5 → „11,5“.
export function cislo(x) {
  return Number.isInteger(x) ? String(x) : x.toFixed(1).replace('.', ',');
}

// Dnešní datum ve tvaru „d. m. rrrr“.
export function datum() {
  const d = new Date();
  return `${d.getDate()}. ${d.getMonth() + 1}. ${d.getFullYear()}`;
}

// Názvy objektů podle ID spojené „ + “ (nebo textová odpověď).
export function textOdpovedi(q, ctx) {
  return q.text || q.a.map((id) => ctx.index.get(id).nazev).join(' + ');
}

// Vysvětlení k otázce na souvislosti (5.5): souv objektu otázky, jinak první fakt. Nikdy navic.
export function vysvetleni(q, ctx) {
  const o = ctx.index.get(q.o);
  if (!o) return '';
  return o.souv || (o.fakta && o.fakta[0]) || '';
}

// Nekliknutelný čip kategorie.
export function cipKategorie(ctx, kat) {
  const k = ctx.KATEGORIE.find((x) => x.id === kat);
  return `<span class="cip staticky" style="--barva: ${k.barva}">${esc(k.nazev)}</span>`;
}

// Je objekt „malý“ (přiblížit na něj)?
export function jeMaly(o, iBod = false) {
  return o.r <= 80 || (o.tvar === 'stat' && o.r > 0) || (iBod && o.tvar === 'bod');
}

// ---------- posluchače a časovače (úklid při odchodu ze stránky) ----------

const posluchaci = new Set();
const casovace = new Set();

// Přidá posluchače na document. Vrací funkci, která ho odebere.
export function naslouchej(typ, fn) {
  document.addEventListener(typ, fn);
  const zaznam = { typ, fn };
  posluchaci.add(zaznam);
  return () => { document.removeEventListener(typ, fn); posluchaci.delete(zaznam); };
}

// setTimeout / setInterval, které se zastaví při úklidu stránky.
export function pozdeji(fn, ms) {
  const id = setTimeout(() => { casovace.delete(id); fn(); }, ms);
  casovace.add(id);
  return id;
}
export function opakuj(fn, ms) {
  const id = setInterval(fn, ms);
  casovace.add(id);
  return id;
}
export function zastav(id) {
  clearTimeout(id); clearInterval(id); casovace.delete(id);
}

// Úklid: odebere všechny posluchače a zastaví časovače. Volá ho každá stránka při odchodu.
export function uklid() {
  for (const { typ, fn } of posluchaci) document.removeEventListener(typ, fn);
  posluchaci.clear();
  for (const id of casovace) { clearTimeout(id); clearInterval(id); }
  casovace.clear();
  document.querySelectorAll('.toast').forEach((t) => t.remove());
}

// ---------- 5.1 čipy kategorií ----------

export function cipyKategorii(el, ctx, priZmene = () => {}) {
  function vykresli() {
    const objekty = ctx.OBJEKTY.filter((o) => !o.pomocny && (o.tucne || ctx.nastaveni.rozsah === 'vse'));
    const kats = ctx.KATEGORIE
      .filter((k) => !k.pomocna)
      .map((k) => ({ k, n: objekty.filter((o) => o.kat === k.id).length }))
      .filter((x) => x.n > 0);
    const viditelne = kats.map((x) => x.k.id);
    el.innerHTML = '';
    const obal = document.createElement('div');
    obal.className = 'cipy';
    for (const { k, n } of kats) {
      const b = prvek(`<button type="button" class="cip" style="--barva: ${k.barva}" aria-pressed="${ctx.aktivniKategorie.has(k.id)}">${esc(k.nazev)} <span class="pocet">${n}</span></button>`);
      b.addEventListener('click', () => {
        if (ctx.aktivniKategorie.has(k.id)) {
          const vybrane = viditelne.filter((id) => ctx.aktivniKategorie.has(id));
          if (vybrane.length <= 1) { ctx.toast('Vyber aspoň jednu kategorii.'); return; }
          ctx.aktivniKategorie.delete(k.id);
        } else {
          ctx.aktivniKategorie.add(k.id);
        }
        vykresli();
        priZmene();
      });
      obal.append(b);
    }
    const vse = prvek('<button type="button" class="cip bez-tecky">Vše</button>');
    vse.addEventListener('click', () => {
      viditelne.forEach((id) => ctx.aktivniKategorie.add(id));
      vykresli(); priZmene();
    });
    const staty = prvek('<button type="button" class="cip bez-tecky">Jen státy</button>');
    staty.addEventListener('click', () => {
      ctx.aktivniKategorie.clear();
      ctx.aktivniKategorie.add('stat');
      vykresli(); priZmene();
    });
    obal.append(vse, staty);
    el.append(obal);
  }
  vykresli();
}

// ---------- 5.2 ABCD ----------
// Vrací { vyber(i), prozrad(), zrus() }.

export function abcd(el, moznosti, priOdpovedi, { opakovat = false, bezTextu = false } = {}) {
  const obal = document.createElement('div');
  obal.className = 'moznosti' + (bezTextu ? ' moznosti-radek' : '');
  const tlacitka = moznosti.map((m, i) => {
    const b = prvek(`<button type="button" class="moznost"><span class="pismeno">${'ABCD'[i]}</span> ${esc(m.text)}</button>`);
    b.addEventListener('click', () => vyber(i));
    obal.append(b);
    return b;
  });
  el.append(obal);
  let hotovo = false;
  const iSpravne = moznosti.findIndex((m) => m.spravne);

  function zablokuj() {
    hotovo = true;
    odeber();
    tlacitka.forEach((b) => { b.disabled = true; });
    if (iSpravne >= 0) tlacitka[iSpravne].classList.add('spravne');
  }
  function vyber(i) {
    if (hotovo || !tlacitka[i] || tlacitka[i].disabled) return;
    const m = moznosti[i];
    if (opakovat && !m.spravne) {
      tlacitka[i].disabled = true;
      tlacitka[i].classList.add('spatne');
      priOdpovedi(false, m.text, i);
      return;
    }
    zablokuj();
    if (!m.spravne) tlacitka[i].classList.add('spatne');
    priOdpovedi(m.spravne, m.text, i);
  }
  const odeber = naslouchej('keydown', (e) => {
    if (vPoli(e) || e.ctrlKey || e.metaKey || e.altKey || e.key.length !== 1) return;
    const k = e.key.toLowerCase();
    let i = '1234'.indexOf(k);
    if (i < 0) i = 'abcd'.indexOf(k);
    if (i >= 0 && i < tlacitka.length) { e.preventDefault(); vyber(i); }
  });
  return { vyber, prozrad: () => { if (!hotovo) zablokuj(); }, zrus: odeber };
}

// ---------- 5.3 napiš ----------

export function napis(el, pocetPolicek, priOdeslani) {
  const form = document.createElement('form');
  form.className = 'napis';
  const pole = [];
  for (let i = 0; i < pocetPolicek; i++) {
    const input = prvek('<input type="text" autocomplete="off" autocapitalize="off" spellcheck="false">');
    if (pocetPolicek === 2) {
      const l = prvek(`<label class="napis-pole"><span>${i + 1}. odpověď</span></label>`);
      l.append(input);
      form.append(l);
    } else {
      input.setAttribute('aria-label', 'Odpověď');
      form.append(input);
    }
    pole.push(input);
  }
  if (pocetPolicek === 2) form.append(prvek('<p class="maly">Na pořadí nezáleží.</p>'));
  const tl = prvek('<button type="submit" class="hlavni">Zkontrolovat</button>');
  form.append(tl);
  let hotovo = false;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (hotovo) return;
    hotovo = true;
    const hodnoty = pole.map((p) => p.value);
    pole.forEach((p) => { p.disabled = true; });
    tl.disabled = true;
    priOdeslani(hodnoty);
  });
  el.append(form);
  pole[0].focus({ preventScroll: true });
  return form;
}

// ---------- 5.4 vyhodnocení napsané odpovědi ----------

export function polozkaSpravne(stav, ctx) {
  return stav === 'ok' || (stav === 'diakritika' && ctx.nastaveni.diakritika === 'tolerantni');
}

export function vyhodnotNapsane(vysledek, ctx) {
  const p = vysledek.polozky;
  const spravne = p.every((x) => polozkaSpravne(x.stav, ctx));
  let html;
  if (!spravne) {
    html = `<div class="vazba-chyba">Špatně. Správně je: ${p.map((x) => `<strong>${esc(x.spravne)}</strong>`).join(' a ')}.</div>`;
  } else if (p.some((x) => x.stav === 'diakritika')) {
    html = `<div class="vazba-skoro">Správně, ale pozor na diakritiku: ${p.filter((x) => x.stav === 'diakritika').map((x) => `<strong>${esc(x.spravne)}</strong>`).join(' a ')}.</div>`;
  } else {
    html = '<div class="vazba-ok">Správně.</div>';
  }
  return { spravne, html };
}

// ---------- 5.5 zpětná vazba ----------

export function zpetnaVazba(el, spravne, textSpravne, vysvetleniText) {
  const d = document.createElement('div');
  d.className = spravne ? 'vazba-ok' : 'vazba-chyba';
  d.innerHTML = spravne ? 'Správně.' : `Špatně. Správně je: <strong>${esc(textSpravne)}</strong>.`;
  if (vysvetleniText) d.innerHTML += `<br><span class="proc">Proč: ${esc(vysvetleniText)}</span>`;
  el.append(d);
  return d;
}

// ---------- 5.6 výsledek kola ----------
// volby: { nazev, priChybach, priZnovu }

export function textVysledku(nazev, skore, max, procenta, chyby) {
  return `Asie naslepo – ${nazev}\nDatum: ${datum()}\nVýsledek: ${cislo(skore)}/${max} (${procenta} %)\nChyby: ${chyby.length ? chyby.join('; ') : 'žádné'}`;
}

export function vysledekKola(el, kolo, volby, ctx) {
  const max = kolo.maxSkore;
  const procenta = max ? Math.round((kolo.skore / max) * 100) : 0;
  const chyby = kolo.chyby.map((c) => (c.detail && c.detail.popis) || '');
  el.innerHTML = `
    <div class="karta vysledek">
      <h2>Hotovo!</h2>
      <p class="vysledek-skore">${cislo(kolo.skore)} / ${max} správně napoprvé (${procenta} %)</p>
      ${chyby.length
        ? `<h3>Chyby:</h3><ul class="seznam-chyb">${chyby.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>`
        : '<p>Bez chyby.</p>'}
      <div class="radek-tlacitek vlevo"></div>
    </div>`;
  const radek = el.querySelector('.radek-tlacitek');
  if (chyby.length && volby.priChybach) {
    const b = prvek('<button type="button" class="hlavni">Procvič jen chyby</button>');
    b.addEventListener('click', () => volby.priChybach(kolo.chyby.map((c) => c.polozka)));
    radek.append(b);
  }
  const znovu = prvek('<button type="button">Znovu</button>');
  znovu.addEventListener('click', () => volby.priZnovu());
  const kop = prvek('<button type="button">Zkopírovat výsledek</button>');
  kop.addEventListener('click', () => ctx.kopiruj(textVysledku(volby.nazev, kolo.skore, max, procenta, chyby)));
  radek.append(znovu, kop);
  radek.firstElementChild.focus({ preventScroll: true });
  window.scrollTo(0, 0);
}

// ---------- 5.7 průběh ----------

export function prubeh(el, kolo) {
  const spravne = [...kolo.prvni.values()].filter((v) => v.spravne).length;
  const chyby = kolo.chyby.length;
  const sirka = kolo.maxSkore ? (kolo.hotovoPrvnich / kolo.maxSkore) * 100 : 0;
  el.innerHTML = `
    <p class="prubeh-text">Zbývá: ${kolo.zbyva} · Správně: ${spravne} · Chyby: ${chyby}</p>
    <div class="prubeh"><div style="width: ${sirka}%"></div></div>`;
}

// ---------- přepínač (radio) a záložky ----------

// Skupina přepínačů: polozky = [[hodnota, text]]. Vrací HTML.
export function prepinac(jmeno, polozky, vychozi) {
  return `<span class="prepinac" role="radiogroup">${polozky.map(([h, t]) =>
    `<label><input type="radio" name="${jmeno}" value="${h}" ${h === vychozi ? 'checked' : ''}> ${esc(t)}</label>`).join('')}</span>`;
}
export function hodnota(el, jmeno) {
  const x = el.querySelector(`input[name="${jmeno}"]:checked`);
  return x ? x.value : null;
}

// Záložky. polozky = [[id, text]]. priVyberu(id). Vrací prvek.
export function zalozky(polozky, aktivni, priVyberu) {
  const t = prvek('<div role="tablist"></div>');
  for (const [id, text] of polozky) {
    const b = prvek(`<button type="button" role="tab" aria-selected="${id === aktivni}" data-id="${id}">${esc(text)}</button>`);
    b.addEventListener('click', () => {
      t.querySelectorAll('[role="tab"]').forEach((x) => x.setAttribute('aria-selected', String(x === b)));
      priVyberu(id);
    });
    t.append(b);
  }
  return t;
}

// ---------- společný běh kola úloh na mapě ----------
// Typy položek:
//   { typ: 'najdi', o }                                   – 8.2
//   { typ: 'pojmenuj', o, format: 'napis' | 'abcd' }      – 8.3
//   { typ: 'otazka', q, format: 'abcd' | 'napis' | 'klik' | 'pn' } – 9.2
//   { typ: 'vetrelec', zaznam, clenove: [id×3], vetrelec: id }     – 9.5
//   { typ: 'obkliknuti', ukol }                           – 9.6
// volby: { nazev, priZnovu, priChybach(polozky), kandidati: () => [objekty] }
// Vrací funkci, která kolo ukončí (odebere posluchače).

export function spustUlohy(el, ctx, polozky, volby) {
  const kolo = new Kolo(polozky);
  const idx = ctx.index;
  el.innerHTML = `
    <div class="kolo">
      <div class="kolo-hlava"></div>
      <div class="rozlozeni">
        <div>
          <div class="mapa"></div>
          <div class="pod-mapou"><button type="button" class="tl-cela">Celá mapa</button></div>
        </div>
        <div class="karta panel"></div>
      </div>
    </div>`;
  const hlava = el.querySelector('.kolo-hlava');
  const panel = el.querySelector('.panel');
  let stav = null;
  const m = ctx.mapa(el.querySelector('.mapa'), { priKliku: (ll) => { if (stav && stav.priKliku && !stav.hotovo) stav.priKliku(ll); } });
  el.querySelector('.tl-cela').addEventListener('click', () => m.celaMapa());

  const jeStat = (id) => idx.get(id)?.kat === 'stat';
  const hraniceKola = polozky.some((p) => (p.typ === 'najdi' || p.typ === 'pojmenuj') && p.o.kat === 'stat');

  const kandidati = () => {
    const k = volby.kandidati ? volby.kandidati() : ctx.objektyVRozsahu();
    return k;
  };

  // Enter = Další
  const odeberEnter = naslouchej('keydown', (e) => {
    if (e.key !== 'Enter' || vPoli(e) || (e.target instanceof HTMLElement && e.target.tagName === 'BUTTON')) return;
    const d = panel.querySelector('.tl-dalsi');
    if (d && !d.disabled) { e.preventDefault(); d.click(); }
  });

  function tlacitkoDalsi(kam) {
    const b = prvek('<button type="button" class="hlavni tl-dalsi">Další</button>');
    b.addEventListener('click', () => { b.disabled = true; dalsi(); });
    (kam || panel).append(b);
    setTimeout(() => b.focus({ preventScroll: true }), 0);
  }

  function zvyrazniOtazku(q) {
    m.smazZvyrazneni();
    const o = idx.get(q.o);
    if (o) m.zvyrazni(o, 'vybrane');
    if (q.a) {
      const sBody = q.a.map((id) => idx.get(id)).filter((x) => x && (x.body || x.tvar === 'stat'));
      sBody.forEach((x) => m.zvyrazni(x, 'spravne'));
      if (sBody.length === 1 && o && (o.body || o.tvar === 'stat')) m.priblizNa(o);
    }
  }

  // Na co uživatel klikl (pro „Tohle je X“).
  function coJeTady(ll, cil) {
    let k = kandidati();
    if (cil && !k.includes(cil)) k = [...k, cil];
    return najdiVBode(ll, k.filter((x) => x.kat === cil?.kat), ctx.geo) || najdiVBode(ll, k, ctx.geo);
  }

  const RENDER = {
    najdi(p) {
      const o = p.o;
      panel.innerHTML = `
        <p class="nadpis-ulohy">Najdi: <strong>${esc(o.nazev)}</strong></p>
        <p>${cipKategorie(ctx, o.kat)}</p>
        <div class="tlacitka-ulohy"><button type="button" class="tl-nevim">Nevím</button></div>
        <div class="vazba-misto" aria-live="polite"></div>`;
      const fb = panel.querySelector('.vazba-misto');
      const spatne = (x, nevim) => {
        stav.hotovo = true;
        panel.querySelector('.tl-nevim').disabled = true;
        let t = 'Špatně. ';
        if (!nevim) {
          if (x && x !== o) { m.zvyrazni(x, 'spatne'); t += `Tohle je <strong>${esc(x.nazev)}</strong>. `; }
          else t += 'Tady nic z vybraných pojmů není. ';
        }
        m.zvyrazni(o, 'spravne');
        fb.innerHTML = `<div class="vazba-chyba">${t}<strong>${esc(o.nazev)}</strong> je zeleně.</div>`;
        kolo.odpoved(false, { popis: `${o.nazev} – ${nevim ? 'nevím' : 'klik vedle'}` });
        if (jeMaly(o)) m.priblizNa(o);
        tlacitkoDalsi();
      };
      stav.priKliku = (ll) => {
        if (skoreZasahu(o, ll, ctx.geo) !== null) {
          stav.hotovo = true;
          panel.querySelector('.tl-nevim').disabled = true;
          m.zvyrazni(o, 'spravne');
          fb.innerHTML = '<div class="vazba-ok">Správně!</div>';
          kolo.odpoved(true);
          pozdeji(dalsi, 900);
        } else {
          spatne(coJeTady(ll, o), false);
        }
      };
      panel.querySelector('.tl-nevim').addEventListener('click', () => { if (!stav.hotovo) spatne(null, true); });
    },

    pojmenuj(p) {
      const o = p.o;
      m.zvyrazni(o, 'cil');
      if (jeMaly(o, true)) m.priblizNa(o); else m.celaMapa();
      panel.innerHTML = `
        <p class="nadpis-ulohy">Jak se jmenuje vyznačený objekt?</p>
        <p>${cipKategorie(ctx, o.kat)}</p>
        <div class="odpoved-misto"></div>
        <div class="vazba-misto" aria-live="polite"></div>`;
      const misto = panel.querySelector('.odpoved-misto');
      const fb = panel.querySelector('.vazba-misto');
      const q = otazkaPojmenuj(o, idx);
      const po = (spravne, odpoved) => {
        stav.hotovo = true;
        m.smazZvyrazneni();
        m.zvyrazni(o, spravne ? 'spravne' : 'spatne');
        kolo.odpoved(spravne, spravne ? null : { popis: `${o.nazev} – tvoje odpověď: ${odpoved || '(nic)'}` });
        tlacitkoDalsi();
      };
      const mo = p.format === 'abcd' ? moznostiABCD(q, idx) : null;
      if (mo) {
        abcd(misto, mo, (sp, text) => { zpetnaVazba(fb, sp, o.nazev, ''); po(sp, text); });
      } else {
        napis(misto, 1, ([t]) => {
          const v = vyhodnotNapsane(zkontrolujNapsane(q, [t], idx), ctx);
          fb.innerHTML = v.html;
          po(v.spravne, t.trim());
        });
      }
    },

    otazka(p) {
      const q = p.q;
      panel.innerHTML = `
        <p class="nadpis-ulohy">${esc(q.q)}</p>
        <div class="odpoved-misto"></div>
        <div class="vazba-misto" aria-live="polite"></div>`;
      const misto = panel.querySelector('.odpoved-misto');
      const fb = panel.querySelector('.vazba-misto');
      const spravnyText = textOdpovedi(q, ctx);
      const proc = vysvetleni(q, ctx);
      const po = (spravne) => {
        stav.hotovo = true;
        zvyrazniOtazku(q);
        kolo.odpoved(spravne, spravne ? null : { popis: `${q.q} – správně: ${spravnyText}` });
        tlacitkoDalsi();
      };
      let format = p.format;
      const mo = format === 'abcd' ? moznostiABCD(q, idx) : null;
      if (format === 'abcd' && !mo) format = 'napis';
      const pn = format === 'pn' ? (p.pn || pravdaNepravda(q, idx)) : null;
      if (format === 'pn' && !pn) format = 'napis';
      const odpovedKlik = format === 'klik' && q.a && q.a.length === 1 ? idx.get(q.a[0]) : null;
      if (format === 'klik' && !(odpovedKlik && odpovedKlik.body)) format = 'napis';

      if (format === 'abcd') {
        abcd(misto, mo, (sp) => { zpetnaVazba(fb, sp, spravnyText, proc); po(sp); });
      } else if (format === 'pn') {
        misto.innerHTML = `<p>Nabízená odpověď: <strong>${esc(pn.nabidka)}</strong></p>
          <div class="radek-tlacitek vlevo"><button type="button" data-v="1">Pravda</button><button type="button" data-v="0">Nepravda</button></div>
          <p class="maly">Klávesy P / N</p>`;
        const tl = [...misto.querySelectorAll('button')];
        const zvol = (v) => {
          if (stav.hotovo) return;
          odeberPN();
          tl.forEach((b) => { b.disabled = true; });
          const sp = v === pn.pravda;
          tl[v ? 0 : 1].classList.add(sp ? 'spravne' : 'spatne');
          zpetnaVazba(fb, sp, `${pn.pravda ? 'Pravda' : 'Nepravda'} (${spravnyText})`, proc);
          po(sp);
        };
        tl.forEach((b) => b.addEventListener('click', () => zvol(b.dataset.v === '1')));
        const odeberPN = naslouchej('keydown', (e) => {
          if (vPoli(e) || e.ctrlKey || e.metaKey || e.altKey) return;
          if (e.key === 'p' || e.key === 'P') { e.preventDefault(); zvol(true); }
          if (e.key === 'n' || e.key === 'N') { e.preventDefault(); zvol(false); }
        });
      } else if (format === 'klik') {
        misto.innerHTML = '<p>Odpověz kliknutím do mapy.</p><div class="tlacitka-ulohy"><button type="button" class="tl-nevim">Nevím</button></div>';
        const nevim = misto.querySelector('.tl-nevim');
        stav.priKliku = (ll) => {
          nevim.disabled = true;
          const sp = skoreZasahu(odpovedKlik, ll, ctx.geo) !== null;
          const x = sp ? null : coJeTady(ll, odpovedKlik);
          const jiny = x && x !== odpovedKlik ? x : null;
          if (jiny) fb.insertAdjacentHTML('beforeend', `<p>Tohle je <strong>${esc(jiny.nazev)}</strong>.</p>`);
          zpetnaVazba(fb, sp, spravnyText, proc);
          po(sp);
          if (jiny) m.zvyrazni(jiny, 'spatne');
        };
        nevim.addEventListener('click', () => {
          if (stav.hotovo) return;
          nevim.disabled = true;
          zpetnaVazba(fb, false, spravnyText, proc);
          po(false);
        });
      } else {
        napis(misto, q.text ? 1 : q.a.length, (hodnoty) => {
          const v = vyhodnotNapsane(zkontrolujNapsane(q, hodnoty, idx), ctx);
          fb.innerHTML = v.html;
          if (proc) fb.lastElementChild.insertAdjacentHTML('beforeend', `<br><span class="proc">Proč: ${esc(proc)}</span>`);
          po(v.spravne);
        });
      }
    },

    vetrelec(p) {
      const z = p.zaznam;
      const moznosti = p.poradi.map((id) => ({ text: idx.get(id).nazev, spravne: id === p.vetrelec, id }));
      panel.innerHTML = `
        <p class="nadpis-ulohy">Který pojem sem nepatří?</p>
        <div class="odpoved-misto"></div>
        <div class="vazba-misto" aria-live="polite"></div>`;
      const fb = panel.querySelector('.vazba-misto');
      abcd(panel.querySelector('.odpoved-misto'), moznosti, (sp, text) => {
        stav.hotovo = true;
        const v = idx.get(p.vetrelec);
        fb.innerHTML = `<div class="${sp ? 'vazba-ok' : 'vazba-chyba'}">${sp ? 'Správně.' : 'Špatně.'} Ostatní patří do skupiny: <strong>${esc(z.nazev)}</strong>. ${esc(v.nazev)} sem nepatří.</div>`;
        m.smazZvyrazneni();
        p.clenove.forEach((id) => m.zvyrazni(idx.get(id), 'spravne'));
        m.zvyrazni(v, 'spatne');
        kolo.odpoved(sp, sp ? null : { popis: `${z.nazev} – tvoje odpověď: ${text}, vetřelec: ${v.nazev}` });
        tlacitkoDalsi();
      });
    },

    obkliknuti(p) {
      const u = p.ukol;
      const vybrane = new Set();
      const kats = new Set([...u.cil, ...u.tol].map((id) => idx.get(id).kat));
      const kand = ctx.OBJEKTY.filter((o) => !o.pomocny && kats.has(o.kat));
      panel.innerHTML = `
        <p class="nadpis-ulohy">${esc(u.zadani)}</p>
        <p class="pocitadlo">Označeno: 0</p>
        <div class="radek-tlacitek vlevo"><button type="button" class="hlavni tl-hotovo">Hotovo</button><button type="button" class="tl-zrusit">Zrušit výběr</button></div>
        <div class="vazba-misto" aria-live="polite"></div>`;
      const pocitadlo = panel.querySelector('.pocitadlo');
      const fb = panel.querySelector('.vazba-misto');
      const prekresli = () => {
        m.smazZvyrazneni();
        vybrane.forEach((id) => m.zvyrazni(idx.get(id), 'vybrane'));
        pocitadlo.textContent = `Označeno: ${vybrane.size}`;
      };
      stav.priKliku = (ll) => {
        const x = najdiVBode(ll, kand, ctx.geo);
        if (!x) return;
        if (vybrane.has(x.id)) vybrane.delete(x.id); else vybrane.add(x.id);
        prekresli();
      };
      panel.querySelector('.tl-zrusit').addEventListener('click', () => { if (!stav.hotovo) { vybrane.clear(); prekresli(); } });
      panel.querySelector('.tl-hotovo').addEventListener('click', () => {
        if (stav.hotovo) return;
        stav.hotovo = true;
        panel.querySelectorAll('.radek-tlacitek button').forEach((b) => { b.disabled = true; });
        m.smazZvyrazneni();
        const zasahy = u.cil.filter((id) => vybrane.has(id));
        const chybelo = u.cil.filter((id) => !vybrane.has(id));
        const navic = [...vybrane].filter((id) => !u.cil.includes(id) && !u.tol.includes(id));
        zasahy.forEach((id) => m.zvyrazni(idx.get(id), 'spravne'));
        chybelo.forEach((id) => m.zvyrazni(idx.get(id), 'cil'));
        navic.forEach((id) => m.zvyrazni(idx.get(id), 'spatne'));
        [...vybrane].filter((id) => u.tol.includes(id)).forEach((id) => m.zvyrazni(idx.get(id), 'vybrane'));
        const skore = Math.max(0, zasahy.length - navic.length) / u.cil.length;
        const sp = skore === 1;
        const jmena = (ids) => ids.map((id) => idx.get(id).nazev).join(', ');
        fb.innerHTML = `<div class="${sp ? 'vazba-ok' : 'vazba-chyba'}">
          ${sp ? 'Správně.' : 'Špatně.'} Zásah: ${zasahy.length} / ${u.cil.length}
          ${chybelo.length ? `<br>Chybělo (oranžově): ${esc(jmena(chybelo))}` : ''}
          ${navic.length ? `<br>Navíc (červeně): ${esc(jmena(navic))}` : ''}</div>`;
        const casti = [];
        if (chybelo.length) casti.push('chybělo: ' + jmena(chybelo));
        if (navic.length) casti.push('navíc: ' + jmena(navic));
        kolo.odpoved(sp, sp ? null : { popis: `${u.zadani} – ${casti.join('; ')}` });
        const b = prvek('<button type="button" class="hlavni tl-dalsi">Další úkol</button>');
        b.addEventListener('click', () => { b.disabled = true; dalsi(); });
        panel.append(b);
        setTimeout(() => b.focus({ preventScroll: true }), 0);
      });
    },
  };

  function maStaty(p) {
    if (p.typ === 'obkliknuti') return [...p.ukol.cil, ...p.ukol.tol].some(jeStat);
    if (p.typ === 'vetrelec') return p.poradi.some(jeStat);
    return false;
  }

  function dalsi() {
    m.smazZvyrazneni(); m.smazPiny(); m.smazCary();
    const p = kolo.dalsi();
    if (!p) { konec(); return; }
    prubeh(hlava, kolo);
    stav = { p, hotovo: false, priKliku: null };
    m.hranice(hraniceKola || maStaty(p));
    RENDER[p.typ](p);
  }

  function konec() {
    odeberEnter();
    stav = null;
    vysledekKola(el, kolo, {
      nazev: volby.nazev,
      priZnovu: volby.priZnovu,
      priChybach: volby.priChybach,
    }, ctx);
  }

  dalsi();
  return () => { odeberEnter(); stav = null; };
}
