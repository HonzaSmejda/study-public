// js/mapa.js – interaktivní mapa Asie (SVG + d3). Použij přesně tento kód.
// Potřebuje globální d3 (lib/d3.v7.min.js) a CSS třídy z kapitoly o stylech.

import { vytvorProjekci, SIRKA, VYSKA } from './projekce.js';
import { caryReky, bodStitku } from './zasah.js';

const KM_NA_STUPEN = 111.2;

// kontejner = prázdný <div class="mapa">; geo = výsledek pripravGeo(); barvy = { idKategorie: '#barva' }
// volby.priKliku(lonlat, udalost) – klik do mapy (ne při posouvání)
// volby.priKlikuNaZnacku(objekt) – klik na značku objektu (jen když jsou značky zobrazené)
export function vytvorMapu(kontejner, geo, barvy, volby = {}) {
  const proj = vytvorProjekci(d3);
  const cesta = d3.geoPath(proj);
  let meritko = 1;

  const svg = d3.select(kontejner).append('svg')
    .attr('viewBox', `0 0 ${SIRKA} ${VYSKA}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .attr('class', 'mapa-svg')
    .attr('role', 'img')
    .attr('aria-label', 'Mapa Asie');

  const svet = svg.append('g').attr('class', 'svet');
  svet.append('rect').attr('class', 'more-pozadi').attr('x', -SIRKA).attr('y', -VYSKA).attr('width', SIRKA * 3).attr('height', VYSKA * 3);
  svet.append('path').attr('class', 'sit').attr('d', cesta(d3.geoGraticule10()));

  const gStaty = svet.append('g').attr('class', 'vrstva-staty');
  gStaty.selectAll('path').data(geo.zaklad.staty).join('path')
    .attr('class', 'stat').attr('data-a3', (f) => f.properties.a3).attr('d', cesta);

  const gHranice = svet.append('g').attr('class', 'vrstva-hranice skryte');
  gHranice.selectAll('path').data(geo.zaklad.staty).join('path').attr('class', 'hranice').attr('d', cesta);

  svet.append('g').attr('class', 'vrstva-jezera')
    .selectAll('path').data(geo.zaklad.jezera).join('path').attr('class', 'jezero').attr('d', cesta);
  svet.append('g').attr('class', 'vrstva-reky')
    .selectAll('path').data(geo.zaklad.reky).join('path').attr('class', 'reka').attr('d', cesta);

  const gZvyrazneni = svet.append('g').attr('class', 'vrstva-zvyrazneni');
  const gCary = svet.append('g').attr('class', 'vrstva-cary');
  const gZnacky = svet.append('g').attr('class', 'vrstva-znacky');
  const gPiny = svet.append('g').attr('class', 'vrstva-piny');

  // ---------- přibližování a posun ----------
  const zoom = d3.zoom()
    .scaleExtent([1, 12])
    .translateExtent([[-SIRKA * 0.25, -VYSKA * 0.25], [SIRKA * 1.25, VYSKA * 1.25]])
    .on('zoom', (e) => {
      meritko = e.transform.k;
      svet.attr('transform', e.transform);
      prepocitejVelikosti(); // nastaví i CSS proměnnou --k, kterou používá css/mapa.css
    });
  svg.call(zoom).on('dblclick.zoom', null);

  // Klik do mapy → [délka, šířka]. Klik se ignoruje, pokud se myš mezi stiskem a puštěním posunula o víc než 5 px.
  let start = null;
  svg.on('pointerdown', (e) => { start = [e.clientX, e.clientY]; });
  svg.on('click', (e) => {
    if (start && Math.hypot(e.clientX - start[0], e.clientY - start[1]) > 5) return;
    const [x, y] = d3.zoomTransform(svg.node()).invert(d3.pointer(e, svg.node()));
    const lonlat = proj.invert([x, y]);
    if (lonlat && volby.priKliku) volby.priKliku(lonlat, e);
  });

  // Velikosti písma, bodů a čar jsou zadané v pixelech obrazovky (data-f, data-r, data-s).
  // Převádí se na jednotky SVG podle skutečné šířky mapy a podle přiblížení.
  let pomer = 1; // kolik jednotek SVG připadá na 1 pixel obrazovky při přiblížení 1
  function prepocitejVelikosti() {
    const sirkaPx = svg.node().getBoundingClientRect().width || SIRKA;
    pomer = SIRKA / sirkaPx;
    const f = pomer / meritko;
    svg.style('--k', meritko / pomer);
    svg.classed('oddaleno', meritko < 2); // CSS skryje popisky v režimu 'priblizeni'
    svet.selectAll('.velikost-r').attr('r', function () { return +this.dataset.r * f; });
    svet.selectAll('.velikost-pisma').attr('font-size', function () { return +this.dataset.f * f; });
    svet.selectAll('.velikost-cary').attr('stroke-width', function () { return +this.dataset.s * f; });
    svet.selectAll('.znacka-text').attr('dx', 7 * f).attr('dy', -5 * f);
    gPiny.selectAll('g.pin').attr('transform', function () { return `translate(${this.dataset.x},${this.dataset.y}) scale(${f})`; });
  }
  new ResizeObserver(() => prepocitejVelikosti()).observe(kontejner);

  const xy = (lonlat) => proj(lonlat);
  const kruhKm = (stred, km) => cesta(d3.geoCircle().center(stred).radius(km / KM_NA_STUPEN)());

  // Tvar objektu pro zvýraznění (vrací pole SVG cest „d“ a informaci, zda jde o čáru).
  function tvarObjektu(o) {
    if (o.tvar === 'stat') {
      const f = o.a3.flatMap((a) => geo.staty.get(a) || []);
      const d = f.map((x) => cesta(x));
      // Malé státy navíc obtáhni kruhem, aby byly vidět.
      if (o.r > 0) d.push(kruhKm(o.body[0], Math.max(o.r, 40)));
      return { d, cara: false };
    }
    if (o.tvar === 'jezero') {
      const f = geo.jezera.get(o.id) || [];
      if (f.length) return { d: f.map((x) => cesta(x)).concat(o.r < 80 ? [kruhKm(o.body[0], o.r)] : []), cara: false };
    }
    if (o.tvar === 'reka') {
      const cary = caryReky(o.id, geo);
      return { d: [cesta({ type: 'MultiLineString', coordinates: cary })], cara: true };
    }
    if (o.tvar === 'linie') {
      return { d: [cesta({ type: 'LineString', coordinates: o.body })], cara: true, sirkaKm: o.r };
    }
    return { d: o.body.map((b) => kruhKm(b, o.r)), cara: false };
  }

  // ---------- veřejné funkce ----------
  const api = {
    projekce: proj,

    // Zapne/vypne hranice států.
    hranice(zapnout) { gHranice.classed('skryte', !zapnout); },

    // Značky objektů (stránka Mapa). objekty = pole objektů.
    // popisky: 'vzdy' = vždy | 'priblizeni' = jen při přiblížení 2× a víc | 'nikdy'
    znacky(objekty, popisky = 'priblizeni') {
      gZnacky.selectAll('*').remove();
      gZnacky.attr('data-popisky', popisky);
      for (const o of objekty) {
        if (!o.body) continue;
        const [x, y] = xy(bodStitku(o, geo));
        const g = gZnacky.append('g').attr('class', 'znacka').attr('data-id', o.id).style('--barva', barvy[o.kat]);
        g.append('circle').attr('class', 'znacka-bod velikost-r').attr('cx', x).attr('cy', y).attr('data-r', o.tucne ? 5 : 3.5);
        if (popisky !== 'nikdy') {
          g.append('text').attr('class', 'znacka-text velikost-pisma' + (o.tucne ? ' tucne' : ''))
            .attr('x', x).attr('y', y)
            .attr('data-f', o.tucne ? 13 : 11).text(o.nazev);
        }
        g.on('click', (e) => { e.stopPropagation(); if (volby.priKlikuNaZnacku) volby.priKlikuNaZnacku(o); });
      }
      prepocitejVelikosti();
    },

    // Zvýrazní objekt. styl = 'cil' | 'spravne' | 'spatne' | 'vybrane' | 'vazba'
    zvyrazni(o, styl = 'cil') {
      if (!o || (!o.body && o.tvar !== 'stat')) return;
      const t = tvarObjektu(o);
      const g = gZvyrazneni.append('g').attr('class', `zvyrazneni ${styl}`).attr('data-id', o.id);
      for (const d of t.d) {
        if (!d) continue;
        const p = g.append('path').attr('d', d).attr('class', t.cara ? 'zv-cara velikost-cary' : 'zv-plocha');
        if (t.cara) p.attr('data-s', o.tvar === 'reka' ? 5 : 9);
      }
      prepocitejVelikosti();
    },
    smazZvyrazneni() { gZvyrazneni.selectAll('*').remove(); },

    // Číslovaný špendlík (hra Popiš mapu, test). Vrací <g> prvek.
    pin(lonlat, text, styl = '') {
      const [x, y] = xy(lonlat);
      const g = gPiny.append('g').attr('class', `pin ${styl}`).attr('data-x', x).attr('data-y', y);
      g.append('circle').attr('r', 11);
      g.append('text').attr('text-anchor', 'middle').attr('dy', '0.35em').text(text);
      prepocitejVelikosti();
      return g.node();
    },
    smazPiny() { gPiny.selectAll('*').remove(); },

    // Čára mezi body (Cesta lodí, „Ukaž všechny vazby“). styl = 'trasa' | 'vazba'
    cara(body, styl = 'trasa') {
      gCary.append('path').attr('class', `cara ${styl} velikost-cary`).attr('data-s', 3)
        .attr('d', cesta({ type: 'LineString', coordinates: body }));
      prepocitejVelikosti();
    },
    smazCary() { gCary.selectAll('*').remove(); },

    // Loď (Cesta lodí). Plynule přejede na nový bod.
    lod(lonlat) {
      const [x, y] = xy(lonlat);
      let l = gPiny.select('g.pin.lod');
      if (l.empty()) {
        l = gPiny.append('g').attr('class', 'pin lod').attr('data-x', x).attr('data-y', y);
        l.append('path').attr('class', 'lod-tvar').attr('d', 'M-13,0 L13,0 L8,8 L-8,8 Z M-1,-1 L-1,-16 L10,-3 Z');
        prepocitejVelikosti();
      }
      const uzel = l.node();
      const odkud = [+uzel.dataset.x, +uzel.dataset.y];
      // Pozice se animuje; měřítko se bere průběžně, aby loď měla stálou velikost i při přibližování.
      l.interrupt().transition().duration(700).tween('pohyb', () => {
        const i = d3.interpolate(odkud, [x, y]);
        return (t) => {
          const [px, py] = i(t);
          uzel.dataset.x = px; uzel.dataset.y = py;
          uzel.setAttribute('transform', `translate(${px},${py}) scale(${pomer / meritko})`);
        };
      });
    },

    // Přiblíží mapu na objekt (nebo na pole bodů).
    priblizNa(o) {
      const body = o.tvar === 'reka' ? caryReky(o.id, geo).flat() : (o.body || []).slice();
      if (o.tvar === 'stat') body.push(...o.a3.flatMap((a) => (geo.staty.get(a) || []).flatMap((f) => f.geometry.coordinates.flat(2))));
      if (!body.length) return;
      const pts = body.map(xy).filter(Boolean);
      const [x0, x1] = d3.extent(pts, (p) => p[0]);
      const [y0, y1] = d3.extent(pts, (p) => p[1]);
      const okraj = 120;
      const k = Math.max(1, Math.min(6, 0.9 / Math.max((x1 - x0 + okraj) / SIRKA, (y1 - y0 + okraj) / VYSKA)));
      const t = d3.zoomIdentity.translate(SIRKA / 2, VYSKA / 2).scale(k).translate(-(x0 + x1) / 2, -(y0 + y1) / 2);
      svg.transition().duration(600).call(zoom.transform, t);
    },
    celaMapa() { svg.transition().duration(400).call(zoom.transform, d3.zoomIdentity); },

    // Vyčistí všechny dočasné vrstvy.
    vycisti() { api.smazZvyrazneni(); api.smazPiny(); api.smazCary(); gZnacky.selectAll('*').remove(); },
  };
  return api;
}
