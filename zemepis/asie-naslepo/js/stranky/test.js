// js/stranky/test.js – Test nanečisto (krok 12).

import { uklid, esc, prvek, opakuj, zastav, polozkaSpravne, vyhodnotNapsane, textOdpovedi, vysvetleni, cislo, datum } from '../komponenty.js';
import { zamichej, porovnejText, tvaryObjektu } from '../util.js';
import { moznostiABCD, zkontrolujNapsane, pravdaNepravda } from '../otazky.js';
import { bodStitku } from '../zasah.js';

const CAS = 25 * 60;
const MAX = 51;

// Sestavení testu (12.2) – vždy jen tučné pojmy.
function sestav(ctx) {
  const idx = ctx.index;
  const tucne = ctx.OBJEKTY.filter((o) => o.tucne && !o.pomocny);

  // A: 20 objektů kromě států, z každé kategorie nejvýš 4
  const naKat = new Map();
  const A = [];
  for (const o of zamichej(tucne.filter((o) => o.kat !== 'stat'))) {
    const n = naKat.get(o.kat) || 0;
    if (n >= 4) continue;
    naKat.set(o.kat, n + 1);
    A.push(o);
    if (A.length === 20) break;
  }

  const otazky = zamichej(ctx.OTAZKY.filter((q) => idx.get(q.o)?.tucne));
  const pouzite = new Set();
  // B: 8 otázek s a (ne text), z různých objektů
  const B = [];
  const objektyB = new Set();
  for (const q of otazky) {
    if (B.length === 8) break;
    if (!q.a || objektyB.has(q.o)) continue;
    objektyB.add(q.o); pouzite.add(q); B.push(q);
  }
  // C: 6 dalších otázek s možnostmi ABCD
  const C = [];
  for (const q of otazky) {
    if (C.length === 6) break;
    if (pouzite.has(q)) continue;
    const moznosti = moznostiABCD(q, idx);
    if (!moznosti) continue;
    pouzite.add(q); C.push({ q, moznosti });
  }
  // D: 4 další otázky pravda / nepravda
  const D = [];
  for (const q of otazky) {
    if (D.length === 4) break;
    if (pouzite.has(q)) continue;
    const pn = pravdaNepravda(q, idx);
    if (!pn) continue;
    pouzite.add(q); D.push(pn);
  }
  // E: 10 států
  const E = zamichej(tucne.filter((o) => o.kat === 'stat')).slice(0, 10);
  return { A, B, C, D, E };
}

