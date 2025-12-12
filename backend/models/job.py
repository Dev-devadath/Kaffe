"""Job-related data models."""
from datetime import datetime
from enum import Enum
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, HttpUrl, field_validator


class JobStatus(str, Enum):
    """Job processing status."""
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class JobMeta(BaseModel):
    """Optional metadata for a job."""
    product_name: Optional[str] = None
    locale: Optional[str] = Field(default="en-US", description="Locale code (e.g., en-US, en-IN)")
    target_platforms: Optional[List[str]] = Field(default=None, description="List of target platforms")
    auto_publish: Optional[bool] = Field(default=False, description="Whether to auto-publish content")
    user_id: Optional[str] = None
    brand_guidelines_url: Optional[HttpUrl] = None

    @field_validator('target_platforms')
    @classmethod
    def validate_platforms(cls, v):
        """Validate target platforms."""
        if v is not None:
            valid_platforms = ['instagram', 'linkedin', 'twitter', 'facebook', 'blog', 'newsletter']
            for platform in v:
                if platform.lower() not in valid_platforms:
                    raise ValueError(f"Invalid platform: {platform}. Must be one of {valid_platforms}")
        return v


class JobRequest(BaseModel):
    """Input schema for job submission."""
    job_id: Optional[str] = Field(default=None, description="Optional UUID for the job")
    user_id: Optional[str] = None
    text_prompt: str = Field(..., min_length=10, description="Product/service description and goals")
    image_url: Optional[HttpUrl] = Field(default=None, description="Publicly accessible image URL")
    meta: Optional[JobMeta] = None

    class Config:
        json_schema_extra = {
            "example": {
                "job_id": "optional-uuid",
                "user_id": "user-123",
                "text_prompt": "EcoBottle — vacuum insulated bottle for commuters. Highlight sustainability and 12h hot retention.",
                "image_url": "https://cdn.example.com/uploads/ecobottle.jpg",
                "meta": {
                    "product_name": "EcoBottle",
                    "locale": "en-IN",
                    "target_platforms": ["instagram", "linkedin"],
                    "auto_publish": False
                }
            }
        }


class JobResponse(BaseModel):
    """Output schema for job status and results."""
    job_id: str
    status: JobStatus
    created_at: datetime
    updated_at: datetime
    message: str
    results: Optional[Dict[str, Any]] = Field(default=None, description="Job results when completed")
    error: Optional[str] = Field(default=None, description="Error message if status is failed")


class JobState(BaseModel):
    """Internal job state tracking."""
    job_id: str
    user_id: Optional[str] = None
    text_prompt: str
    image_url: Optional[str] = None
    meta: Optional[JobMeta] = None
    status: JobStatus = JobStatus.PENDING
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    error_log: List[str] = Field(default_factory=list)
    results: Optional[Dict[str, Any]] = None

    def update_status(self, new_status: JobStatus, error: Optional[str] = None):
        """Update job status and timestamp."""
        self.status = new_status
        self.updated_at = datetime.utcnow()
        if error:
            self.error_log.append(f"[{self.updated_at.isoformat()}] {error}")

    def add_result(self, result: Dict[str, Any]):
        """Add result data to job state."""
        if self.results is None:
            self.results = {}
        self.results.update(result)
        self.updated_at = datetime.utcnow()

