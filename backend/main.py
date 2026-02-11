from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from datetime import timedelta, datetime
from bson import ObjectId
import io

from config import settings
from models import UserCreate, UserLogin, UserResponse, Token, WatermarkRecord, WatermarkDetectionResult
from auth import (
    get_password_hash,
    authenticate_user,
    create_access_token,
    get_current_user
)
from database import users_collection, watermarks_collection
from watermark import embed_watermark, detect_watermark

app = FastAPI(title="Audio Watermarking Anti-Piracy System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Audio Watermarking Anti-Piracy System API"}

@app.post("/api/auth/register", response_model=UserResponse)
async def register(user: UserCreate):
    """Register a new user"""
    existing_user = users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    hashed_password = get_password_hash(user.password)
    
    user_dict = {
        "email": user.email,
        "full_name": user.full_name,
        "hashed_password": hashed_password,
        "created_at": datetime.utcnow()
    }
    
    result = users_collection.insert_one(user_dict)
    
    return UserResponse(
        id=str(result.inserted_id),
        email=user.email,
        full_name=user.full_name
    )

@app.post("/api/auth/login", response_model=Token)
async def login(user: UserLogin):
    """Login user and return JWT token"""
    authenticated_user = authenticate_user(user.email, user.password)
    if not authenticated_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": authenticated_user["email"]},
        expires_delta=access_token_expires
    )
    
    return Token(access_token=access_token, token_type="bearer")

@app.get("/api/auth/me", response_model=UserResponse)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """Get current logged-in user information"""
    return UserResponse(
        id=str(current_user["_id"]),
        email=current_user["email"],
        full_name=current_user["full_name"]
    )

@app.post("/api/watermark/embed")
async def embed_watermark_endpoint(
    file: UploadFile = File(...),
    content_id: str = None,
    current_user: dict = Depends(get_current_user)
):
    """Embed watermark in audio/video file"""
    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded")
    
    if not content_id:
        content_id = f"content_{datetime.utcnow().timestamp()}"
    
    file_bytes = await file.read()
    
    try:
        watermarked_bytes, watermark_id = embed_watermark(
            file_bytes,
            str(current_user["_id"]),
            content_id
        )
        
        watermark_record = {
            "user_id": str(current_user["_id"]),
            "email": current_user["email"],
            "content_id": content_id,
            "watermark_id": watermark_id,
            "timestamp": datetime.utcnow(),
            "original_filename": file.filename,
            "watermarked_filename": f"watermarked_{file.filename}"
        }
        watermarks_collection.insert_one(watermark_record)
        
        return StreamingResponse(
            io.BytesIO(watermarked_bytes),
            media_type="audio/wav",
            headers={
                "Content-Disposition": f"attachment; filename=watermarked_{file.filename.rsplit('.', 1)[0]}.wav"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

@app.post("/api/watermark/detect", response_model=WatermarkDetectionResult)
async def detect_watermark_endpoint(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """Detect and extract watermark from audio file"""
    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded")
    
    file_bytes = await file.read()
    
    try:
        watermark_id = detect_watermark(file_bytes)
        
        if watermark_id:
            watermark_record = watermarks_collection.find_one({"watermark_id": watermark_id})
            
            if watermark_record:
                return WatermarkDetectionResult(
                    detected=True,
                    watermark_id=watermark_id,
                    user_email=watermark_record["email"],
                    content_id=watermark_record["content_id"],
                    timestamp=watermark_record["timestamp"]
                )
            else:
                return WatermarkDetectionResult(
                    detected=True,
                    watermark_id=watermark_id,
                    user_email=None,
                    content_id=None,
                    timestamp=None
                )
        else:
            return WatermarkDetectionResult(detected=False)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error detecting watermark: {str(e)}")

@app.get("/api/watermarks/history")
async def get_watermark_history(current_user: dict = Depends(get_current_user)):
    """Get watermark history for current user"""
    watermarks = list(watermarks_collection.find(
        {"user_id": str(current_user["_id"])}
    ).sort("timestamp", -1))
    
    for watermark in watermarks:
        watermark["_id"] = str(watermark["_id"])
        watermark["timestamp"] = watermark["timestamp"].isoformat()
    
    return watermarks

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