export function vykresli(el, ctx) {
  const idx = ctx.index;

  function uvod() {
    uklid();
    el.innerHTML = `
      <h1>Test nanečisto</h1>
      <div class="karta">
        <div class="tabulka-obal">
          <table class="tabulka-testu">
            <thead><tr><th>Část</th><th>Obsah</th><th>Body</th></tr></thead>
            <tbody>
              <tr><td>A. Slepá mapa</td><td>20 čísel na mapě → napiš názvy</td><td>20 × 1 = 20</td></tr>
              <tr><td>B. Souvislosti</td><td>8 otevřených otázek</td><td>8 × 2 = 16</td></tr>
              <tr><td>C. ABCD</td><td>6 otázek</td><td>6 × 1 = 6</td></tr>
              <tr><td>D. Pravda / nepravda</td><td>4 tvrzení</td><td>4 × 1 = 4</td></tr>
              <tr><td>E. Státy</td><td>10 čísel na mapě → napiš státy</td><td>10 × 0,5 = 5</td></tr>
              <tr><th>Celkem</th><td></td><th>51 bodů</th></tr>
            </tbody>
          </table>
        </div>
        <p>Doporučený čas: 25 minut. Vyhodnotí se až po odevzdání celého testu.</p>
        <button type="button" class="hlavni tl-start">▶ Začít test</button>
      </div>`;
    el.querySelector('.tl-start').addEventListener('click', test);
  }

  function test() {
    uklid();
    const t = sestav(ctx);
    let odevzdano = false;
    const vstupMapy = (prefix, objekty) => objekty.map((o, i) => `
      <label class="radek-popis" data-cast="${prefix}" data-i="${i}"><span class="cislo">${i + 1}.</span>
        <input type="text" data-cast="${prefix}" data-i="${i}" autocomplete="off" autocapitalize="off" spellcheck="false"></label>
      <div class="radek-vazba" data-cast="${prefix}" data-i="${i}"></div>`).join('');

    el.innerHTML = `
      <div class="casomira" aria-live="off">⏱ 25:00</div>
      <h1>Test nanečisto</h1>
      <div class="vysledek-testu" aria-live="polite"></div>
      <section class="cast karta">
        <h2>A. Slepá mapa (20 b)</h2>
        <p class="maly">Napiš názvy objektů označených čísly. Kliknutím na číslo v mapě skočíš na políčko.</p>
        <div class="rozlozeni rozlozeni-test">
          <div class="mapa" data-mapa="A"></div>
          <div class="popis-radky">${vstupMapy('A', t.A)}</div>
        </div>
      </section>
      <section class="cast karta">
        <h2>B. Souvislosti (16 b)</h2>
        ${t.B.map((q, i) => `
          <div class="uloha" data-cast="B" data-i="${i}">
            <p class="otazka-testu"><strong>${i + 1}.</strong> ${esc(q.q)}</p>
            <div class="pole-testu">${q.a.map((_, j) => `<input type="text" data-cast="B" data-i="${i}" data-j="${j}" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="${q.a.length === 2 ? `${j + 1}. odpověď` : 'Odpověď'}" placeholder="${q.a.length === 2 ? `${j + 1}. odpověď` : ''}">`).join('')}</div>
            ${q.a.length === 2 ? '<p class="maly">Na pořadí nezáleží.</p>' : ''}
            <div class="vazba-ulohy"></div>
          </div>`).join('')}
      </section>
      <section class="cast karta">
        <h2>C. ABCD (6 b)</h2>
        ${t.C.map(({ q, moznosti }, i) => `
          <div class="uloha" data-cast="C" data-i="${i}">
            <p class="otazka-testu"><strong>${i + 1}.</strong> ${esc(q.q)}</p>
            <div class="moznosti">${moznosti.map((m, j) => `
              <label class="moznost moznost-radio"><input type="radio" name="c${i}" value="${j}"><span class="pismeno">${'ABCD'[j]}</span> ${esc(m.text)}</label>`).join('')}</div>
            <div class="vazba-ulohy"></div>
          </div>`).join('')}
      </section>
      <section class="cast karta">
        <h2>D. Pravda / nepravda (4 b)</h2>
        ${t.D.map((pn, i) => `
          <div class="uloha" data-cast="D" data-i="${i}">
            <p class="otazka-testu"><strong>${i + 1}.</strong> ${esc(pn.otazka.q)}<br>Nabízená odpověď: <strong>${esc(pn.nabidka)}</strong></p>
            <div class="prepinac pn-volba">
              <label class="moznost moznost-radio"><input type="radio" name="d${i}" value="1"> Pravda</label>
              <label class="moznost moznost-radio"><input type="radio" name="d${i}" value="0"> Nepravda</label>
            </div>
            <div class="vazba-ulohy"></div>
          </div>`).join('')}
      </section>
      <section class="cast karta">
        <h2>E. Státy (5 b)</h2>
        <p class="maly">Napiš názvy států označených čísly.</p>
        <div class="rozlozeni rozlozeni-test">
          <div class="mapa" data-mapa="E"></div>
          <div class="popis-radky">${vstupMapy('E', t.E)}</div>
        </div>
      </section>
      <div class="radek-tlacitek stred"><button type="button" class="hlavni tl-odevzdat">Odevzdat test</button></div>
      <dialog class="potvrzeni"></dialog>`;

    // mapy se špendlíky
    const piny = {};
    const pripravMapu = (cast, objekty, bod, hranice) => {
      const m = ctx.mapa(el.querySelector(`[data-mapa="${cast}"]`));
      m.hranice(hranice);
      piny[cast] = objekty.map((o, i) => {
        const g = m.pin(bod(o), String(i + 1));
        g.style.cursor = 'pointer';
        g.addEventListener('click', (e) => {
          e.stopPropagation();
          const inp = el.querySelector(`input[data-cast="${cast}"][data-i="${i}"]`);
          inp.focus({ preventScroll: false });
        });
        return g;
      });
      return m;
    };
    pripravMapu('A', t.A, (o) => bodStitku(o, ctx.geo), false);
    pripravMapu('E', t.E, (o) => o.body[0], true);
    el.querySelectorAll('input[data-cast="A"], input[data-cast="E"]').forEach((inp) => {
      inp.addEventListener('focus', () => {
        const cast = inp.dataset.cast;
        piny[cast].forEach((g, j) => g.setAttribute('class', `pin ${j === Number(inp.dataset.i) ? 'aktivni' : ''}`.trim()));
      });
    });

    // časomíra
    let zbyva = CAS;
    const casEl = el.querySelector('.casomira');
    const casovac = opakuj(() => {
      zbyva--;
      casEl.textContent = `⏱ ${Math.floor(zbyva / 60)}:${String(zbyva % 60).padStart(2, '0')}`;
      if (zbyva <= 0) { odevzdej(true); }
    }, 1000);

    const hodnotaPole = (sel) => (el.querySelector(sel)?.value || '').trim();
    const zvoleno = (name) => el.querySelector(`input[name="${name}"]:checked`)?.value ?? null;

    function nevyplneno() {
      let n = 0;
      el.querySelectorAll('input[type="text"]').forEach((i) => { if (!i.value.trim()) n++; });
      t.C.forEach((_, i) => { if (zvoleno(`c${i}`) === null) n++; });
      t.D.forEach((_, i) => { if (zvoleno(`d${i}`) === null) n++; });
      return n;
    }

    el.querySelector('.tl-odevzdat').addEventListener('click', () => {
      const n = nevyplneno();
      if (!n) { odevzdej(false); return; }
      const d = el.querySelector('dialog.potvrzeni');
      d.innerHTML = `<p>Nevyplnil jsi ${n} úloh. Opravdu odevzdat?</p>
        <div class="radek-tlacitek"><button type="button" class="tl-zpet">Zpět k testu</button><button type="button" class="hlavni tl-ano">Ano, odevzdat</button></div>`;
      d.querySelector('.tl-zpet').addEventListener('click', () => d.close());
      d.querySelector('.tl-ano').addEventListener('click', () => { d.close(); odevzdej(false); });
      d.showModal();
    });

    // ---------- 12.3 vyhodnocení ----------
    function odevzdej(casVyprsel) {
      if (odevzdano) return;
      odevzdano = true;
      zastav(casovac);
      const dlg = el.querySelector('dialog.potvrzeni');
      if (dlg.open) dlg.close();
      el.querySelectorAll('input').forEach((i) => { if (i.type === 'text') i.readOnly = true; else i.disabled = true; });
      el.querySelector('.tl-odevzdat').parentElement.remove();

      let body = 0;
      const zopakovat = [];              // objekty k zopakování
      const chybyObjekty = [];
      const chybyOtazky = [];

      // A a E
      const mapova = (cast, objekty, zaBod) => objekty.forEach((o, i) => {
        const napsano = hodnotaPole(`input[data-cast="${cast}"][data-i="${i}"]`);
        const s = porovnejText(napsano, tvaryObjektu(o));
        const ok = polozkaSpravne(s, ctx);
        if (ok) body += zaBod; else { zopakovat.push(o); chybyObjekty.push(o.id); }
        piny[cast][i].setAttribute('class', `pin ${ok ? 'spravne' : 'spatne'}`);
        const r = el.querySelector(`.radek-popis[data-cast="${cast}"][data-i="${i}"]`);
        r.classList.add(ok ? 'spravne' : 'spatne');
        el.querySelector(`.radek-vazba[data-cast="${cast}"][data-i="${i}"]`).innerHTML = ok
          ? (s === 'diakritika' ? `<span class="skoro-text">Správně, ale pozor na diakritiku: <strong>${esc(o.nazev)}</strong>.</span>` : '<span class="ok-text">Správně.</span>')
          : `<span class="chyba-text">Špatně. Správně je: <strong>${esc(o.nazev)}</strong>.</span>`;
      });
      mapova('A', t.A, 1);
      mapova('E', t.E, 0.5);

      const proc = (q) => { const v = vysvetleni(q, ctx); return v ? `<br><span class="proc">Proč: ${esc(v)}</span>` : ''; };
      const pridejChybuOtazky = (q) => { chybyOtazky.push(q); const o = idx.get(q.o); if (o && !zopakovat.includes(o)) zopakovat.push(o); };

      // B
      t.B.forEach((q, i) => {
        const hodnoty = q.a.map((_, j) => hodnotaPole(`input[data-cast="B"][data-i="${i}"][data-j="${j}"]`));
        const v = zkontrolujNapsane(q, hodnoty, idx);
        const spravnych = v.polozky.filter((p) => polozkaSpravne(p.stav, ctx)).length;
        body += q.a.length === 1 ? spravnych * 2 : spravnych;
        const h = vyhodnotNapsane(v, ctx);
        if (!h.spravne) pridejChybuOtazky(q);
        const misto = el.querySelector(`.uloha[data-cast="B"][data-i="${i}"] .vazba-ulohy`);
        misto.innerHTML = h.html;
        misto.lastElementChild.insertAdjacentHTML('beforeend', ` <span class="maly">(${q.a.length === 1 ? spravnych * 2 : spravnych} / 2 b)</span>${proc(q)}`);
      });

      // C
      t.C.forEach(({ q, moznosti }, i) => {
        const z = zvoleno(`c${i}`);
        const ok = z !== null && moznosti[Number(z)].spravne;
        if (ok) body += 1; else pridejChybuOtazky(q);
        const uloha = el.querySelector(`.uloha[data-cast="C"][data-i="${i}"]`);
        uloha.querySelectorAll('.moznost').forEach((l, j) => {
          if (moznosti[j].spravne) l.classList.add('spravne');
          else if (String(j) === z) l.classList.add('spatne');
        });
        uloha.querySelector('.vazba-ulohy').innerHTML = `<div class="${ok ? 'vazba-ok' : 'vazba-chyba'}">${ok ? 'Správně.' : `Špatně. Správně je: <strong>${esc(textOdpovedi(q, ctx))}</strong>.`}${proc(q)}</div>`;
      });

      // D
      t.D.forEach((pn, i) => {
        const z = zvoleno(`d${i}`);
        const ok = z !== null && (z === '1') === pn.pravda;
        if (ok) body += 1; else pridejChybuOtazky(pn.otazka);
        const uloha = el.querySelector(`.uloha[data-cast="D"][data-i="${i}"]`);
        uloha.querySelectorAll('.moznost').forEach((l) => {
          const v = l.querySelector('input').value === '1';
          if (v === pn.pravda) l.classList.add('spravne');
          else if (l.querySelector('input').checked) l.classList.add('spatne');
        });
        uloha.querySelector('.vazba-ulohy').innerHTML = `<div class="${ok ? 'vazba-ok' : 'vazba-chyba'}">${ok ? 'Správně.' : `Špatně. Je to <strong>${pn.pravda ? 'pravda' : 'nepravda'}</strong> – správně je: <strong>${esc(textOdpovedi(pn.otazka, ctx))}</strong>.`}${proc(pn.otazka)}</div>`;
      });

      const p = Math.round((body / MAX) * 100);
      const z = ctx.znamka(p);
      const podleKat = ctx.KATEGORIE.map((k) => ({ k, o: zopakovat.filter((o) => o.kat === k.id) })).filter((x) => x.o.length);
      const vysledek = el.querySelector('.vysledek-testu');
      vysledek.innerHTML = `
        <div class="karta vysledek">
          ${casVyprsel ? '<p class="vazba-chyba">Čas vypršel – test byl odevzdán.</p>' : ''}
          <p class="vysledek-skore">${cislo(body)} / ${MAX} bodů (${p} %) → známka ${z}</p>
          ${podleKat.length ? `<h3>Co zopakovat</h3>${podleKat.map(({ k, o }) => `<p><strong>${esc(k.nazev)}:</strong> ${o.map((x) => esc(x.nazev)).join(', ')}</p>`).join('')}` : '<p>Bez chyby. 👏</p>'}
          <div class="radek-tlacitek vlevo"></div>
        </div>`;
      const radek = vysledek.querySelector('.radek-tlacitek');
      if (chybyObjekty.length || chybyOtazky.length) {
        const b = prvek('<button type="button" class="hlavni">Procvič chyby</button>');
        b.addEventListener('click', () => {
          ctx.posledniChyby = { objekty: chybyObjekty, otazky: chybyOtazky };
          location.hash = '#/kviz?chyby=1';
        });
        radek.append(b);
      }
      const novy = prvek('<button type="button">Nový test</button>');
      novy.addEventListener('click', test);
      const kop = prvek('<button type="button">Zkopírovat výsledek</button>');
      kop.addEventListener('click', () => ctx.kopiruj(
        `Asie naslepo – Test nanečisto\nDatum: ${datum()}\nVýsledek: ${cislo(body)}/${MAX} bodů (${p} %) = známka ${z}\nZopakovat: ${zopakovat.map((o) => o.nazev).join(', ') || 'nic'}`));
      radek.append(novy, kop);
      casEl.textContent = casVyprsel ? 'Čas vypršel – test byl odevzdán.' : `✔ Odevzdáno · ${cislo(body)} / ${MAX} b · známka ${z}`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  uvod();
  return uklid;
}
