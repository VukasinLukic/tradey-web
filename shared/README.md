# TRADEY Shared

Shared types, constants, and validation schemas between frontend and backend.

## Contents

### Types
- `user.types.ts` - UserProfile interface
- `post.types.ts` - Post, ClothingCondition types
- `chat.types.ts` - Chat, Message interfaces

### Constants
- `firebasePaths.ts` - Firestore collection paths
- `validationSchemas.ts` - Zod validation schemas

## Usage

This package is linked to both frontend and backend via `package.json`:

```json
{
  "dependencies": {
    "shared": "file:../shared"
  }
}
```

Import in your code:

```typescript
// Types
import { UserProfile, Post, Chat, Message } from 'shared/types';

// Constants
import { COLLECTIONS } from 'shared/constants/firebasePaths';

// Validation
import { createPostSchema } from 'shared/constants/validationSchemas';
```

## Build

```bash
npm install
npm run build
```

## Adding New Types

1. Create type file in `types/` directory
2. Export from `types/index.ts`
3. Update dependent packages if needed

