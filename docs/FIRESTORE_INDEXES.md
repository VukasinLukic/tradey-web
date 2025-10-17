# Firestore Composite Indexes - TRADEY

## 📌 Problem

Firestore zahteva composite indexes za složene upite (queries sa više polja).

## ✅ Rešenje

Klikni na URL i Firebase će automatski kreirati index (traje 1-2 minuta).

---

## Required Indexes

### 1. **Posts Collection - Main Query**

**Index Fields:**
- `isAvailable` (Ascending)
- `createdAt` (Descending)

**URL za automatsko kreiranje:**
```
https://console.firebase.google.com/v1/r/project/vibe-hakaton/firestore/indexes?create_composite=Ckpwcm9qZWN0cy92aWJlLWhha2F0b24vZGF0YWJhc2VzLyhkZWZhdWx0KS9jb2xsZWN0aW9uR3JvdXBzL3Bvc3RzL2luZGV4ZXMvXxABGg8KC2lzQXZhaWxhYmxlEAEaDQoJY3JlYXRlZEF0EAIaDAoIX19uYW1lX18QAg
```

**Zašto je potreban:**
- GET /api/posts koristi filter `isAvailable == true` + orderBy `createdAt DESC`
- Bez indexa, query će failovati

**Kako kreirati:**
1. Klikni na URL gore
2. Firebase će te odvesti na console
3. Klikni "Create Index"
4. Sačekaj 1-2 minuta

---

### 2. **Posts Collection - By Creator**

**Index Fields:**
- `authorId` (Ascending)
- `createdAt` (Descending)

**Kako kreirati:**
- Pokupi URL iz error poruke kada pozoveš GET /api/posts?creator=USER_ID
- Ili kreiraj manuelno u Firebase Console

---

### 3. **Posts Collection - By Condition**

**Index Fields:**
- `condition` (Ascending)
- `isAvailable` (Ascending)
- `createdAt` (Descending)

**Zašto:**
- GET /api/posts?condition=GOOD

---

### 4. **Chats Collection - User Chats**

**Index Fields:**
- `participants` (Array-contains)
- `updatedAt` (Descending)

**Zašto:**
- GET /api/chats traži chatove gde je user participant
- Sortira po `updatedAt`

---

## 📝 Kako Manuelno Kreirati Index

1. Idi na [Firebase Console](https://console.firebase.google.com)
2. Projekat: `vibe-hakaton`
3. Firestore Database → Indexes tab
4. Klikni "Create Index"
5. Collection: `posts` ili `chats`
6. Dodaj Fields:
   - Prvo polje (npr. isAvailable): Ascending
   - Drugo polje (npr. createdAt): Descending
7. Query scopes: Collection
8. Create

---

## 🚦 Status Indexa

| Index | Status | URL |
|-------|--------|-----|
| posts: isAvailable + createdAt | ⏳ Pending | [Kreiraj ovde](https://console.firebase.google.com/v1/r/project/vibe-hakaton/firestore/indexes?create_composite=Ckpwcm9qZWN0cy92aWJlLWhha2F0b24vZGF0YWJhc2VzLyhkZWZhdWx0KS9jb2xsZWN0aW9uR3JvdXBzL3Bvc3RzL2luZGV4ZXMvXxABGg8KC2lzQXZhaWxhYmxlEAEaDQoJY3JlYXRlZEF0EAIaDAoIX19uYW1lX18QAg) |
| posts: authorId + createdAt | ⏳ Pending | Pojavi će se error sa URL-om |
| chats: participants + updatedAt | ⏳ Pending | Pojavi će se error sa URL-om |

---

## ⚠️ Napomena

- **DO NOT** pokušaj da koristiš `/api/posts` dok index nije kreiran
- Možeš koristiti `/api/posts/:id` (single post) bez problema
- Health endpoint radi bez indexa: `/api/health`
- User endpoints rade bez indexa: `/api/users/:id`

---

## 🎯 Kada Je Index Gotov

Nakon što klikneš link i kreiraš index:
1. Sačekaj 1-2 minuta
2. Test: `curl http://localhost:5000/api/posts`
3. Trebao bi da vidiš `[]` (prazan array) umesto error poruke
4. Ako ima postova u bazi, videćeš ih

---

## 📞 Problem?

Ako index ne radi posle 5 minuta:
1. Proveri status u Firebase Console → Indexes
2. Status treba da bude "Enabled" (zeleno)
3. Ako je "Building" (žuto), sačekaj još malo
4. Ako je "Error" (crveno), obriši i kreiraj ponovo
