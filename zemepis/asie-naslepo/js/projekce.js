// js/projekce.js – projekce mapy. Používá ji map.js.
// Millerovo válcové zobrazení: rovné poledníky i rovnoběžky („placatá“ mapa jako v atlase),
// sever je zvětšený méně než u Mercatorova zobrazení. Střed mapy je na 100° v. d.
export const SIRKA = 1600;
export const VYSKA = 1200;

// Body, které musí být na mapě vidět (rám Asie).
const RAM = {
  type: 'MultiPoint',
  coordinates: [[26, 41], [33, 29], [43, 11], [60, 8], [77, 5], [95, -11], [128, -11],
    [150, 45], [-165, 68], [180, 72], [100, 80], [70, 74], [45, 47]],
};

// Millerovo zobrazení (λ, φ v radiánech → x, y) a jeho inverze (kvůli klikání do mapy).
function miller(lambda, phi) {
  return [lambda, 1.25 * Math.log(Math.tan(Math.PI / 4 + 0.4 * phi))];
}
miller.invert = (x, y) => [x, 2.5 * Math.atan(Math.exp(0.8 * y)) - 0.625 * Math.PI];

export function vytvorProjekci(d3) {
  return d3.geoProjection(miller)
    .rotate([-100, 0])
    .fitExtent([[20, 20], [SIRKA - 20, VYSKA - 20]], RAM);
}
