import { readFileSync, writeFileSync } from "node:fs";
const e = JSON.parse(readFileSync(process.argv[2], "utf8"));
const kompakt = {};
for (const [ort, d] of Object.entries(e)) {
  kompakt[ort] = {
    hoehe: d.hoehe,
    jahre: d.jahre.map(k => [k.jahr, k.hgt, k.kgt, +k.mittel.toFixed(2), k.hitzetage, k.frosttage, k.tropennaechte, k.eistage, k.sommertage]),
    v: Object.fromEntries(Object.entries(d.vergleich).map(([k, x]) => [k, [ +x.frueher.toFixed(2), +x.heute.toFixed(2), +x.trendJeJahrzehnt.toFixed(2), +x.r2.toFixed(2) ]]))
  };
}
writeFileSync(process.argv[3], JSON.stringify(kompakt));
console.log("Kompakt geschrieben:", (JSON.stringify(kompakt).length / 1024).toFixed(1), "KB");
for (const [ort, d] of Object.entries(kompakt)) {
  const v = d.v;
  console.log(ort.padEnd(10), "HGT", v.hgt[0], "→", v.hgt[1], "| KGT", v.kgt[0], "→", v.kgt[1], "| Hitzetage", v.hitzetage[0], "→", v.hitzetage[1]);
}
