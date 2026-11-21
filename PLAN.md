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

### Krok 2b: čistší vzhled – HOTOVO
Rozhodnutí podle vzorníku ze studia (a proč):
- **Jedno zaoblení (10 px)** pro tlačítka, karty, pole i rámečky. Dřív se míchalo 8, 10 a 12 px a studio to má mezi zakázanými vzory. Výjimkou jsou čipy kategorií: jsou to štítky, ne tlačítka, a pilulka je odliší.
- **Karty bez stínu**, jen tenký rámeček. „Stín a rámeček kolem všeho“ je zakázaný vzor. Stín zůstal jen u plovoucí časomíry, která leží přes obsah.
- **Klidnější menu:** aktivní stránka má tmavý text a oranžovou čáru pod ním místo oranžové výplně. Oranžová plocha tak zůstává jen hlavnímu tlačítku („jedno hlavní tlačítko na obrazovku“).
- **Logo** „Asie naslepo“ normálním písmem místo verzálek.
- **Výraznější nadpisy:** větší a tučnější h1, aby byl jasný rozdíl mezi nadpisem a textem.
- **Bez poskakování:** dlaždice se při najetí myší už nezvedají, jen se zbarví rámeček.
- Barvy kategorií na mapě jsem nechal. Nejsou ozdoba, ale informace.
- Test: stejný jako v kroku 2a, plus kontrola tmavého režimu očima. PROŠLO.

### Krok 3: úvodní stránka – HOTOVO
- Udělal jsem tři varianty: `navrhy/uvod-a.html` (rejstřík: předměty jako řádky), `navrhy/uvod-b.html` (karty předmětů s barevným pruhem) a `navrhy/uvod-c.html` (velký náhled hlavní aplikace).
- **Vybral jsem A s náhledem aplikace.** Proč: nejlíp snese další předměty, protože každý předmět je řádek a každá aplikace v něm karta. C vypadá nejlíp, dokud je aplikace jedna, ale s pěti by nebylo jasné, kterou dát nahoru. B při dvou předmětech působí prázdně. Náhled (snímek mapy) jsem vzal z C, protože studio chce, aby sekci nesl obrázek, ne ikonka.
- Španělština je tam jako „Slovíčka – připravuje se“, aby bylo vidět, jak se budou předměty přidávat.
- Nový předmět = nový blok `<section class="predmet">` v `index.html`, nová aplikace = nová položka `<li>` a snímek v `img/`.
- Barvy a písmo jsou v `css/zaklad.css`, stejné jako v aplikaci, takže web působí jako jeden celek. Funguje i tmavý režim.
- Test: šířka 360 px a 1366 px, světlý i tmavý režim. Bez vodorovného posuvu, obrázek se načte, žádná chybějící adresa, odkaz otevře aplikaci. PROŠLO. Testy aplikace z kroků 1 a 2 prošly znovu.

## Otázky na ráno (nic z toho neblokuje)
1. **Název webu:** zatím „Učení“. Chceš jiný? Hele, název: chtěl bych z toho udělat takovou učící stránku, takže chtěl bych nějaký kreativní název. Zkus něco vymyslet, dej mi nějaký návrhy a něco pak vyberem. 
2. **Varianta úvodní stránky:** vybral jsem A s náhledem. Jestli se ti víc líbí B nebo C, přepnu to. Já teď úplně nevím, o čem mluvíš. Ty bereš asi nějaký návrhy ABC z toho studia. Já o tom moc nevím, tak mi to kdyžtak vysvětli. 
3. **„Připravuje se“ u španělštiny:** nechat, nebo předmět ukázat až s hotovou aplikací? Hele, španělštinu tam nech, že se připravuje ona. Teďkon už vlastně ji dodělávám, že už bude funkční, takže to tam normálně nech. 
