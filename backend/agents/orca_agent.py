"""Orca Orchestrator Agent - Main coordinator for the multi-agent system."""
from typing import Dict, Any, Optional
from models.job import JobRequest, JobStatus
from models.agent_contracts import (
    ImageAnalysisResult,
    BrandingResult,
    SEOResult,
    ChannelPlannerResult,
    ContentGenerationResult,
    QualityCheckResult,
    PublisherResult
)
from agents.base_agent import BaseAgent
from services.gemini_client import GeminiClient
from services.image_service import image_service
from services.job_manager import job_manager
from utils.validators import validate_text_prompt
from utils.logger import logger


class OrcaAgent(BaseAgent):
    """Main orchestrator agent that coordinates all sub-agents."""
    
    def __init__(self, gemini_client: Optional[GeminiClient] = None):
        """
        Initialize Orca agent.
        
        Args:
            gemini_client: Optional Gemini client instance
        """
        super().__init__("Orca")
        self.gemini_client = gemini_client or GeminiClient()
        self.image_service = image_service
    
    async def execute(self, job_id: str, request: JobRequest) -> Dict[str, Any]:
        """
        Execute the main orchestration flow.
        
        This is the entry point called by the API.
        
        Args:
            job_id: Job ID
            request: Job request data
        
        Returns:
            Dictionary with orchestration results
        """
        try:
            # Update job status to processing
            await job_manager.update_job(job_id, status=JobStatus.PROCESSING)
            self.log_info(f"Starting orchestration for job {job_id}")
            
            # Step 1: Validate inputs
            await self._validate_inputs(request)
            
            # Step 2: Handle image (if provided)
            image_metadata = None
            if request.image_url:
                self.log_info(f"Processing image: {request.image_url}")
                image_metadata = await self.image_service.process_image(str(request.image_url))
            
            # Step 3: Prepare context for analysis
            context = await self._prepare_context(request, image_metadata)
            
            # Step 4: Use Gemini to analyze the brief and generate orchestration plan
            analysis = await self._generate_orchestration_plan(context)
            
            # Step 5: Structure response for future agent integration
            result = await self._structure_response(
                job_id=job_id,
                request=request,
                analysis=analysis,
                image_metadata=image_metadata
            )
            
            # Step 6: Update job with results
            await job_manager.update_job(job_id, status=JobStatus.COMPLETED, result=result)
            self.log_info(f"Orchestration completed for job {job_id}")
            
            return result
            
        except Exception as e:
            error_msg = f"Orchestration failed: {str(e)}"
            self.log_error(error_msg, exc_info=True)
            await job_manager.update_job(job_id, status=JobStatus.FAILED, error=error_msg)
            raise
    
    async def _validate_inputs(self, request: JobRequest):
        """
        Validate job request inputs.
        
        Args:
            request: Job request to validate
        
        Raises:
            ValueError: If validation fails
        """
        # Validate text prompt
        is_valid, error = validate_text_prompt(request.text_prompt)
        if not is_valid:
            raise ValueError(f"Invalid text prompt: {error}")
        
        # Validate image URL if provided
        if request.image_url:
            is_valid, error = await self.image_service.validate_image(str(request.image_url))
            if not is_valid:
                raise ValueError(f"Invalid image URL: {error}")
        
        # Validate metadata if provided
        if request.meta:
            if request.meta.locale:
                from utils.validators import validate_locale
                if not validate_locale(request.meta.locale):
                    raise ValueError(f"Invalid locale format: {request.meta.locale}")
        
        self.log_debug("Input validation passed")
    
    async def _prepare_context(
        self,
        request: JobRequest,
        image_metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Prepare context dictionary for Gemini analysis.
        
        Args:
            request: Job request
            image_metadata: Optional image metadata
        
        Returns:
            Context dictionary
        """
        context = {
            "text_prompt": request.text_prompt,
            "product_name": request.meta.product_name if request.meta else None,
            "locale": request.meta.locale if request.meta else "en-US",
            "target_platforms": request.meta.target_platforms if request.meta else [],
            "has_image": request.image_url is not None,
            "image_url": str(request.image_url) if request.image_url else None,
        }
        
        if image_metadata:
            context["image_metadata"] = image_metadata
        
        return context
    
    async def _generate_orchestration_plan(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Use Gemini to analyze the brief and generate an orchestration plan.
        
        Args:
            context: Context dictionary
        
        Returns:
            Analysis dictionary with insights
        """
        self.log_info("Generating orchestration plan with Gemini")
        
        analysis = await self.gemini_client.analyze_brief(
            text_prompt=context["text_prompt"],
            image_url=context.get("image_url"),
            meta={
                "product_name": context.get("product_name"),
                "locale": context.get("locale"),
                "target_platforms": context.get("target_platforms", [])
            }
        )
        
        self.log_debug("Orchestration plan generated successfully")
        return analysis
    
    async def _structure_response(
        self,
        job_id: str,
        request: JobRequest,
        analysis: Dict[str, Any],
        image_metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Structure the final response with placeholders for future agent results.
        
        Args:
            job_id: Job ID
            request: Original request
            analysis: Gemini analysis
            image_metadata: Optional image metadata
        
        Returns:
            Structured result dictionary
        """
        result = {
            "job_id": job_id,
            "orchestration_plan": {
                "brief_analysis": analysis.get("analysis", ""),
                "extracted_info": {
                    "text_prompt": request.text_prompt,
                    "product_name": request.meta.product_name if request.meta else None,
                    "locale": request.meta.locale if request.meta else "en-US",
                    "target_platforms": request.meta.target_platforms if request.meta else [],
                }
            },
            "agent_results": {
                # Placeholders for future agent integration
                "image_analysis": None,  # Will be populated by Image Analysis Agent
                "branding": None,  # Will be populated by Branding Agent
                "seo": None,  # Will be populated by SEO Agent
                "channel_planning": None,  # Will be populated by Channel Planner
                "content_generation": [],  # Will be populated by Content Generation Agents
                "quality_check": None,  # Will be populated by Quality Agent
                "publisher": None,  # Will be populated by Publisher Agent
            },
            "image_metadata": image_metadata,
            "status": "ready_for_agent_integration",
            "next_steps": [
                "Integrate Image Analysis Agent",
                "Integrate Branding Agent",
                "Integrate SEO Agent",
                "Integrate Channel Planner",
                "Integrate Content Generation Agents",
                "Integrate Quality Agent",
                "Integrate Publisher Agent"
            ]
        }
        
        return result
    
    # Placeholder methods for future agent integration
    
    async def _call_image_analysis_agent(
        self,
        job_id: str,
        image_url: str
    ) -> Optional[ImageAnalysisResult]:
        """
        Call Image Analysis Agent.
        
        TODO: Implement when Image Analysis Agent is ready.
        
        Args:
            job_id: Job ID
            image_url: Image URL to analyze
        
        Returns:
            ImageAnalysisResult or None
        """
        # TODO: Implement HTTP/gRPC call to Image Analysis Agent
        self.log_debug(f"Image Analysis Agent not yet integrated for job {job_id}")
        return None
    
    async def _call_branding_agent(
        self,
        job_id: str,
        text_prompt: str,
        image_analysis: Optional[ImageAnalysisResult] = None
    ) -> Optional[BrandingResult]:
        """
        Call Branding Agent.
        
        TODO: Implement when Branding Agent is ready.
        
        Args:
            job_id: Job ID
            text_prompt: Text prompt
            image_analysis: Optional image analysis results
        
        Returns:
            BrandingResult or None
        """
        # TODO: Implement HTTP/gRPC call to Branding Agent
        self.log_debug(f"Branding Agent not yet integrated for job {job_id}")
        return None
    
    async def _call_seo_agent(
        self,
        job_id: str,
        text_prompt: str,
        branding_result: Optional[BrandingResult] = None
    ) -> Optional[SEOResult]:
        """
        Call SEO & Keyword Agent.
        
        TODO: Implement when SEO Agent is ready.
        
        Args:
            job_id: Job ID
            text_prompt: Text prompt
            branding_result: Optional branding results
        
        Returns:
            SEOResult or None
        """
        # TODO: Implement HTTP/gRPC call to SEO Agent
        self.log_debug(f"SEO Agent not yet integrated for job {job_id}")
        return None
    
    async def _call_channel_planner(
        self,
        job_id: str,
        branding: Optional[BrandingResult],
        seo: Optional[SEOResult],
        image_analysis: Optional[ImageAnalysisResult],
        meta: Optional[Dict[str, Any]]
    ) -> Optional[ChannelPlannerResult]:
        """
        Call Channel Planner Agent.
        
        TODO: Implement when Channel Planner is ready.
        
        Args:
            job_id: Job ID
            branding: Branding results
            seo: SEO results
            image_analysis: Image analysis results
            meta: Job metadata
        
        Returns:
            ChannelPlannerResult or None
        """
        # TODO: Implement HTTP/gRPC call to Channel Planner
        self.log_debug(f"Channel Planner not yet integrated for job {job_id}")
        return None
    
    async def _call_content_generators(
        self,
        job_id: str,
        channel_briefs: list
    ) -> list[ContentGenerationResult]:
        """
        Call Content Generation Agents.
        
        TODO: Implement when Content Generation Agents are ready.
        
        Args:
            job_id: Job ID
            channel_briefs: List of channel briefs
        
        Returns:
            List of ContentGenerationResult
        """
        # TODO: Implement parallel calls to Content Generation Agents
        self.log_debug(f"Content Generation Agents not yet integrated for job {job_id}")
        return []
    
    async def _call_quality_agent(
        self,
        job_id: str,
        content_results: list[ContentGenerationResult]
    ) -> Optional[QualityCheckResult]:
        """
        Call Quality & Simulation Agent.
        
        TODO: Implement when Quality Agent is ready.
        
        Args:
            job_id: Job ID
            content_results: List of generated content
        
        Returns:
            QualityCheckResult or None
        """
        # TODO: Implement HTTP/gRPC call to Quality Agent
        self.log_debug(f"Quality Agent not yet integrated for job {job_id}")
        return None
    
    async def _call_publisher_agent(
        self,
        job_id: str,
        content_results: list[ContentGenerationResult],
        auto_publish: bool = False
    ) -> Optional[PublisherResult]:
        """
        Call Publisher Agent.
        
        TODO: Implement when Publisher Agent is ready.
        
        Args:
            job_id: Job ID
            content_results: List of finalized content
            auto_publish: Whether to auto-publish
        
        Returns:
            PublisherResult or None
        """
        # TODO: Implement HTTP/gRPC call to Publisher Agent
        self.log_debug(f"Publisher Agent not yet integrated for job {job_id}")
        return None

