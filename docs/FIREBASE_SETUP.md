

## 6. Napomene

### Followers Tracking

Trenutno aplikacija ne trackuje "followers" brojač aktivno. Ako želiš da implementiraš:

1. Dodaj `followers` polje u `users` kolekciju (array of user IDs)
2. Update backend `toggleFollow` endpoint da ažurira i `followers` array kod praćenog korisnika
3. Ili koristi Cloud Functions za održavanje brojača

### Likes/Views Tracking

Aplikacija trenutno ne trackuje broj lajkova/pregleda po postu. Za implementaciju:

1. Dodaj `likes` array i `likesCount` polje u `posts` dokument
2. Update backend `toggleLike` endpoint da ažurira brojač
3. Frontend komponente već imaju placeholder za ove brojače

### Report Functionality

Report modali su implementirani u UI, ali backend endpoint za reporting nije kreiran. Za implementaciju:

1. Kreiraj `reports` kolekciju u Firestore
2. Dodaj backend endpoint `/api/reports` za kreiranje reporta
3. Pove ži frontend sa backend-om

## 7. Testiranje

Nakon podešavanja:

1. Pokreni backend: `cd backend && npm run dev`
2. Pokreni frontend: `cd frontend && npm run dev`
3. Registruj test korisnika
4. Postavi proizvod
5. Testiraj chat funkcionalnost
6. Proveri da li slike uploaduju u Storage

## 8. Production Deployment

Kad deplojuješ na production:

1. **Ažuriraj CORS_ORIGIN** u backend .env sa production URL-om
2. **Ažuriraj Firestore i Storage Rules** ako je potrebno
3. **Omogući Firestore Backups** (Firebase Console > Firestore > Backups)
4. **Postavi Cloud Functions** za dodatnu logiku (ako je potrebno)
5. **Proveri Firebase Pricing** - free tier ima limite

---

✅ Nakon što podesiš sve ovo, aplikacija će biti potpuno funkcionalna!

Ako imaš pitanja ili problema, proveri Firebase Console logs ili konzolu u browser-u za greške.
