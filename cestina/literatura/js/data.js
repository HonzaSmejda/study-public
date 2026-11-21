/* Literatura – obsah.
   Zdroje: prezentace učitelky (Baroko; Klasicismus a osvícenství v literatuře) a Honzovy odpovědi
   k pracovnímu sešitu (s. 88, 89, 100–103). Kde má prezentace chybu, zůstává verze z prezentace
   a v poli `pozn` je poznámka.

   Formát cvičení:
   - doplnovacka: text s mezerami {slovo}, `navic` = matoucí slova do nabídky
   - otazky: {q, a:[správně, špatně, …], v: vysvětlení} nebo {q, ano:true/false, v}
   - rozbor: [{dilo, text, otazky:[…]}]  úryvek a k němu otázky */

window.LIT = {
  obdobi: [
    {
      id: "baroko", nazev: "Baroko", od: 1580, do: 1780, roky: "konec 16. – konec 18. stol.",
      kratce: "Člověk otřesený válkou hledá jistotu v Bohu.",
      kontext: [
        "Název z portugalského barocco, nepravidelná perla. Původně myšleno ironicky.",
        "Začíná v Itálii, přehodnocuje odkaz antiky a renesance.",
        "Třicetiletá válka (1618–1648) a v Čechách porážka stavů na Bílé hoře (1620). Pak jediné povolené náboženství katolické a odchod nekatolíků do exilu.",
        "V české literatuře v 17. století hlavně barokní lyrika, v 18. století kazatelství. Krize (temno) až od 40. let 18. století."
      ],
      znaky: [
        "Vyjadřuje pocity člověka otřeseného v hloubi bytosti, který nemá důvěru v rozum.",
        "Okázalost, rozevláté křivky, protiklady.",
        "Hrdina se obrací do vlastního nitra, skutečnost se mění ve znaky a symboly.",
        "Naturalismus a nadsázka (hyperbolizace) záporných jevů.",
        "Důraz na lidskou bezmocnost vůči řádu světa, duchovnost, mysticismus.",
        "Jazyk plný novotvarů a slovních hříček.",
        "Později hravé rokoko: pastýři, potůčky v parcích, baculatí andělíčci."
      ],
      kotvy: [[1618, "třicetiletá válka"], [1620, "Bílá hora"]]
    },
    {
      id: "klasicismus", nazev: "Klasicismus", od: 1630, do: 1790, roky: "17. stol., Francie",
      kratce: "Krásné je to, co je pravdivé. Rozum a pravidla.",
      kontext: [
        "Umělecký směr, který vznikl ve Francii v 17. století.",
        "Základ umění je rozum a pravda. Literatura má hlavně vychovávat.",
        "Pravidla shrnul Boileau ve spise Umění básnické (1677).",
        "U nás se prosazuje opožděně a spolu s osvícenstvím (osvícenský klasicismus)."
      ],
      znaky: [
        "Racionální vztah k tvorbě: „Krásné je to, co je pravdivé.“",
        "Výchovná funkce, názornost, vytříbený jazyk, potlačení citů.",
        "Přísná pravidla. Drama dodržuje zásadu tří jednot (místa, času, děje) a stavbu podle Aristotela: expozice, kolize, krize, peripetie, katastrofa.",
        "Vysoké útvary (tragédie, óda, epos) a nízké (komedie, lidový jazyk).",
        "Přejímá antické žánry: óda (Horatius), elegie (Ovidius), epos (Homér), bajka (Ezop).",
        "Metoda nápodoby, tvůrčí originalita se necení."
      ],
      kotvy: [[1677, "Boileau: Umění básnické"]]
    },
    {
      id: "osvicenstvi", nazev: "Osvícenství", od: 1690, do: 1790, roky: "18. stol.",
      kratce: "Rozum proti tmářství, předsudkům a zázrakům.",
      kontext: [
        "Myšlenkové hnutí opřené o rozum, proti tmářství, feudalismu, zázrakům a předsudkům.",
        "Šíří se ze západu, hlavně z Francie (Voltaire, Diderot, Rousseau). Encyklopedisté chtějí shrnout všechno lidské vědění.",
        "Forma není nová, přebírá útvary klasicismu. Oblíbená je lehká poezie (anakreontika, radosti života) a vzniká občanské drama.",
        "Myšlenky osvícenců připravily Velkou francouzskou revoluci (1789)."
      ],
      znaky: [
        "Důraz na rozum, vzdělání a svobodné myšlení.",
        "Kritika církve, absolutismu a náboženské nesnášenlivosti.",
        "Ideál rovnosti lidí, víra v pokrok.",
        "Encyklopedie, filozofické povídky, satira.",
        "Občanské drama s náměty z lidového prostředí, mravoličný román, který má dojmout."
      ],
      kotvy: [[1789, "Francouzská revoluce"]]
    },
    {
      id: "preromantismus", nazev: "Preromantismus", od: 1740, do: 1800, roky: "2. pol. 18. stol.",
      kratce: "Cit místo rozumu, příroda a lidová tradice.",
      kontext: [
        "Pre = před. Přechod od klasicismu k romantismu.",
        "Dvě podoby: anglický sentimentalismus a německé hnutí Sturm und Drang (Bouře a vzdor, 1767–1785).",
        "Herder: všechny národy mají právo na vlastní vývoj, budoucnost patří Slovanům. To bylo populární v době českého národního obrození."
      ],
      znaky: [
        "Citovost a fantastičnost místo rozumu.",
        "Nový vztah k přírodě (návrat k přírodě).",
        "Zájem o lidovou slovesnost jako zdroj národní tradice.",
        "Odklon od antiky a od pravidel.",
        "Sturm und Drang: tvořivá svoboda jedince, zákony vlastního srdce, hnutí géniů."
      ],
      kotvy: []
    }
  ],

  autori: {
    /* ======================= BAROKO ======================= */
    komensky: {
      jmeno: "Jan Amos Komenský", obdobi: "baroko", zeme: "Čechy", skupina: "Exulantská literatura", narozen: 1592, zemrel: 1670, hlavni: true,
      kratce: "Učitel národů, poslední biskup Jednoty bratrské.",
      zivot: [
        "Narodil se 1592 (Nivnice, Komňa nebo Uherský Brod, všechna tři místa to tvrdí). Do dospělosti užíval jméno Segeš.",
        "Studoval v Heidelbergu. Poslední biskup Jednoty bratrské.",
        "Po Bílé hoře odmítl přestoupit ke katolictví, skrýval se (Brandýs nad Orlicí), po roce 1628 odešel do polského Lešna.",
        "Navštívil Anglii, Švédsko, Prusko. Při požáru Lešna (1656) přišel o majetek a část rukopisů.",
        "Zemřel 1670 v Amsterdamu, pochován v Naardenu. Domů se už nesměl vrátit."
      ],
      dila: [
        { nazev: "Labyrint světa a ráj srdce", rok: 1623, druh: "filozofický spis, alegorie", popis: "Poutník bloudí světem s průvodci Všezvědem Všudybudem a Mámením (růžové brýle). Všude najde jen podvod a marnost, nakonec nalezne ráj ve vlastním srdci, u Boha." },
        { nazev: "Kšaft umírající matky Jednoty bratrské", rok: 1650, druh: "alegorie", popis: "Jednota jako umírající matka odkazuje své poklady českému národu a věří, že se mu vláda věcí vrátí." },
        { nazev: "Informatorium školy mateřské", rok: 1630, druh: "pedagogický spis", popis: "Kniha pro matky a chůvy, jako jeden z prvních zdůraznil předškolní výchovu." },
        { nazev: "Brána jazyků otevřená", rok: 1631, druh: "učebnice", popis: "Učebnice latiny (v prezentaci jako Dveře jazyků otevřené)." },
        { nazev: "Velká didaktika", rok: 1657, druh: "pedagogický spis", popis: "Didactica magna. Pedagogika jako věda, škola pro každého, středem je žák, ne učitel." },
        { nazev: "Orbis pictus (Svět v obrazech)", rok: 1658, druh: "učebnice", popis: "Nejznámější kniha, obrázková učebnice latiny, vzor všech jazykových učebnic." },
        { nazev: "Škola hrou", rok: 1654, druh: "soubor her", popis: "Divadelní hry pro žáky, učení názorné a od jednoduchého ke složitému." },
        { nazev: "Všeobecná porada o nápravě věcí lidských", rok: null, druh: "vševědný spis", popis: "Války a neshody pramení z nevzdělanosti, vzdělání napraví svět. Věnováno všem národům." },
        { nazev: "Hlubina bezpečnosti", rok: null, druh: "filozofický spis", popis: "Filozoficko-náboženské pojednání, bezpečí je jen v Bohu." }
      ],
      myslenky: [
        "Vzdělání pro všechny bez rozdílu původu a pohlaví, zdarma.",
        "Názorné vyučování, škola hrou, od jednoduchého ke složitému.",
        "Pansofie (vševěda): spojení všech věd s teologií.",
        "Společnost je zkažená, napravit ji má vzdělání, víra a spolupráce."
      ],
      citat: "Učit lze slovy, vychovávat jen příkladem."
    },
    balbin: {
      jmeno: "Bohuslav Balbín", obdobi: "baroko", zeme: "Čechy", skupina: "Oficiální literatura", narozen: 1621, zemrel: 1688,
      kratce: "Jezuita, historik a vlastenec.",
      zivot: ["Jezuita, historik, zeměpisec, vlastenec. Profesor gymnázia, pak zbaven oprávnění a nucen žít v Klatovech a pražském Klementinu."],
      dila: [
        { nazev: "Rozprava na obranu jazyka slovanského, zvláště českého", rok: null, druh: "obrana češtiny", popis: "Latinsky psaná obrana češtiny proti germanizaci, vyšla až 1775." },
        { nazev: "Rozmanitosti z historie Království českého", rok: null, druh: "vlastivěda", popis: "Latinsky psaná česká vlastivěda (historie, zeměpis, národopis)." },
        { nazev: "Učené Čechy", rok: null, druh: "kulturní dějiny", popis: "České kulturní a literární dějiny." }
      ]
    },
    bridel: {
      jmeno: "Bedřich Bridel", obdobi: "baroko", zeme: "Čechy", skupina: "Oficiální literatura", narozen: 1619, zemrel: 1680,
      kratce: "Jezuita a básník, zemřel při ošetřování nemocných morem.",
      zivot: ["Jezuita, misionář, profesor rétoriky. Zemřel na mor při ošetřování nemocných."],
      dila: [
        { nazev: "Co Bůh? Člověk?", rok: null, druh: "lyrická báseň", popis: "Vrcholná skladba baroka, básník v první osobě mluví k Bohu." },
        { nazev: "Jesličky", rok: null, druh: "vánoční poezie", popis: "Vánoční písně." }
      ],
      pozn: "V prezentaci je jméno napsané jako „Briedel“."
    },
    michna: {
      jmeno: "Adam Michna z Otradovic", obdobi: "baroko", zeme: "Čechy", skupina: "Oficiální literatura", narozen: 1600, zemrel: 1676,
      kratce: "Básník a skladatel z Jindřichova Hradce.",
      zivot: ["Básník, hudební skladatel a varhaník v Jindřichově Hradci, měl obchod s vínem."],
      dila: [
        { nazev: "Česká mariánská muzika", rok: null, druh: "kancionál", popis: "Ukolébavky (Hajej, můj andílku), milostné písně a koledy (Chtíc, aby spal)." },
        { nazev: "Loutna česká", rok: null, druh: "kancionál", popis: "13 duchovních písní." }
      ]
    },
    konias: {
      jmeno: "Antonín Koniáš", obdobi: "baroko", zeme: "Čechy", skupina: "Oficiální literatura", narozen: 1691, zemrel: 1760,
      kratce: "Jezuita a cenzor, spálil asi 30 tisíc knih.",
      zivot: ["Jezuita, kazatel, cenzor. Fanatik, spálil asi 30 tisíc knih, které považoval za kacířské."],
      dila: [{ nazev: "Klíč kacířské bludy k rozeznávání otvírající", rok: 1729, druh: "seznam zakázaných knih", popis: "Seznam knih určených ke zničení." }]
    },
    kadlinsky: {
      jmeno: "Felix Kadlinský", obdobi: "baroko", zeme: "Čechy", skupina: "Oficiální literatura", narozen: 1613, zemrel: 1675,
      kratce: "Jezuita, hravá duchovní a přírodní lyrika.",
      dila: [{ nazev: "Zdoroslavíček v kratochvilném hájíčku postavený", rok: null, druh: "sbírka", popis: "Hravá poezie, Boží zjevení vidí v kráse přírody." }]
    },
    beckovsky: {
      jmeno: "Jan František Beckovský", obdobi: "baroko", zeme: "Čechy", skupina: "Oficiální literatura", narozen: 1658, zemrel: 1725,
      kratce: "Kněz a historik, psal česky.",
      dila: [{ nazev: "Poselkyně starých příběhův českých", rok: null, druh: "historická četba", popis: "Rozšíření Hájkovy kroniky, populární čtení." }]
    },
    pesina: {
      jmeno: "Tomáš Pešina z Čechorodu", obdobi: "baroko", zeme: "Čechy", skupina: "Oficiální literatura", narozen: 1629, zemrel: 1680,
      kratce: "Kněz a historik.",
      dila: [{ nazev: "Dějiny Moravy", rok: null, druh: "historie", popis: "Historické dílo." }]
    },
    stransky: {
      jmeno: "Pavel Stránský ze Zap", obdobi: "baroko", zeme: "Čechy", skupina: "Exulantská literatura", narozen: null, zemrel: null,
      kratce: "Exulant v Polsku, popsal předbělohorský stát.",
      dila: [{ nazev: "O státě českém (Respublica Bohemiae)", rok: null, druh: "dějepis a místopis", popis: "Popis předbělohorského českého státu i povahy Čechů." }]
    },
    skala: {
      jmeno: "Pavel Skála ze Zhoře", obdobi: "baroko", zeme: "Čechy", skupina: "Exulantská literatura", narozen: null, zemrel: null,
      kratce: "Exulant, církevní dějiny.",
      dila: [{ nazev: "Historie církevní", rok: null, druh: "historie", popis: "Deset svazků dějin církve se zřetelem k českým poměrům." }]
    },
    tranovsky: {
      jmeno: "Jiří Třanovský", obdobi: "baroko", zeme: "Čechy", skupina: "Exulantská literatura", narozen: null, zemrel: null,
      kratce: "Exulant na Slovensku, kancionál.",
      dila: [{ nazev: "Citera svatých", rok: null, druh: "kancionál", popis: "Duchovní písně." }]
    },
    kocmanek: {
      jmeno: "Václav František Kocmánek", obdobi: "baroko", zeme: "Čechy", skupina: "Pololidová tvorba", narozen: null, zemrel: null,
      kratce: "Autor interludií, pololidová tvorba.",
      dila: [{ nazev: "Interludia", rok: null, druh: "krátké hry", popis: "Mezihry, některé pronikly do lidového podání." }]
    },
    calderon: {
      jmeno: "Pedro Calderón de la Barca", obdobi: "baroko", zeme: "Španělsko", narozen: 1600, zemrel: 1681,
      kratce: "Španělský dramatik.",
      dila: [
        { nazev: "Život je sen", rok: null, druh: "drama", popis: "Divadelní hra." },
        { nazev: "Soudce zalamejský", rok: null, druh: "drama", popis: "Divadelní hra." },
        { nazev: "Lékař své cti", rok: null, druh: "drama", popis: "Divadelní hra." }
      ]
    },
    gongora: {
      jmeno: "Luis de Góngora", obdobi: "baroko", zeme: "Španělsko", narozen: 1561, zemrel: 1627,
      kratce: "Podle něj gongorismus: složitý jazyk plný metafor.",
      dila: [{ nazev: "Samoty", rok: null, druh: "poezie, alegorie", popis: "Gongorismus: jazyk ovlivněný latinou, metafory, složitá větná stavba." }]
    },
    terezie: {
      jmeno: "Terezie z Avily", obdobi: "baroko", zeme: "Španělsko", narozen: 1515, zemrel: 1582,
      kratce: "Mystička, popisuje splynutí s Bohem.",
      dila: [{ nazev: "Hrad v nitru", rok: null, druh: "duchovní literatura", popis: "Mystika, symboly a metafory, duchovní extáze." }]
    },
    tasso: {
      jmeno: "Torquato Tasso", obdobi: "baroko", zeme: "Itálie", narozen: 1544, zemrel: 1595,
      kratce: "Italský básník.",
      dila: [{ nazev: "Osvobozený Jeruzalém", rok: null, druh: "epos", popis: "Epos o křížové výpravě." }]
    },
    milton: {
      jmeno: "John Milton", obdobi: "baroko", zeme: "Anglie", narozen: 1608, zemrel: 1674,
      kratce: "Duchovní epos Ztracený ráj.",
      dila: [{ nazev: "Ztracený ráj", rok: 1667, druh: "duchovní epos, blankvers", popis: "12 knih podle Genesis. Satan v podobě hada svede Evu k hříchu, Eva Adama. Církev knihu zakázala (1732–1900)." }],
      citat: "Duše je místem sama o sobě a dovede nám nebe změnit na peklo a peklo na nebe."
    },
    grimmelshausen: {
      jmeno: "H. J. Ch. von Grimmelshausen", obdobi: "baroko", zeme: "Německo", narozen: null, zemrel: null,
      kratce: "Pikareskní román o třicetileté válce.",
      dila: [{ nazev: "Dobrodružný Simplicius Simplicissimus", rok: null, druh: "pikareskní román", popis: "Prostý člověk prožije hrůzy třicetileté války a nakonec se stane poustevníkem." }],
      pozn: "V prezentaci je jméno napsané jako „Christoffel von Grimmelshouse“."
    },

    /* ======================= KLASICISMUS ======================= */
    goldoni: {
      jmeno: "Carlo Goldoni", obdobi: "klasicismus", zeme: "Itálie", narozen: 1707, zemrel: 1793, hlavni: true,
      kratce: "Zakladatel italské národní veselohry.",
      zivot: [
        "Vystudoval práva, ale utekl a kočoval s hereckou společností.",
        "Napsal přes dvě stě her.",
        "Proměnil commedii dell’arte: zrušil masky a typizované postavy, herci se musí učit text, důraz na mluvené slovo.",
        "Jeho hrdinové nejsou stylizované postavy, ale skuteční lidé z lidového prostředí."
      ],
      dila: [
        { nazev: "Sluha dvou pánů", rok: 1745, druh: "komedie", popis: "Sluha Truffaldino slouží dvěma pánům najednou. Slavná role Miroslava Donutila v Národním divadle." },
        { nazev: "Poprask na laguně", rok: 1762, druh: "komedie", popis: "Rybářské městečko Chioggia, pomluvy a žárlivé milenecké dvojice." },
        { nazev: "Chytrá vdova", rok: null, druh: "komedie", popis: "Měšťanský svět." },
        { nazev: "Jemnostpán markýz", rok: null, druh: "komedie", popis: "Šlechta." }
      ],
      myslenky: ["Divadlo o skutečných lidech jejich vlastním jazykem.", "Humor a nadsázka z běžných sporů (pomluvy, žárlivost)."],
      tema: "commedia"
    },
    moliere: {
      jmeno: "Molière", obdobi: "klasicismus", zeme: "Francie", narozen: 1622, zemrel: 1673,
      kratce: "Herec a autor satirických veseloher, umřel na jevišti.",
      zivot: ["Vlastním jménem Jean-Baptiste Poquelin. Herec a ředitel společnosti, 13 let hrál na venkově, zemřel na jevišti.", "Zesměšňuje církevní pokrytectví, šlechtu i měšťany, často porušuje zásadu tří jednot. Vytvořil velké literární typy."],
      dila: [
        { nazev: "Lakomec", rok: 1668, druh: "komedie", popis: "Harpagon vidí smysl života v penězích. Psáno prózou, inspirace Plautem (Komedie o hrnci)." },
        { nazev: "Tartuffe (Svatoušek)", rok: 1664, druh: "komedie", popis: "Zesměšňuje náboženské pokrytectví." },
        { nazev: "Misantrop", rok: null, druh: "komedie", popis: "Komedie." },
        { nazev: "Zdravý nemocný", rok: null, druh: "komedie", popis: "Komedie." },
        { nazev: "Škola žen", rok: null, druh: "komedie", popis: "Komedie." },
        { nazev: "Don Juan", rok: null, druh: "tragédie (podle prezentace)", popis: "Svůdník Don Juan.", pozn: "Prezentace uvádí tragédii, v jiných zdrojích je Don Juan komedie." }
      ]
    },
    lafontaine: {
      jmeno: "Jean de La Fontaine", obdobi: "klasicismus", zeme: "Francie", narozen: 1621, zemrel: 1695,
      kratce: "Autor bajek.",
      dila: [{ nazev: "Bajky", rok: null, druh: "bajky", popis: "245 bajek." }]
    },
    corneille: {
      jmeno: "Pierre Corneille", obdobi: "klasicismus", zeme: "Francie", narozen: 1606, zemrel: 1684,
      kratce: "Hrdina obětuje lásku pro čest a povinnost.",
      dila: [{ nazev: "Cid", rok: 1637, druh: "tragikomedie", popis: "Španělský královský dvůr v 11. století, láska proti cti." }]
    },
    racine: {
      jmeno: "Jean Racine", obdobi: "klasicismus", zeme: "Francie", narozen: 1639, zemrel: 1699,
      kratce: "Francouzský tragik.",
      dila: [
        { nazev: "Faidra", rok: 1677, druh: "tragédie", popis: "Nejznámější tragédie." },
        { nazev: "Berenika", rok: null, druh: "tragédie", popis: "Tragédie." }
      ]
    },

    /* ======================= OSVÍCENSTVÍ ======================= */
    voltaire: {
      jmeno: "Voltaire", obdobi: "osvicenstvi", zeme: "Francie", narozen: 1694, zemrel: 1778, hlavni: true,
      kratce: "Encyklopedista, satirik, bojovník proti fanatismu.",
      zivot: [
        "Vlastním jménem François-Marie Arouet. Encyklopedista a osvícenec.",
        "Kritizoval církev, absolutismus a náboženskou nesnášenlivost, proto byl pronásledován a jeho díla zakazována.",
        "Pohřben v pařížském Panthéonu."
      ],
      dila: [
        { nazev: "Panna orleánská", rok: null, druh: "satirická skladba ve verších", popis: "Zesměšňuje legendu o Johance z Arku a církevní svaté (v sešitě jako „Panna“)." },
        { nazev: "Candide neboli Optimismus", rok: 1759, druh: "filozofická povídka", popis: "Filozofická povídka (v prezentaci jen „Optimismus neboli“)." },
        { nazev: "Prosťáček", rok: null, druh: "filozofická povídka", popis: "Filozofická povídka." }
      ],
      myslenky: ["Rozum a svobodné myšlení proti fanatismu a pověrám.", "Lidé nemohou soudit, kdo patří do pekla a kdo do nebe."]
    },
    diderot: {
      jmeno: "Denis Diderot", obdobi: "osvicenstvi", zeme: "Francie", narozen: 1713, zemrel: 1784, hlavni: true,
      kratce: "Hlavní tvůrce Encyklopedie, román Jeptiška.",
      zivot: ["Encyklopedista a osvícenec, za kritiku církve a moci pronásledován."],
      dila: [
        { nazev: "Jeptiška", rok: 1760, druh: "román", popis: "Nemanželskou Zuzanu nutí rodina do kláštera, aby jí nemusela dát věno ani dědictví. Ostrá kritika poměrů v církvi. Film Jacques Rivette (1966) s Annou Karinou." }
      ],
      myslenky: ["Lidé jsou sobečtí a pokrytečtí, peníze staví nad rodinu.", "Vzdělání a encyklopedie pro všechny."]
    },
    defoe: {
      jmeno: "Daniel Defoe", obdobi: "osvicenstvi", zeme: "Anglie", narozen: 1660, zemrel: 1731, hlavni: true,
      kratce: "Robinson Crusoe, otec robinzonády.",
      zivot: ["Většinu děl napsal v první polovině 18. století.", "Robinson Crusoe je založen na skutečném příběhu (možná více příbězích)."],
      dila: [
        { nazev: "Robinson Crusoe", rok: 1719, druh: "román s realistickými prvky, výchovný román", popis: "Hoch z kupecké rodiny uteče na moře, ztroskotá a 28 let žije na pustém ostrově. Přežije díky rozumu, práci a silné morálce. Vznikl subžánr robinzonáda (Majerová: Robinsonka). České vydání ilustroval Zdeněk Burian." }
      ],
      myslenky: ["Rozumem a prací člověk vyřeší všechny problémy.", "Robinson je obraz ideálního bílého muže, který kolonizuje cizí území."]
    },
    swift: {
      jmeno: "Jonathan Swift", obdobi: "osvicenstvi", zeme: "Anglie", narozen: 1667, zemrel: 1745,
      kratce: "Satirik, Gulliverovy cesty.",
      dila: [{ nazev: "Gulliverovy cesty", rok: 1726, druh: "satirický román", popis: "Cesty do fantastických zemí jako satira na společnost." }]
    },
    montesquieu: {
      jmeno: "Charles de Montesquieu", obdobi: "osvicenstvi", zeme: "Francie", narozen: 1689, zemrel: 1755,
      kratce: "Filozof a encyklopedista.",
      dila: [{ nazev: "Perské listy", rok: 1721, druh: "filozofická povídka v dopisech", popis: "Francouzská společnost očima Peršanů." }]
    },
    prevost: {
      jmeno: "Antoine-François Prévost", obdobi: "osvicenstvi", zeme: "Francie", narozen: 1697, zemrel: 1763,
      kratce: "Abbé Prévost, mravoličný román.",
      dila: [{ nazev: "Manon Lescaut", rok: 1731, druh: "mravoličný román", popis: "Historie lásky." }]
    },

    /* ======================= PREROMANTISMUS ======================= */
    rousseau: {
      jmeno: "Jean-Jacques Rousseau", obdobi: "preromantismus", zeme: "Francie", narozen: 1712, zemrel: 1778, hlavni: true,
      kratce: "Člověk je od přírody dobrý, kazí ho společnost.",
      zivot: [
        "Narodil se v Ženevě, psal francouzsky, žil hlavně ve Francii.",
        "Filozof, spisovatel, hudební skladatel, encyklopedista.",
        "Hlásal rovnost lidí a teoreticky připravil myšlenky Francouzské revoluce.",
        "Pohřben v Panthéonu (stejně jako Voltaire, Hugo, Zola, Dumas st., Marie Curie)."
      ],
      dila: [
        { nazev: "Rozprava o původu a základech nerovnosti", rok: null, druh: "filozofický spis", popis: "Příčinou nerovnosti, válek a násilí je soukromé vlastnictví: „ovoce patří všem a země žádnému“." },
        { nazev: "O společenské smlouvě", rok: 1762, druh: "filozofický spis", popis: "Člověk ztratí přirozenou svobodu, ale získá občanskou. Zákon vyjadřuje obecnou vůli." },
        { nazev: "Emil čili O výchově", rok: 1762, druh: "pedagogický spis", popis: "Výchova v souladu s přírodou. Člověk se rodí čistý, společnost ho kazí." },
        { nazev: "Julie neboli Nová Heloisa", rok: 1761, druh: "román v dopisech", popis: "Láska chudého učitele k dívce z bohaté rodiny." },
        { nazev: "Vyznání", rok: null, druh: "autobiografie", popis: "Vlastní životopis." }
      ],
      myslenky: [
        "Člověk je od přirozenosti dobrý a kazí jej společnost.",
        "Návrat k přírodě, cit nad rozumem.",
        "Svoboda, rovnost, svrchovanost lidu.",
        "Úpadek mravů způsobuje civilizace: přepych, nerovnost, marnivost."
      ],
      citat: "Člověk se rodí svobodný, ale všude je v okovech."
    },
    herder: {
      jmeno: "Johann Gottfried Herder", obdobi: "preromantismus", zeme: "Německo", narozen: 1744, zemrel: 1803,
      kratce: "Teoretik Sturm und Drang, budoucnost patří Slovanům.",
      dila: [
        { nazev: "Myšlenky k filozofii dějin lidstva", rok: null, druh: "filozofický spis", popis: "Každý národ má právo na vlastní vývoj, budoucnost patří Slovanům." },
        { nazev: "Lidové písně", rok: null, druh: "sbírka", popis: "Sbírka lidové poezie." }
      ],
      pozn: "V prezentaci je druhé jméno uvedeno jako Gottlieb."
    },
    schiller: {
      jmeno: "Friedrich Schiller", obdobi: "preromantismus", zeme: "Německo", narozen: 1759, zemrel: 1805,
      kratce: "Básník svobody, Óda na radost.",
      zivot: ["Básník a dramatik. Právo člověka na svobodu, umění utváří člověka."],
      dila: [
        { nazev: "Loupežníci", rok: 1781, druh: "drama", popis: "Karla Moora vydědí otec kvůli bratrovi Franzovi a Karel se stane vůdcem loupežníků. Končí tragicky." },
        { nazev: "Óda na radost", rok: null, druh: "óda", popis: "Zhudebněná Beethovenem, dnes hymna EU." },
        { nazev: "Úklady a láska", rok: null, druh: "drama", popis: "Drama." },
        { nazev: "Valdštejn", rok: null, druh: "dramatická trilogie", popis: "O Albrechtovi z Valdštejna, který se stal zrádcem proti své vůli." }
      ]
    },
    goethe: {
      jmeno: "Johann Wolfgang Goethe", obdobi: "preromantismus", zeme: "Německo", narozen: 1749, zemrel: 1832,
      kratce: "Faust, Werther, Král duchů.",
      zivot: ["Básník, filozof, přírodovědec, ministr ve Výmaru. Jezdil do českých lázní. Hrdinové jsou osamělí géniové proti společnosti."],
      dila: [
        { nazev: "Utrpení mladého Werthera", rok: 1774, druh: "román v dopisech", popis: "Werther se nesmíří s tím, že dívka dala přednost jinému, a spáchá sebevraždu. Mladí ho napodobovali." },
        { nazev: "Faust", rok: null, druh: "veršovaná tragédie", popis: "Dva díly, psal ho celý život. Faust zaprodá duši ďáblu Mefistofelovi, sázka Boha a ďábla." },
        { nazev: "Král duchů", rok: null, druh: "balada", popis: "Otec veze nemocného syna nocí, chlapec vidí krále duchů. Doma už je dítě mrtvé." },
        { nazev: "Spřízněni volbou", rok: null, druh: "román", popis: "Milostný příběh, láska nedojde naplnění." },
        { nazev: "Götz z Berlichingen", rok: null, druh: "drama", popis: "Zánik rytířství." }
      ]
    },
    richardson: {
      jmeno: "Samuel Richardson", obdobi: "preromantismus", zeme: "Anglie", narozen: 1689, zemrel: 1761,
      kratce: "Sentimentální román Clarissa.",
      dila: [{ nazev: "Clarissa", rok: null, druh: "sentimentální román", popis: "Dívka se nesmíří s tím, že jí rodiče brání vzít si toho, koho miluje." }]
    },
    sterne: {
      jmeno: "Laurence Sterne", obdobi: "preromantismus", zeme: "Anglie", narozen: 1713, zemrel: 1768,
      kratce: "Tristram Shandy.",
      dila: [
        { nazev: "Život a názory blahorodého pana Tristrama Shandyho", rok: null, druh: "román", popis: "Román." }
      ],
      pozn: "Prezentace připisuje Sentimentální cestu po Francii a Itálii Fieldingovi. V jiných zdrojích je jejím autorem Sterne a od ní má název celý sentimentalismus."
    },
    fielding: {
      jmeno: "Henry Fielding", obdobi: "preromantismus", zeme: "Anglie", narozen: 1707, zemrel: 1754,
      kratce: "Podle prezentace autor Sentimentální cesty.",
      dila: [{ nazev: "Sentimentální cesta po Francii a Itálii", rok: null, druh: "cestopis", popis: "Odtud název sentimentalismus.", pozn: "Takhle to je v prezentaci. V jiných zdrojích je autorem Laurence Sterne." }]
    },
    percy: {
      jmeno: "Thomas Percy", obdobi: "preromantismus", zeme: "Anglie", narozen: 1729, zemrel: 1811,
      kratce: "Sbíral lidovou slovesnost.",
      dila: [{ nazev: "Památky starodávné anglické poezie", rok: null, druh: "sbírka lidové slovesnosti", popis: "Sbírka starých balad a písní." }]
    }
  },

  /* Témata, která nejsou autor */
  temata: {
    commedia: {
      nazev: "Commedia dell’arte", obdobi: "baroko",
      body: [
        "Komedie založená na improvizaci, kostra hry vždy stejná.",
        "Stálé postavy s maskami, herec hrál jednu postavu celý život.",
        "Vzniká v Itálii na přelomu renesance a baroka, kočovné společnosti.",
        "Postavy: Arlecchino (harlekýn), Colombina, Dottore, Pantalone, Brighella, Capitano.",
        "Později ji zdokonalili Molière a Goldoni."
      ]
    },
    lidova: {
      nazev: "Lidová a pololidová tvorba", obdobi: "baroko",
      body: [
        "Pololidová: přechod mezi oficiální a ústní tvorbou, není tištěná (Kocmánek: Interludia, Rakovnická hra).",
        "Písmáci zachycují lidovou tvorbu (F. J. Vavák), Satira na 4 stavy.",
        "Lidová: sociální písně, pohádky (Čert a Káča, O Honzovi), balady, pověsti (o Žižkovi, Blaník, Sibyliina proroctví).",
        "Loutkové hry (o Faustovi, Donu Juanovi), loutkář Matěj Kopecký (Kašpárek)."
      ]
    }
  },

  /* ======================= CVIČENÍ HLAVNÍCH AUTORŮ ======================= */
  cviceni: {
    komensky: {
      doplnovacka: {
        text: "Jan Amos Komenský, který ve světě proslul především jako {pedagog}, se hlásil k {jednotě} bratrské. Když po {porážce} stavovského povstání odmítl přestoupit ke {katolictví}, byl nucen se skrývat. Později odešel do zahraničí, působil v {Anglii} zmítané občanskou válkou, {polském} Lešně, {nizozemském} Amsterdamu a na mnoha dalších místech. Formuloval řadu {zásad} pedagogiky, na nichž stojí i dnešní {školství}. Osobně považoval za velmi důležité své spisy o všeobecné moudrosti, která se nazývá {pansofie}. Ve svém díle prosazoval zásadu {názorného} vyučování.",
        navic: ["biskup", "vítězství", "luteránství", "Francii", "německém", "švédském", "pravidel", "teologie", "didaktika", "přísného"]
      },
      otazky: [
        { q: "K jakému dílu se vztahuje obrázek světa jako kruhového města s ulicemi?", a: ["Labyrint světa a ráj srdce", "Kšaft umírající matky Jednoty bratrské", "Všeobecná porada o nápravě věcí lidských", "Škola hrou"], v: "Poutník bloudí městem světa, které má podobu labyrintu." },
        { q: "Ve kterých dílech použil Komenský alegorii?", a: ["Labyrint světa a ráj srdce, Kšaft umírající matky Jednoty bratrské", "Velká didaktika, Orbis pictus", "Informatorium školy mateřské, Brána jazyků", "Škola hrou, Hlubina bezpečnosti"], v: "V Kšaftu vystupuje Jednota jako umírající matka, v Labyrintu je svět jako bludiště." },
        { q: "Ve kterém díle definoval principy moderní pedagogiky?", a: ["Velká didaktika", "Orbis pictus", "Labyrint světa a ráj srdce", "Kšaft umírající matky"], v: "Didactica magna: pedagogika jako věda." },
        { q: "Komenský se zabýval astrologií.", ano: false, v: "Zaškrtnout: didaktika, pedagogika, historie, teologie, lingvistika, filozofie, bohemistika, překladatelství, divadlo, duchovní písně, encyklopedie, politika, diplomacie. Ne: právo, astrologie, archeologie, anatomie, malířství." },
        { q: "Komenský se zabýval divadlem.", ano: true, v: "Škola hrou je soubor divadelních her pro žáky." },
        { q: "Komenský se zabýval diplomacií.", ano: true, v: "Mírové snahy a jednání v exilu." },
        { q: "Komenský se zabýval anatomií.", ano: false, v: "Anatomie, právo, archeologie, astrologie a malířství mezi jeho obory nepatří." },
        { q: "Co souvisí s životem a dílem Komenského?", a: ["exil, biskup, didaktika, alegorie", "papež, revoluce, epos, kronika", "osvícenství, papež, kronika, epos", "revoluce, osvícenství, biskup, epos"], v: "Ze sešitu: exil, biskup, pedagogika, baroko, alegorie, didaktika." },
        { q: "Co si Komenský myslel o vzdělání?", a: ["Má být pro všechny, názorné, hravé a postupovat od snadného k těžšímu", "Má být jen pro šlechtu a duchovní", "Má se učit hlavně nazpaměť", "Je důležitější učitel než žák"], v: "Škola pro každého bez ohledu na pohlaví, majetek a původ. Středem je žák." },
        { q: "Co si Komenský myslel o lidské společnosti?", a: ["Je zkažená, napravit ji má vzdělání, mravnost, víra a spolupráce", "Je dokonalá a není co měnit", "Kazí ji soukromé vlastnictví", "Spasí ji jen revoluce"], v: "„Náprava věcí lidských.“ Soukromé vlastnictví je Rousseau." },
        { q: "Co si Komenský myslel o světě?", a: ["Je Boží dílo, ale bez Boha je labyrintem, ve kterém člověk bloudí", "Je to stroj, který se dá vysvětlit jen rozumem", "Je nejlepší ze všech možných světů", "Je sen, ze kterého se probudíme"], v: "Svět je propojený celek stvořený Bohem." },
        { q: "Jaké knihy pro mládež navrhuje Komenský ve Velké didaktice?", a: ["Krátké, přehledné a srozumitelné učebnice psané novou, snadnou metodou", "Rozsáhlé encyklopedie se vším věděním", "Latinské texty k učení nazpaměť", "Knihy jen s obrázky, bez textu"], v: "Učebnice, které žákům dají „klíč“ k pochopení." },
        { q: "V čem byl jeho přístup moderní?", a: ["Odmítal biflování, chtěl porozumění, názornost a samostatné myšlení", "Zavedl tresty za chyby", "Chtěl učit jen latinsky", "Prosazoval výuku jen pro chlapce"], v: "Žák se má naučit dál poznávat sám." },
        { q: "Kde zemřel Komenský?", a: ["v Amsterdamu", "v Lešně", "v Praze", "v Heidelbergu"], v: "1670 v Amsterdamu, pochován v Naardenu." }
      ],
      rozbor: [
        {
          dilo: "Labyrint světa a ráj srdce", autor: "komensky",
          text: "Tehdy vede mne Všudybud po schodech na jakés pavlače, kdež hromady uzřím lidí žebříky dělajících a k obloze přistavujících: pak lezoucích zhůru a lapajících hvězdy… O čemž někteří usadíc se regule psali, kdy, kde a jak se které scházeti neb rozcházeti mají, vyměřujíce.",
          otazky: [
            { q: "O kterém povolání Komenský píše?", a: ["astronomové", "řečníci", "boháči", "historici"], v: "Lapají hvězdy a měří jejich běh. V dalších ukázkách jsou řečníci a boháči." },
            { q: "Které slovo je přechodník?", a: ["vyměřujíce", "dělajících", "lezoucích", "lapajících"], v: "Dělajících, lezoucích, lapajících jsou přídavná jména slovesná, ne přechodníky." },
            { q: "Které slovo je cizího původu?", a: ["regule", "pavlače", "hromady", "žebříky"], v: "Regule z latiny = pravidla." },
            { q: "Kdo je Všudybud?", a: ["průvodce poutníka světem", "ďábel, který svádí poutníka", "anděl, který vede do ráje", "král labyrintu"], v: "Všezvěd Všudybud radí poutníkovi, aby nic nekritizoval. Druhým průvodcem je Mámení." }
          ]
        },
        {
          dilo: "Labyrint světa a ráj srdce", autor: "komensky",
          text: "Já ani se na to dívati, ani bolesti srdce déle snášeti nemoha, prchl jsem, na poušť někam aneb raději, kdyby možné bylo, z světa ven utéci chtěje… „Již vidím, že v světě lépe nebude! Již jest po mé naději veta! Běda mně!“",
          otazky: [
            { q: "Z které části skladby úryvek pochází?", a: ["z Labyrintu světa, ze závěru poutníkova bloudění", "z Ráje srdce, ze závěru knihy", "z úvodu, když poutník vyráží", "z Kšaftu umírající matky"], v: "Poutník je zoufalý a raději by zemřel. Hned potom se obrátí do vlastního srdce." },
            { q: "Jaký má Komenský názor na lidský svět?", a: ["kritický a pesimistický: svět je plný nepravosti, lži a krutosti", "optimistický: svět je nejlepší možný", "lhostejný: svět ho nezajímá", "obdivný: svět je plný krásy a pokroku"], v: "Lidé se odvrátili od Boha, poutník ve světě nenachází klid." },
            { q: "Kde nakonec poutník najde klid?", a: ["ve vlastním srdci, u Boha", "v klášteře na poušti", "na královském dvoře", "v knihách a vědě"], v: "Ráj srdce." }
          ]
        },
        {
          dilo: "Orbis pictus (Svět v obrazech)", autor: "komensky",
          text: "UČITEL: Pojď sem, hochu, uč se být moudrým. HOCH: Co je to být moudrým? UČITEL: Všemu, co je potřebné, dobře rozumět, všecko dobře konat, dobře vyjadřovat. HOCH: Kdo mě tomu naučí? UČITEL: Já s Boží pomocí. … Zde máš živou a hlasnou abecedu.",
          otazky: [
            { q: "Proč je ukázka napsaná jako divadelní hra?", a: ["dialog je živější a dětem srozumitelnější, dá se zahrát", "aby se dala hrát v kostele", "protože Komenský psal jen divadlo", "aby byla co nejkratší"], v: "Princip škola hrou." },
            { q: "Čemu chce učitel chlapce naučit?", a: ["moudrosti: dobře rozumět, dobře jednat, dobře se vyjadřovat", "latinské gramatice nazpaměť", "modlitbám", "počítání"], v: "Začíná hláskami (živou abecedou) a pokračuje pozorováním světa." },
            { q: "Jak se v ukázce uplatňuje princip škola hrou?", a: ["dítě se učí aktivně: napodobuje zvuky, kreslí, pozoruje svět", "dítě hraje hry místo učení", "učitel dítě trestá za chyby", "dítě se učí samo bez učitele"], v: "Spojuje slova s obrázky a skutečnými věcmi." }
          ]
        },
        {
          dilo: "Všeobecná porada o nápravě věcí lidských", autor: "komensky",
          text: "Aby bylo možné u celého lidského rodu dosíci dokonalého myšlení, dokonalé řeči a dokonalého vytváření věcí, a tím aby se konečně jednou mezi lidmi dosáhlo všeobecné svornosti, aby se ze světa (uzná-li Bůh za dobré) vymýtily nesváry, je dílo věnováno všem národům země.",
          otazky: [
            { q: "Proč se Komenský obrací na všechny národy země?", a: ["chce napravit celé lidstvo, mír se týká všech", "chce, aby se všichni naučili česky", "chce založit jednu říši", "chce prodat knihu do celého světa"], v: "Ne jeden národ, ale celý lidský rod." },
            { q: "Jaký byl jeho vztah k Bohu?", a: ["hluboce věřící a pokorný, náprava závisí na Boží vůli", "pochyboval o existenci Boha", "Boha kritizoval jako osvícenec", "Bůh v jeho díle nehraje roli"], v: "„Uzná-li Bůh za dobré.“" }
          ]
        }
      ]
    },

    goldoni: {
      doplnovacka: {
        text: "Carlo Goldoni byl představitelem italské {komedie}. Je autorem více než dvou set {her}. Vystudoval {práva}, ale {utekl} s hereckou společností. Pozměnil principy {commedie dell’arte}. Zrušil {masky} a typizované {postavy}. Kladl důraz na {mluvené} slovo. Hrdinové jeho her nejsou {stylizované} postavy, ale {skuteční} lidé z {lidového} prostředí. Mezi jeho nejúspěšnější hry patří {Sluha dvou pánů} a {Poprask na laguně}.",
        navic: ["tragédie", "románů", "medicínu", "zůstal", "antického dramatu", "kostýmy", "zpívané", "šlechtického", "Lakomec", "Cid"]
      },
      otazky: [
        { q: "Co měli společného Goldoni, Molière a Plautus?", a: ["všichni psali komedie, které s humorem zesměšňují lidské slabosti", "všichni byli Italové", "všichni psali tragédie podle pravidel tří jednot", "všichni byli herci commedie dell’arte"], v: "Molièrův Lakomec je inspirovaný Plautovou Komedií o hrnci." },
        { q: "Patří „improvizace“ ke Goldonimu, nebo ke commedii dell’arte?", a: ["commedia dell’arte", "Goldoni"], v: "Goldoni: lidové prostředí, humor, důraz na mluvené slovo, skuteční lidé, herci se musí učit texty. Commedia: harlekýn, kolombína, masky, improvizace, stylizované postavy, pantomima." },
        { q: "Patří „herci se musí učit texty“ ke Goldonimu, nebo ke commedii dell’arte?", a: ["Goldoni", "commedia dell’arte"], v: "Goldoni zrušil improvizaci, herci hrají napsaný text." },
        { q: "Patří „stylizované postavy“ ke Goldonimu, nebo ke commedii dell’arte?", a: ["commedia dell’arte", "Goldoni"], v: "Goldoni místo nich píše skutečné lidi." },
        { q: "Patří „masky“ ke Goldonimu, nebo ke commedii dell’arte?", a: ["commedia dell’arte", "Goldoni"], v: "Goldoni masky zrušil." },
        { q: "Patří „skuteční lidé“ ke Goldonimu, nebo ke commedii dell’arte?", a: ["Goldoni", "commedia dell’arte"], v: "Skuteční lidé z lidového prostředí." },
        { q: "Patří „pantomima“ ke Goldonimu, nebo ke commedii dell’arte?", a: ["commedia dell’arte", "Goldoni"], v: "Goldoni kladl důraz na mluvené slovo." },
        { q: "Harlekýn je…", a: ["mazaný sluha zamilovaný do kolombíny, kostkovaný oblek a černá škraboška", "chytrá služka, která pomáhá paní se schůzkami", "bohatý doktor nebo právník v černém taláru", "kapitán s mečem a maskou s dlouhým nosem"], v: "Arlecchino." },
        { q: "Kolombína je…", a: ["chytrá služka, která pomáhá své paní zorganizovat schůzky s milencem", "mazaný sluha v kostkovaném obleku", "kupec Pantalone", "kapitán ve vojenské uniformě"], v: "Colombina." },
        { q: "Dottore je…", a: ["bohatý doktor nebo právník, požitkář v černém taláru", "sluha Brighella", "kapitán s mečem", "zamilovaný mladík"], v: "Dottore." },
        { q: "Ze kterého představení odehrávajícího se v rybářské vesnici je slavná fotografie?", a: ["Poprask na laguně", "Sluha dvou pánů", "Chytrá vdova", "Lakomec"], v: "Chioggia, rybářské městečko." },
        { q: "Kdo hrál slavného Truffaldina ve Sluhovi dvou pánů v Národním divadle?", a: ["Miroslav Donutil", "Jiří Lábus", "Ivan Trojan", "Bolek Polívka"], v: "Národní divadlo, 1994." }
      ],
      rozbor: [
        {
          dilo: "Poprask na laguně", autor: "goldoni",
          text: "LUCIETTA: Na mou duši, že jsem nechtěla nic říct, ale nemohla jsem to vydržet. Začala se mi sbíhat řeč na jazyku, zkoušela jsem to spolknout, ale ne a ne to přemoct. V jednom uchu mi něco špitalo: – Mlč! – a v druhém to ponoukalo: – Ven s tím! A já si zacpala to ucho, co chtělo mlčet, a natáhla to, co chtělo mluvit… PASQUA: Ze čtyřiceti tisíc lidí je, myslím, nás ženských třicet tisíc.",
          otazky: [
            { q: "Jak se nazývá řeč „Mlč!“ a „Ven s tím!“?", a: ["vnitřní řeč (vnitřní monolog)", "řeč stranou", "nepřímá řeč", "polopřímá řeč"], v: "Dva protichůdné vnitřní hlasy. Nejde o řeč stranou." },
            { q: "Jaké jsou Lucietta a Pasqua?", a: ["prosté ženy z rybářského prostředí, upovídané a zvědavé", "šlechtičny z Benátek", "jeptišky z kláštera", "stylizované masky commedie dell’arte"], v: "Rády pomlouvají a neudrží tajemství." },
            { q: "Proč není v městečku nouze o děvčata?", a: ["podle nadsázky je ze 40 tisíc lidí 30 tisíc žen", "muži odešli do války", "do města přijely herečky", "děvčata se tam rodí častěji"], v: "Pasquina nadsázka." },
            { q: "Který výraz patří k lidovým výrazům Goldoniho postav?", a: ["nabrebentily", "regule", "vyměřujíce", "obecná vůle"], v: "Další: klapačky, nahučela, nadbíhal, zašil vyřídilku, strašpytel, marná sláva." },
            { q: "Co je typické pro Goldoniho tvorbu, jak ji vidíš v ukázce?", a: ["lidové prostředí, skuteční lidé, hovorový jazyk, rychlý dialog, humor", "vznešený jazyk a tragický konec", "improvizace a masky", "alegorie a náboženské symboly"], v: "Běžné spory (pomluvy, žárlivost) s nadsázkou." }
          ]
        }
      ]
    },

    voltaire: {
      doplnovacka: {
        text: "Voltaire byl francouzský {encyklopedista} a osvícenec. Psal {filozofické} povídky, například Prosťáček nebo Candide. V satirické skladbě Panna orleánská zesměšňuje legendu o {Johance z Arku}. Byl pronásledován, protože kritizoval {církev} a absolutismus. Pohřben je v pařížském {Panthéonu}.",
        navic: ["kněz", "rytířské", "Marii Terezii", "rozum", "Louvru"]
      },
      otazky: [
        { q: "Proč byli Voltaire a Diderot pronásledováni?", a: ["kritizovali církev, absolutismus a nesnášenlivost, a tím ohrožovali moc", "byli ve spojení s Angličany", "psali v cizím jazyce", "odmítli sloužit v armádě"], v: "Jejich díla byla zakazována, oni sami vězněni nebo museli odejít." },
        { q: "Co má filozofie Voltaira a Diderota společného?", a: ["rozum, vzdělání a svobodné myšlení, odmítání fanatismu a pověr", "návrat k přírodě a cit nad rozumem", "mystické splynutí s Bohem", "obranu absolutní monarchie"], v: "Víra v pokrok a zlepšení společnosti." },
        { q: "Je „encyklopedie“ typická pro francouzské osvícenství?", ano: true, v: "Typické: encyklopedie, kritika církve, ideál rovnosti, filozofie, vzdělávání. Ne: legendy, fantazie, rezignace." },
        { q: "Je „rezignace“ typická pro francouzské osvícenství?", ano: false, v: "Osvícenci věřili v pokrok, nerezignovali." },
        { q: "Je „ideál rovnosti“ typický pro francouzské osvícenství?", ano: true, v: "Ideál rovnosti." },
        { q: "Jsou „legendy“ typické pro francouzské osvícenství?", ano: false, v: "Legendy patří spíš k baroku." },
        { q: "Jakou skutečnou postavu zesměšňuje Panna orleánská?", a: ["Johanku z Arku", "Marii Antoinettu", "svatého Dominika", "Ludvíka XIV."], v: "Bojovala proti Angličanům ve stoleté válce, roku 1431 upálena v Rouenu." }
      ],
      rozbor: [
        {
          dilo: "Panna orleánská", autor: "voltaire",
          text: "Mnich se po smrti dostává do pekla a je překvapený, s kým se tam setkává: „Jsem, běda, synu, svatý Dominik!“ … „Proč dělat povyk pro nějaký klam, proč tlachy lidskými si lámat hlavu – zda starosti a trampoty já mám, nebo že nemám náležitou slávu? … Pokud jde o mne, já se právem opékám na pekelném roštu žhavém.“",
          otazky: [
            { q: "Která myšlenka je hlavní myšlenkou ukázky?", a: ["lidé nemohou rozhodnout, kdo patří do pekla a kdo do nebe", "každý by se měl snažit, aby neskončil v pekle", "svatí jsou v nebi a hříšníci v pekle", "peklo neexistuje"], v: "Svatý skončil v pekle. Doslova sedí i to, že Dominik svůj trest považuje za spravedlivý („právem“)." },
            { q: "Jde o lyrický (nedějový) text?", ano: false, v: "Je to epický, dějový text." },
            { q: "Uplatňují se v textu dvě rýmová schémata?", ano: true, v: "Sdružený (AABB) a střídavý (ABAB)." },
            { q: "Hovoří v textu dvě postavy přímou řečí?", ano: false, v: "Přímo mluví jen svatý Dominik." },
            { q: "Obrací se vypravěč na čtenáře?", ano: false, v: "Neobrací." }
          ]
        }
      ]
    },

    diderot: {
      doplnovacka: {
        text: "Denis Diderot byl hlavním tvůrcem francouzské {Encyklopedie}. V románu Jeptiška nutí rodina {nemanželskou} dceru Zuzanu vstoupit do {kláštera}, aby jí nemusela dát věno ani {dědictví}. Podle románu natočil Jacques Rivette film s Annou {Karinou}.",
        navic: ["Bible", "nejstarší", "manželství", "vzdělání", "Bardotovou"]
      },
      otazky: [
        { q: "Proč rodina nutila Zuzanu, aby vstoupila do kláštera?", a: ["byla nemanželské dítě a rodina nechtěla dělit majetek", "Zuzana chtěla být jeptiškou", "otec byl biskup", "klášter rodině zaplatil"], v: "Matce připomínala její hřích, majetek měl zůstat sestrám." },
        { q: "Jaký by byl Zuzanin osud, kdyby neposlechla?", a: ["po smrti rodičů by neměla skoro nic a skončila by v chudobě", "provdala by se za šlechtice", "zdědila by celý majetek", "musela by odejít do ciziny"], v: "Sestry by ji přivedly na žebrotu." },
        { q: "Jak hodnotí Diderot svět a lidskou společnost?", a: ["záporně: lidé jsou sobečtí, pokrytečtí a peníze staví nad rodinu", "kladně: lidé si pomáhají", "neutrálně, jen popisuje", "kladně, protože církev chrání slabé"], v: "„Každý na tomto světě myslí jen na sebe.“" },
        { q: "Jak se jmenoval film, který skandalizoval poměry v církvi?", a: ["Jeptiška (La Religieuse)", "Panna orleánská", "Manon Lescaut", "Candide"], v: "Režie Jacques Rivette, 1966." }
      ],
      rozbor: [
        {
          dilo: "Jeptiška", autor: "diderot",
          text: "„Jak mě tedy mohly oloupit o všechno, když mě považují za sestru?“ „Ach, slečno, hájí své zájmy, jen své zájmy! Bez peněz by se nikdy tak dobře neprovdaly. Každý na tomto světě myslí jen na sebe. Radím vám, abyste po smrti rodičů s nimi nepočítala.“",
          otazky: [
            { q: "Kdo je autorem ukázky?", a: ["Denis Diderot", "Voltaire", "Jean-Jacques Rousseau", "abbé Prévost"], v: "Román Jeptiška (1760)." },
            { q: "Co ukázka kritizuje?", a: ["sobectví a moc peněz, které rozhodují o osudu člověka", "nevzdělanost venkova", "krutost války", "lenost šlechty"], v: "Osvícenská kritika společnosti a církve." },
            { q: "Ke kterému směru dílo patří?", a: ["osvícenství", "baroko", "preromantismus", "klasicismus"], v: "Francouzské osvícenství." }
          ]
        }
      ]
    },

    defoe: {
      doplnovacka: {
        text: "Daniel Defoe napsal většinu svých děl v první polovině {18.} století. Román Robinson Crusoe zachycuje osud {námořníka}, který strávil osmadvacet let na {pustém ostrově}. Robinson má především {kladné} vlastnosti. Do jeho postavy se promítají autorovy {osvícenské} názory, že pomocí {rozumu} dokáže člověk vyřešit všechny problémy. Robinson je obrazem ideálního {bílého} muže kolonizujícího {mimoevropská} území.",
        navic: ["17.", "kupce", "lodi", "záporné", "barokní", "víry", "černého", "evropská"]
      },
      otazky: [
        { q: "Kdo ilustroval české vydání Robinsona a proslavil se kresbami dinosaurů?", a: ["Zdeněk Burian", "Josef Lada", "Jiří Trnka", "Adolf Born"], v: "Ilustroval i Karla Maye, Julese Verna a Jaroslava Foglara." },
        { q: "Kdo byl Pátek a proč se tak jmenoval?", a: ["domorodec zachráněný před kanibaly, jméno podle dne záchrany", "Robinsonův pes, narodil se v pátek", "kapitán lodi, která Robinsona zachránila", "pirát, který Robinsona zajal"], v: "Stal se Robinsonovým sluhou a společníkem." },
        { q: "Robinson se dlouho marně pokoušel vypěstovat obilí.", ano: false, v: "Obilí mu vyrostlo náhodou z vysypaných zrn." },
        { q: "Vzhled evropského ječmene se zásadně liší od anglického.", ano: false, v: "Poznal pravý evropský nebo spíše anglický ječmen." },
        { q: "Kolik let strávil Robinson na ostrově?", a: ["28", "10", "5", "40"], v: "28 let. V převyprávění J. V. Plevy jen 10." },
        { q: "Jak se jmenuje subžánr, který Robinson založil?", a: ["robinzonáda", "pikareska", "simpliciáda", "sentimentalismus"], v: "Např. Marie Majerová: Robinsonka." }
      ],
      rozbor: [
        {
          dilo: "Robinson Crusoe", autor: "defoe",
          text: "Bylo to krátce před dobou dešťů, když nic netuše, vysypal jsem onu dříve zmíněnou drť… Asi tak za měsíc jsem na tom místě spatřil několik ze země vyrážejících zelených stébel… Ale jak jsem užasl, ba ustrnul, když po nějakém čase stébla vymetla deset nebo dvanáct klasů, v nichž jsem poznal pravý evropský nebo spíše anglický ječmen!",
          otazky: [
            { q: "Z čeho má Robinson v ukázce radost?", a: ["náhodou mu vyrostl ječmen, může pěstovat obilí", "připlula loď, která ho zachrání", "našel na ostrově Pátka", "našel v troskách lodi zásoby"], v: "Ze zbytků zrní vysypaných z pytle." },
            { q: "Jak asi text pokračuje?", a: ["zrna sklidí, znovu zaseje a po pár sklizních má mouku a chléb", "zrna hned sní", "ječmen spálí a odpluje", "obilí mu sežerou kozy a vzdá to"], v: "Rozum a trpělivá práce." },
            { q: "Převládá vyprávěcí postup a je použita přímá řeč?", ano: false, v: "Přímá řeč v ukázce není." },
            { q: "Obsahuje text popisný postup a je psaný v ich-formě?", ano: true, v: "Robinson vypráví sám za sebe." }
          ]
        },
        {
          dilo: "Robinson Crusoe", autor: "defoe",
          text: "Postrádal jsem teď jedině člun, abych naložil mnohé věci, které budu potřebovat. Nic však nepomůže, myslíme-li na svá přání se založenýma rukama. Nouze mě naučila vynalézavosti… Rozhodl jsem se, že jich užiji, i házel jsem s paluby všecka dřeva, jež jsem unesl… svazoval jsem čtyři klády na obou koncích v jeden vor.",
          otazky: [
            { q: "S čím Robinson v ukázce bojuje?", a: ["nemá člun a musí z vraku dostat těžké zásoby", "s piráty a kanibaly", "se zimou a sněhem", "s nemocí"], v: "Postaví si vor." },
            { q: "Jak se v ukázce projevují autorovy osvícenské názory?", a: ["rozum, vynalézavost a práce místo zbožných přání", "důvěra v zázrak a modlitbu", "návrat k přírodě a cit", "oslava šlechtické cti"], v: "„Nic však nepomůže, myslíme-li na svá přání se založenýma rukama.“" },
            { q: "Ke kterému směru Robinson Crusoe patří?", a: ["osvícenství", "preromantismus", "baroko", "klasicismus"], v: "Anglické osvícenství, 1719." }
          ]
        }
      ]
    },

    rousseau: {
      doplnovacka: {
        text: "Jest menší hřích neznati {Boha}, než rouhati se mu. Člověk je od přirozenosti dobrý a kazí jej {společnost}. Ten, kdo přemýšlí, je zkažené {zvíře}. Vzdát se {svobody} znamená vzdát se lidskosti. Člověk se rodí svobodný, ale všude je v {okovech}. Bez upřímnosti je jakákoli diskuze pouhý {žvást}. Nejstarší přirozenou společností je {rodina}.",
        navic: ["církev", "příroda", "dítě", "majetku", "zajetí", "klam", "stát"]
      },
      otazky: [
        { q: "Projevil se preromantismus v díle J.-J. Rousseaua?", ano: true, v: "Rousseau je hlavní postava preromantismu." },
        { q: "Libuje si preromantismus v přírodních scenériích?", ano: true, v: "Nový vztah k přírodě." },
        { q: "Je preromantismus odklonem od racionalismu?", ano: true, v: "Cit místo rozumu." },
        { q: "Odmítá preromantismus lidovou poezii?", ano: false, v: "Naopak ji sbírá a obdivuje." },
        { q: "Je preromantismus předchůdcem romantismu?", ano: true, v: "Pre = před." },
        { q: "Upřednostňuje preromantismus pocity před rozumem?", ano: true, v: "Cit nad rozumem." },
        { q: "Opěvuje preromantismus civilizaci a pokrok?", ano: false, v: "Civilizace podle Rousseaua člověka kazí." },
        { q: "S čím má být výchova podle Rousseaua v souladu?", a: ["s přírodou", "s lidskou společností", "s církví", "se státem"], v: "Emil čili O výchově." },
        { q: "Na které Rousseauovy myšlenky navázala Velká francouzská revoluce?", a: ["svoboda, rovnost, svrchovanost lidu, zákon jako obecná vůle", "božské právo krále", "návrat ke klášterní výchově", "rozdělení společnosti na stavy"], v: "Moc pochází od lidu." },
        { q: "Co je podle Rousseaua příčinou úpadku mravů?", a: ["odklon od přirozeného života vlivem civilizace (přepych, nerovnost, marnivost)", "nedostatek víry v Boha", "nevzdělanost lidu", "příliš mnoho svobody"], v: "I vědy a umění podporují marnivost a přetvářku." },
        { q: "Kde se Rousseau narodil?", a: ["v Ženevě", "v Paříži", "v Londýně", "v Římě"], v: "Psal francouzsky, žil hlavně ve Francii." },
        { q: "Kdo další je pohřben v pařížském Panthéonu?", a: ["Voltaire, Victor Hugo, Émile Zola", "Molière, Racine, Corneille", "Goethe, Schiller, Herder", "Defoe, Swift, Milton"], v: "Také Alexandre Dumas st. a Marie Curie-Skłodowská." }
      ],
      rozbor: [
        {
          dilo: "Rozprava o původu a základech nerovnosti", autor: "rousseau",
          text: "Onen člověk, který si obsadil jistý kus pozemku, prohlásil: Tohle je mé! A našel dost prostoduchých lidí, kteří mu to uvěřili, byl skutečným zakladatelem občanské společnosti. Kolika zločinů, válek, vražd, běd a hrůz by bylo lidstvo ušetřeno, kdyby byl někdo vytrhal kůly… Jste ztraceni, jestliže zapomenete, že ovoce patří všem a země žádnému.",
          otazky: [
            { q: "Které ideály Rousseau v rozpravě prosazuje?", a: ["přirozenou rovnost a svobodu, příčinou nerovnosti je soukromé vlastnictví", "posvátnost soukromého majetku", "poslušnost vůči králi", "vládu vzdělaných nad nevzdělanými"], v: "„Ovoce patří všem a země žádnému.“" },
            { q: "Jsou jeho myšlenky aktuální i dnes?", a: ["ano, řešíme majetkovou nerovnost a nerovné příležitosti", "ne, nerovnost už neexistuje", "ne, platily jen ve středověku", "jen pro zemědělce"], v: "I vliv civilizace na přírodu." },
            { q: "Kdo je podle ukázky zakladatelem občanské společnosti?", a: ["první člověk, který si ohradil pozemek a řekl „tohle je mé“", "první král", "Bůh", "první filozof"], v: "Soukromé vlastnictví." }
          ]
        },
        {
          dilo: "O společenské smlouvě", autor: "rousseau",
          text: "Společenskou smlouvou ztrácí člověk svou přirozenou svobodu a neomezené právo na vše, co jej svádí a čeho může dosáhnout, získá občanskou svobodu a vlastnické právo ke všemu, co má… popis pouhé žádosti je otroctvím a poslušnost zákona, který jsme si sami uložili, je svobodou.",
          otazky: [
            { q: "Jaký má Rousseau názor na společenskou smlouvu?", a: ["je výhodná: člověk ztratí přirozenou svobodu, ale získá občanskou", "je špatná, člověka zotročuje", "je zbytečná, lidé mají žít bez pravidel", "má platit jen pro šlechtu"], v: "Zákony vyjadřují obecnou vůli." },
            { q: "Co jediné činí člověka pánem sebe sama?", a: ["mravní svoboda: poslušnost zákona, který si sami uložili", "majetek", "neomezená svoboda dělat cokoli", "víra v Boha"], v: "Kdo se řídí jen svou žádostí, je otrok." }
          ]
        }
      ]
    }
  },

  /* Úryvky a citáty pro „Čí je to úryvek“ (krátké, z prezentací) */
  citaty: [
    { autor: "komensky", dilo: "Kšaft umírající matky Jednoty bratrské", text: "Věřím i já Bohu, že po přejití víchřic hněvu… vláda věcí tvých k tobě se zase navrátí, ó lide český!" },
    { autor: "komensky", dilo: "citát", text: "Zahálka je polštář Satanův." },
    { autor: "komensky", dilo: "citát", text: "Šťastný národ, který má hojnost dobrých škol a dobrých knih." },
    { autor: "rousseau", dilo: "citát", text: "Vzdát se svobody znamená vzdát se lidskosti." },
    { autor: "rousseau", dilo: "citát", text: "Slovo finance je slovem otroka; je neznámé v obci." },
    { autor: "milton", dilo: "Ztracený ráj", text: "Duch člověka, který Bůh vdechl, nemůže zahynout s tělesnou schránkou." },
    { autor: "goethe", dilo: "Král duchů", text: "Můj otče, můj otče, a nyní mne jal! Ba, ublížil už mi duchů král!" },
    { autor: "stransky", dilo: "O státě českém", text: "Čech po většině s obdivem následuje všecko cizí, kdežto, co doma ve vlasti vzniká, posuzuje povýšeně a pohrdlivě." }
  ]
};
