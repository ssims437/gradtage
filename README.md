# Gradtage

41 Jahre Tagestemperaturen für **Wien, Graz und Innsbruck**, ausgewertet als Heiz- und
Kühlgradtage. Kein Kommentar zum Klima, sondern die Zahl, mit der Gebäude ausgelegt werden —
und was sich daran seit 1985 geändert hat.

### → [Öffnen](https://ssims437.github.io/gradtage/)

Eine einzelne HTML-Datei. Kein Build, keine Bibliothek, nichts verlässt den Browser.

---

## Der Befund

Jahrzehnt 2015–2024 gegenüber 1985–1994, über die drei Städte gemittelt:

| | 1985–1994 | 2015–2024 | |
|---|---|---|---|
| Jahresmittel | 9,2 °C | **11,0 °C** | +1,8 K |
| Heizgradtage | 3 544 | **3 022** | **−14,7 %** |
| Kühlgradtage | 147 | **271** | **+84 %** |
| Eistage | 18,7 | **6,2** | −12,5 Tage |

Je Stadt fällt es unterschiedlich aus:

| | Heizgradtage | Kühlgradtage | Hitzetage (ab 30 °C) | Tropennächte |
|---|---|---|---|---|
| **Wien** | 3 246 → 2 828 | 235 → 380 | 12,3 → 22,7 | 4,2 → **12,9** |
| **Graz** | 3 642 → 3 172 | 110 → 229 | 2,5 → 8,9 | 0,2 → 1,1 |
| **Innsbruck** | 3 745 → 3 067 | 97 → 203 | 2,1 → **12,8** | 0,0 → 0,9 |

Innsbruck ist der auffälligste Fall: aus zwei Hitzetagen im Jahr sind fast dreizehn geworden,
mit R² 0,51 — also ein stetiger Trend, kein Ausreißerjahr. Und Wien hat heute im Schnitt
**dreimal so viele Tropennächte**, also Nächte, in denen Gebäude nicht mehr auskühlen.

## Warum die Entlastung keine ist

Der Heizbedarf sinkt um 13 bis 18 Prozent — das klingt nach Ersparnis. Der Kühlbedarf steigt
aber nicht anteilig, sondern **auf das Doppelte**, und er trifft eine andere Infrastruktur:
geheizt wird mit Gas, Pellets oder Wärmepumpe, gekühlt ausschließlich mit Strom — und zwar
dann, wenn alle gleichzeitig kühlen.

In absoluten Gradtagen bleibt der Heizanteil weit größer: In Wien stehen rund 2 830
Heizgradtagen etwa 380 Kühlgradtage gegenüber. Der Zuwachs bei den Tropennächten betrifft
aber genau die Nächte, in denen Gebäude nicht mehr auskühlen — in Pflegeheimen und
Krankenhäusern ein Planungsthema, kein Komfortthema.

## Wie gerechnet wird

**Heizgradtage** nach österreichischer Konvention `HGT 20/12`: Ein Tag zählt, wenn das
Tagesmittel unter der Heizgrenze von 12 °C liegt; sein Beitrag ist die Differenz zwischen
20 °C Raumtemperatur und dem Tagesmittel. **Kühlgradtage** analog mit der Basis 18,3 °C.
Ein Jahr geht nur ein, wenn mindestens 360 Tage vorliegen.

Verglichen werden zwei Jahrzehnte statt einzelner Jahre, weil einzelne Jahre stark schwanken.
Die Trendgerade nutzt alle 41 Werte; **R²** sagt, wie gut sie die Streuung erklärt.

```
daten/auswerten.mjs     Tagesdaten → Jahreskennzahlen, Trends, Jahrzehntvergleich
daten/kompakt.mjs       Kennzahlen → das JSON, das in der Seite steckt
daten/kennzahlen.json   das Ergebnis (5 KB, in index.html eingebettet)
```

Die Rohdaten (rund 45 000 Tageswerte, 1,2 MB) liegen nicht im Repo — sie lassen sich mit einem
Aufruf je Stadt neu ziehen:

```
https://archive-api.open-meteo.com/v1/archive
  ?latitude=48.2082&longitude=16.3738
  &start_date=1985-01-01&end_date=2025-12-31
  &daily=temperature_2m_mean,temperature_2m_min,temperature_2m_max
  &timezone=Europe%2FVienna
```

## Was diese Zahlen nicht sind

**Keine Stationsmessung**, sondern ERA5-Reanalyse — ein Rasterprodukt. Lokale Effekte wie die
Wiener Innenstadt-Wärmeinsel sind darin geglättet; die echte Innenstadt hat mehr Tropennächte
als hier steht.

**Keine Verbrauchsrechnung.** Gradtage sind der klimatische Anteil. Dämmstandard, Nutzung und
Anlagentechnik wirken auf den tatsächlichen Verbrauch stärker als das Wetter.

**Salzburg fehlt**, weil die Schnittstelle beim vierten Abruf ins Rate-Limit lief. Drei Städte
decken Ost, Süd und West ab; die Aussage hängt nicht an der vierten.

## Farben

Die beiden Serienfarben sind nicht nach Gefühl gewählt: Ocker `#B5651D` für Heizen, Türkis
`#0090A0` für Kühlen bestehen die Prüfung auf Farbfehlsichtigkeit (ΔE 17,1 bei Deuteranopie),
Chroma-Untergrenze und Kontrast gegen die Fläche. Der Dunkelmodus hat eigene, ebenfalls
geprüfte Stufen (`#C07C36` / `#00A0B0`) — keine automatische Umkehr.

Die drei Städte sind als kleine Vielfache getrennt statt über eine dritte Farbe codiert, mit
gleicher Skala je Spalte, damit die Höhen vergleichbar bleiben.

## Lizenz

[MIT](LICENSE). Daten: ERA5 über [Open-Meteo](https://open-meteo.com/), abgerufen am
14. August 2026.

Verwandt: [Plotterblätter](https://github.com/ssims437/plotterblaetter) ·
[Redundanz](https://github.com/ssims437/redundanz) ·
[Reparatur](https://github.com/ssims437/reparatur) ·
[Würfel](https://github.com/ssims437/wuerfel) ·
[Rechenwerk](https://github.com/ssims437/rechenwerk) ·
[Nachkomma](https://github.com/ssims437/nachkomma) ·
[Zeitsprung](https://github.com/ssims437/zeitsprung) ·
[Stimmführung](https://github.com/ssims437/stimmfuehrung) ·
[Verzerrung](https://github.com/ssims437/verzerrung)
