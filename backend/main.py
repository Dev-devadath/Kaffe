"""FastAPI application entry point for Orca Orchestrator."""
from contextlib import asynccontextmanager
from typing import Optional
from fastapi import FastAPI, HTTPException, BackgroundTasks, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import ValidationError
from pydantic_settings import BaseSettings
import requests
import uuid
import os

from models.job import JobRequest, JobResponse, JobStatus, JobMeta
from services.job_manager import job_manager
from services.gemini_client import GeminiClient
from agents.orca_agent import OrcaAgent
from utils.logger import setup_logger, logger


class Settings(BaseSettings):
    """Application settings."""
    google_api_key: str
    log_level: str = "INFO"
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    external_agent_url: str = ""
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False


# Initialize settings
settings = Settings()

# Initialize logger
setup_logger("orca", settings.log_level)

# Global instances
gemini_client: Optional[GeminiClient] = None
orca_agent: Optional[OrcaAgent] = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup/shutdown events."""
    # Startup
    global gemini_client, orca_agent
    
    try:
        logger.info("Initializing Gemini client...")
        gemini_client = GeminiClient(api_key=settings.google_api_key)
        orca_agent = OrcaAgent(gemini_client=gemini_client)
        logger.info("Application startup complete")
    except Exception as e:
        logger.error(f"Failed to initialize application: {e}")
        raise
    
    yield
    
    # Shutdown
    logger.info("Application shutting down")


# Create FastAPI app
app = FastAPI(
    title="Orca Orchestrator API",
    description="Main orchestrator for multi-agent marketing content system",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Exception handlers
@app.exception_handler(ValidationError)
async def validation_exception_handler(request, exc):
    """Handle Pydantic validation errors."""
    return JSONResponse(
        status_code=422,
        content={"detail": str(exc), "errors": exc.errors()}
    )


@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """Handle general exceptions."""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )


# Background task for async orchestration
async def process_job_async(job_id: str, request: JobRequest):
    """Process job asynchronously in background."""
    try:
        await orca_agent.execute(job_id, request)
    except Exception as e:
        logger.error(f"Background job processing failed for {job_id}: {e}", exc_info=True)


@app.get("/api/v1/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "orca-orchestrator",
        "version": "1.0.0"
    }


@app.post("/api/v1/jobs", response_model=JobResponse, status_code=202)
async def create_job(
    background_tasks: BackgroundTasks,
    text_prompt: str = Form(...),
    image_url: Optional[str] = Form(None),
    user_id: Optional[str] = Form(None),
    job_id: Optional[str] = Form(None),
    product_name: Optional[str] = Form(None),
    locale: Optional[str] = Form("en-US"),
    target_platforms: Optional[str] = Form(None),  # Comma-separated string
    auto_publish: Optional[bool] = Form(False),
    image_file: Optional[UploadFile] = File(None)
):
    """
    Create a new job.
    
    Accepts multipart/form-data with:
    - text_prompt (required): Product/service description
    - image_url (optional): Publicly accessible image URL
    - image_file (optional): Image file upload (not yet implemented)
    - user_id (optional): User identifier
    - job_id (optional): Custom job ID
    - meta fields (optional): product_name, locale, target_platforms, auto_publish
    """
    try:
        # Handle image file upload (placeholder - not yet implemented)
        if image_file:
            raise HTTPException(
                status_code=501,
                detail="Image file upload not yet implemented. Please use image_url instead."
            )
        
        # Parse target_platforms if provided
        platforms = None
        if target_platforms:
            platforms = [p.strip() for p in target_platforms.split(",") if p.strip()]
        
        # Build metadata
        meta = None
        if any([product_name, locale != "en-US", platforms, auto_publish]):
            meta = JobMeta(
                product_name=product_name,
                locale=locale,
                target_platforms=platforms,
                auto_publish=auto_publish
            )
        
        # Create job request
        request = JobRequest(
            job_id=job_id,
            user_id=user_id,
            text_prompt=text_prompt,
            image_url=image_url,
            meta=meta
        )
        
        # Create job
        job_id = await job_manager.create_job(request)
        
        # Start background processing
        background_tasks.add_task(process_job_async, job_id, request)
        
        # Get initial job state
        job_state = await job_manager.get_job(job_id)
        
        return JobResponse(
            job_id=job_id,
            status=job_state.status,
            created_at=job_state.created_at,
            updated_at=job_state.updated_at,
            message="Job created and processing started"
        )
        
    except ValidationError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        logger.error(f"Error creating job: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/v1/jobs/json", response_model=JobResponse, status_code=202)
async def create_job_json(
    background_tasks: BackgroundTasks,
    request: JobRequest
):
    """
    Create a new job from JSON payload.
    
    Alternative endpoint that accepts JSON instead of form-data.
    """
    try:
        # Create job
        job_id = await job_manager.create_job(request)
        
        # Start background processing
        background_tasks.add_task(process_job_async, job_id, request)
        
        # Get initial job state
        job_state = await job_manager.get_job(job_id)
        
        return JobResponse(
            job_id=job_id,
            status=job_state.status,
            created_at=job_state.created_at,
            updated_at=job_state.updated_at,
            message="Job created and processing started"
        )
        
    except ValidationError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        logger.error(f"Error creating job: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/v1/jobs/{job_id}", response_model=JobResponse)
async def get_job(job_id: str):
    """
    Get job status and results.
    
    Args:
        job_id: Job ID to retrieve
    
    Returns:
        JobResponse with current status and results
    """
    job_state = await job_manager.get_job(job_id)
    
    if not job_state:
        raise HTTPException(status_code=404, detail=f"Job {job_id} not found")
    
    # Get error message if failed
    error_msg = None
    if job_state.status == JobStatus.FAILED and job_state.error_log:
        error_msg = job_state.error_log[-1]  # Get last error
    
    return JobResponse(
        job_id=job_state.job_id,
        status=job_state.status,
        created_at=job_state.created_at,
        updated_at=job_state.updated_at,
        message=f"Job status: {job_state.status.value}",
        results=job_state.results,
        error=error_msg
    )


@app.get("/api/v1/jobs")
async def list_jobs(
    user_id: Optional[str] = None,
    status: Optional[JobStatus] = None,
    limit: int = 100
):
    """
    List jobs with optional filtering.
    
    Args:
        user_id: Filter by user ID
        status: Filter by status
        limit: Maximum number of jobs to return
    
    Returns:
        List of job summaries
    """
    jobs = await job_manager.list_jobs(user_id=user_id, status=status, limit=limit)
    
    return {
        "jobs": [
            {
                "job_id": job.job_id,
                "status": job.status.value,
                "created_at": job.created_at.isoformat(),
                "updated_at": job.updated_at.isoformat(),
                "has_results": job.results is not None
            }
            for job in jobs
        ],
        "count": len(jobs)
    }


ALLOWED_CONTENT_TYPES = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp"
]


@app.post("/api/upload-temp-image")
async def upload_temp_image(file: UploadFile = File(...)):
    """
    Upload image to tmpfiles.org and process through external agent.
    Returns strategies and analytics for Instagram, LinkedIn, and Blog.
    """
    # Validate content type
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        return JSONResponse(
            status_code=400,
            content={"status": "error", "error": "Invalid image format"}
        )
    
    # Generate session ID
    session_id = str(uuid.uuid4())
    
    try:
        # Read file bytes
        file_bytes = await file.read()
        
        # Step 1: Upload to tmpfiles.org
        files = {
            'file': (file.filename, file_bytes, file.content_type)
        }
        
        tmpfiles_response = requests.post(
            "https://tmpfiles.org/api/v1/upload",
            files=files
        )
        
        if tmpfiles_response.status_code != 200:
            return JSONResponse(
                status_code=500,
                content={"status": "error", "error": "Temporary file upload failed"}
            )
        
        # Parse tmpfiles.org response
        tmpfiles_data = tmpfiles_response.json()
        
        # Extract the URL and convert to direct link
        if tmpfiles_data.get("status") == "success":
            temp_url = tmpfiles_data["data"]["url"]
            # Convert tmpfiles.org URL to direct download URL
            temp_url = temp_url.replace("tmpfiles.org/", "tmpfiles.org/dl/")
        else:
            return JSONResponse(
                status_code=500,
                content={"status": "error", "error": "Failed to get temporary file URL"}
            )
        
        # Step 2: POST the session ID and temporary link to the webhook
        if not settings.external_agent_url:
            return JSONResponse(
                status_code=500,
                content={"status": "error", "error": "EXTERNAL_AGENT_URL not configured"}
            )
        
        webhook_response = requests.post(
            settings.external_agent_url,
            json={
                "session_id": session_id,
                "image_url": temp_url
            }
        )
        
        if webhook_response.status_code != 200:
            return JSONResponse(
                status_code=500,
                content={
                    "status": "error",
                    "error": "Webhook request failed",
                    "status_code": webhook_response.status_code,
                    "response": webhook_response.text
                }
            )
        
        # Parse response from webhook
        result = webhook_response.json()
        
        # Return the expected format with status and data
        # The webhook response should contain the strategies and analytics
        return JSONResponse(
            status_code=200,
            content={
                "status": "success",
                "data": result.get("data", result)  # Use data field if present, otherwise use entire result
            }
        )
            
    except requests.exceptions.RequestException as e:
        return JSONResponse(
            status_code=500,
            content={"status": "error", "error": f"Request failed: {str(e)}"}
        )
    except Exception as e:
        logger.error(f"Upload failed: {e}", exc_info=True)
        return JSONResponse(
            status_code=500,
            content={"status": "error", "error": f"Upload failed: {str(e)}"}
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=True,
        log_level=settings.log_level.lower()
    )

