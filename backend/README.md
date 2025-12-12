# Orca Orchestrator - Multi-Agent Marketing System

Main orchestrator agent for coordinating specialized marketing content agents.

## Setup

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env and add your GOOGLE_API_KEY
   ```

3. **Run the application:**
   ```bash
   python main.py
   ```
   
   Or using uvicorn directly:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```

## API Endpoints

### Health Check
- `GET /api/v1/health` - Check service health

### Jobs
- `POST /api/v1/jobs` - Create a new job (multipart/form-data)
- `POST /api/v1/jobs/json` - Create a new job (JSON)
- `GET /api/v1/jobs/{job_id}` - Get job status and results
- `GET /api/v1/jobs` - List jobs (with optional filters)

## Example Usage

### Create Job (JSON)
```bash
curl -X POST "http://localhost:8000/api/v1/jobs/json" \
  -H "Content-Type: application/json" \
  -d '{
    "text_prompt": "EcoBottle — vacuum insulated bottle for commuters. Highlight sustainability and 12h hot retention.",
    "image_url": "https://example.com/image.jpg",
    "meta": {
      "product_name": "EcoBottle",
      "locale": "en-IN",
      "target_platforms": ["instagram", "linkedin"],
      "auto_publish": false
    }
  }'
```

### Get Job Status
```bash
curl "http://localhost:8000/api/v1/jobs/{job_id}"
```

## Architecture

- **Orca Agent**: Main orchestrator that coordinates all sub-agents
- **Job Manager**: In-memory job state management
- **Gemini Client**: Integration with Google Gemini 2.5 for AI operations
- **Image Service**: Image validation and processing

## Future Agent Integration

The Orca agent has placeholder methods for:
- Image Analysis Agent
- Branding Agent
- SEO & Keyword Agent
- Channel Planner
- Content Generation Agents
- Quality & Simulation Agent
- Publisher Agent

These will be integrated as separate agents are built.

