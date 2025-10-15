# TRADEY – Design Guidelines

## Visual Style

### Fonts

* **Naslovni font:** Anton – debeo, geometrijski, odlučan. Koristi se za hero sekcije, CTA-ove, bannere.
* **Tekstualni font:** EB Garamond / Cormorant Garamond – serifni, „gotički“ stil za opise, pomoćne informacije i mikrocopy.

### Boje (Brand Colors)

| Element          | Boja         | HEX kod | Značenje                        |
| ---------------- | ------------ | ------- | ------------------------------- |
| Primarna Crvena  | Tamno crvena | #a61f1e | Strast, akcija, energija        |
| Sekundarna Plava | Svetloplava  | #a2c8ff | Svežina, poverenje, kontrast    |
| Pozadinska Crna  | Crna         | #000000 | Minimalizam, oštrina, identitet |

### Ton i Identitet

* Buntovno, ali pozitivno
* Održivost bez moralizovanja
* Direktan jezik, ali empatičan i prijateljski
* Poruke tipa: „Menjaj, ne bacaj.“, „Tvoja stara jakna je nečiji novi stil."

## Page Layout Principles

* Mobile-first struktura
* Grid-based layout uz `gap`, `grid-cols-*`, `flex-wrap`
* `min-w-0` i `overflow-auto` za sprečavanje raspada layout-a
* Sve interaktivne zone min 44x44px (tap targets)
* CTA dugmad vidljiva, jasna, dostupna
* Pristupačnost kroz `focus`, `aria-*`, `role=` atribute

## Animacije i Interaktivnost

* Landing: Framer Motion za hero sekciju, fade-in za proizvode
* Tailwind `transition`, `duration-*`, `ease-*` za glatke promene
* Poštovanje `prefers-reduced-motion`
* Lazy load za slike (performance boost)
* Interakcije: like, hover na karticama, postavljanje predmeta

## Accessibility & Mobile Notes

* Testirati sa tastaturom i screen reader-om
* Fleksibilni layout-i (auto height, `min-w-0` i `flex-basis` logika)
* Skrolabilne liste (`overflow-x-scroll`) za mobilne viewe
* Kontrast teksta min AA, poželjno AAA

## Brend Ton

* Savremen, buntovan, ali inkluzivan
* Glavna poruka: „Ne moraš da kupiš nešto novo da bi izgledao novo.“
