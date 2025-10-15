# TRADEY API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <firebase-jwt-token>
```

---

## Health Check

### GET /health
Health check endpoint for monitoring.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-10-15T12:00:00.000Z"
}
```

---

## Posts Endpoints

### GET /posts
Get list of posts with optional filters.

**Query Parameters:**
- `q` (string, optional): Search query
- `tag` (string, optional): Filter by tag
- `creator` (string, optional): Filter by creator ID
- `limit` (number, optional): Limit results (default: 20)

**Response:**
```json
[
  {
    "id": "post123",
    "title": "Vintage Leather Jacket",
    "description": "...",
    "brand": "Zara",
    "condition": "GOOD",
    "size": "M",
    "images": ["url1", "url2"],
    "tradePreferences": "No t-shirts",
    "authorId": "user123",
    "authorUsername": "john_doe",
    "authorLocation": "Stari Grad",
    "createdAt": "2025-10-15T12:00:00.000Z",
    "isAvailable": true
  }
]
```

### GET /posts/:id
Get a single post by ID.

**Response:** Same as single post object above.

### POST /posts (Protected)
Create a new post.

**Request Body:**
```json
{
  "title": "Vintage Leather Jacket",
  "description": "Beautiful black leather jacket from the 90s",
  "brand": "Zara",
  "condition": "GOOD",
  "size": "M",
  "images": ["url1", "url2"],
  "tradePreferences": "No t-shirts"
}
```

**Response:** Created post object with status 201.

### PUT /posts/:id (Protected)
Update a post (owner only).

**Request Body:** Partial post object.

### DELETE /posts/:id (Protected)
Delete a post (owner only).

### POST /posts/:id/like (Protected)
Toggle like on a post.

**Response:**
```json
{
  "liked": true
}
```

---

## Users Endpoints

### GET /users/:id
Get user profile.

**Response:**
```json
{
  "uid": "user123",
  "username": "john_doe",
  "email": "john@example.com",
  "phone": "0601234567",
  "location": "Stari Grad",
  "avatarUrl": "...",
  "bio": "...",
  "following": ["user456"],
  "likedPosts": ["post123"],
  "createdAt": "2025-01-01T12:00:00.000Z",
  "role": "user"
}
```

### PUT /users/:id (Protected)
Update user profile (owner only).

**Request Body:**
```json
{
  "username": "new_username",
  "bio": "New bio",
  "location": "Novi Beograd"
}
```

### POST /users/:id/follow (Protected)
Follow/unfollow a user.

**Response:**
```json
{
  "following": true
}
```

---

## Chat Endpoints

### GET /chats (Protected)
Get all user's chats.

**Response:**
```json
[
  {
    "id": "chat123",
    "participants": ["user123", "user456"],
    "lastMessage": "Hello!",
    "lastMessageAt": "2025-10-15T12:00:00.000Z",
    "updatedAt": "2025-10-15T12:00:00.000Z"
  }
]
```

### GET /chats/:chatId/messages (Protected)
Get messages from a chat (paginated).

**Query Parameters:**
- `limit` (number, optional): Limit results (default: 50)
- `cursor` (string, optional): Pagination cursor

**Response:**
```json
{
  "messages": [
    {
      "id": "msg123",
      "chatId": "chat123",
      "senderId": "user123",
      "text": "Hello!",
      "createdAt": "2025-10-15T12:00:00.000Z",
      "readBy": ["user123"]
    }
  ],
  "nextCursor": "msg122"
}
```

### POST /chats/:chatId/messages (Protected)
Send a message.

**Request Body:**
```json
{
  "text": "Hello there!"
}
```

### POST /chats (Protected)
Create a new chat.

**Request Body:**
```json
{
  "participantId": "user456"
}
```

---

## Error Responses

All endpoints may return these error responses:

### 400 Bad Request
```json
{
  "error": "Validation error",
  "errors": [...]
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error"
}
```

