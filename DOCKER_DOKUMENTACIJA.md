# Objašnjenje Dockerfile-ova i .dockerignore fajlova

## Dockerfile struktura

Oba servisa (backend i frontend) koriste **multi-stage build** tehniku koja omogućava kreiranje manjih production image-a. Proces se deli na dve faze: builder stage za kompajliranje koda i production stage za finalni image.

### Builder Stage

U prvoj fazi koristi se `node:18-alpine` image za kompajliranje aplikacije. Package fajlovi (`package.json`) se kopiraju pre source koda radi optimizacije Docker layer cachinga - ako se source kod promeni a dependencies ne, Docker će ponovo koristiti keširani layer sa zavisnostima. Koristi se `npm install` umesto `npm ci` jer projekat nema `package-lock.json` fajl. Nakon instalacije, `npm cache clean --force` uklanja privremene fajlove i smanjuje veličinu layer-a.

### Production Stage

Druga faza pravi finalni lightweight image koji sadrži samo kompajlirani kod i production dependencies. Iz builder stage-a se kopiraju samo potrebni fajlovi pomoću `COPY --from=builder`, što značajno smanjuje veličinu finalnog image-a.

### Razlike između Backend i Frontend Dockerfile-a

Frontend Dockerfile koristi **ARG i ENV instrukcije** za prihvatanje Firebase konfiguracijskih promenljivih tokom build procesa. `ARG` prima vrednosti sa `--build-arg` opcijom, a zatim se konvertuju u `ENV` promenljive koje Vite bundler koristi tokom kompajliranja React aplikacije. Backend ove promenljive prima kao environment variables tokom pokretanja kontejnera.

Frontend servira statičke fajlove pomoću `serve` paketa, dok backend pokreće Node.js Express server direktno sa `node dist/server.js` komandom.

## Dodatne opcije za višu ocenu

**LABEL** - Metadata koja opisuje image (maintainer, version, description). Korisno za organizaciju i dokumentaciju image-a.

**Multi-stage build** - Korišćenje builder i production faza smanjuje veličinu finalnog image-a jer se development dependencies i source fajlovi ne uključuju u production.

**Non-root korisnik** - Kreiranje posebnog `nodejs` korisnika (UID 1001) i pokretanje aplikacije pod njim (`USER nodejs`) povećava sigurnost jer aplikacija nema root privilegije.

**HEALTHCHECK** - Automatska provera zdravlja kontejnera. Docker periodično poziva health endpoint i restartuje kontejner ako ne odgovara. Backend proverava `/api/health`, frontend koristi Node.js `http.get` za proveru dostupnosti porta 3000.

**ENTRYPOINT sa dumb-init** - `dumb-init` je lightweight init sistem koji pravilno rukuje signalima (SIGTERM, SIGINT) i omogućava graceful shutdown kontejnera. Instalira se sa `apk add --no-cache dumb-init`.

**--chown opcija** - Postavlja vlasništvo fajlova direktno tokom kopiranja (`COPY --from=builder --chown=nodejs:nodejs`), što je efikasnije od naknadne promene vlasništva.

**npm cache clean** - Briše npm cache nakon instalacije zavisnosti, smanjujući veličinu Docker layer-a.

**ENV promenljive** - Postavljanje default vrednosti za NODE_ENV i PORT.

## .dockerignore fajl

`.dockerignore` funkcioniše slično kao `.gitignore` - definiše koje fajlove i direktorijume Docker ne treba da kopira tokom build procesa. Oba servisa ignorišu `node_modules` (jer se rebuiluju u image-u), `dist` i `build` direktorijume, `.env` fajlove, `.git` folder, dokumentaciju, IDE fajlove, test fajlove i logove. Ovo ubrzava build proces i smanjuje veličinu build context-a koji se šalje Docker daemon-u.
