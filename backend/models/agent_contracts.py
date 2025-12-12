"""Contract schemas for agent responses (placeholders for future agents)."""
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class ImageAnalysisResult(BaseModel):
    """Response schema for Image Analysis Agent."""
    objects: List[str] = Field(default_factory=list, description="Detected objects")
    ocr_text: Optional[str] = Field(default=None, description="Extracted text from image")
    colors: List[str] = Field(default_factory=list, description="Dominant colors")
    mood: Optional[str] = Field(default=None, description="Mood/emotion detected")
    alt_text: Optional[str] = Field(default=None, description="Generated alt text")
    hooks: List[str] = Field(default_factory=list, description="Visual hooks identified")
    tags: List[str] = Field(default_factory=list, description="Relevant tags")
    confidence: float = Field(default=0.0, ge=0.0, le=1.0, description="Confidence score")


class BrandingResult(BaseModel):
    """Response schema for Branding Agent."""
    audience_personas: List[Dict[str, Any]] = Field(default_factory=list)
    tone_options: List[str] = Field(default_factory=list)
    brand_do_rules: List[str] = Field(default_factory=list)
    brand_dont_rules: List[str] = Field(default_factory=list)
    seed_keywords: List[str] = Field(default_factory=list)
    value_props: List[str] = Field(default_factory=list)


class SEOResult(BaseModel):
    """Response schema for SEO & Keyword Agent."""
    keywords: List[Dict[str, Any]] = Field(default_factory=list, description="Keyword clusters with scores")
    intent_classification: Optional[str] = Field(default=None, description="Search intent type")
    priority_keywords: List[str] = Field(default_factory=list, description="High-priority keywords")
    serp_insights: Optional[Dict[str, Any]] = Field(default=None, description="SERP analysis data")


class ChannelBrief(BaseModel):
    """Schema for channel-specific briefs from Channel Planner."""
    channel: str
    format: str
    content_length: Optional[int] = None
    image_crops: Optional[List[Dict[str, Any]]] = None
    posting_times: Optional[List[str]] = None
    requirements: Dict[str, Any] = Field(default_factory=dict)


class ChannelPlannerResult(BaseModel):
    """Response schema for Channel Planner Agent."""
    channel_briefs: List[ChannelBrief] = Field(default_factory=list)


class ContentGenerationResult(BaseModel):
    """Response schema for Content Generation Agents."""
    format_type: str  # blog, social, newsletter, visual_prompt
    content: Dict[str, Any] = Field(default_factory=dict)
    metadata: Dict[str, Any] = Field(default_factory=dict)


class QualityCheckResult(BaseModel):
    """Response schema for Quality & Simulation Agent."""
    confidence: float = Field(ge=0.0, le=1.0)
    readability_score: Optional[float] = None
    keyword_coverage: Optional[float] = None
    ctr_simulation: Optional[float] = None
    issues: List[str] = Field(default_factory=list)
    suggestions: List[str] = Field(default_factory=list)


class PublisherResult(BaseModel):
    """Response schema for Publisher Agent."""
    publish_ids: Dict[str, str] = Field(default_factory=dict, description="Platform -> publish_id mapping")
    tracking_urls: Dict[str, str] = Field(default_factory=dict, description="Platform -> tracking URL mapping")
    scheduled_at: Optional[str] = None
    status: str = "scheduled"  # scheduled, published, failed

