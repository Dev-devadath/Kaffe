"""Image Decoder Agent for KAFFE multi-agent AI system.

This agent analyzes product images using Gemini Vision to extract Canonical Visual Identity (CVI)
without hallucination or product identity modification. Outputs strict JSON matching ImageAnalysisResult schema.
"""

import os
import json
import io
from typing import Dict, Any, Optional, List
from PIL import Image
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold

from agents.base_agent import BaseAgent
from models.agent_contracts import ImageAnalysisResult, VisualConstraints
from utils.logger import logger


class ImageAgent(BaseAgent):
    """Image Analysis Agent using Gemini Vision for CVI extraction."""
    
    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize ImageAgent with Gemini Vision model.
        
        Args:
            api_key: Google API key (defaults to GOOGLE_API_KEY env var)
        """
        super().__init__(name="ImageAgent")
        
        # Load API key from .env through environment variable
        self.api_key = api_key or os.getenv("GOOGLE_API_KEY")
        if not self.api_key:
            raise ValueError("GOOGLE_API_KEY environment variable is required")
        
        # Configure Gemini
        genai.configure(api_key=self.api_key)
        
        # Initialize Gemini Vision model (supports image inputs)
        try:
            self.model = genai.GenerativeModel('gemini-1.5-pro')
            self.log_info("Gemini Vision model initialized successfully")
        except Exception as e:
            self.log_error(f"Failed to initialize Gemini Pro, trying Flash: {e}")
            try:
                self.model = genai.GenerativeModel('gemini-1.5-flash')
                self.log_info("Using Gemini Flash as fallback")
            except Exception as e2:
                self.log_error(f"Failed to initialize any Gemini model: {e2}")
                raise
        
        # Safety settings - allow all content for product analysis
        self.safety_settings = {
            HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
            HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
            HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
            HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
        }
        
        # Generation config for strict JSON output
        self.generation_config = {
            "temperature": 0.1,  # Low temperature for precise, factual analysis
            "max_output_tokens": 4096,
        }
    
    def _build_cvi_extraction_prompt(self) -> str:
        """
        Build the prompt for Canonical Visual Identity extraction.
        
        Returns:
            Detailed prompt string enforcing CVI preservation rules
        """
        return """You are a precision visual analysis system designed to extract Canonical Visual Identity (CVI) from product images.

**CRITICAL RULES:**
1. **NO HALLUCINATION**: Describe ONLY what is visibly present in the image
2. **NO GUESSING**: If uncertain about any detail, omit it or mark as "uncertain"
3. **NO MODIFICATION**: Never suggest changes or improvements to the product
4. **PRESERVE IDENTITY**: Extract exact visual characteristics to preserve product appearance in future poster generation

**YOUR TASK:**
Analyze the product image and extract the following information in STRICT JSON format:

{
  "product_type": "String - specific product category (e.g., 'ceramic coffee mug', 'leather handbag', 'wooden chair')",
  "visual_description": "String - precise description of what is visible (appearance, form, visible text/logos)",
  "visible_features": ["Array of strings - specific visible features like 'handle on right side', 'matte finish', 'circular base'"],
  "aesthetics_and_style": ["Array of strings - style attributes like 'minimalist', 'rustic', 'modern', 'vintage'"],
  "mood_or_emotion": ["Array of strings - emotions evoked like 'calm', 'energetic', 'professional', 'playful'"],
  "possible_use_cases": ["Array of strings - realistic use contexts based on visible design"],
  "visual_constraints": {
    "exact_colors": ["Array of strings - precise color descriptions like 'deep navy blue', 'cream white', 'metallic silver'"],
    "materials": "String - materials visible in the image (e.g., 'glazed ceramic', 'brushed aluminum', 'natural wood grain')",
    "shape_form": "String - precise geometric description of shape and form",
    "forbidden_modifications": [
      "Do not change color",
      "Do not change proportions",
      "Do not remove components",
      "Do not add components",
      "Do not redesign any visible part"
    ]
  }
}

**EXTRACTION GUIDELINES:**
- **Product Type**: Be specific (not just "mug" but "ceramic coffee mug with handle")
- **Visual Description**: Focus on objective visual characteristics, not marketing language
- **Visible Features**: List concrete, observable elements (textures, shapes, labels, patterns)
- **Aesthetics**: Identify the design style based on visual cues
- **Mood**: What emotions does the visual design evoke?
- **Use Cases**: Based on visible design, what is this product used for?
- **Exact Colors**: Use precise color names (not just "blue" but "sky blue" or "navy blue")
- **Materials**: Describe visible material properties (texture, finish, surface quality)
- **Shape/Form**: Geometric description (cylindrical, rectangular, curved, angular, etc.)

**OUTPUT FORMAT:**
Return ONLY valid JSON matching the schema above. No additional text, explanations, or markdown formatting.
Ensure all arrays are populated with at least 1-3 relevant items based on visible information.

