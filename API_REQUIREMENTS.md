# API Requirements for Kaffe Flow

This document outlines all the APIs needed for the complete user flow.

## Current Flow

1. **Upload Page** (`/app`) - User uploads an image
2. **Processing Page** (`/app/processing`) - Image is analyzed and content is generated
3. **Dashboard Page** (`/app/dashboard`) - User reviews, edits, and manages content

---

## Required APIs

### 1. **POST `/api/analyze-image`** ✅ (Currently called, needs implementation)

**Purpose**: Main API endpoint that analyzes the uploaded image and generates all marketing content.

**Request**:
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body:
  ```json
  {
    "file": <File> // Image file (PNG, JPG, JPEG)
  }
  ```

**Response**:
```json
{
  "blog_intro": "This stunning piece of artwork showcases...",
  "faqs": [
    {
      "question": "What is the inspiration behind this artwork?",
      "answer": "This piece draws inspiration from..."
    },
    {
      "question": "What techniques were used?",
      "answer": "The artwork employs a combination of..."
    },
    {
      "question": "How can I use this for marketing?",
      "answer": "This artwork is perfect for social media..."
    }
  ],
  "social_thread": [
    "🎨 Just created something special! This new piece...",
    "The process of creating this was both challenging...",
    "Art isn't just about what you see—it's about..."
  ],
  "keywords": ["digital art", "contemporary art", "visual storytelling", "creative marketing", "art promotion"]
}
```

**Status**: Called from `processing.tsx` line 74, but backend implementation is missing.

---

### 2. **POST `/api/generate-image`** ⚠️ (Referenced but not implemented)

**Purpose**: Generate platform-specific images (e.g., Instagram post images).

**Request**:
- Method: `POST`
- Content-Type: `application/json`
- Body:
```json
{
  "platform": "instagram",
  "original_image_url": "https://...",
  "content": "Post caption text...",
  "style": "modern" // optional
}
```

**Response**:
```json
{
  "image_url": "https://...",
  "image_base64": "data:image/png;base64,..." // optional
}
```

**Status**: Referenced in `dashboard.tsx` line 62 (`handleGenerateImage`), but not yet implemented.

---

### 3. **PUT/PATCH `/api/content/:id`** ⚠️ (Referenced but not implemented)

**Purpose**: Save edited content for a specific platform.

**Request**:
- Method: `PUT` or `PATCH`
- Content-Type: `application/json`
- Body:
```json
{
  "platform": "instagram",
  "content": "Edited content text...",
  "session_id": "..." // or user_id if auth is added
}
```

**Response**:
```json
{
  "success": true,
  "message": "Content saved successfully"
}
```

**Status**: Referenced in `dashboard.tsx` line 57 (`handleSave`), but not yet implemented.

---

### 4. **GET `/api/performance/:session_id`** ⚠️ (Optional - for future enhancement)

**Purpose**: Get performance metrics for content across platforms.

**Request**:
- Method: `GET`
- Path Parameter: `session_id` or `content_id`

**Response**:
```json
{
  "platforms": [
    {
      "platform": "instagram",
      "engagement": 85,
      "reach": 1200,
      "score": 92,
      "last_updated": "2024-01-15T10:30:00Z"
    },
    {
      "platform": "twitter",
      "engagement": 72,
      "reach": 850,
      "score": 78,
      "last_updated": "2024-01-15T10:30:00Z"
    }
  ]
}
```

**Status**: Currently using mock data in `dashboard.tsx` line 25-50. This would replace the mock performance metrics.

---

## Implementation Priority

### Phase 1: Core Functionality (Required for MVP)
1. ✅ **POST `/api/analyze-image`** - Must be implemented for the flow to work
   - This is the main API that powers the entire flow
   - Called from: `frontend/app/pages/processing.tsx:74`

### Phase 2: Enhanced Features (Nice to have)
2. **POST `/api/generate-image`** - For Instagram image generation
   - Called from: `frontend/app/pages/dashboard.tsx:62`
3. **PUT `/api/content/:id`** - For saving edited content
   - Called from: `frontend/app/pages/dashboard.tsx:57`

### Phase 3: Analytics (Future)
4. **GET `/api/performance/:session_id`** - For real performance metrics
   - Currently mocked in: `frontend/app/pages/dashboard.tsx:25-50`

---

## Current Backend Status

- ✅ FastAPI setup exists
- ✅ Dependencies installed (FastAPI, OpenAI, etc.)
- ❌ No API routes implemented yet
- ❌ `backend/app/routes.py` is empty
- ❌ `backend/main.py` is empty

---

## Next Steps

1. **Implement `/api/analyze-image`** endpoint in `backend/app/routes.py`
   - Use OpenAI GPT-4o Vision API for image analysis
   - Generate blog intro, FAQs, social thread, and keywords
   - Return the response structure shown above

2. **Update `backend/main.py`** to include the router
   - Import routes from `app.routes`
   - Add CORS middleware for frontend communication

3. **Test the flow**:
   - Upload image → Processing → Dashboard
   - Verify all content displays correctly

4. **Optional**: Implement image generation and content saving APIs

---

## API Base URL

- Development: `http://localhost:8000`
- Production: TBD

All API calls from frontend currently use: `http://localhost:8000/api/...`

