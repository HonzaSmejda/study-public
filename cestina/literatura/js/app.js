/* Literatura – aplikace. Jen klikání: lekce autorů, míchané procvičování, test, opakování chyb, tahák.
   Postup se ukládá do localStorage (jen v tomto prohlížeči). */
(function () {
  "use strict";
  var D = window.LIT;
  var app = document.getElementById("app");
  var KLIC = "aprendo-literatura-v1";

  /* ---------- pomocné ---------- */
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function zamichat(p) { p = p.slice(); for (var i = p.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = p[i]; p[i] = p[j]; p[j] = t; } return p; }
  function vyber(p) { return p[Math.floor(Math.random() * p.length)]; }
  function unik(p) { return p.filter(function (x, i) { return p.indexOf(x) === i; }); }
  function obdobi(id) { return D.obdobi.filter(function (o) { return o.id === id; })[0]; }
  var autoriIds = Object.keys(D.autori);
  function autor(id) { return D.autori[id]; }
  function autoriObdobi(oid) { return autoriIds.filter(function (id) { return D.autori[id].obdobi === oid; }); }
  function zivotRoky(a) { return a.narozen ? a.narozen + "–" + (a.zemrel || "") : ""; }

  /* ---------- uložený postup ---------- */
  var S = { a: {}, chyby: [] };
  try { var ulozeno = JSON.parse(localStorage.getItem(KLIC)); if (ulozeno && ulozeno.a) S = ulozeno; if (!S.chyby) S.chyby = []; } catch (e) { /* bez úložiště to funguje taky */ }
  function uloz() { try { localStorage.setItem(KLIC, JSON.stringify(S)); } catch (e) { /* nic */ } }
  function stavAutora(id) { return S.a[id] || (S.a[id] = { kroky: {}, umim: false }); }
  function kroky(id) { return D.cviceni[id] ? 4 : 2; }
  function oznacKrok(id, k, skore) {
    var st = stavAutora(id); st.kroky[k] = skore == null ? 1 : skore;
    var n = kroky(id), hotovo = 0, soucet = 0, pocet = 0;
    for (var i = 1; i <= n; i++) { if (st.kroky[i] != null) { hotovo++; if (i > 1) { soucet += st.kroky[i]; pocet++; } } }
    st.umim = hotovo === n && (pocet === 0 || soucet / pocet >= 0.7);
    uloz();
  }
  function stitekStavu(id) {
    var st = S.a[id];
    if (st && st.umim) return '<span class="stav umim">umím</span>';
    if (st && Object.keys(st.kroky).length) return '<span class="stav rozprac">rozpracováno</span>';
    return '<span class="stav">nové</span>';
  }
  function klicOtazky(o) { return o.q + "|" + [].concat(o.spravne).join(",") + "|" + (o.uryvek ? o.uryvek.text.slice(0, 40) : ""); }
  function zapisChybu(o) { var k = klicOtazky(o); if (!S.chyby.some(function (c) { return klicOtazky(c) === k; })) S.chyby.push(o); uloz(); }
  function smazChybu(o) { var k = klicOtazky(o); S.chyby = S.chyby.filter(function (c) { return klicOtazky(c) !== k; }); uloz(); }

  /* ---------- otázky ---------- */
  function norm(o, extra) {
    var q;
    if (o.ano != null) q = { typ: "anone", q: o.q, moznosti: ["ANO", "NE"], spravne: o.ano ? "ANO" : "NE", v: o.v };
    else q = { typ: "vyber", q: o.q, moznosti: o.a.slice(), spravne: o.a[0], v: o.v };
    if (extra) for (var k in extra) q[k] = extra[k];
    return q;
  }
  function otazkyAutora(id) { var c = D.cviceni[id]; return c ? c.otazky.map(function (o) { return norm(o, { autor: id }); }) : []; }
  function rozborAutora(id) {
    var c = D.cviceni[id], out = [];
    if (c && c.rozbor) c.rozbor.forEach(function (r) { r.otazky.forEach(function (o) { out.push(norm(o, { autor: id, uryvek: { text: r.text, dilo: r.dilo } })); }); });
    return out;
  }
  function jineAutory(id, n, stejneObdobi) {
    var a = autor(id);
    var p = autoriIds.filter(function (x) { return x !== id && (!stejneObdobi || D.autori[x].obdobi === a.obdobi); });
    if (p.length < n) p = p.concat(zamichat(autoriIds.filter(function (x) { return x !== id && p.indexOf(x) < 0; })));
    return zamichat(p).slice(0, n);
  }
  function genDiloAutor(id, dilo) {
    var a = autor(id); dilo = dilo || vyber(a.dila);
    var jini = jineAutory(id, 3, Math.random() < 0.6).map(function (x) { return D.autori[x].jmeno; });
    return { typ: "vyber", q: "Kdo napsal dílo „" + dilo.nazev + "“?", moznosti: [a.jmeno].concat(jini), spravne: a.jmeno,
      v: dilo.nazev + " (" + dilo.druh + (dilo.rok ? ", " + dilo.rok : "") + "): " + dilo.popis, autor: id };
  }
  function genAutorObdobi(id) {
    var a = autor(id), o = obdobi(a.obdobi);
    return { typ: "vyber", q: "Do kterého období patří " + a.jmeno + "?", moznosti: D.obdobi.map(function (x) { return x.nazev; }), spravne: o.nazev,
      v: a.jmeno + (zivotRoky(a) ? " (" + zivotRoky(a) + ")" : "") + ": " + a.kratce, autor: id };
  }
  function genDiloObdobi(id) {
    var a = autor(id), d = vyber(a.dila), o = obdobi(a.obdobi);
    return { typ: "vyber", q: "Do kterého období patří dílo „" + d.nazev + "“?", moznosti: D.obdobi.map(function (x) { return x.nazev; }), spravne: o.nazev,
      v: "Napsal ho " + a.jmeno + ". " + o.nazev + ": " + o.kratce, autor: id };
  }
  function genAutorZeme(id) {
    var a = autor(id);
    var zeme = unik(autoriIds.map(function (x) { return D.autori[x].zeme; })).filter(function (z) { return z !== a.zeme; });
    return { typ: "vyber", q: "Ze které země je " + a.jmeno + "?", moznosti: [a.zeme].concat(zamichat(zeme).slice(0, 3)), spravne: a.zeme, v: a.kratce, autor: id };
  }
  function genZnak(oid) {
    var o = oid ? obdobi(oid) : vyber(D.obdobi);
    return { typ: "vyber", q: "Pro které období je typické: „" + vyber(o.znaky) + "“", moznosti: D.obdobi.map(function (x) { return x.nazev; }), spravne: o.nazev, v: o.nazev + " (" + o.roky + "): " + o.kratce };
  }
  function genSeradAutory(ids) {
    var p = zamichat((ids || autoriIds).filter(function (x) { return D.autori[x].narozen; }));
    var vybrane = [], roky = [];
    p.forEach(function (x) { var r = D.autori[x].narozen; if (vybrane.length < 4 && roky.every(function (y) { return Math.abs(y - r) >= 8; })) { vybrane.push(x); roky.push(r); } });
    if (vybrane.length < 3) return null;
    var serazene = vybrane.slice().sort(function (x, y) { return D.autori[x].narozen - D.autori[y].narozen; });
    return { typ: "serad", q: "Seřaď autory od nejstaršího (podle roku narození).", moznosti: vybrane.map(function (x) { return D.autori[x].jmeno; }),
      spravne: serazene.map(function (x) { return D.autori[x].jmeno; }),
      v: serazene.map(function (x) { return D.autori[x].jmeno + " " + D.autori[x].narozen; }).join(" · ") };
  }
  function genSeradDila(ids) {
    var dila = [];
    (ids || autoriIds).forEach(function (x) { D.autori[x].dila.forEach(function (d) { if (d.rok) dila.push({ nazev: d.nazev, rok: d.rok, autor: D.autori[x].jmeno }); }); });
    dila = zamichat(dila);
    var vybrane = [];
    dila.forEach(function (d) { if (vybrane.length < 4 && vybrane.every(function (y) { return Math.abs(y.rok - d.rok) >= 5; })) vybrane.push(d); });
    if (vybrane.length < 3) return null;
    var serazene = vybrane.slice().sort(function (x, y) { return x.rok - y.rok; });
    return { typ: "serad", q: "Seřaď díla od nejstaršího.", moznosti: vybrane.map(function (d) { return d.nazev; }), spravne: serazene.map(function (d) { return d.nazev; }),
      v: serazene.map(function (d) { return d.nazev + " (" + d.autor + ", " + d.rok + ")"; }).join(" · ") };
  }
  function genCiUryvek(ids) {
    var zdroje = [];
    D.citaty.forEach(function (c) { if (!ids || ids.indexOf(c.autor) >= 0) zdroje.push(c); });
    Object.keys(D.cviceni).forEach(function (id) { if (!ids || ids.indexOf(id) >= 0) (D.cviceni[id].rozbor || []).forEach(function (r) { zdroje.push({ autor: id, dilo: r.dilo, text: r.text }); }); });
    if (!zdroje.length) return null;
    var c = vyber(zdroje), a = autor(c.autor);
    var jini = jineAutory(c.autor, 3, true).map(function (x) { return D.autori[x].jmeno; });
    return { typ: "vyber", q: "Čí je to text?", uryvek: { text: c.text }, moznosti: [a.jmeno].concat(jini), spravne: a.jmeno,
      v: a.jmeno + (c.dilo && c.dilo !== "citát" ? ", " + c.dilo : "") + ". " + a.kratce, autor: c.autor };
  }
  function genProAutora(id) {
    var a = autor(id), out = a.dila.slice(0, 3).map(function (d) { return genDiloAutor(id, d); });
    out.push(genAutorObdobi(id)); out.push(genAutorZeme(id));
    return out;
  }
  function pripravit(q) { var k = {}; for (var x in q) k[x] = q[x]; if (q.typ !== "anone") k.moznosti = zamichat(unik(q.moznosti)); return k; }
  function vyplnit(fns, n) {
    var out = [], pokusy = 0, klice = {};
    while (out.length < n && pokusy < n * 8) { pokusy++; var q = vyber(fns)(); if (!q) continue; var k = klicOtazky(q); if (klice[k]) continue; klice[k] = 1; out.push(q); }
    return out;
  }
  function michane(oids, n) {
    var ids = oids ? autoriIds.filter(function (x) { return oids.indexOf(D.autori[x].obdobi) >= 0; }) : autoriIds;
    var hlavni = ids.filter(function (x) { return D.cviceni[x]; });
    var sesit = [];
    hlavni.forEach(function (x) { sesit = sesit.concat(otazkyAutora(x), rozborAutora(x)); });
    var gen = vyplnit([
      function () { return genDiloAutor(vyber(ids)); },
      function () { return genAutorObdobi(vyber(ids)); },
      function () { return genDiloObdobi(vyber(ids)); },
      function () { return genZnak(oids ? vyber(oids) : null); },
      function () { return genCiUryvek(ids); },
      function () { return genSeradAutory(ids); },
      function () { return genSeradDila(ids); }
    ], Math.ceil(n / 2));
    var zeSesitu = zamichat(sesit).slice(0, n - gen.length);
    return zamichat(zeSesitu.concat(gen)).slice(0, n);
  }

  /* ---------- kvíz ---------- */
  var kviz = null;
  function spustKviz(nastaveni) {
    kviz = { otazky: nastaveni.otazky.map(pripravit), i: 0, body: 0, odpovedi: [], test: !!nastaveni.test, rezim: nastaveni.rezim || "",
      nadpis: nastaveni.nadpis, zpet: nastaveni.zpet, hotovo: nastaveni.hotovo, hlavicka: nastaveni.hlavicka || "", poradi: [], odpovezeno: false };
    vykresliKviz();
  }
  function vykresliKviz() {
    var k = kviz;
    if (k.i >= k.otazky.length) return konecKvizu();
    var q = k.otazky[k.i];
    var h = k.hlavicka + '<div class="radek"><span class="mala">' + esc(k.nadpis) + "</span><span class=\"mala\">" + (k.i + 1) + " / " + k.otazky.length + "</span></div>";
    h += '<div class="prubeh"><i style="width:' + (k.i / k.otazky.length * 100) + '%"></i></div>';
    if (q.uryvek) h += '<blockquote class="uryvek">' + esc(q.uryvek.text) + (q.uryvek.dilo && q.q.indexOf("Kdo je autorem") < 0 ? "<cite>" + esc(q.uryvek.dilo) + "</cite>" : "") + "</blockquote>";
    h += '<p class="otazka">' + esc(q.q) + "</p>";
    if (q.typ === "serad") {
      h += '<div class="moznosti">' + q.moznosti.map(function (m, j) {
        var pos = k.poradi.indexOf(j);
        return '<button class="moznost' + (pos >= 0 ? " vybrano" : "") + '" data-serad="' + j + '">' + (pos >= 0 ? '<span class="poradi">' + (pos + 1) + "</span>" : "") + esc(m) + "</button>";
      }).join("") + "</div>";
      h += '<p class="mala">Ťukej v pořadí. Druhým ťuknutím výběr zrušíš.</p>';
    } else {
      h += '<div class="moznosti' + (q.typ === "anone" ? " anone" : "") + '">' + q.moznosti.map(function (m, j) { return '<button class="moznost" data-odp="' + j + '">' + esc(m) + "</button>"; }).join("") + "</div>";
    }
    h += '<div id="zpetna"></div>';
    h += '<div class="dole"><button class="tl hlavni" id="dalsi" ' + (q.typ === "serad" ? "disabled" : "hidden") + ">" + (q.typ === "serad" ? "Zkontrolovat" : "Další") + "</button></div>";
    app.innerHTML = h;
    k.odpovezeno = false;
  }
  function vyhodnot(spravne, vybrany) {
    var k = kviz, q = k.otazky[k.i];
    k.odpovezeno = true;
    if (spravne) k.body++;
    k.odpovedi.push({ q: q, ok: spravne, vybrano: vybrany });
    var puvodni = k.otazky[k.i];
    if (!spravne && k.rezim !== "chyby") zapisChybu(puvodni);
    if (spravne && k.rezim === "chyby") smazChybu(puvodni);
    var tl = document.getElementById("dalsi");
    tl.hidden = false; tl.disabled = false;
    tl.textContent = k.i + 1 >= k.otazky.length ? "Výsledek" : "Další";
    if (!k.test) {
      var spr = q.typ === "serad" ? q.spravne.join(" → ") : q.spravne;
      document.getElementById("zpetna").innerHTML = '<div class="vysledek ' + (spravne ? "ok" : "ne") + '"><strong>' + (spravne ? "Správně" : "Správně je: " + esc(spr)) + "</strong>" + (q.v ? esc(q.v) : "") + "</div>";
      tl.focus({ preventScroll: true });
      var zp = document.getElementById("zpetna").getBoundingClientRect(), hrana = tl.parentNode.getBoundingClientRect().top - 12;
      if (zp.bottom > hrana) window.scrollBy({ top: zp.bottom - hrana, behavior: "smooth" });
    } else {
      document.getElementById("zpetna").innerHTML = '<p class="mala">Odpověď uložena. Výsledek uvidíš na konci.</p>';
    }
  }
  app.addEventListener("click", function (e) {
    var t = e.target.closest("button"); if (!t) return;
    if (kviz && document.getElementById("dalsi")) {
      var k = kviz, q = k.otazky[k.i];
      if (t.id === "dalsi") {
        if (q.typ === "serad" && !k.odpovezeno) {
          var tip = k.poradi.map(function (j) { return q.moznosti[j]; });
          var ok = tip.join("|") === q.spravne.join("|");
          app.querySelectorAll("[data-serad]").forEach(function (b) {
            var j = +b.dataset.serad; b.disabled = true;
            b.classList.remove("vybrano"); b.classList.add(q.spravne.indexOf(q.moznosti[j]) === k.poradi.indexOf(j) ? "spravne" : "spatne");
          });
          vyhodnot(ok, tip.join(" → "));
          return;
        }
        k.i++; k.poradi = []; vykresliKviz(); window.scrollTo(0, 0); return;
      }
      if (k.odpovezeno) return;
      if (t.dataset.serad != null) {
        var j = +t.dataset.serad, pos = k.poradi.indexOf(j);
        if (pos >= 0) k.poradi.splice(pos, 1); else k.poradi.push(j);
        var y = window.scrollY; vykresliKviz(); window.scrollTo(0, y);
        document.getElementById("dalsi").disabled = k.poradi.length !== q.moznosti.length;
        return;
      }
      if (t.dataset.odp != null) {
        var m = q.moznosti[+t.dataset.odp], ok2 = m === q.spravne;
        app.querySelectorAll("[data-odp]").forEach(function (b) {
          b.disabled = true;
          if (k.test) { if (b === t) b.classList.add("vybrano"); }
          else if (q.moznosti[+b.dataset.odp] === q.spravne) b.classList.add("spravne");
          else if (b === t) b.classList.add("spatne");
        });
        vyhodnot(ok2, m);
      }
    }
  });
  function konecKvizu() {
    var k = kviz, n = k.otazky.length, pomer = n ? k.body / n : 0;
    var chyby = k.odpovedi.filter(function (o) { return !o.ok; });
    var h = k.hlavicka + '<p class="stitek">' + esc(k.nadpis) + "</p>";
    h += '<p class="skore">' + k.body + " / " + n + "</p>";
    h += '<p class="veta">' + (pomer >= 0.9 ? "Výborně, tohle umíš." : pomer >= 0.7 ? "Dobrý. Projdi si chyby níže." : "Tohle chce ještě zopakovat.") + "</p>";
    if (chyby.length) {
      var autoriChyb = unik(chyby.map(function (o) { return o.q.autor; }).filter(Boolean));
      if (k.test && autoriChyb.length) h += '<div class="blok"><strong>Kam se vrátit:</strong> ' + autoriChyb.map(function (id) { return '<a href="#/autor/' + id + '/1">' + esc(autor(id).jmeno) + "</a>"; }).join(", ") + "</div>";
      h += "<h2>Chyby</h2>";
      h += chyby.map(function (o) {
        var spr = o.q.typ === "serad" ? o.q.spravne.join(" → ") : o.q.spravne;
        return '<div class="chyba-polozka"><div>' + esc(o.q.q) + "</div>" + (o.q.uryvek ? '<div class="mala">Úryvek: ' + esc(o.q.uryvek.text.slice(0, 90)) + "…</div>" : "") +
          '<div class="mala">Tvoje odpověď: ' + esc(o.vybrano) + '</div><div class="spravna">' + esc(spr) + "</div>" + (o.q.v ? '<div class="mala">' + esc(o.q.v) + "</div>" : "") + "</div>";
      }).join("");
    }
    h += '<div class="dole"><a class="tl hlavni" href="' + k.zpet + '">' + (k.hotovo ? "Pokračovat" : "Hotovo") + "</a></div>";
    var fn = k.hotovo; kviz = null;
    if (fn) fn(pomer);
    app.innerHTML = h;
    window.scrollTo(0, 0);
  }

  /* ---------- obrazovky ---------- */
  function osa() {
    var OD = 1550, DO = 1800, sirka = DO - OD;
    function x(r) { return ((r - OD) / sirka * 100).toFixed(2) + "%"; }
    var h = '<div class="osa" aria-label="Časová osa období"><div class="osa-pas"><div class="osa-mrizka">';
    for (var r = 1600; r < DO; r += 50) h += '<span style="left:' + x(r) + '"></span>';
    h += "</div>";
    D.obdobi.forEach(function (o, i) {
      var vpravo = o.od - OD > sirka * 0.55;
      h += '<a class="osa-pruh" href="#/obdobi/' + o.id + '" style="top:' + (4 + i * 36) + "px;left:" + x(o.od) + ";width:calc(" + x(o.do) + " - " + x(o.od) + ")" +
        (vpravo ? ";justify-content:flex-end;overflow:visible" : "") + '"><span' + (vpravo ? ' style="position:absolute;right:8px"' : "") + ">" + esc(o.nazev) + "</span></a>";
    });
    var kotvy = [[1620, "Bílá hora 1620"], [1789, "revoluce 1789"]];
    kotvy.forEach(function (k) { h += '<span class="osa-kotva" style="left:' + x(k[0]) + '" title="' + esc(k[1]) + '"></span>'; });
    h += '<div class="osa-roky">';
    for (r = 1600; r < DO; r += 50) h += '<span style="left:' + x(r) + '">' + r + "</span>";
    h += '</div></div><div class="osa-legenda"><span>1618–1648 třicetiletá válka</span><span>1620 Bílá hora</span><span>1789 Francouzská revoluce</span></div></div>';
    return h;
  }

  function domu() {
    var h = "<h1>Literatura</h1><p class=\"veta\">Od baroka po preromantismus. Jen klikání, nic se nepíše.</p>";
    h += osa();
    h += "<h2>Období</h2><ul class=\"karty\">";
    D.obdobi.forEach(function (o) {
      var ids = autoriObdobi(o.id), umim = ids.filter(function (x) { return S.a[x] && S.a[x].umim; }).length;
      h += '<li><a class="karta" href="#/obdobi/' + o.id + '"><div class="radek"><strong>' + esc(o.nazev) + '</strong><span class="mala">' + esc(o.roky) + '</span></div><span class="mala">' + esc(o.kratce) + " · umím " + umim + " z " + ids.length + "</span></a></li>";
    });
    h += "</ul><h2>Procvičování</h2><div class=\"mrizka2 vic\">";
    h += '<a class="tl hlavni" href="#/procvicovani/michane">Míchané</a>';
    h += '<a class="tl" href="#/test">Test</a>';
    h += '<a class="tl" href="#/chyby">Chyby (' + S.chyby.length + ")</a>";
    h += '<a class="tl" href="#/tahak">Tahák</a></div>';
    h += '<ul class="karty" style="margin-top:10px">';
    [["osa", "Časová osa", "Seřaď autory a díla podle doby"], ["dila", "Kdo co napsal", "Dílo a jeho autor"], ["uryvky", "Čí je to text", "Poznej autora podle úryvku"], ["obdobi", "Zařaď do období", "Autor, dílo nebo znak a jeho období"]].forEach(function (p) {
      h += '<li><a class="karta" href="#/procvicovani/' + p[0] + '"><strong>' + p[1] + '</strong><span class="mala">' + p[2] + "</span></a></li>";
    });
    h += "</ul>";
    app.innerHTML = h;
  }

  function strankaObdobi(oid) {
    var o = obdobi(oid); if (!o) return domu();
    var h = '<a class="zpet" href="#/">← Časová osa</a><p class="stitek">' + esc(o.roky) + "</p><h1>" + esc(o.nazev) + '</h1><p class="veta">' + esc(o.kratce) + "</p>";
    h += '<a class="tl hlavni siroke" href="#/procvicovani/obdobi-' + oid + '">Procvičit celé období</a>';
    h += '<h2>Doba a kontext</h2><div class="blok"><ul class="body">' + o.kontext.map(function (k) { return "<li>" + esc(k) + "</li>"; }).join("") + "</ul></div>";
    h += '<h2>Znaky</h2><div class="blok"><ul class="body">' + o.znaky.map(function (k) { return "<li>" + esc(k) + "</li>"; }).join("") + "</ul></div>";
    h += "<h2>Autoři</h2>";
    var ids = autoriObdobi(oid);
    var skupiny = {};
    ids.forEach(function (id) { var a = autor(id), s = a.skupina ? a.zeme + ": " + a.skupina : a.zeme; (skupiny[s] = skupiny[s] || []).push(id); });
    var poradi = Object.keys(skupiny).sort(function (x, y) {
      var hx = skupiny[x].some(function (i) { return autor(i).hlavni; }), hy = skupiny[y].some(function (i) { return autor(i).hlavni; });
      return hy - hx;
    });
    poradi.forEach(function (s) {
      h += "<h3>" + esc(s) + '</h3><ul class="karty">';
      skupiny[s].sort(function (x, y) { return (autor(y).hlavni ? 1 : 0) - (autor(x).hlavni ? 1 : 0); }).forEach(function (id) {
        var a = autor(id);
        h += '<li><a class="karta" href="#/autor/' + id + '/1"><div class="radek"><strong>' + esc(a.jmeno) + (a.hlavni ? '<span class="hlavni-autor">sešit</span>' : "") + "</strong>" + stitekStavu(id) + '</div><span class="mala">' + esc(a.kratce) + "</span></a></li>";
      });
      h += "</ul>";
    });
    Object.keys(D.temata).forEach(function (tid) {
      var t = D.temata[tid]; if (t.obdobi !== oid) return;
      h += "<h3>" + esc(t.nazev) + '</h3><div class="blok"><ul class="body">' + t.body.map(function (b) { return "<li>" + esc(b) + "</li>"; }).join("") + "</ul></div>";
    });
    app.innerHTML = h;
  }

  function hlavickaAutora(id, krok) {
    var a = autor(id), o = obdobi(a.obdobi), n = kroky(id), st = stavAutora(id);
    var nazvy = n === 4 ? ["Seznam se", "Doplň", "Poznej", "Rozbor"] : ["Seznam se", "Procvič"];
    var h = '<a class="zpet" href="#/obdobi/' + o.id + '">← ' + esc(o.nazev) + "</a>";
    h += '<p class="stitek">' + esc(a.zeme) + (zivotRoky(a) ? " · " + zivotRoky(a) : "") + "</p><h1>" + esc(a.jmeno) + "</h1>";
    h += '<nav class="kroky' + (n === 2 ? " dva" : "") + '">' + nazvy.map(function (nz, i) {
      var k = i + 1;
      return '<a class="krok' + (st.kroky[k] != null ? " hotovo" : "") + '" href="#/autor/' + id + "/" + k + '"' + (k === krok ? ' aria-current="step"' : "") + "><b>" + (st.kroky[k] != null ? "✓" : k) + "</b>" + nz + "</a>";
    }).join("") + "</nav>";
    return h;
  }

  function seznamSe(id) {
    var a = autor(id), n = kroky(id);
    var h = hlavickaAutora(id, 1);
    h += '<p class="veta">' + esc(a.kratce) + "</p>";
    if (a.zivot) h += '<h2>Život</h2><div class="blok"><ul class="body">' + a.zivot.map(function (z) { return "<li>" + esc(z) + "</li>"; }).join("") + "</ul></div>";
    h += '<h2>Díla</h2><div class="blok">' + a.dila.map(function (d) {
      return '<div class="dilo"><strong>' + esc(d.nazev) + "</strong>" + (d.rok ? " <span class=\"mala\">" + d.rok + "</span>" : "") + '<div class="mala">' + esc(d.druh) + "</div><div>" + esc(d.popis) + "</div>" + (d.pozn ? '<div class="pozn">Poznámka: ' + esc(d.pozn) + "</div>" : "") + "</div>";
    }).join("") + "</div>";
    if (a.myslenky) h += '<h2>Myšlenky</h2><div class="blok"><ul class="body">' + a.myslenky.map(function (z) { return "<li>" + esc(z) + "</li>"; }).join("") + "</ul></div>";
    if (a.tema && D.temata[a.tema]) { var t = D.temata[a.tema]; h += "<h2>" + esc(t.nazev) + '</h2><div class="blok"><ul class="body">' + t.body.map(function (b) { return "<li>" + esc(b) + "</li>"; }).join("") + "</ul></div>"; }
    if (a.citat) h += '<p class="citat">„' + esc(a.citat) + "“</p>";
    if (a.pozn) h += '<div class="pozn">Poznámka: ' + esc(a.pozn) + "</div>";
    h += '<div class="dole"><a class="tl hlavni" href="#/autor/' + id + '/2" data-precteno="' + id + '">Mám přečteno, ' + (n === 4 ? "doplňovat" : "procvičit") + "</a></div>";
    app.innerHTML = h;
  }
  app.addEventListener("click", function (e) {
    var t = e.target.closest("[data-precteno]"); if (t) oznacKrok(t.dataset.precteno, 1);
  });

  /* Doplňovačka */
  var dopl = null;
  function doplnovacka(id) {
    var c = D.cviceni[id].doplnovacka;
    var casti = [], mezery = [];
    c.text.split(/(\{[^}]+\})/).forEach(function (p) {
      if (p.charAt(0) === "{") { mezery.push(p.slice(1, -1)); casti.push({ m: mezery.length - 1 }); } else if (p) casti.push({ t: p });
    });
    dopl = { id: id, casti: casti, mezery: mezery, stav: mezery.map(function () { return ""; }), i: 0, chyby: 0, pokusy: 0,
      banka: zamichat(unik(mezery.concat(c.navic))), pouzito: {} };
    vykresliDopl();
  }
  function vykresliDopl(y) {
    var d = dopl, h = hlavickaAutora(d.id, 2);
    h += '<p class="mala">Ťukni na slovo, které patří do žluté mezery.</p><div class="dopl-text">' + d.casti.map(function (c) {
      if (c.t) return esc(c.t);
      var s = d.stav[c.m];
      return '<span class="mezera' + (c.m === d.i && d.i < d.mezery.length ? " aktivni" : "") + (s === "ok" ? " ok" : s === "odkryto" ? " odkryto" : "") + '" id="m' + c.m + '">' + (s ? esc(d.mezery[c.m]) : "&nbsp;") + "</span>";
    }).join("") + "</div>";
    if (d.i < d.mezery.length) {
      h += '<div class="banka">' + d.banka.map(function (w, j) { return '<button class="cip" data-cip="' + j + '"' + (d.pouzito[w] ? " disabled" : "") + ">" + esc(w) + "</button>"; }).join("") + '</div><div class="dopl-misto"></div>';
    } else {
      var ok = d.stav.filter(function (s) { return s === "ok"; }).length;
      h += '<div class="vysledek ' + (ok / d.mezery.length >= 0.7 ? "ok" : "ne") + '"><strong>Hotovo: ' + ok + " z " + d.mezery.length + " napoprvé nebo napodruhé</strong>Červeně jsou mezery, které se musely odkrýt.</div>";
      h += '<div class="dole"><a class="tl hlavni" href="#/autor/' + d.id + '/3">Pokračovat na Poznej</a></div>';
    }
    app.innerHTML = h;
    if (y != null) window.scrollTo(0, y);
    var akt = document.getElementById("m" + d.i);
    if (akt) { var r = akt.getBoundingClientRect(), banka = app.querySelector(".banka"), horni = banka ? banka.getBoundingClientRect().top : window.innerHeight;
      if (r.bottom > horni - 16 || r.top < 70) window.scrollBy(0, r.top - Math.max(80, (horni - 80) / 2)); }
  }
  app.addEventListener("click", function (e) {
    var t = e.target.closest("[data-cip]"); if (!t || !dopl) return;
    var d = dopl, w = d.banka[+t.dataset.cip], spr = d.mezery[d.i];
    if (w === spr) {
      d.stav[d.i] = d.pokusy === 0 ? "ok" : "ok"; d.pouzito[w] = 1; d.i++; d.pokusy = 0;
    } else {
      d.chyby++; d.pokusy++;
      if (d.pokusy >= 2) { d.stav[d.i] = "odkryto"; d.pouzito[spr] = 1; d.i++; d.pokusy = 0; }
      else { t.classList.add("chyba"); setTimeout(function () { t.classList.remove("chyba"); }, 300); return; }
    }
    if (d.i >= d.mezery.length) { var ok = d.stav.filter(function (s) { return s === "ok"; }).length; oznacKrok(d.id, 2, ok / d.mezery.length); }
    vykresliDopl(window.scrollY);
  });

  function strankaAutora(id, krok) {
    var a = autor(id); if (!a) return domu();
    krok = Math.max(1, Math.min(kroky(id), +krok || 1));
    dopl = null; kviz = null;
    if (krok === 1) return seznamSe(id);
    if (kroky(id) === 2) {
      return spustKviz({ otazky: genProAutora(id), nadpis: "Procvič: " + a.jmeno, zpet: "#/obdobi/" + a.obdobi, hlavicka: hlavickaAutora(id, 2),
        hotovo: function (p) { oznacKrok(id, 2, p); } });
    }
    if (krok === 2) return doplnovacka(id);
    if (krok === 3) return spustKviz({ otazky: zamichat(otazkyAutora(id)), nadpis: "Poznej", zpet: "#/autor/" + id + "/4", hlavicka: hlavickaAutora(id, 3), hotovo: function (p) { oznacKrok(id, 3, p); } });
    return spustKviz({ otazky: rozborAutora(id), nadpis: "Rozbor ukázky", zpet: "#/obdobi/" + a.obdobi, hlavicka: hlavickaAutora(id, 4), hotovo: function (p) { oznacKrok(id, 4, p); } });
  }

  function procvicovani(typ) {
    var zpet = "#/", nadpis, otazky;
    if (typ === "osa") { nadpis = "Časová osa"; otazky = vyplnit([function () { return genSeradAutory(); }, function () { return genSeradDila(); }], 8); }
    else if (typ === "dila") { nadpis = "Kdo co napsal"; otazky = vyplnit([function () { return genDiloAutor(vyber(autoriIds)); }], 10); }
    else if (typ === "uryvky") { nadpis = "Čí je to text"; otazky = vyplnit([function () { return genCiUryvek(); }], 8); }
    else if (typ === "obdobi") { nadpis = "Zařaď do období"; otazky = vyplnit([function () { return genAutorObdobi(vyber(autoriIds)); }, function () { return genDiloObdobi(vyber(autoriIds)); }, function () { return genZnak(); }], 10); }
    else if (typ && typ.indexOf("obdobi-") === 0) { var oid = typ.slice(7), o = obdobi(oid); if (!o) return domu(); nadpis = "Procvičit: " + o.nazev; zpet = "#/obdobi/" + oid; otazky = michane([oid], 12); }
    else { nadpis = "Míchané procvičování"; otazky = michane(null, 12); }
    spustKviz({ otazky: otazky, nadpis: nadpis, zpet: zpet });
  }

  function test(rozsah) {
    if (!rozsah) {
      var h = '<a class="zpet" href="#/">← Časová osa</a><h1>Test</h1><p class="veta">15 otázek jako v písemce. Výsledek a vysvětlení uvidíš až na konci.</p><div class="karty" style="display:grid;gap:10px">';
      h += '<a class="tl hlavni siroke" href="#/test/vse">Všechna období</a>';
      D.obdobi.forEach(function (o) { h += '<a class="tl siroke" href="#/test/' + o.id + '">' + esc(o.nazev) + "</a>"; });
      app.innerHTML = h + "</div>";
      return;
    }
    var oids = rozsah === "vse" ? null : [rozsah];
    if (oids && !obdobi(rozsah)) return test();
    spustKviz({ otazky: michane(oids, 15), nadpis: "Test: " + (oids ? obdobi(rozsah).nazev : "všechna období"), zpet: "#/test", test: true });
  }

  function chyby() {
    if (!S.chyby.length) {
      app.innerHTML = '<a class="zpet" href="#/">← Časová osa</a><h1>Chyby</h1><p class="veta">Zatím žádné. Co pokazíš v lekci, procvičování nebo testu, objeví se tady. Když to tu pak dáš správně, zmizí to.</p>';
      return;
    }
    spustKviz({ otazky: zamichat(S.chyby).slice(0, 12), nadpis: "Opakování chyb", zpet: "#/", rezim: "chyby" });
  }

  function tahak() {
    var h = '<a class="zpet neprint" href="#/">← Časová osa</a><h1>Tahák</h1><p class="veta neprint">Celá látka na jedné stránce. <button class="tl" onclick="window.print()" style="min-height:36px;padding:4px 12px">Vytisknout</button></p>';
    D.obdobi.forEach(function (o) {
      h += "<h2>" + esc(o.nazev) + ' <span class="mala">' + esc(o.roky) + "</span></h2><p class=\"mala\">" + esc(o.znaky.slice(0, 4).join(" · ")) + "</p>";
      h += '<div style="overflow-x:auto"><table class="tahak-tab"><thead><tr><th>Autor</th><th>Díla</th></tr></thead><tbody>';
      autoriObdobi(o.id).forEach(function (id) {
        var a = autor(id);
        h += "<tr><td>" + esc(a.jmeno) + '<div class="mala">' + esc(a.zeme) + (zivotRoky(a) ? ", " + zivotRoky(a) : "") + "</div></td><td>" +
          a.dila.map(function (d) { return "<b>" + esc(d.nazev) + "</b>" + (d.rok ? " (" + d.rok + ")" : "") + ": " + esc(d.popis); }).join("<br>") + "</td></tr>";
      });
      h += "</tbody></table></div>";
    });
    app.innerHTML = h;
  }

  /* ---------- směrování ---------- */
  function route() {
    var p = (location.hash.replace(/^#\/?/, "") || "").split("/");
    kviz = null; dopl = null;
    if (p[0] === "obdobi") strankaObdobi(p[1]);
    else if (p[0] === "autor") strankaAutora(p[1], p[2]);
    else if (p[0] === "procvicovani") procvicovani(p[1]);
    else if (p[0] === "test") test(p[1]);
    else if (p[0] === "chyby") chyby();
    else if (p[0] === "tahak") tahak();
    else domu();
    window.scrollTo(0, 0);
    app.focus({ preventScroll: true });
  }
  window.addEventListener("hashchange", route);
  route();
})();
