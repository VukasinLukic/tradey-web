# AI Server - TODO Lista

> **Note:** This is a NEW REPOSITORY (tradey-ai-server)

## Quick Overview

- [ ] TASK-005: Setup AI Server Structure
- [ ] TASK-006: Implement Image Embeddings (CLIP)
- [ ] TASK-007: Implement Vector Store (FAISS)
- [ ] TASK-008: Implement Feed Ranking Algorithm
- [ ] TASK-009: Implement Cold Start Strategy
- [ ] TASK-010: Implement User Style Vector Computation

---

## Repository Setup

```bash
# Create new repository
mkdir tradey-ai-server
cd tradey-ai-server
git init

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or: venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt
```

---

## Detailed Tasks

### TASK-005: Setup AI Server Structure

**Priority:** P0
**Effort:** 4 hours

#### Description
Create the foundational FastAPI project structure for the AI recommendation server.

#### Folder Structure to Create
```
tradey-ai-server/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app entry
│   ├── config.py            # Settings and environment
│   ├── api/
│   │   ├── __init__.py
│   │   ├── process_item.py  # POST /api/process-item
│   │   ├── recommend.py     # POST /api/recommend
│   │   └── health.py        # GET /health
│   ├── ml/
│   │   ├── __init__.py
│   │   ├── embeddings.py    # CLIP + Sentence Transformers
│   │   ├── ranking.py       # Scoring algorithm
│   │   └── cold_start.py    # Cold start strategy
│   └── db/
│       ├── __init__.py
│       └── vector_store.py  # FAISS wrapper
├── data/
│   └── faiss_index/         # Persisted index files
├── tests/
│   ├── __init__.py
│   ├── test_embeddings.py
│   └── test_ranking.py
├── requirements.txt
├── Dockerfile
├── .env.example
├── .gitignore
└── README.md
```

#### main.py
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import health, process_item, recommend
from app.config import settings

