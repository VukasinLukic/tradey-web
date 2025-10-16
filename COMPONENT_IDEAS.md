# Ideje za frontend komponente (za Claude Code)

Ovaj dokument služi kao detaljan vodič za implementaciju `Marketplace` stranice i `Profile Page` komponenti, uzimajući u obzir postojeći `Masterplan`, `Roles` i `Design Guidelines` projekta TRADEY, kao i dostavljene vizuelne reference.

Cilj je razviti ove komponente sa fokusom na minimalistički, "editorial" dizajn, visok UX i angažman korisnika.

---

## 1. `/marketplace` Stranica

### Osnovni Koncept (Ponovljeno)
Javni prostor gde su prikazani svi proizvodi koje su korisnici objavili. Dizajn je minimalistički, inspirisan "lookbook" slikom – grid proizvoda, beli background, tanki fontovi, minimalistična navigacija. Svi proizvodi imaju sliku artikla, naziv, kratki opis, veličinu, tip odeće, profil sliku i ime korisnika (klik vodi na njegov profil).

**Funkcionalnosti:**
*   Filter traka sa dropdown-ovima: Stil | Veličina | Tip odeće | Boja | Stanje (novo / korišćeno)
*   Pretraga po tekstu (ime proizvoda, opis, tagovi, korisnik).
*   Klik na artikal → otvara “detalj proizvoda” (single item view).
*   Klik na Kontaktiraj → otvara chat, automatski šalje poruku: "Hej, zainteresovana/zainteresovan sam za [product title] (link). Možemo dogovoriti razmenu?"
*   Chat je povezan sa korisnikom koji je objavio proizvod.
*   Paginacija: 20 proizvoda po strani.
*   Backend: Firestore kolekcije `/posts`, `/users`, `/chats` i povezani API.

### Prihvaćene Dodatne Ideje za `/marketplace`

1.  **"Trending" ili "Featured" sekcija na vrhu (Landing Page inspiracija)**
    *   **Ideja:** Mala, rotirajuća ili fiksna sekcija na vrhu `/marketplace` stranice koja prikazuje 3-5 "trending" ili "featured" proizvoda.
    *   **Objašnjenje:** Koristiti `likedPosts` brojač sa backend-a za "trending" logiku.
    *   **Dizajn:** Minimalistički karusel ili manji grid, inspirisan hero sekcijom sa Landing Page-a (`masterplan.md`), ali prilagođen "lookbook" estetici.

2.  **"Save Post" / "Add to Liked" opcija direktno na kartici proizvoda**
    *   **Ideja:** Brza opcija "like" ili "save" (srce/zvezda ikonica) direktno na kartici proizvoda u gridu.
    *   **Objašnjenje:** Smanjuje broj klikova za akciju, podstiče bržu interakciju i popunjava "Sačuvani artikli" (`/liked` ruta iz `roles.md`).
    *   **Dizajn:** Mala, diskretna ikonica (srce ili bookmark) u uglu kartice, koja menja boju kada je aktivna.

3.  **Indikator dostupnosti proizvoda na kartici**
    *   **Ideja:** Mali vizuelni indikator na kartici proizvoda koji pokazuje da li je artikal dostupan za razmenu (`isAvailable` polje iz `masterplan.md`).
    *   **Objašnjenje:** Korisnici odmah znaju status, sprečava frustraciju.
    *   **Dizajn:** Može biti zelena/crvena tačka, ili siva overlay traka preko slike ako nije dostupan.

4.  **Brza pretraga/filter traka koja se lepi pri skrolovanju (Sticky Filter Bar)**
    *   **Ideja:** Filter traka i tekstualna pretraga postaju "sticky" na vrhu ekrana kada korisnik skroluje.
    *   **Objašnjenje:** Poboljšava upotrebljivost, održavajući opcije pretrage uvek dostupnim, posebno na mobilnim uređajima.
    *   **Dizajn:** Diskretna traka koja se lepi na vrh, sa minimalnim senkama kako bi zadržala minimalistički izgled.

5.  **Prikaz broja "Likes" ili "Views" (ako je relevantno) na kartici proizvoda**
    *   **Ideja:** Prikaz malog broja "lajkova" ili "pregleda" ispod svakog proizvoda na kartici.
    *   **Objašnjenje:** Stvara osećaj popularnosti, podstiče interakciju (društveni dokaz).
    *   **Dizajn:** Minimalistički prikaz (npr. ikonica srca + broj), neupadljivo, uklapa se u tanak font i beli background.

