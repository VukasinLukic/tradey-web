# TRADEY – App Flow, Pages, and Roles

## Core Pages & Routes

### Public Routes

* `/` – **Landing Page**

  * Brendirana animirana hero sekcija
  * Istaknuti proizvodi (carousel ili grid)
  * CTA za login/signup

* `/login`, `/signup` – **Autentifikacija**

  * Forme sa Zod/Yup validacijom
  * Google OAuth dugme (opciono)

* `/item/:id` – **Pregled Artikla**

  * Slike, opis, tagovi
  * Dugme za pokretanje chata

### Protected Routes

* `/profile` – **Profil korisnika**

  * Moji artikli (grid)
  * Link ka „Postavi novi“ + „Poruke“
  * Edit/delete opcije po kartici

* `/chat` – **Inbox/razgovori**

  * Lista razgovora
  * Chat UI (per item/per user)

* `/liked` – **Sačuvani artikli**

  * Grid pregleda sa mogućnošću uklanjanja

* `/following` – **Feed**

  * Artikli korisnika koje pratiš
  * Scrollable, sa like i chat opcijama

* `/user/:id` – **Javni profil korisnika**

  * Njihovi artikli
  * Dugme za praćenje / otpraćenje

---

## User Roles & Access

### Public Visitors

* Pristup: Landing, login, signup, pojedinačni artikli
* Nema pristup čuvanju, lajkovanju ili chatu

### Authenticated Users

* Pristup svim zaštićenim rutama
* Postavljanje, brisanje, uređivanje artikala
* Čuvanje artikala, pokretanje i nastavak chatova
* Praćenje/otpraćenje korisnika

---

## App Flow (User Journey)

1. **Posetilac dolazi na landing** → vidi proizvode → klikne CTA
2. **Registruje se ili loguje**
3. **Ulazi u profil** → postavlja svoj prvi artikal
4. **Gleda artikle drugih** → lajkuje, započinje chat
5. **Prati korisnike** → dobija feed
6. **Prati razmenu u chat-u** i dogovara

---

## Navigacija

* Responsive navbar sa:

  * Logo (link ka `/`)
  * Ako nije logovan: Login/Signup
  * Ako je logovan: `Profil`, `Sačuvani`, `Poruke`, `Feed`
  * Hamburger meni na mobilnom (Tailwind `md:hidden`, `drawer` pattern)
