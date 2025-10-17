FROM node:18-alpine AS builder

WORKDIR /app

# Kopiranje package fajlova
COPY package*.json ./

# Instaliranje zavisnosti
RUN npm ci

# Kopiranje source koda
COPY . .

# Build TypeScript-a
RUN npm run build

# Production faza
FROM node:18-alpine

WORKDIR /app

# Kopiranje buildovanih fajlova i zavisnosti
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Kopiranje Firebase service account (mora biti prisutan tokom build-a)
COPY firebase-service-account.json ./

# Otvaranje porta
EXPOSE 5000

# Pokretanje servera
CMD ["npm", "start"]