6.  **Backend optimizacija za pretragu (Full-text search)**
    *   **Ideja:** Razmotriti integraciju sa servisima kao što su Algolia/MeiliSearch ili custom rešenje za full-text pretragu.
    *   **Objašnjenje:** Poboljšava robusnost i brzinu pretrage po "ime proizvoda, opis, tagovi, korisnik".

7.  **"Povezani proizvodi" sekcija na "detalj proizvoda" stranici**
    *   **Ideja:** Predlaganje povezanih proizvoda (na osnovu istog autora, sličnih tagova, veličine ili kategorije) na stranici sa detaljima o proizvodu.
    *   **Objašnjenje:** Podstiče dalje istraživanje i zadržavanje korisnika.
    *   **Dizajn:** Mali grid sličnih proizvoda ispod glavnog prikaza, sa naslovom "More like this" ili "From the same user".

8.  **Dugme "Report" za neprikladan sadržaj na "detalj proizvoda"**
    *   **Ideja:** Lako dostupno dugme za prijavu neprikladnog sadržaja na stranici sa detaljima o proizvodu.
    *   **Objašnjenje:** Olakšava moderaciju sadržaja i održava platformu sigurnom.
    *   **Dizajn:** Diskretna ikonica (zastavica ili tri tačke menija) koja otvara modal.

9.  **Vizuelna oznaka za "New Arrivals" (Novi proizvodi)**
    *   **Ideja:** Mali, vizuelno privlačan baner ili "tag" na karticama proizvoda koji su nedavno objavljeni (u poslednja 24-48h).
    *   **Objašnjenje:** Podstiče korisnike da redovno posećuju marketplace. Koristi `createdAt` polje.
    *   **Dizajn:** Diskretan, stilizovan tekst "NEW" ili "NOVO" u uglu kartice, možda sa suptilnom animacijom.

10. **"Empty State" ilustracija i sugestija**
    *   **Ideja:** Prijateljska ilustracija (npr. prazan garderober) i sugestije ako pretraga/filteri ne vrate rezultate.
    *   **Objašnjenje:** Sprečava frustraciju korisnika, daje smernice i podstiče na akciju (proširi pretragu, objavi nešto).
    *   **Dizajn:** Minimalistička ilustracija sa kratkim tekstom i CTA.

11. **Vizuelni indikatori za stanje proizvoda ("Condition")**
    *   **Ideja:** Mali vizuelni "badge" ili ikonica na kartici proizvoda koja simbolizuje stanje (npr. tri zvezdice za "novo", dve za "korišćeno").
    *   **Objašnjenje:** Brza vizuelna informacija o stanju.
    *   **Dizajn:** Diskretna ikonica ili mali tekstualni badge sa ikonicom (npr. "✨ Novo" ili "♻️ Korišćeno").

12. **"Share" opcija za proizvode**
    *   **Ideja:** Dugme "Share" na stranici sa detaljima proizvoda za deljenje linka.
    *   **Objašnjenje:** Povećava vidljivost proizvoda i aplikacije.
    *   **Dizajn:** Standardna ikonica za deljenje koja otvara dijalog.

---

### Dizajn referenca za `/marketplace`:
Referenca je "lookbook" slika, sa fokusom na grid prikaz, beli background, tanke fontove i minimalističnu navigaciju. Kartice proizvoda treba da budu čiste i vizuelno privlačne.

---

## 2. `Profile Page` (Moj profil i Javni profil korisnika)

### Osnovni Koncept (Ponovljeno)
*   **`/profile` (Moj profil):** Moji artikli (grid), Link ka "Postavi novi" + "Poruke", Edit/delete opcije po kartici.
*   **`/user/:id` (Javni profil korisnika):** Njihovi artikli, Dugme za praćenje / otpraćenje.
*   **Podaci:** `username, email, avatarUrl, bio, location, following[], likedPosts[], createdAt, role`

### Prihvaćene Dodatne Ideje za `Profile Page`

