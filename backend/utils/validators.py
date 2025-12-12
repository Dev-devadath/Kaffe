"""Input validation helpers."""
import re
from typing import Optional
from urllib.parse import urlparse
from PIL import Image
import httpx


def validate_url(url: str) -> bool:
    """
    Validate if a string is a valid URL.
    
    Args:
        url: URL string to validate
    
    Returns:
        True if valid URL, False otherwise
    """
    try:
        result = urlparse(url)
        return all([result.scheme, result.netloc])
    except Exception:
        return False


def validate_text_prompt(text: str, min_length: int = 10) -> tuple[bool, Optional[str]]:
    """
    Validate text prompt.
    
    Args:
        text: Text to validate
        min_length: Minimum required length
    
    Returns:
        Tuple of (is_valid, error_message)
    """
    if not text or not isinstance(text, str):
        return False, "Text prompt must be a non-empty string"
    
    if len(text.strip()) < min_length:
        return False, f"Text prompt must be at least {min_length} characters long"
    
    # Check for reasonable maximum length (e.g., 5000 characters)
    if len(text) > 5000:
        return False, "Text prompt exceeds maximum length of 5000 characters"
    
    return True, None


def validate_image_url_format(url: str) -> bool:
    """
    Validate image URL format (checks extension).
    
    Args:
        url: Image URL to validate
    
    Returns:
        True if URL appears to be an image, False otherwise
    """
    if not validate_url(url):
        return False
    
    # Common image extensions
    image_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'}
    parsed = urlparse(url.lower())
    path = parsed.path
    
    # Check if path ends with image extension
    if any(path.endswith(ext) for ext in image_extensions):
        return True
    
    # Some URLs might not have extensions (e.g., CDN URLs)
    # In that case, we'll let it pass and validate during download
    return True


async def validate_image_download(url: str, timeout: int = 10) -> tuple[bool, Optional[str]]:
    """
    Validate image by attempting to download and verify it's a valid image.
    
    Args:
        url: Image URL to validate
        timeout: Request timeout in seconds
    
    Returns:
        Tuple of (is_valid, error_message)
    """
    try:
        async with httpx.AsyncClient(timeout=timeout) as client:
            response = await client.get(url)
            response.raise_for_status()
            
            # Check content type
            content_type = response.headers.get('content-type', '').lower()
            if not content_type.startswith('image/'):
                return False, f"URL does not point to an image (content-type: {content_type})"
            
            # Try to open as image
            try:
                from io import BytesIO
                img = Image.open(BytesIO(response.content))
                img.verify()
                return True, None
            except Exception as e:
                return False, f"Invalid image format: {str(e)}"
                
    except httpx.TimeoutException:
        return False, "Image download timed out"
    except httpx.HTTPStatusError as e:
        return False, f"HTTP error: {e.response.status_code}"
    except Exception as e:
        return False, f"Error validating image: {str(e)}"


def validate_locale(locale: str) -> bool:
    """
    Validate locale format (e.g., en-US, en-IN).
    
    Args:
        locale: Locale string to validate
    
    Returns:
        True if valid format, False otherwise
    """
    pattern = r'^[a-z]{2}-[A-Z]{2}$'
    return bool(re.match(pattern, locale))

