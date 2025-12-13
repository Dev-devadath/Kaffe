from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import requests
import uvicorn
import uuid
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="Image Upload API",
    description="API for uploading images to temporary storage",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ALLOWED_CONTENT_TYPES = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp"
]

EXTERNAL_AGENT_URL = os.getenv("EXTERNAL_AGENT_URL")

@app.post("/api/upload-temp-image")
async def upload_temp_image(file: UploadFile = File(...)):
    """
    Upload image to tmpfiles.org and return session ID with URL
    """
    # Validate content type
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        return JSONResponse(
            status_code=400,
            content={"error": "Invalid image format"}
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
                content={"error": "Temporary file upload failed"}
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
                content={"error": "Failed to get temporary file URL"}
            )
        
        # Step 2: POST the session ID and temporary link to the webhook
        webhook_response = requests.post(
            EXTERNAL_AGENT_URL,
            json={
                "session_id": session_id,
                "image_url": temp_url
            }
        )
        
        if webhook_response.status_code != 200:
            return JSONResponse(
                status_code=500,
                content={
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
            content={"error": f"Request failed: {str(e)}"}
        )
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": f"Upload failed: {str(e)}"}
        )


if __name__ == "__main__":
    uvicorn.run("img_temp:app", host="0.0.0.0", port=8000, reload=True)
