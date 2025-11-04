# 🎯 TRADEY - Pending Tasks

**Last Updated**: November 4, 2025
**Status**: 90% Production Ready
**Sprints Completed**: 1, 2, 3 ✅

---

## 📊 Current Status

- **Core Features**: 100% ✅
- **Security**: 95% ✅
- **Moderation**: 100% ✅
- **Advanced Features**: 40%

---

## 🔄 Pending Features

### High Priority

**Notification System** (20h)

- Firebase Cloud Messaging for new messages, likes, comments, followers
- In-app notification center

**Trade Tracking** (16h)

- Formal workflow: Pending → Accepted → Completed
- Auto-prompt for reviews after completion

**Advanced Search** (20h)

- Algolia/ElasticSearch integration
- Full-text search with autocomplete
- Typo tolerance

### Medium Priority

**Image Optimization** (12h)

- WebP conversion, responsive sizes, CDN caching

**Phone Validation** (2h)

- International support with `libphonenumber-js`

**Trust Badges** (6h)

-trusted trader sa boljom ocenom od 4 dobija ovaj bedz pored svog username na profilu kad se udje , power seller kada ima od 10 objava objavnjeno na istom mestu kao ovaj prethodni

### Low Priority

**Social Sharing** (4h)

- Share to social media instagram whatsapp viber , copy link

**Audit Logging** (6h)

- Log sensitive operations (deletions, bans, reports)

**Data Retention Policy** (8h)

- Auto-cleanup: deleted posts (30d), inactive users (2y), old messages (1y)

## 🐛 Known Issues

**getUserPosts Authorization** (1h - MEDIUM)

- File: `backend/src/controllers/userController.ts:115-135`
- Issue: Doesn't filter unavailable posts for non-owners

**Error Information Disclosure** (15min - LOW)

- File: `backend/src/middleware/errorHandler.ts:54-57`
- Fix: Ensure `NODE_ENV=production` in production

---

## 🎯 Next Milestone

**Q1 2025 Backlog**: Notification system, trade tracking, advanced search (~60 hours)

**Production Launch**: Estimated 6-8 weeks