app = FastAPI(title="TRADEY AI Server", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(process_item.router, prefix="/api")
app.include_router(recommend.router, prefix="/api")

@app.on_event("startup")
async def startup():
    # Load ML models and FAISS index
    from app.ml.embeddings import load_models
    from app.db.vector_store import load_index
    load_models()
    load_index()

@app.on_event("shutdown")
async def shutdown():
    # Persist FAISS index
    from app.db.vector_store import save_index
    save_index()
```

#### config.py
```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    CORS_ORIGINS: list = ["http://localhost:5000", "https://tradey-api.railway.app"]
    FAISS_INDEX_PATH: str = "data/faiss_index"
    EMBEDDING_DIM: int = 512

    class Config:
        env_file = ".env"

settings = Settings()
```

#### requirements.txt
```
fastapi==0.109.0
uvicorn==0.27.0
pydantic-settings==2.1.0
torch==2.1.0
transformers==4.36.0
sentence-transformers==2.2.2
faiss-cpu==1.7.4
numpy==1.26.0
pillow==10.2.0
requests==2.31.0
python-multipart==0.0.6
```

#### Dockerfile
```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### Acceptance Criteria
- [ ] Project structure created
- [ ] FastAPI app starts without errors
- [ ] GET /health returns 200
- [ ] CORS configured for backend URL
- [ ] Docker build succeeds

---

### TASK-006: Implement Image Embeddings (CLIP)

**Priority:** P0
**Effort:** 6 hours

#### Description
Use CLIP model to generate 512-dimensional embeddings from clothing images.

#### File: app/ml/embeddings.py
```python
from transformers import CLIPModel, CLIPProcessor
import torch
import numpy as np
from PIL import Image
import requests
from io import BytesIO

_model = None
_processor = None

def load_models():
    global _model, _processor
    _model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
    _processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
    print("CLIP model loaded")

def get_image_from_url(url: str) -> Image.Image:
    response = requests.get(url, timeout=10)
    return Image.open(BytesIO(response.content)).convert("RGB")

def embed_image(image: Image.Image) -> np.ndarray:
    """Generate 512-dim embedding from image."""
    inputs = _processor(images=image, return_tensors="pt")
    with torch.no_grad():
        features = _model.get_image_features(**inputs)
    # Normalize for cosine similarity
    normalized = features / features.norm(dim=-1, keepdim=True)
    return normalized.cpu().numpy()[0]  # Shape: (512,)

def embed_image_url(url: str) -> np.ndarray:
    """Generate embedding from image URL."""
    image = get_image_from_url(url)
    return embed_image(image)

def embed_batch(images: list[Image.Image]) -> np.ndarray:
    """Batch embedding for efficiency."""
    inputs = _processor(images=images, return_tensors="pt", padding=True)
    with torch.no_grad():
        features = _model.get_image_features(**inputs)
    normalized = features / features.norm(dim=-1, keepdim=True)
    return normalized.cpu().numpy()  # Shape: (N, 512)
```

#### API Endpoint: app/api/process_item.py
```python
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.ml.embeddings import embed_image_url
from app.db.vector_store import add_item

router = APIRouter()

class ProcessItemRequest(BaseModel):
    item_id: str
    image_url: str
    metadata: dict = {}

class ProcessItemResponse(BaseModel):
    item_id: str
    embedding_generated: bool

@router.post("/process-item", response_model=ProcessItemResponse)
async def process_item(request: ProcessItemRequest):
    try:
        embedding = embed_image_url(request.image_url)
        add_item(request.item_id, embedding, request.metadata)
        return ProcessItemResponse(item_id=request.item_id, embedding_generated=True)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

#### Performance Requirements
- Single image: < 500ms on CPU
- Batch of 10: < 2s on CPU
- Model loading: ~30s (cold start)

#### Acceptance Criteria
- [ ] CLIP model loads on startup
- [ ] embed_image returns 512-dim normalized vector
- [ ] POST /api/process-item generates and stores embedding
- [ ] Works without GPU (CPU inference)
- [ ] Handles invalid image URLs gracefully

---

### TASK-007: Implement Vector Store (FAISS)

**Priority:** P0
**Effort:** 4 hours

#### Description
Create FAISS-based vector store for efficient similarity search. Persist index to disk on shutdown.

#### File: app/db/vector_store.py
```python
import faiss
import numpy as np
import json
import os
from app.config import settings

_index = None
_item_ids = []
_metadata = {}

def load_index():
    global _index, _item_ids, _metadata
    index_path = f"{settings.FAISS_INDEX_PATH}/index.faiss"
    ids_path = f"{settings.FAISS_INDEX_PATH}/item_ids.json"
    meta_path = f"{settings.FAISS_INDEX_PATH}/metadata.json"

    if os.path.exists(index_path):
        _index = faiss.read_index(index_path)
        with open(ids_path, 'r') as f:
            _item_ids = json.load(f)
        with open(meta_path, 'r') as f:
            _metadata = json.load(f)
        print(f"Loaded FAISS index with {len(_item_ids)} items")
    else:
        _index = faiss.IndexFlatIP(settings.EMBEDDING_DIM)  # Inner product = cosine on normalized
        _item_ids = []
        _metadata = {}
        print("Created new FAISS index")

def save_index():
    os.makedirs(settings.FAISS_INDEX_PATH, exist_ok=True)
    faiss.write_index(_index, f"{settings.FAISS_INDEX_PATH}/index.faiss")
    with open(f"{settings.FAISS_INDEX_PATH}/item_ids.json", 'w') as f:
        json.dump(_item_ids, f)
    with open(f"{settings.FAISS_INDEX_PATH}/metadata.json", 'w') as f:
        json.dump(_metadata, f)
    print(f"Saved FAISS index with {len(_item_ids)} items")

def add_item(item_id: str, embedding: np.ndarray, metadata: dict = None):
    global _item_ids, _metadata
    # Check if already exists
    if item_id in _item_ids:
        # Update: remove old and add new
        idx = _item_ids.index(item_id)
        # FAISS doesn't support updates, so we track duplicates
        # For MVP, just append (duplicates filtered in search)

    _index.add(embedding.reshape(1, -1).astype('float32'))
    _item_ids.append(item_id)
    if metadata:
        _metadata[item_id] = metadata

def search(query: np.ndarray, k: int = 50, exclude_ids: list = None) -> list[tuple[str, float]]:
    """Search for similar items. Returns [(item_id, score), ...]"""
    exclude_ids = exclude_ids or []

    # Search more to filter exclusions
    search_k = k + len(exclude_ids) + 10
    scores, indices = _index.search(query.reshape(1, -1).astype('float32'), search_k)

    results = []
    for j, i in enumerate(indices[0]):
        if i < len(_item_ids):
            item_id = _item_ids[i]
            if item_id not in exclude_ids:
                results.append((item_id, float(scores[0][j])))
                if len(results) >= k:
                    break

    return results

def get_embedding(item_id: str) -> np.ndarray:
    """Get embedding for a specific item."""
    if item_id not in _item_ids:
        return None
    idx = _item_ids.index(item_id)
    return _index.reconstruct(idx)

def get_all_embeddings(item_ids: list[str]) -> dict[str, np.ndarray]:
    """Get embeddings for multiple items."""
    return {
        item_id: get_embedding(item_id)
        for item_id in item_ids
        if item_id in _item_ids
    }
```

#### Key Features
- Inner product similarity (equivalent to cosine on normalized vectors)
- Exclusion list support (for already-swiped items)
- Persistence to disk on shutdown
- Auto-load on startup

#### Acceptance Criteria
- [ ] Index loads from disk if exists
- [ ] New items can be added
- [ ] Search returns top-k similar items
- [ ] Exclusion list filters results
- [ ] Index persists on shutdown
- [ ] Survives server restart

---

### TASK-008: Implement Feed Ranking Algorithm

**Priority:** P0
**Effort:** 8 hours

#### Description
Multi-factor ranking algorithm combining style similarity, size match, popularity, budget, and location.

#### File: app/ml/ranking.py
```python
import numpy as np
from typing import Optional

def compute_score(
    style_similarity: float,
    size_match: float,
    popularity_score: float,
    budget_match: float,
    location_match: float
) -> float:
    """
    Weighted ranking score.

    Weights:
    - 40% style similarity (visual match)
    - 30% size match (practical fit)
    - 15% popularity (social proof)
    - 10% budget match (affordability)
    - 5% location match (convenience)
    """
    return (
        0.40 * style_similarity +
        0.30 * size_match +
        0.15 * popularity_score +
        0.10 * budget_match +
        0.05 * location_match
    )

def calculate_size_match(user_sizes: list[str], item_size: str) -> float:
    """Binary size match: 1.0 if matches, 0.0 if not."""
    if not user_sizes or not item_size:
        return 0.5  # Unknown = neutral
    return 1.0 if item_size.upper() in [s.upper() for s in user_sizes] else 0.0

def calculate_budget_match(item_price: float, user_max_budget: Optional[float]) -> float:
    """Score based on price vs budget. Lower price = higher score."""
    if not user_max_budget:
        return 0.5  # No budget preference = neutral
    if item_price <= user_max_budget:
        # Within budget: score based on how much under
        return 1.0 - (item_price / user_max_budget) * 0.3  # 0.7 - 1.0
    else:
        # Over budget: penalize based on how much over
        over_ratio = item_price / user_max_budget
        return max(0, 1.0 - (over_ratio - 1.0))  # Decays to 0

def calculate_location_match(user_city: str, item_city: str) -> float:
    """Bonus for same city."""
    if not user_city or not item_city:
        return 0.5
    return 1.0 if user_city.lower() == item_city.lower() else 0.3

def calculate_popularity_score(likes: int, max_likes: int) -> float:
    """Normalized popularity. Log scale to prevent outliers dominating."""
    if max_likes == 0:
        return 0.5
    return np.log1p(likes) / np.log1p(max_likes)

def rank_items(
    item_scores: list[tuple[str, float]],  # From FAISS search (item_id, style_sim)
    item_metadata: dict,  # item_id -> {size, price, city, likes}
    user_preferences: dict,  # {sizes, budgetMax, city}
    max_likes: int = 100
) -> list[tuple[str, float]]:
    """
    Rank items with multi-factor scoring.
    Returns sorted list of (item_id, final_score).
    """
    ranked = []

    for item_id, style_sim in item_scores:
        meta = item_metadata.get(item_id, {})

        size_match = calculate_size_match(
            user_preferences.get('sizes', []),
            meta.get('size', '')
        )

        budget_match = calculate_budget_match(
            meta.get('price', 0),
            user_preferences.get('budgetMax')
        )

        location_match = calculate_location_match(
            user_preferences.get('city', ''),
            meta.get('city', '')
        )

        popularity = calculate_popularity_score(
            meta.get('likes', 0),
            max_likes
        )

        final_score = compute_score(
            style_similarity=style_sim,
            size_match=size_match,
            popularity_score=popularity,
            budget_match=budget_match,
            location_match=location_match
        )

        ranked.append((item_id, final_score))

    # Sort by final score descending
    ranked.sort(key=lambda x: x[1], reverse=True)
    return ranked
```

#### Diversity Injection
```python
def inject_diversity(ranked_items: list, exploration_ratio: float = 0.1) -> list:
    """
    90% ranked items + 10% random exploration.
    Prevents filter bubbles and helps discover new styles.
    """
    import random

    n_total = len(ranked_items)
    n_explore = int(n_total * exploration_ratio)
    n_ranked = n_total - n_explore

    top_items = ranked_items[:n_ranked]
    remaining = ranked_items[n_ranked:]
    explore_items = random.sample(remaining, min(n_explore, len(remaining)))

    # Interleave exploration items
    final = []
    explore_positions = set(random.sample(range(n_total), len(explore_items)))

    top_idx, explore_idx = 0, 0
    for i in range(n_total):
        if i in explore_positions and explore_idx < len(explore_items):
            final.append(explore_items[explore_idx])
            explore_idx += 1
        elif top_idx < len(top_items):
            final.append(top_items[top_idx])
            top_idx += 1

    return final
```

#### Acceptance Criteria
- [ ] Score formula implemented with correct weights
- [ ] Size match works with multi-size preferences
- [ ] Budget match penalizes over-budget items
- [ ] Location match gives bonus to same city
- [ ] Popularity uses log scale normalization
- [ ] Diversity injection adds 10% exploration

---

### TASK-009: Implement Cold Start Strategy

**Priority:** P0
**Effort:** 4 hours

#### Description
Handle new users with < 30 swipes using quiz preferences and popular items.

#### File: app/ml/cold_start.py
```python
from typing import Optional
from app.db.vector_store import search
import numpy as np

def get_cold_start_feed(
    swipe_count: int,
    user_preferences: dict,
    liked_item_embeddings: list[np.ndarray],
    exclude_ids: list[str],
    count: int = 50
) -> tuple[list[str], bool]:
    """
    Returns (item_ids, is_cold_start).

    Cold start thresholds:
    - 0-10 swipes: 100% popular items matching quiz
    - 10-30 swipes: 70% quiz-based + 30% from early likes
    - 30+ swipes: Full personalization (not cold start)
    """
    is_cold_start = swipe_count < 30

    if swipe_count < 10:
        # Pure cold start: popular items matching preferences
        items = get_popular_by_preferences(user_preferences, exclude_ids, count)
        return items, True

    elif swipe_count < 30:
        # Transitional: mix of preferences and early behavioral signals
        n_quiz = int(count * 0.7)  # 70%
        n_behavioral = count - n_quiz  # 30%

        quiz_items = get_popular_by_preferences(
            user_preferences, exclude_ids, n_quiz
        )

        behavioral_items = []
        if liked_item_embeddings:
            behavioral_items = get_from_early_likes(
                liked_item_embeddings, exclude_ids + quiz_items, n_behavioral
            )

        # Shuffle to mix
        import random
        combined = quiz_items + behavioral_items
        random.shuffle(combined)
        return combined, True

    else:
        # Not cold start
        return [], False

def get_popular_by_preferences(
    preferences: dict,
    exclude_ids: list[str],
    count: int
) -> list[str]:
    """
    Get popular items that match user preferences.
    Queries items sorted by popularity, filtered by size/style.
    """
    # This would query a pre-computed popular items list
    # For MVP, return all items sorted by likes
    from app.db.vector_store import get_all_items_by_popularity

    all_items = get_all_items_by_popularity()  # [(item_id, metadata), ...]

    filtered = []
    user_sizes = set(s.upper() for s in preferences.get('sizes', []))
    user_styles = set(s.lower() for s in preferences.get('styles', []))

    for item_id, meta in all_items:
        if item_id in exclude_ids:
            continue

        # Filter by size if specified
        if user_sizes and meta.get('size', '').upper() not in user_sizes:
            continue

        # Filter by style if specified (optional)
        if user_styles and meta.get('style', '').lower() not in user_styles:
            continue

        filtered.append(item_id)
        if len(filtered) >= count:
            break

    return filtered

def get_from_early_likes(
    liked_embeddings: list[np.ndarray],
    exclude_ids: list[str],
    count: int
) -> list[str]:
    """
    Find items similar to user's early likes.
    """
    if not liked_embeddings:
        return []

    # Average embedding of liked items
    avg_embedding = np.mean(liked_embeddings, axis=0)
    avg_embedding = avg_embedding / np.linalg.norm(avg_embedding)

    # Search for similar
    results = search(avg_embedding, k=count + len(exclude_ids), exclude_ids=exclude_ids)
    return [item_id for item_id, _ in results[:count]]
```

#### Cold Start Thresholds
| Swipes | Strategy | Mix |
|--------|----------|-----|
| 0-10 | Pure popularity | 100% quiz preferences |
| 10-30 | Transitional | 70% quiz + 30% behavioral |
| 30+ | Full personalization | Based on user style vector |

#### Acceptance Criteria
- [ ] 0-10 swipes returns popular items only
- [ ] 10-30 swipes mixes quiz and behavioral
- [ ] 30+ swipes returns is_cold_start=false
- [ ] Exclusion list respected
- [ ] Preferences filtering works (size, style)

---

### TASK-010: Implement User Style Vector Computation

**Priority:** P0
**Effort:** 4 hours

#### Description
Compute a user's style preference as the average embedding of their liked items.

#### File: app/ml/user_style.py
```python
import numpy as np
from typing import Optional
from app.db.vector_store import get_embedding, get_all_embeddings

def compute_user_style_vector(liked_item_ids: list[str]) -> Optional[np.ndarray]:
    """
    Compute user style as average of liked item embeddings.
    Returns normalized 512-dim vector or None if no likes.
    """
    if not liked_item_ids:
        return None

    embeddings = get_all_embeddings(liked_item_ids)

    if not embeddings:
        return None

    # Stack and average
    embedding_matrix = np.stack(list(embeddings.values()))
    avg_embedding = np.mean(embedding_matrix, axis=0)

    # Normalize for cosine similarity
    normalized = avg_embedding / np.linalg.norm(avg_embedding)
    return normalized

def update_user_style_vector(
    current_vector: Optional[np.ndarray],
    new_like_embedding: np.ndarray,
    total_likes: int,
    decay_factor: float = 0.95
) -> np.ndarray:
    """
    Incrementally update style vector with new like.
    Uses exponential moving average to weight recent likes more.
    """
    if current_vector is None:
        return new_like_embedding / np.linalg.norm(new_like_embedding)

    # Exponential moving average
    # Recent likes have more weight
    weight = 1.0 / (total_likes + 1)
    updated = (1 - weight) * decay_factor * current_vector + weight * new_like_embedding

    # Renormalize
    return updated / np.linalg.norm(updated)

def get_style_similarity(user_vector: np.ndarray, item_embedding: np.ndarray) -> float:
    """
    Cosine similarity between user style and item.
    Both vectors should be normalized.
    """
    return float(np.dot(user_vector, item_embedding))
```

#### API Endpoint: app/api/recommend.py
```python
from fastapi import APIRouter
from pydantic import BaseModel
from app.ml.cold_start import get_cold_start_feed
from app.ml.ranking import rank_items, inject_diversity
from app.ml.user_style import compute_user_style_vector
from app.db.vector_store import search, get_metadata

router = APIRouter()

class RecommendRequest(BaseModel):
    user_id: str
    user_preferences: dict  # {sizes, budgetMax, city, styles}
    liked_item_ids: list[str] = []
    exclude_item_ids: list[str] = []
    count: int = 50

class RecommendResponse(BaseModel):
    item_ids: list[str]
    cold_start: bool

@router.post("/recommend", response_model=RecommendResponse)
async def recommend(request: RecommendRequest):
    swipe_count = len(request.liked_item_ids) + len(request.exclude_item_ids)

    # Try cold start first
    cold_start_items, is_cold_start = get_cold_start_feed(
        swipe_count=swipe_count,
        user_preferences=request.user_preferences,
        liked_item_embeddings=[],  # Fetched internally
        exclude_ids=request.exclude_item_ids,
        count=request.count
    )

    if is_cold_start:
        return RecommendResponse(item_ids=cold_start_items, cold_start=True)

    # Full personalization
    user_vector = compute_user_style_vector(request.liked_item_ids)

    if user_vector is None:
        # Fallback to cold start
        cold_start_items, _ = get_cold_start_feed(
            swipe_count=0,
            user_preferences=request.user_preferences,
            liked_item_embeddings=[],
            exclude_ids=request.exclude_item_ids,
            count=request.count
        )
        return RecommendResponse(item_ids=cold_start_items, cold_start=True)

    # FAISS search
    similar_items = search(user_vector, k=request.count * 2, exclude_ids=request.exclude_item_ids)

    # Get metadata for ranking
    item_metadata = get_metadata([item_id for item_id, _ in similar_items])

    # Multi-factor ranking
    ranked = rank_items(similar_items, item_metadata, request.user_preferences)

    # Add diversity
    final = inject_diversity(ranked)

    item_ids = [item_id for item_id, _ in final[:request.count]]
    return RecommendResponse(item_ids=item_ids, cold_start=False)
```

#### Acceptance Criteria
- [ ] User style computed from liked items
- [ ] Incremental update works for new likes
- [ ] Style similarity returns 0-1 range
- [ ] POST /api/recommend returns personalized feed
- [ ] Cold start fallback when no style vector
- [ ] Response includes cold_start flag

---

## Deployment

### Railway (Recommended)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### Environment Variables
```env
CORS_ORIGINS=["http://localhost:5000","https://tradey-api.railway.app"]
FAISS_INDEX_PATH=data/faiss_index
```

### Health Check
```bash
curl https://your-app.railway.app/health
# Expected: {"status": "healthy", "index_size": 1234}
```

## Performance Targets

| Metric | Target |
|--------|--------|
| Model loading | < 60s (cold start) |
| Single embedding | < 500ms |
| Recommendation | < 300ms |
| Index size | Up to 50k items |
