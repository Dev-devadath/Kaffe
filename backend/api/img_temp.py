from fastapi import APIRouter, File, UploadFile
from fastapi.responses import JSONResponse
import requests

router = APIRouter()

ALLOWED_CONTENT_TYPES = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp"
]

@router.post("/api/upload-temp-image")
async def upload_temp_image(file: UploadFile = File(...)):
    """
    Upload image to temporary storage and return public URL
    """
    # Validate content type
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        return JSONResponse(
            status_code=400,
            content={"error": "Invalid image format"}
        )
    
    try:
        # Read file bytes
        file_bytes = await file.read()
        
        # Prepare multipart upload for tmpfiles.org
        files = {
            'file': (file.filename, file_bytes, file.content_type)
        }
        
        # Upload to webhook
        response = requests.post(
            "https://a4318af379dd.ngrok-free.app/webhook-test/analyze",
            files=files,
            timeout=30
        )
        
        # Check if upload was successful
        if response.status_code != 200:
            return JSONResponse(
                status_code=500,
                content={"error": "Temporary upload failed"}
            )
        
        # Parse response from webhook
        result = response.json()
        
        # Extract the URL from the response
        if "url" in result:
            return JSONResponse(
                status_code=200,
                content={"url": result["url"]}
            )
        else:
            return JSONResponse(
                status_code=500,
                content={"error": "Temporary upload failed"}
            )
            
    except requests.exceptions.RequestException:
        return JSONResponse(
            status_code=500,
            content={"error": "Temporary upload failed"}
        )
    except Exception:
        return JSONResponse(
            status_code=500,
            content={"error": "Temporary upload failed"}
        )