1.  **Isticanje "Bio" i "Location" (Jači vizuelni identitet)**
    *   **Ideja:** Više prostora i lepša tipografija za korisničku "bio" i "lokaciju" odmah ispod imena i avatara.
    *   **Objašnjenje:** Omogućava korisnicima da izraze svoju ličnost.
    *   **Dizajn:** Veći font za `bio`, ikona lokacije uz grad/državu, inspirisano "John Doe" profilnom slikom.

2.  **"Following" / "Followers" brojači (Socijalni dokaz)**
    *   **Ideja:** Pored dugmeta "Follow / Unfollow", prikažite brojeve "Following" i "Followers". Može biti klikabilno.
    *   **Objašnjenje:** Pruža socijalni dokaz, podstiče interakciju.
    *   **Dizajn:** Mali, jasno vidljivi brojači, slično brojevima ispod imena na referentnoj "John Doe" profilnoj slici.

3.  **"Empty State" za "Moji artikli" / "Njihovi artikli"**
    *   **Ideja:** Ako korisnik nema objavljenih artikala, prikažite poruku i CTA dugme.
    *   **Objašnjenje:** Sprečava prazan osećaj stranice, podstiče na akciju.
    *   **Dizajn:** Minimalistička ilustracija/ikona, kratak tekst i CTA.

4.  **"Recently Liked" ili "Saved" sekcija (za Moj profil)**
    *   **Ideja:** Mala, opciona sekcija koja prikazuje 3-5 poslednjih lajkovanih/sačuvanih artikala.
    *   **Objašnjenje:** Podseća korisnika na njegove interese.
    *   **Dizajn:** Manji grid ili karusel kartica.

5.  **Brzi "Edit Profile" dugme (za Moj profil)**
    *   **Ideja:** Jasno vidljivo dugme "Edit Profile" koje vodi na stranicu za uređivanje profila.
    *   **Objašnjenje:** Olakšava korisnicima da ažuriraju svoje podatke.
    *   **Dizajn:** Diskretno dugme, možda samo ikonica olovke, da ne naruši minimalistički dizajn, pozicionirano slično dugmadima na "John Doe" slici.

6.  **"Report User" dugme (za Javni profil korisnika)**
    *   **Ideja:** Opcija za prijavu neprikladnog profila ili ponašanja na javnom profilu.
    *   **Objašnjenje:** Održava platformu sigurnom.
    *   **Dizajn:** Diskretna ikonica (zastavica ili tri tačke menija) u gornjem desnom uglu profila, otvara modal.

7.  **Prikaz "Roles" (za Admin/Moderatore)**
    *   **Ideja:** Mala oznaka pored imena korisnika (npr. "Admin" ili "Moderator") ako ima tu ulogu.
    *   **Objašnjenje:** Jasno identifikuje uloge.
    *   **Dizajn:** Mali, diskretan badge pored imena.

---

### Dizajn referenca za `Profile Page`:
Referenca je "John Doe" profilna slika. Fokusirati se na čist raspored, centralizovan avatar i ime, jasno istaknutu "bio" sekciju, i grupisane, ali diskretne interaktivne elemente. Ideje za "Following"/"Followers" brojače i "Edit Profile" dugme treba da budu inspirisane rasporedom i stilom interaktivnih elemenata na referentnoj slici.

---

## Opšte Dizajnerske Smernice za Claude Code

Prilikom implementacije, Claude Code treba da se pridržava sledećih principa iz `masterplan.md`, `roles.md` i `design_guide_lines.md`:

*   **Vizuelni stil:** FaytePixelTest-Soft za naslove, Avara za tekst, definisana paleta boja (`#5A0717`, `#95B1C7`, `#FFFDEF`, `#1A0905`).
*   **Ton i identitet:** Buntovno, pozitivno, održivo, direktno, empatično, gotička i kul estetika. Sajt je na engleskom jeziku.
*   **Layout:** Mobile-first, grid-based layout, `min-w-0` i `overflow-auto`.
*   **Pristupačnost:** Minimalne interaktivne zone 44x44px, `focus`, `aria-*`, `role=` atributi, testiranje sa tastaturom i screen reader-om, kontrast teksta min AA.
*   **Animacije:** Framer Motion za mikroanimacije, Tailwind `transition`, `duration-*`, `ease-*`, poštovanje `prefers-reduced-motion`.
*   **Performanse:** Lazy loading slika.

Očekuje se implementacija koristeći React 19, TypeScript, Vite i Tailwind CSS 4.
