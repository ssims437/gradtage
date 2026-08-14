import { readFileSync, writeFileSync, readdirSync } from "node:fs";

const ORDNER = new URL(".", import.meta.url).pathname.replace(/^\//, "");

/* Heizgradtage nach österreichischer Konvention (HGT 20/12):
   Ein Tag zählt, wenn das Tagesmittel unter der Heizgrenze von 12 °C liegt.
   Beitrag ist die Differenz zwischen Raumtemperatur 20 °C und Tagesmittel.
   Kühlgradtage analog mit Basis 18,3 °C (ASHRAE 65 °F). */
const HEIZGRENZE = 12, RAUM = 20, KUEHLBASIS = 18.3;

function jahresKennzahlen(tage) {
  const jahre = new Map();
  for (const t of tage) {
    const j = +t.datum.slice(0, 4);
    if (!jahre.has(j)) jahre.set(j, {
      jahr: j, n: 0, summeMittel: 0,
      hgt: 0, kgt: 0,
      frosttage: 0, eistage: 0, sommertage: 0, hitzetage: 0, tropennaechte: 0
    });
    const k = jahre.get(j);
    k.n++;
    k.summeMittel += t.mittel;
    if (t.mittel < HEIZGRENZE) k.hgt += RAUM - t.mittel;
    if (t.mittel > KUEHLBASIS) k.kgt += t.mittel - KUEHLBASIS;
    if (t.min < 0) k.frosttage++;
    if (t.max < 0) k.eistage++;
    if (t.max >= 25) k.sommertage++;
    if (t.max >= 30) k.hitzetage++;
    if (t.min >= 20) k.tropennaechte++;
  }
  return [...jahre.values()]
    .filter(k => k.n >= 360)                       // nur vollständige Jahre
    .map(k => ({ ...k, mittel: k.summeMittel / k.n, hgt: Math.round(k.hgt), kgt: Math.round(k.kgt) }))
    .sort((a, b) => a.jahr - b.jahr);
}

// Lineare Regression: Steigung je Jahr, plus Bestimmtheitsmaß
function trend(punkte) {
  const n = punkte.length;
  const mx = punkte.reduce((s, p) => s + p.x, 0) / n;
  const my = punkte.reduce((s, p) => s + p.y, 0) / n;
  let sxy = 0, sxx = 0, syy = 0;
  for (const p of punkte) {
    sxy += (p.x - mx) * (p.y - my);
    sxx += (p.x - mx) ** 2;
    syy += (p.y - my) ** 2;
  }
  const steigung = sxy / sxx;
  const r2 = syy === 0 ? 0 : (sxy * sxy) / (sxx * syy);
  return { steigung, achse: my - steigung * mx, r2 };
}

const mittelwert = (a) => a.reduce((s, v) => s + v, 0) / a.length;

const ergebnis = {};
for (const datei of readdirSync(ORDNER).filter(f => f.endsWith(".json") && f !== "ergebnis.json")) {
  const roh = JSON.parse(readFileSync(ORDNER + datei, "utf8"));
  const d = roh.daily;
  const tage = d.time.map((datum, i) => ({
    datum,
    mittel: d.temperature_2m_mean[i],
    min: d.temperature_2m_min[i],
    max: d.temperature_2m_max[i]
  })).filter(t => t.mittel !== null && t.min !== null && t.max !== null);

  const jahre = jahresKennzahlen(tage);
  const frueh = jahre.filter(k => k.jahr >= 1985 && k.jahr <= 1994);
  const spaet = jahre.filter(k => k.jahr >= 2015 && k.jahr <= 2024);

  const kennzahl = (feld) => ({
    frueher: mittelwert(frueh.map(k => k[feld])),
    heute: mittelwert(spaet.map(k => k[feld])),
    trendJeJahrzehnt: trend(jahre.map(k => ({ x: k.jahr, y: k[feld] }))).steigung * 10,
    r2: trend(jahre.map(k => ({ x: k.jahr, y: k[feld] }))).r2
  });

  ergebnis[datei.replace(".json", "")] = {
    hoehe: roh.elevation,
    jahre,
    vergleich: {
      mittel: kennzahl("mittel"),
      hgt: kennzahl("hgt"),
      kgt: kennzahl("kgt"),
      frosttage: kennzahl("frosttage"),
      eistage: kennzahl("eistage"),
      sommertage: kennzahl("sommertage"),
      hitzetage: kennzahl("hitzetage"),
      tropennaechte: kennzahl("tropennaechte")
    }
  };
}

writeFileSync(ORDNER + "ergebnis.json", JSON.stringify(ergebnis, null, 1));

// Konsolenbericht
for (const [ort, e] of Object.entries(ergebnis)) {
  const v = e.vergleich;
  const zeile = (name, k, einheit, stellen = 1) =>
    `  ${name.padEnd(16)} ${k.frueher.toFixed(stellen).padStart(8)} → ${k.heute.toFixed(stellen).padStart(8)} ${einheit.padEnd(4)}` +
    ` (${(k.heute - k.frueher >= 0 ? "+" : "")}${(k.heute - k.frueher).toFixed(stellen)}, ` +
    `Trend ${(k.trendJeJahrzehnt >= 0 ? "+" : "")}${k.trendJeJahrzehnt.toFixed(stellen)}/Jahrzehnt, R² ${k.r2.toFixed(2)})`;
  console.log(`\n=== ${ort} (${e.hoehe} m) · ${e.jahre.length} vollständige Jahre ===`);
  console.log("  Vergleich 1985–1994 gegen 2015–2024");
  console.log(zeile("Jahresmittel", v.mittel, "°C"));
  console.log(zeile("Heizgradtage", v.hgt, "Kd", 0));
  console.log(zeile("Kühlgradtage", v.kgt, "Kd", 0));
  console.log(zeile("Frosttage", v.frosttage, "d"));
  console.log(zeile("Eistage", v.eistage, "d"));
  console.log(zeile("Sommertage", v.sommertage, "d"));
  console.log(zeile("Hitzetage", v.hitzetage, "d"));
  console.log(zeile("Tropennächte", v.tropennaechte, "d"));
  const heizErsparnis = (1 - v.hgt.heute / v.hgt.frueher) * 100;
  console.log(`  → Heizbedarf rechnerisch ${heizErsparnis.toFixed(1)} % geringer als vor 30 Jahren`);
  console.log(`  → Kühlbedarf ${(v.kgt.heute / v.kgt.frueher).toFixed(2)}-fach`);
}
