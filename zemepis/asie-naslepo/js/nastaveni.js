// js/nastaveni.js – dialog Nastavení (⚙). Použij přesně tento kód.
// Nastavení platí jen do zavření stránky. Po „Použít“ se aktuální stránka vykreslí znovu.

export function otevriNastaveni(ctx, prekresli) {
  const d = document.getElementById('nastaveni');
  const n = ctx.nastaveni;
  const volba = (jmeno, hodnota, text) =>
    `<label class="volba"><input type="radio" name="${jmeno}" value="${hodnota}" ${n[jmeno] === hodnota ? 'checked' : ''}> ${text}</label>`;
  d.innerHTML = `
    <form method="dialog" class="nastaveni-formular">
      <h2>Nastavení</h2>
      <fieldset><legend>Rozsah pojmů</legend>
        ${volba('rozsah', 'tucne', 'Jen tučné pojmy (doporučeno)')}
        ${volba('rozsah', 'vse', 'Tučné i netučné pojmy (rozšíření)')}
      </fieldset>
      <fieldset><legend>Diakritika při psaní</legend>
        ${volba('diakritika', 'tolerantni', 'Chybějící diakritika = „skoro správně“ (uznává se)')}
        ${volba('diakritika', 'prisna', 'Chybějící diakritika = chyba')}
      </fieldset>
      <fieldset><legend>Stupnice známek v testu (od kolika %)</legend>
        <div class="stupnice">
          ${[1, 2, 3, 4].map((z, i) => `<label>${z}: <input type="number" min="0" max="100" name="s${i}" value="${n.stupnice[i]}"></label>`).join('')}
        </div>
        <p class="maly">Méně než hranice pro 4 = známka 5.</p>
      </fieldset>
      <fieldset><legend>Vzhled</legend>
        ${volba('tema', 'auto', 'Podle systému')}
        ${volba('tema', 'svetle', 'Světlý')}
        ${volba('tema', 'tmave', 'Tmavý')}
      </fieldset>
      <p class="maly">Nastavení platí, dokud stránku nezavřeš. Po použití začne rozpracované kolo znovu.</p>
      <div class="radek-tlacitek">
        <button value="zrusit">Zavřít</button>
        <button value="pouzit" class="hlavni">Použít</button>
      </div>
    </form>`;
  d.onclose = () => {
    if (d.returnValue !== 'pouzit') return;
    const f = new FormData(d.querySelector('form'));
    n.rozsah = f.get('rozsah');
    n.diakritika = f.get('diakritika');
    n.tema = f.get('tema');
    const s = [0, 1, 2, 3].map((i) => Number(f.get('s' + i)));
    if (s.every((v, i) => v >= 0 && v <= 100 && (i === 0 || v < s[i - 1]))) n.stupnice = s;
    else ctx.toast('Stupnice musí klesat (např. 90, 75, 50, 30) – ponechána původní.');
    if (n.tema === 'auto') delete document.documentElement.dataset.tema;
    else document.documentElement.dataset.tema = n.tema;
    prekresli();
  };
  d.showModal();
}