Analyze the product image now and return the JSON:"""
    
    def _load_image_from_bytes(self, image_bytes: bytes) -> Image.Image:
        """
        Load image from bytes using Pillow.
        
        Args:
            image_bytes: Raw image bytes
            
        Returns:
            PIL Image object
            
        Raises:
            ValueError: If image cannot be loaded
        """
        try:
            image = Image.open(io.BytesIO(image_bytes))
            self.log_debug(f"Image loaded successfully: {image.format} {image.size}")
            return image
        except Exception as e:
            self.log_error(f"Failed to load image from bytes: {e}")
            raise ValueError(f"Invalid image data: {e}")
    
    def _parse_gemini_response(self, response_text: str) -> Dict[str, Any]:
        """
        Parse Gemini response and extract JSON.
        
        Args:
            response_text: Raw response from Gemini
            
        Returns:
            Parsed JSON dictionary
            
        Raises:
            ValueError: If JSON parsing fails
        """
        try:
            # Try to find JSON in the response
            # Remove markdown code blocks if present
            text = response_text.strip()
            
            # Remove markdown code blocks
            if text.startswith("```json"):
                text = text[7:]
            elif text.startswith("```"):
                text = text[3:]
            
            if text.endswith("```"):
                text = text[:-3]
            
            text = text.strip()
            
            # Parse JSON
            parsed = json.loads(text)
            self.log_debug(f"Successfully parsed JSON response")
            return parsed
            
        except json.JSONDecodeError as e:
            self.log_error(f"JSON parsing failed: {e}")
            self.log_debug(f"Raw response: {response_text[:500]}")
            raise ValueError(f"Failed to parse JSON from Gemini response: {e}")
    
    def _create_fallback_result(self, error_message: str) -> ImageAnalysisResult:
        """
        Create a fallback ImageAnalysisResult when analysis fails.
        
        Args:
            error_message: Error description
            
        Returns:
            Fallback ImageAnalysisResult with minimal CVI data
        """
        self.log_error(f"Creating fallback result due to: {error_message}")
        
        return ImageAnalysisResult(
            product_type="unknown_product",
            visual_description=f"Analysis failed: {error_message}",
            visible_features=["unable_to_analyze"],
            aesthetics_and_style=["unknown"],
            mood_or_emotion=["neutral"],
            possible_use_cases=["general_purpose"],
            visual_constraints=VisualConstraints()
        )
    
    def _parse_to_image_analysis_result(self, cvi_data: Dict[str, Any]) -> ImageAnalysisResult:
        """
        Parse CVI data dictionary into ImageAnalysisResult Pydantic model.
        
        Args:
            cvi_data: CVI extraction dictionary from Gemini
            
        Returns:
            Validated ImageAnalysisResult instance
        """
        try:
            # Use Pydantic to validate and parse the data
            result = ImageAnalysisResult(**cvi_data)
            self.log_debug("Successfully parsed CVI data into ImageAnalysisResult")
            return result
            
        except Exception as e:
            self.log_error(f"Failed to parse CVI data to ImageAnalysisResult: {e}")
            return self._create_fallback_result(f"Parsing error: {e}")
    
    async def analyze_image(self, image_bytes: bytes) -> ImageAnalysisResult:
        """
        Analyze image and extract Canonical Visual Identity.
        
        Args:
            image_bytes: Raw image bytes
            
        Returns:
            ImageAnalysisResult with CVI data
        """
        try:
            # Load image
            self.log_info("Loading image from bytes")
            image = self._load_image_from_bytes(image_bytes)
            
            # Build prompt
            prompt = self._build_cvi_extraction_prompt()
            
            # Call Gemini Vision
            self.log_info("Sending image to Gemini Vision for CVI extraction")
            response = self.model.generate_content(
                [prompt, image],
                generation_config=self.generation_config,
                safety_settings=self.safety_settings
            )
            
            if not response.text:
                raise ValueError("Empty response from Gemini Vision")
            
            self.log_debug(f"Received response from Gemini ({len(response.text)} chars)")
            
            # Parse JSON response
            cvi_data = self._parse_gemini_response(response.text)
            
            # Store raw CVI data for debugging/logging
            self.log_debug(f"CVI extraction successful: {json.dumps(cvi_data, indent=2)[:500]}")
            
            # Parse to ImageAnalysisResult using Pydantic
            result = self._parse_to_image_analysis_result(cvi_data)
            
            self.log_info("Image analysis completed successfully")
            return result
            
        except Exception as e:
            self.log_error(f"Image analysis failed: {e}", exc_info=True)
            return self._create_fallback_result(str(e))
    
    async def execute(self, image_bytes: bytes, **kwargs) -> Dict[str, Any]:
        """
        Execute image analysis (implements BaseAgent.execute).
        
        Args:
            image_bytes: Raw image bytes (required)
            **kwargs: Additional parameters (ignored)
            
        Returns:
            Dictionary with 'result' key containing ImageAnalysisResult
        """
        # Validate inputs
        is_valid, error_msg = await self.validate_inputs(image_bytes=image_bytes)
        if not is_valid:
            self.log_error(f"Input validation failed: {error_msg}")
            return {
                "result": self._create_fallback_result(f"Validation error: {error_msg}"),
                "error": error_msg
            }
        
        # Analyze image
        result = await self.analyze_image(image_bytes)
        
        return {
            "result": result,
            "agent": self.name,
            "success": bool(result.product_type and result.product_type != "unknown_product")
        }
    
    async def validate_inputs(self, **kwargs) -> tuple[bool, Optional[str]]:
        """
        Validate inputs before execution.
        
        Args:
            **kwargs: Must contain 'image_bytes' key
            
        Returns:
            Tuple of (is_valid, error_message)
        """
        image_bytes = kwargs.get("image_bytes")
        
        if image_bytes is None:
            return False, "image_bytes parameter is required"
        
        if not isinstance(image_bytes, bytes):
            return False, f"image_bytes must be bytes, got {type(image_bytes)}"
        
        if len(image_bytes) == 0:
            return False, "image_bytes is empty"
        
        # Try to load image to validate format
        try:
            self._load_image_from_bytes(image_bytes)
        except Exception as e:
            return False, f"Invalid image format: {e}"
        
        return True, None


def get_gemini_model(api_key: Optional[str] = None) -> ImageAgent:
    """
    Factory function to create ImageAgent instance.
    
    This function provides compatibility with the expected `get_gemini_model()` pattern.
    
    Args:
        api_key: Google API key (defaults to env var)
        
    Returns:
        Initialized ImageAgent instance
    """
    return ImageAgent(api_key=api_key)
