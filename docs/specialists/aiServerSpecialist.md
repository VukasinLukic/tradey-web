# AI Server Specialist - Python/FastAPI Guidelines

## Tech Stack

- **Language**: Python 3.10+
- **Framework**: FastAPI
- **ML**: CLIP (image embeddings), Sentence Transformers
- **Vector DB**: FAISS (in-memory, persisted)
- **Math**: NumPy for vector operations

---

## File Locations

```
tradey-ai-server/
├── app/
│   ├── main.py           # FastAPI entry point
│   ├── config.py         # Settings (pydantic-settings)
│   ├── api/              # Route handlers
│   │   ├── health.py
│   │   ├── process_item.py
│   │   └── recommend.py
│   ├── ml/               # ML logic
│   │   ├── embeddings.py
│   │   ├── ranking.py
│   │   ├── cold_start.py
│   │   └── user_style.py
│   └── db/               # Vector store
│       └── vector_store.py
├── data/
│   └── faiss_index/      # Persisted index
├── tests/
├── requirements.txt
└── Dockerfile
```

---

## Key Patterns

### FastAPI Route
```python
# api/recommend.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

class RecommendRequest(BaseModel):
    user_id: str
    user_preferences: dict
    liked_item_ids: list[str] = []
    exclude_item_ids: list[str] = []
    count: int = 50

class RecommendResponse(BaseModel):
    item_ids: list[str]
    cold_start: bool

@router.post("/recommend", response_model=RecommendResponse)
async def recommend(request: RecommendRequest):
    try:
        # Business logic here
        return RecommendResponse(item_ids=[], cold_start=False)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

### CLIP Embedding
```python
# ml/embeddings.py
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

def embed_image_url(url: str) -> np.ndarray:
    """Generate 512-dim normalized embedding from image URL."""
    response = requests.get(url, timeout=10)
    image = Image.open(BytesIO(response.content)).convert("RGB")

    inputs = _processor(images=image, return_tensors="pt")
    with torch.no_grad():
        features = _model.get_image_features(**inputs)

    # Normalize for cosine similarity
    normalized = features / features.norm(dim=-1, keepdim=True)
    return normalized.cpu().numpy()[0]
```

### FAISS Vector Store
```python
# db/vector_store.py
import faiss
import numpy as np
import json
import os

_index = None
_item_ids = []

def load_index(path: str = "data/faiss_index"):
    global _index, _item_ids
    index_file = f"{path}/index.faiss"
    ids_file = f"{path}/item_ids.json"

    if os.path.exists(index_file):
        _index = faiss.read_index(index_file)
        with open(ids_file) as f:
            _item_ids = json.load(f)
    else:
        _index = faiss.IndexFlatIP(512)  # Inner product = cosine on normalized
        _item_ids = []

def add_item(item_id: str, embedding: np.ndarray):
    _index.add(embedding.reshape(1, -1).astype('float32'))
    _item_ids.append(item_id)

def search(query: np.ndarray, k: int = 50) -> list[tuple[str, float]]:
    scores, indices = _index.search(query.reshape(1, -1).astype('float32'), k)
    return [(
        _item_ids[i],
        float(scores[0][j])
    ) for j, i in enumerate(indices[0]) if i < len(_item_ids)]

def save_index(path: str = "data/faiss_index"):
    os.makedirs(path, exist_ok=True)
    faiss.write_index(_index, f"{path}/index.faiss")
    with open(f"{path}/item_ids.json", 'w') as f:
        json.dump(_item_ids, f)
```

### Ranking Algorithm
```python
# ml/ranking.py
import numpy as np

def compute_score(
    style_similarity: float,
    size_match: float,
    popularity_score: float,
    budget_match: float,
    location_match: float
) -> float:
    """
    Weighted multi-factor score.

    Weights:
    - 40% style similarity (CLIP cosine)
    - 30% size match
    - 15% popularity
    - 10% budget fit
    - 5% location
    """
    return (
        0.40 * style_similarity +
        0.30 * size_match +
        0.15 * popularity_score +
        0.10 * budget_match +
        0.05 * location_match
    )

def calculate_size_match(user_sizes: list[str], item_size: str) -> float:
    if not user_sizes or not item_size:
        return 0.5
    return 1.0 if item_size.upper() in [s.upper() for s in user_sizes] else 0.0

def calculate_popularity(likes: int, max_likes: int) -> float:
    if max_likes == 0:
        return 0.5
    return np.log1p(likes) / np.log1p(max_likes)  # Log scale
```

---

## Cold Start Strategy

```python
# ml/cold_start.py

def get_cold_start_feed(swipe_count: int, preferences: dict, count: int):
    """
    Thresholds:
    - 0-10 swipes: 100% popular by quiz preferences
    - 10-30 swipes: 70% quiz + 30% early behavioral
    - 30+ swipes: Full personalization (not cold start)
    """
    if swipe_count < 10:
        return get_popular_by_preferences(preferences, count), True

    elif swipe_count < 30:
        n_quiz = int(count * 0.7)
        n_behavioral = count - n_quiz
        quiz_items = get_popular_by_preferences(preferences, n_quiz)
        behavioral = get_from_early_likes(n_behavioral)
        return shuffle(quiz_items + behavioral), True

    else:
        return [], False  # Use full personalization
```

---

## User Style Vector

```python
# ml/user_style.py
import numpy as np

def compute_user_style(liked_embeddings: list[np.ndarray]) -> np.ndarray:
    """Average embedding of liked items = user style."""
    if not liked_embeddings:
        return None

    avg = np.mean(liked_embeddings, axis=0)
    return avg / np.linalg.norm(avg)  # Normalize

def style_similarity(user_vector: np.ndarray, item_embedding: np.ndarray) -> float:
    """Cosine similarity (both normalized)."""
    return float(np.dot(user_vector, item_embedding))
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check + index size |
| POST | `/api/process-item` | Generate & store embedding |
| POST | `/api/recommend` | Get personalized feed |

---

## Performance Targets

| Metric | Target |
|--------|--------|
| Model loading | < 60s (cold start) |
| Single embedding | < 500ms |
| Recommendation | < 300ms |
| Index capacity | 50k items |

---

## Configuration

```python
# config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    CORS_ORIGINS: list = ["http://localhost:5000"]
    FAISS_INDEX_PATH: str = "data/faiss_index"
    EMBEDDING_DIM: int = 512

    class Config:
        env_file = ".env"

settings = Settings()
```

---

## Deployment

### Dockerfile
```dockerfile
FROM python:3.10-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Railway/Render
```bash
# Railway
railway login
railway init
railway up

# Render
# Connect GitHub repo, set start command:
# uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

---

## Testing

```bash
# Install dependencies
pip install -r requirements.txt

# Run locally
uvicorn app.main:app --reload

# Test endpoints
curl http://localhost:8000/health

curl -X POST http://localhost:8000/api/process-item \
  -H "Content-Type: application/json" \
  -d '{"item_id": "123", "image_url": "https://..."}'

# Run tests
pytest tests/
```

---

## Common Gotchas

1. **First request slow** - Model loading takes ~30s
2. **Memory usage** - CLIP + FAISS need ~2GB RAM
3. **CPU inference** - Works but slower than GPU
4. **Index persistence** - Save on shutdown, load on startup
5. **Normalized vectors** - Always normalize for cosine similarity
6. **Float32** - FAISS requires float32, not float64
