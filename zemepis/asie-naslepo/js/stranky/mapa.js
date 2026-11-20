// js/stranky/mapa.js – prohlížení mapy a karta objektu (krok 7).

import { cipyKategorii, esc, uklid, naslouchej, vPoli, cipKategorie } from '../komponenty.js';
import { najdiVBode, bodStitku } from '../zasah.js';
import { ikona } from '../util.js';

const SKUPINY = [
  ['spojuje', 'Spojuje / je spojeno přes'],
  ['oddeluje', 'Odděluje'],
  ['mezi', 'Leží mezi'],
  ['usti', 'Ústí / ústí sem'],
  ['pramen', 'Pramení'],
  ['protece', 'Protéká / protéká jím'],
  ['soucast', 'Patří k'],
  ['stat', 'Stát(y)'],
  ['lezi', 'Leží v / na / u'],
];

const VYCHOZI_TEXT = 'Klikni na značku nebo kamkoli do mapy. Kolečkem myši (nebo dvěma prsty) mapu přiblížíš.';

export function vykresli(el, ctx, parametry) {
  const idx = ctx.index;
  el.innerHTML = `
    <div class="mapa-stranka">
      <div class="mapa-sloupec">
        <div class="mapa-cipy"></div>
        <div class="ovladani mapa-ovladani">
          <label class="zaskrt"><input type="checkbox" class="chk-hranice"> Hranice států</label>
          <span class="popisky-volba">Popisky:
            <label><input type="radio" name="popisky" value="priblizeni" checked> při přiblížení</label>
            <label><input type="radio" name="popisky" value="vzdy"> vždy</label>
          </span>
          <label class="hledani">${ikona('hledat')} <input type="text" list="seznam-pojmu" placeholder="Hledat pojem…" autocomplete="off" aria-label="Hledat pojem"></label>
          <datalist id="seznam-pojmu"></datalist>
        </div>
        <div class="mapa-obal">
          <div class="mapa mapa-velka"></div>
          <aside class="karta karta-objektu" aria-live="polite"></aside>
        </div>
        <div class="ovladani prohlidka"></div>
      </div>
    </div>`;

  const panel = el.querySelector('.karta-objektu');
  const chkHranice = el.querySelector('.chk-hranice');
  const hledani = el.querySelector('.hledani input');
  const datalist = el.querySelector('#seznam-pojmu');
  const prohlidkaEl = el.querySelector('.prohlidka');

  let vybrany = null;
  const aktivniVazby = new Set();
  let vazbyZobrazene = false;
  let prohlidka = null; // { objekty, i }

  const m = ctx.mapa(el.querySelector('.mapa'), {
    priKliku: (ll) => {
      const objekty = ctx.objektyVRozsahu();
      const x = najdiVBode(ll, objekty.filter((o) => o.kat !== 'stat'), ctx.geo)
        || najdiVBode(ll, objekty.filter((o) => o.kat === 'stat'), ctx.geo);
      if (x) otevri(x); else zavri();
    },
    priKlikuNaZnacku: (o) => otevri(o),
  });

  const popisky = () => el.querySelector('input[name="popisky"]:checked').value;
  const prekresliZnacky = () => m.znacky(ctx.objektyVRozsahu(), popisky());
  const naplnSeznam = () => {
    datalist.innerHTML = ctx.objektyVRozsahu().map((o) => `<option value="${esc(o.nazev)}">`).join('');
  };

  chkHranice.checked = ctx.aktivniKategorie.has('stat');
  m.hranice(chkHranice.checked);
  chkHranice.addEventListener('change', () => m.hranice(chkHranice.checked));
  el.querySelectorAll('input[name="popisky"]').forEach((r) => r.addEventListener('change', prekresliZnacky));
  hledani.addEventListener('change', () => {
    const o = ctx.objektyVRozsahu().find((x) => x.nazev === hledani.value);
    if (o) { otevri(o); m.priblizNa(o); hledani.value = ''; hledani.blur(); }
  });

  cipyKategorii(el.querySelector('.mapa-cipy'), ctx, () => {
    prekresliZnacky();
    naplnSeznam();
    if (!prohlidka) vykresliProhlidku();
  });

  // ---------- zvýraznění ----------
  function prekresliZvyrazneni() {
    m.smazZvyrazneni();
    if (vybrany) m.zvyrazni(vybrany, 'vybrane');
    for (const id of aktivniVazby) m.zvyrazni(idx.get(id), 'vazba');
  }

  function vazbyObjektu(o) {
    const skupiny = new Map();
    for (const q of ctx.OTAZKY) {
      if (q.o !== o.id || q.t === 'zpet' || q.t === 'fakt' || !q.a) continue;
      if (!skupiny.has(q.t)) skupiny.set(q.t, []);
      const s = skupiny.get(q.t);
      for (const id of q.a) if (!s.includes(id)) s.push(id);
    }
    return skupiny;
  }

  // ---------- karta objektu ----------
  function zavri() {
    vybrany = null;
    aktivniVazby.clear();
    vazbyZobrazene = false;
    m.smazZvyrazneni();
    m.smazCary();
    panel.classList.add('prazdna');
    panel.innerHTML = `<p class="maly">${VYCHOZI_TEXT}</p>`;
  }

  function otevri(o) {
    vybrany = o;
    aktivniVazby.clear();
    vazbyZobrazene = false;
    m.smazCary();
    prekresliZvyrazneni();

    const skupiny = vazbyObjektu(o);
    const mnemo = ctx.MNEMO.filter((x) => x.objekty.includes(o.id));
    const klikaci = (x) => x && (x.body || x.tvar === 'stat');

    panel.classList.remove('prazdna');
    panel.innerHTML = `
      <button type="button" class="tl-zavrit-kartu" aria-label="Zavřít kartu" title="Zavřít">×</button>
      <h2>${esc(o.nazev)}${o.tucne === false ? ' <span class="maly stitek">rozšíření</span>' : ''}</h2>
      <p>${cipKategorie(ctx, o.kat)}</p>
      ${o.kde ? `<p><strong>${o.kat === 'stat' ? 'Oblast' : 'Kde'}:</strong> ${esc(o.kde)}</p>` : ''}
      ${o.souv ? `<p><strong>Souvislosti:</strong> ${esc(o.souv)}</p>` : ''}
      <div class="skupiny-vazeb">
        ${SKUPINY.filter(([t]) => skupiny.has(t)).map(([t, nadpis]) => `
          <div class="skupina-vazeb">
            <h3 class="nadpis-skupiny">${nadpis}</h3>
            <div class="cipy">
              ${skupiny.get(t).map((id) => {
                const x = idx.get(id);
                const barva = ctx.barvy[x.kat];
                return klikaci(x)
                  ? `<button type="button" class="cip cip-vazba" data-id="${id}" aria-pressed="false" style="--barva: ${barva}">${esc(x.nazev)}</button>`
                  : `<span class="cip staticky" style="--barva: ${barva}">${esc(x.nazev)}</span>`;
              }).join('')}
            </div>
          </div>`).join('')}
      </div>
      ${o.fakta && o.fakta.length ? `<h3 class="nadpis-skupiny">Z poznámek</h3><ul class="fakta">${o.fakta.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>` : ''}
      ${mnemo.map((x) => `<p class="pomucka"><strong>Pomůcka</strong> ${esc(x.co)}: ${esc(x.pomucka)}</p>`).join('')}
      ${(o.navic || []).map((n) => `<p class="navic">${esc(n)}</p>`).join('')}
      <div class="karta-tlacitka">
        ${skupiny.size ? '<button type="button" class="tl-vazby">Ukaž všechny vazby</button>' : ''}
        <a class="tlacitko hlavni" href="#/trenink?objekt=${encodeURIComponent(o.id)}">Procvič tento pojem</a>
      </div>`;

    panel.querySelector('.tl-zavrit-kartu').addEventListener('click', zavri);
    panel.scrollTop = 0;
    const cipy = [...panel.querySelectorAll('.cip-vazba')];
    const aktualizujCipy = () => cipy.forEach((c) => c.setAttribute('aria-pressed', String(aktivniVazby.has(c.dataset.id))));
    cipy.forEach((c) => c.addEventListener('click', () => {
      const id = c.dataset.id;
      if (aktivniVazby.has(id)) aktivniVazby.delete(id); else aktivniVazby.add(id);
      aktualizujCipy();
      prekresliZvyrazneni();
    }));

    const tlVazby = panel.querySelector('.tl-vazby');
    if (tlVazby) {
      tlVazby.addEventListener('click', () => {
        vazbyZobrazene = !vazbyZobrazene;
        m.smazCary();
        aktivniVazby.clear();
        if (vazbyZobrazene) {
          const odkud = bodStitku(o, ctx.geo);
          for (const ids of skupiny.values()) {
            for (const id of ids) {
              const x = idx.get(id);
              if (!x.body || x.id === o.id) continue;
              m.cara([odkud, bodStitku(x, ctx.geo)], 'vazba');
              aktivniVazby.add(id);
            }
          }
        }
        tlVazby.textContent = vazbyZobrazene ? 'Skrýt vazby' : 'Ukaž všechny vazby';
        aktualizujCipy();
        prekresliZvyrazneni();
      });
    }
  }

  // ---------- prohlídka ----------
  function vykresliProhlidku() {
    const objekty = ctx.objektyVRozsahu();
    const kats = ctx.KATEGORIE.filter((k) => !k.pomocna && objekty.some((o) => o.kat === k.id));
    prohlidkaEl.innerHTML = `
      <label>Prohlídka: <select class="vyber-kategorie">${kats.map((k) => `<option value="${k.id}">${esc(k.nazev)}</option>`).join('')}</select></label>
      <button type="button" class="tl-spustit">Spustit prohlídku</button>`;
    prohlidkaEl.querySelector('.tl-spustit').addEventListener('click', () => {
      const kat = prohlidkaEl.querySelector('.vyber-kategorie').value;
      const seznam = ctx.objektyVRozsahu().filter((o) => o.kat === kat);
      if (!seznam.length) return;
      prohlidka = { objekty: seznam, i: 0 };
      krokProhlidky();
    });
  }

  function krokProhlidky() {
    const { objekty, i } = prohlidka;
    const o = objekty[i];
    otevri(o);
    m.priblizNa(o);
    prohlidkaEl.innerHTML = `
      <button type="button" class="tl-pred" ${i === 0 ? 'disabled' : ''}>Předchozí</button>
      <span class="prohlidka-pocet">${i + 1} / ${objekty.length}</span>
      <button type="button" class="tl-dal" ${i === objekty.length - 1 ? 'disabled' : ''}>Další</button>
      <button type="button" class="tl-konec">Ukončit</button>`;
    prohlidkaEl.querySelector('.tl-pred').addEventListener('click', () => posun(-1));
    prohlidkaEl.querySelector('.tl-dal').addEventListener('click', () => posun(1));
    prohlidkaEl.querySelector('.tl-konec').addEventListener('click', ukonciProhlidku);
  }

  function posun(d) {
    if (!prohlidka) return;
    const j = prohlidka.i + d;
    if (j < 0 || j >= prohlidka.objekty.length) return;
    prohlidka.i = j;
    krokProhlidky();
  }

  function ukonciProhlidku() {
    prohlidka = null;
    m.celaMapa();
    vykresliProhlidku();
  }

  naslouchej('keydown', (e) => {
    if (!prohlidka || vPoli(e)) return;
    if (e.key === 'ArrowLeft') { e.preventDefault(); posun(-1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); posun(1); }
  });

  // ---------- start ----------
  prekresliZnacky();
  naplnSeznam();
  vykresliProhlidku();
  zavri();

  const id = parametry.get('id');
  if (id && idx.has(id)) {
    const o = idx.get(id);
    otevri(o);
    if (o.body || o.tvar === 'stat') m.priblizNa(o);
  }

  return uklid;
}
