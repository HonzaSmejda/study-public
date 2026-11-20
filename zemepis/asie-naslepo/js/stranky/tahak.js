// js/stranky/tahak.js – Tahák (krok 13).

import { cipyKategorii, uklid, esc } from '../komponenty.js';
import { bezDiakritiky, ikona } from '../util.js';

const UPOZORNENI = [
  'V materiálu je překlep „Marmanské“ – správně je <strong>Marmarské moře</strong>.',
  'V poznámkách je „Saharmatha“ – správně je <strong>Sagarmatha</strong>.',
  'V seznamu řek je „Ingidirka“ – správně je <strong>Indigirka</strong>.',
  'Seznam států v materiálu není – web používá 50 států Asie (včetně Ruska, Turecka, Kypru a zakavkazských států). Ověř si s učitelem, které počítá.',
  'Muztag: myslí se pravděpodobně Muztag Ata v Pamíru – ověř si s učitelem.',
];

const norm = (s) => bezDiakritiky(String(s || '').toLowerCase());

export function vykresli(el, ctx) {
  el.innerHTML = `
    <h1>Tahák</h1>
    <div class="ovladani-tahak">
      <div class="tahak-cipy"></div>
      <div class="ovladani">
        <label class="zaskrt"><input type="checkbox" class="zakryt-kde"> Zakrýt sloupec Kde leží</label>
        <label class="zaskrt"><input type="checkbox" class="zakryt-souv"> Zakrýt sloupec Souvislosti</label>
        <input type="text" class="filtr" placeholder="Filtrovat…" aria-label="Filtrovat" autocomplete="off">
        <button type="button" class="tl-tisk">${ikona('tisk')} Vytisknout</button>
      </div>
    </div>
    <div class="tahak-tabulky"></div>
    <div class="tahak-dalsi"></div>`;

  const tabulky = el.querySelector('.tahak-tabulky');
  const zakrytKde = el.querySelector('.zakryt-kde');
  const zakrytSouv = el.querySelector('.zakryt-souv');
  const filtr = el.querySelector('.filtr');

  function vykresliTabulky() {
    const objekty = ctx.objektyVRozsahu();
    const kats = ctx.KATEGORIE.filter((k) => !k.pomocna && ctx.aktivniKategorie.has(k.id));
    tabulky.innerHTML = kats.map((k) => {
      let seznam = objekty.filter((o) => o.kat === k.id);
      if (!seznam.length) return '';
      const stat = k.id === 'stat';
      const reka = k.id === 'reka';
      if (stat) seznam = seznam.slice().sort((a, b) => a.nazev.localeCompare(b.nazev, 'cs'));
      const hlavicka = stat
        ? '<th>Stát</th><th>Oblast</th><th class="odkaz-mapa"><span class="sr-only">Mapa</span></th>'
        : `<th>Pojem</th><th>Kde leží</th><th>Souvislosti</th>${reka ? '<th>Ústí do</th>' : ''}<th class="odkaz-mapa"><span class="sr-only">Mapa</span></th>`;
      const radky = seznam.map((o) => {
        const net = o.tucne === false;
        const nazev = net ? `<em>${esc(o.nazev)}</em>` : esc(o.nazev);
        const kde = net ? '—' : esc(o.kde || '—');
        const fakta = o.fakta && o.fakta.length ? `<div class="maly fakta-tahak">Z poznámek: ${o.fakta.map(esc).join(' · ')}</div>` : '';
        const souv = net ? '—' : `${esc(o.souv || '—')}${fakta}`;
        const hledat = norm([o.nazev, o.kde, o.souv].join(' '));
        const odkaz = `<td class="odkaz-mapa"><a href="#/mapa?id=${encodeURIComponent(o.id)}" aria-label="Ukázat ${esc(o.nazev)} na mapě">${ikona('misto')}</a></td>`;
        if (stat) return `<tr data-hledat="${esc(hledat)}"><td>${nazev}</td><td class="sl-kde">${kde}</td>${odkaz}</tr>`;
        const usti = reka ? `<td>${o.ustiDo ? esc(ctx.index.get(o.ustiDo).nazev) : '—'}</td>` : '';
        return `<tr data-hledat="${esc(hledat)}"><td>${nazev}</td><td class="sl-kde">${kde}</td><td class="sl-souv">${souv}</td>${usti}${odkaz}</tr>`;
      }).join('');
      return `<section class="tahak-sekce">
        <h2>${esc(k.nazev)} <span class="pocet-tahak">(${seznam.length})</span></h2>
        <div class="tabulka-obal"><table><thead><tr>${hlavicka}</tr></thead><tbody>${radky}</tbody></table></div>
      </section>`;
    }).join('');
    zakryj();
    filtruj();
  }

  function zakryj() {
    tabulky.querySelectorAll('.sl-kde').forEach((td) => td.classList.toggle('zakryto', zakrytKde.checked));
    tabulky.querySelectorAll('.sl-souv').forEach((td) => td.classList.toggle('zakryto', zakrytSouv.checked));
  }

  function filtruj() {
    const t = norm(filtr.value.trim());
    tabulky.querySelectorAll('.tahak-sekce').forEach((s) => {
      let viditelne = 0;
      s.querySelectorAll('tbody tr').forEach((tr) => {
        const ok = !t || tr.dataset.hledat.includes(t);
        tr.hidden = !ok;
        if (ok) viditelne++;
      });
      s.hidden = viditelne === 0;
    });
  }

  // Klik na zakrytou buňku ji odkryje, druhý klik znovu zakryje.
  tabulky.addEventListener('click', (e) => {
    const td = e.target.closest('td.sl-kde, td.sl-souv');
    if (!td) return;
    const zakryvaSe = td.classList.contains('sl-kde') ? zakrytKde.checked : zakrytSouv.checked;
    if (zakryvaSe) td.classList.toggle('zakryto');
  });
  zakrytKde.addEventListener('change', zakryj);
  zakrytSouv.addEventListener('change', zakryj);
  filtr.addEventListener('input', filtruj);
  el.querySelector('.tl-tisk').addEventListener('click', () => window.print());
  cipyKategorii(el.querySelector('.tahak-cipy'), ctx, vykresliTabulky);

  // Pod tabulkami
  const fakta = [...new Set(ctx.OBJEKTY.flatMap((o) => o.fakta || []))];
  el.querySelector('.tahak-dalsi').innerHTML = `
    <section class="tahak-sekce">
      <h2>Mnemotechnické pomůcky</h2>
      <div class="tabulka-obal"><table><thead><tr><th>Co</th><th>Pomůcka</th></tr></thead>
        <tbody>${ctx.MNEMO.map((m) => `<tr><td>${esc(m.co)}</td><td>${esc(m.pomucka)}</td></tr>`).join('')}</tbody></table></div>
    </section>
    <section class="tahak-sekce">
      <h2>Zajímavosti z poznámek</h2>
      <ul class="fakta">${fakta.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
    </section>
    <section class="tahak-sekce">
      <h2>Upozornění k materiálu</h2>
      <ul class="upozorneni">${UPOZORNENI.map((u) => `<li>${u}</li>`).join('')}</ul>
    </section>`;

  vykresliTabulky();
  return uklid;
}
