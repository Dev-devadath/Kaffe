"""Gemini 2.5 API client service."""
import os
from typing import Dict, Any, Optional
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold
from utils.logger import logger


class GeminiClient:
    """Client for interacting with Google Gemini 2.5 API."""
    
    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize Gemini client.
        
        Args:
            api_key: Google API key (defaults to GOOGLE_API_KEY env var)
        """
        self.api_key = api_key or os.getenv("GOOGLE_API_KEY")
        if not self.api_key:
            raise ValueError("GOOGLE_API_KEY environment variable is required")
        
        genai.configure(api_key=self.api_key)
        
        # Initialize the model (Gemini 2.5)
        # Note: Adjust model name based on actual Gemini 2.5 model name
        # Common names: gemini-2.0-flash-exp, gemini-1.5-pro, gemini-1.5-flash
        # Using gemini-1.5-pro as fallback, update when Gemini 2.5 is available
        try:
            self.model = genai.GenerativeModel('gemini-1.5-pro')
            logger.info("Gemini client initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize Gemini model: {e}")
            # Fallback to flash model
            try:
                self.model = genai.GenerativeModel('gemini-1.5-flash')
                logger.info("Using Gemini Flash as fallback")
            except Exception as e2:
                logger.error(f"Failed to initialize fallback model: {e2}")
                raise
    
    async def generate_content(
        self,
        prompt: str,
        context: Optional[Dict[str, Any]] = None,
        system_instruction: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: Optional[int] = None
    ) -> str:
        """
        Generate content using Gemini API.
        
        Args:
            prompt: The main prompt/question
            context: Additional context dictionary to include
            system_instruction: System-level instructions
            temperature: Sampling temperature (0.0 to 1.0)
            max_tokens: Maximum tokens to generate
        
        Returns:
            Generated text response
        
        Raises:
            Exception: If generation fails
        """
        try:
            # Build the full prompt with context
            full_prompt = self._build_prompt(prompt, context)
            
            # Configure generation parameters
            generation_config = {
                "temperature": temperature,
            }
            if max_tokens:
                generation_config["max_output_tokens"] = max_tokens
            
            # Safety settings - allow all content for marketing use case
            safety_settings = {
                HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
                HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
                HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
                HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
            }
            
            # Generate content
            logger.debug(f"Generating content with prompt length: {len(full_prompt)}")
            
            response = self.model.generate_content(
                full_prompt,
                generation_config=generation_config,
                safety_settings=safety_settings,
                system_instruction=system_instruction
            )
            
            if not response.text:
                raise ValueError("Empty response from Gemini API")
            
            logger.debug(f"Generated content length: {len(response.text)}")
            return response.text
            
        except Exception as e:
            logger.error(f"Error generating content with Gemini: {e}")
            raise
    
    def _build_prompt(self, prompt: str, context: Optional[Dict[str, Any]] = None) -> str:
        """
        Build full prompt string with context.
        
        Args:
            prompt: Base prompt
            context: Additional context to include
        
        Returns:
            Full prompt string
        """
        if not context:
            return prompt
        
        # Format context as structured information
        context_str = "\n\nAdditional Context:\n"
        for key, value in context.items():
            if isinstance(value, (list, dict)):
                import json
                context_str += f"{key}: {json.dumps(value, indent=2)}\n"
            else:
                context_str += f"{key}: {value}\n"
        
        return f"{prompt}{context_str}"
    
    async def analyze_brief(
        self,
        text_prompt: str,
        image_url: Optional[str] = None,
        meta: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Analyze a marketing brief and extract key information.
        
        Args:
            text_prompt: User's product/service description
            image_url: Optional image URL
            meta: Optional metadata
        
        Returns:
            Dictionary with extracted information
        """
        system_instruction = """You are an expert marketing strategist analyzing product briefs. 
        Extract key information including:
        - Product/service name
        - Key features and USPs
        - Target audience
        - Value propositions
        - Suggested tone and messaging
        - Content hooks and angles
        
        Return your analysis in a structured format."""
        
        prompt = f"""Analyze the following marketing brief and extract key insights:

Brief: {text_prompt}
"""
        
        if image_url:
            prompt += f"\nImage URL: {image_url} (Note: Image analysis will be handled separately)"
        
        if meta:
            prompt += f"\nMetadata: {meta}"
        
        prompt += "\n\nProvide a comprehensive analysis with actionable insights for content creation."
        
        response_text = await self.generate_content(
            prompt=prompt,
            system_instruction=system_instruction,
            temperature=0.7
        )
        
        # Parse response (in a real scenario, you might want structured output)
        # For now, return as dict with the raw response
        return {
            "analysis": response_text,
            "text_prompt": text_prompt,
            "image_url": image_url,
            "meta": meta
        }

