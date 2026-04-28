<!--
  Filnavn: README.md
  Formål: Prosjektbeskrivelse, brukerveiledning og videreutviklingsplan for Sannsynlighetslab.
  Versjon: 0.1.0
-->

# Sannsynlighetslab

**Sannsynlighetslab** er en interaktiv web-app for undervisning i kombinatorikk og sannsynlighet.

Appen er laget som et demo-verktøy for klasserommet, der læreren kan vise simuleringer, stille spørsmål og sammenligne teoretisk sannsynlighet med eksperimentelle resultater.

---

## Innhold i første versjon

Appen inneholder disse modulene:

1. **Myntkast**
   - Simuler mange myntkast.
   - Sammenlign antall kron og mynt.
   - Diskuter teoretisk og eksperimentell sannsynlighet.

2. **Terningkast**
   - Kast én eller to terninger.
   - Vis fordeling av summer.
   - Demonstrer hvorfor noen summer er mer sannsynlige enn andre.

3. **Trekking med og uten tilbakelegging**
   - Trekk fargede kuler fra en pose.
   - Sammenlign avhengige og uavhengige hendelser.
   - Se hvordan sannsynligheten endrer seg uten tilbakelegging.

4. **Antrekk og kombinasjoner**
   - Bruk multiplikasjonsprinsippet.
   - Beregn antall mulige antrekk fra ulike kategorier.

5. **Koder og passord**
   - Vis hvor raskt antall muligheter vokser.
   - Beregn antall mulige koder ut fra antall tegn og symboler.

6. **Rekkefølge eller ikke**
   - Sammenlign kombinasjoner og permutasjoner.
   - Vis når rekkefølge betyr noe.

---

## Foreslått filstruktur

```text
sannsynlighetslab/
│
├── index.html
├── README.md
│
├── css/
│   └── style.css
│
└── js/
    └── app.js
