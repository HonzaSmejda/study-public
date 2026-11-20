// js/stranky/start.js – úvodní stránka (krok 6.1).

import { cipyKategorii, uklid } from '../komponenty.js';

const DLAZDICE = [
  ['🗺', 'Mapa', '#/mapa', 'Prohlížej mapu a klikni na pojem – uvidíš, s čím souvisí.'],
  ['📍', 'Slepá mapa', '#/slepa', 'Najdi, pojmenuj, popiš mapu, sprint a řeky.'],
  ['🔗', 'Souvislosti', '#/souvislosti', 'Mezi čím a čím, kam co ústí – otázky a minihry.'],
  ['❓', 'Kvíz ABCD', '#/kviz', 'Rychlý kvíz se čtyřmi možnostmi.'],
  ['🃏', 'Kartičky', '#/karticky', 'Otoč kartičku, řekni si odpověď, Umím / Neumím.'],
  ['📝', 'Test nanečisto', '#/test', 'Písemka se slepou mapou a známkou.'],
  ['📄', 'Tahák', '#/tahak', 'Všechno přehledně v tabulkách, k tisku.'],
];

export function vykresli(el, ctx) {
  el.innerHTML = `
    <section class="start">
      <h1 class="start-nadpis">Asie naslepo</h1>
      <p class="podnadpis">Slepá mapa a souvislosti – procvičuj polohu i to, co s čím souvisí.</p>
      <a class="tlacitko hlavni trenink-tlacitko" href="#/trenink">
        <span class="trenink-radek"><span class="trenink-nazev">▶ Rychlý trénink</span><span class="trenink-cas">(cca 15 minut)</span></span>
        <span class="trenink-popis">10× najdi na mapě · 5× napiš souvislost · 5× ABCD</span>
      </a>
      <h2>Co procvičovat</h2>
      <div class="start-cipy"></div>
      <p class="vybrano"></p>
      <div class="dlazdice">
        ${DLAZDICE.map(([ikona, nazev, odkaz, veta]) => `
          <a class="dlazdice-polozka karta" href="${odkaz}">
            <span class="dlazdice-ikona" aria-hidden="true">${ikona}</span>
            <span class="dlazdice-nazev">${nazev}</span>
            <span class="dlazdice-veta">${veta}</span>
          </a>`).join('')}
      </div>
      <p class="maly paticka">Web neukládá žádný pokrok. Po zavření stránky začínáš znovu.</p>
    </section>`;
  const vybrano = el.querySelector('.vybrano');
  const prepocitej = () => { vybrano.textContent = `Vybráno ${ctx.objektyVRozsahu().length} pojmů.`; };
  cipyKategorii(el.querySelector('.start-cipy'), ctx, prepocitej);
  prepocitej();
  return uklid;
}
