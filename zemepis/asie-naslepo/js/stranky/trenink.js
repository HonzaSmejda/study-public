// js/stranky/trenink.js – Rychlý trénink (krok 6.2).

import { spustUlohy, uklid, esc } from '../komponenty.js';
import { zamichej } from '../util.js';

function sestav(ctx, id) {
  if (id && ctx.index.has(id)) {
    const o = ctx.index.get(id);
    const otazky = ctx.OTAZKY.filter((q) => q.o === id);
    return [
      { typ: 'najdi', o },
      { typ: 'pojmenuj', o, format: 'abcd' },
      ...zamichej(otazky.flatMap((q) => [{ typ: 'otazka', q, format: 'abcd' }, { typ: 'otazka', q, format: 'napis' }])),
    ];
  }
  const objekty = ctx.objektyVRozsahu();
  const otazky = ctx.otazkyVRozsahu();
  const pouzite = zamichej(objekty);
  const polozky = pouzite.slice(0, 10).map((o) => ({ typ: 'najdi', o }));
  let zbytek = pouzite.slice(10);
  const dalsiObjekt = () => (zbytek.length ? zbytek.shift() : objekty[Math.floor(Math.random() * objekty.length)]);
  if (otazky.length) {
    const vybrane = zamichej(otazky);
    vybrane.slice(0, 5).forEach((q) => polozky.push({ typ: 'otazka', q, format: 'napis' }));
    let zbyle = vybrane.slice(5);
    for (let i = 0; i < 5; i++) {
      if (Math.random() < 0.5 && zbyle.length) polozky.push({ typ: 'otazka', q: zbyle.shift(), format: 'abcd' });
      else polozky.push({ typ: 'pojmenuj', o: dalsiObjekt(), format: 'abcd' });
    }
  } else {
    for (let i = 0; i < 5; i++) { const o = dalsiObjekt(); if (o) polozky.push({ typ: 'najdi', o }); }
    for (let i = 0; i < 5; i++) { const o = dalsiObjekt(); if (o) polozky.push({ typ: 'pojmenuj', o, format: 'abcd' }); }
  }
  return zamichej(polozky.filter((p) => p.o !== undefined || p.q));
}

export function vykresli(el, ctx, parametry) {
  const id = parametry.get('objekt');
  const o = id ? ctx.index.get(id) : null;
  el.innerHTML = `
    <h1>Rychlý trénink${o ? `: ${esc(o.nazev)}` : ''}</h1>
    <div class="trenink-obsah"></div>`;
  const obsah = el.querySelector('.trenink-obsah');
  let zastavKolo = null;
  const spust = (polozky) => {
    if (zastavKolo) zastavKolo();
    if (!polozky.length) {
      obsah.innerHTML = '<div class="karta"><p>Ve vybraném rozsahu nejsou žádné pojmy. Vyber jiné kategorie na <a href="#/">úvodní stránce</a>.</p></div>';
      return;
    }
    zastavKolo = spustUlohy(obsah, ctx, polozky, {
      nazev: 'Rychlý trénink',
      priZnovu: () => spust(sestav(ctx, id)),
      priChybach: (chybne) => spust(zamichej(chybne)),
      kandidati: () => (o && !ctx.objektyVRozsahu().includes(o) ? [...ctx.objektyVRozsahu(), o] : ctx.objektyVRozsahu()),
    });
  };
  spust(sestav(ctx, id));
  return uklid;
}
