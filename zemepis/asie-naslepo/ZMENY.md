# Odchylky od dokumentace

Kód z příloh A, B a C je převzatý **beze změny** (vytažený skriptem přímo z dokumentace).
`node tools/check-data.mjs` hlásí „Data jsou v pořádku.“ (241 objektů, 195 otázek).

## Struktura
- Kořen projektu je složka `public/` (místo `asie-naslepo/`).
- `tools/` a `package.json` jsou uvnitř `public/`, aby fungovaly relativní cesty skriptů. Na hosting je **nenahrávej** (kapitola 17).
- `test-mapa.html` (16.1) jsem nevytvářel – mapa je ověřená přímo na stránkách.

## Komponenty
- `js/komponenty.js` obsahuje kromě 5.1–5.7 i společný běh kola na mapě `spustUlohy()` (Najdi, Pojmenuj, otázky, vetřelec, obkliknutí). Používají ho Slepá mapa, Souvislosti, Rychlý trénink i „Procvič jen chyby“ v kvízu.
- Úklid stránky: posluchače na `document` a časovače se registrují přes `naslouchej()`, `pozdeji()` a `opakuj()` a `uklid()` je při odchodu ze stránky všechny zruší.

## Drobná rozšíření nad rámec specifikace
- Formát „Klikni na mapě“ (9.2) má tlačítko „Nevím“.
- Sprint (8.5) má tlačítko „Přeskočit“ (počítá se jako nenalezený pojem).
- Kartičky: tlačítko „Export pro Anki/Quizlet“ je i na úvodní obrazovce a výsledek má navíc tlačítko „Nastavení“.
- Chybné odpovědi na mapě začínají slovem „Špatně.“ (požadavek z kroku 14: správnost nikdy jen barvou).
- Mapa v rozložení mapa + panel má výšku omezenou na výšku okna (`max-height`), aby byla celá vidět i na nízkých monitorech.
- Souvislosti → Otázky: čipy kategorií jsou vidět vždy, ne jen když v rozsahu nejsou žádné otázky.

## Úpravy podle připomínek (28. 10. 2026)
- **Mapa:** mapa je přes celou šířku a vysoká skoro jako okno. Karta objektu se otevírá přes pravou část mapy (s tlačítkem ×), bez výběru se ukáže jen malá nápověda vlevo dole. Pod 900 px šířky je karta pod mapou.
- **Kartičky:** typ „název → mapa“ je zrušený. Mapová kartička je jen jedna, „mapa → název“: vpředu mapa se zvýrazněným objektem a otázkou „Co je vyznačené na mapě?“, vzadu odpověď slovy (název, Kde, souvislosti).
- **Slepá mapa:** nahoře jsou čipy kategorií („Jen státy“, „Vše“ …), takže se dá procvičovat jen vybraná skupina. Výběr se sdílí s ostatními stránkami, hra Řeka na něm nezávisí (čipy jsou tam skryté).
- **Kvíz:** stejné rozložení jako Souvislosti: mapa vlevo, otázka a možnosti vpravo, vše na jedné obrazovce (ověřeno při 1366×768 i 1920×1080). Na mobilu je mapa nahoře a nejvýš 45 % výšky obrazovky.
- **Projekce mapy** (`js/projekce.js`, odchylka od přílohy B2): místo azimutálního stejnoplochého zobrazení (otočeného na střed Asie, prohnutá síť) je Millerovo válcové zobrazení se středem na 100° v. d. Poledníky i rovnoběžky jsou rovné. Sever je zvětšený méně než u Mercatorova zobrazení. Vyhodnocení kliknutí se počítá v kilometrech, takže se nezměnilo. Původní verze: `d3.geoAzimuthalEqualArea().rotate([-95, -42])`.
