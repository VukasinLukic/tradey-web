FROM node:18-alpine AS builder

WORKDIR /app

# Kopiranje package fajlova
COPY package*.json ./

# Instaliranje zavisnosti
RUN npm ci

# Kopiranje source koda
COPY . .

# Build za production
RUN npm run build

# Production faza
FROM node:18-alpine

WORKDIR /app

# Instaliranje serve za serviranje static fajlova
RUN npm install -g serve

# Kopiranje buildovanih fajlova
COPY --from=builder /app/dist ./dist

# Otvaranje porta
EXPOSE 3000

# Serviranje aplikacije
CMD ["serve", "-s", "dist", "-l", "3000"]

