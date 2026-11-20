# Plán úprav webu

Zapsáno 20. 11. 2026. Zatím se nic neprogramuje, tohle je jen plán.

## 1. Na mobilu chybí cesta domů (Asie naslepo)

- **Problém:** na úzkém displeji není v horní liště tlačítko Domů, takže se nejde vrátit na domovskou stránku aplikace.
- **Příčina:** v `zemepis/asie-naslepo/css/styl.css` je pro šířku do 600 px pravidlo `.logo { display: none; }`. Logo „ASIE NASLEPO“ je zároveň jediný odkaz na `#/`.
- **Návrh:** na mobilu logo nechat (zkrácené, nebo jako samostatné tlačítko „Domů“) a menu nechat posouvat do strany. Ověřit na šířce 360 px.
- **Navíc:** přidat cestu zpátky na rozcestník celého webu (`../../`).

## 2. Bez emoji, profesionálnější vzhled

- **Emoji pryč všude:** v aplikaci je jich zhruba 70, a to v `index.html` (🌏 v logu, ⚙ u nastavení) a v `js/` (hlavně `start.js`, `kviz.js`, `komponenty.js`, `test.js`, `karticky.js`, `tahak.js`, `mapa.js`, `slepa.js`, `souvislosti.js`). Kde nesou význam (✔ ✘ u odpovědí, ⚙ nastavení, 🔍 hledání), nahradit je jednoduchou SVG ikonou nebo slovem. 👏 a podobné úplně vypustit.
- **Šipky → a ↔** v textu nejsou emoji. Rozhodnout při úpravě, jestli zůstanou.
- **Co převzít z repa `studio` (`sablony/vzornik.md`, `zakazane-vzory.md`):**
  - jednotné zaoblení na celém webu (tlačítka i karty),
  - jedna výrazná barva a jedna barva pro hlavní tlačítko, zbytek neutrální,
  - krátké nadpisy (1 až 4 slova) s výrazným kontrastem velikosti proti textu,
  - jedno hlavní tlačítko na obrazovku, vedlejší jen obrysové,
  - žádná emoji v nadpisech a tlačítkách, žádné duhové přechody, ne stín a rámeček kolem všeho, ne animace u všeho,
  - jeden poznávací prvek pro celý web, ne pět.
- **Co nepřevzít:** pravidla pro weby firem (fotka v každé sekci, střídání tmavých a světlých sekcí, prodejní texty, kontaktní formulář). Učící aplikace potřebuje hlavně čitelnost a rychlé ovládání.

## 3. Úvodní stránka učícího webu

- Teď je v kořeni jen provizorní rozcestník `index.html`.
- **Cíl:** pořádná úvodní stránka, která snese přibývající předměty a aplikace. První je Zeměpis (Asie naslepo), další v plánu jsou slovíčka ze španělštiny.
- **Struktura:** předmět = sekce, aplikace = položka v ní. Adresy jsou `<predmet>/<aplikace>/`, například `zemepis/asie-naslepo/` a později třeba `spanelstina/slovicka/`.
- **Vzhled:** stejný jako po úpravě v bodě 2, aby úvodní stránka a aplikace působily jako jeden web.
- Nejdřív navrhnout dvě až tři varianty horní části úvodní stránky a nechat vybrat, teprve potom stavět.

## Pořadí

1. Tlačítko Domů na mobilu (malá oprava).
2. Společný vzhled a odstranění emoji.
3. Úvodní stránka.

Netlify verzi Asie naslepo nevypínat.

## Deník práce (noc 20.–21. 11. 2026)

### Krok 1: Domů na mobilu – HOTOVO
- Logo má teď ikonu domečku. Na mobilu (do 600 px) zůstane jen ta ikona v rámečku, text se skryje. Dřív se skrylo celé logo.
- Menu na mobilu se samo posune k aktivní stránce, aby bylo vidět, kde jsem.
- Na startu aplikace je dole odkaz „Další předměty“ na rozcestník. Absolutní adresa, protože stejný kód běží i na Netlify, kde by `../../` nevedlo nikam.
- Z veřejné kopie jsem vyřadil `tools/`, `package.json` a `ZMENY.md`. Podle `ZMENY.md` se na hosting nemají nahrávat. Zdroj v repu skola je má dál.
- Test: Playwright, šířka 360 px a 1366 px, všech 9 stránek. Domů je vidět a klik vrací na start, žádné chyby v konzoli, žádný vodorovný posuv. PROŠLO.

### Krok 2a: emoji pryč – HOTOVO
- Všechna emoji jsou pryč z textů, tlačítek i dlaždic. Kde nesla význam, je místo nich slovo nebo jednoduchá čárová ikona (SVG, bere barvu textu, takže funguje i v tmavém režimu): nastavení, časomíra, hledání, tisk, odkaz na mapu v taháku.
- „✔ 5 ✘ 2“ je teď „Správně: 5 · Chyby: 2“. Slovo je jasnější než symbol a na některých telefonech se ✔ kreslí jako barevné emoji.
- Šipky ▶ ◀ u tlačítek jsem vypustil, text tlačítka stačí. Šipky → v obsahu (pomůcky, „mapa → název“) zůstaly, nejsou to emoji, ale typografie.
- Křížek za špatné kliknutí na slepé mapě je obyčejné „×“.
- Dlaždice na startu jsou bez ikon. Studio má „karty s ikonkou“ mezi zakázanými vzory a název s větou stačí.
- Test: totéž co v kroku 1 a navíc kontrola emoji na každé stránce i po spuštění hry (kvíz, test, kartičky, slepá mapa, souvislosti, prohlídka mapy). PROŠLO. Při testu se ukázal vodorovný posuv v taháku na mobilu (skrytý popisek sloupce utíkal z tabulky). Opraveno.
