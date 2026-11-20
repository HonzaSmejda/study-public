// js/kolo.js – jedno kolo procvičování (fronta položek, vracení chyb, skóre). Použij přesně tento kód.
//
// Pravidla:
// - Skóre se počítá jen z PRVNÍHO pokusu u každé položky.
// - Špatně zodpovězená položka se vrátí do fronty jako 4. v pořadí (nebo na konec, je-li fronta kratší).
// - Kolo končí, když je fronta prázdná (všechno nakonec zodpovězeno správně).
//
// Použití:
//   const kolo = new Kolo(polozky);
//   let p = kolo.dalsi();            // null = konec kola
//   kolo.odpoved(true|false, detail, body)
//   kolo.skore, kolo.maxSkore, kolo.chyby, kolo.zbyva, kolo.hotovoPrvnich

export class Kolo {
  constructor(polozky, { opakovatChyby = true } = {}) {
    this.polozky = polozky;
    this.fronta = polozky.map((p, i) => ({ p, i }));
    this.prvni = new Map();          // index položky → { polozka, spravne, detail, body }
    this.opakovatChyby = opakovatChyby;
    this.aktualni = null;
  }

  // Vezme další položku z fronty (nebo vrátí null, když je kolo hotové).
  dalsi() {
    this.aktualni = this.fronta.shift() || null;
    return this.aktualni ? this.aktualni.p : null;
  }

  // Zaznamená odpověď na aktuální položku.
  // detail = cokoli pro výpis chyb (např. { odpoved: 'Adenský záliv', spravne: 'Ománský záliv' })
  // body = kolik bodů za správnou odpověď (výchozí 1; s nápovědou 0.5)
  odpoved(spravne, detail = null, body = 1) {
    const a = this.aktualni;
    if (!a) return;
    if (!this.prvni.has(a.i)) this.prvni.set(a.i, { polozka: a.p, spravne, detail, body: spravne ? body : 0 });
    if (!spravne && this.opakovatChyby) this.fronta.splice(Math.min(3, this.fronta.length), 0, a);
    this.aktualni = null;
  }

  get zbyva() { return this.fronta.length + (this.aktualni ? 1 : 0); }
  get hotovoPrvnich() { return this.prvni.size; }
  get skore() { return [...this.prvni.values()].reduce((s, v) => s + v.body, 0); }
  get maxSkore() { return this.polozky.length; }
  get chyby() { return [...this.prvni.values()].filter((v) => !v.spravne); }
}
