from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, status, Query, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from datetime import timedelta, datetime, timezone
from typing import Optional
import io
import traceback

from config import settings
from models import (
    UserCreate,
    UserLogin,
    UserResponse,
    Token,
    WatermarkDetectionResult,
    WatermarkRecord,
)
from auth import (
    get_password_hash,
    authenticate_user,
    create_access_token,
    get_current_user,
)
from database import users_collection, watermarks_collection
from watermark import embed_watermark, detect_watermark

app = FastAPI(title="Audio/Video Watermarking Anti-Piracy System")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:8000",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Watermarking API Running Successfully"}

# ========== AUTH ==========

# Register: create user, return token, set cookie
@app.post("/api/auth/register", response_model=Token)
async def register(user: UserCreate, response: Response):
    existing_user = users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    hashed_password = get_password_hash(user.password)

    user_dict = {
        "email": user.email,
        "full_name": user.full_name,
        "hashed_password": hashed_password,
        "created_at": datetime.now(timezone.utc),
    }

    users_collection.insert_one(user_dict)

    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=access_token_expires,
    )

    # optional cookie
    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=True,
        secure=False,  # True in production with HTTPS
        samesite="lax",
        max_age=int(access_token_expires.total_seconds()),
    )

    return Token(access_token=access_token, token_type="bearer")

@app.post("/api/auth/login", response_model=Token)
async def login(user: UserLogin, response: Response):
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
        expires_delta=access_token_expires,
    )

    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=int(access_token_expires.total_seconds()),
    )

    return Token(access_token=access_token, token_type="bearer")

@app.get("/api/auth/me", response_model=UserResponse)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    return UserResponse(
        id=str(current_user["_id"]),
        email=current_user["email"],
        full_name=current_user["full_name"],
    )

# ========== EMBED WATERMARK ==========

@app.post("/api/watermark/embed")
async def embed_watermark_endpoint(
    file: UploadFile = File(...),
    content_id: Optional[str] = None,
    current_user: dict = Depends(get_current_user),
):
    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded")

    if not content_id:
        content_id = f"content_{datetime.now(timezone.utc).timestamp()}"

    file_bytes = await file.read()

    try:
        watermarked_bytes, watermark_id = embed_watermark(
            file_bytes,
            str(current_user["_id"]),
            content_id,
        )

        watermark_record = {
            "user_id": str(current_user["_id"]),
            "email": current_user["email"],
            "user_full_name": current_user["full_name"],
            "content_id": content_id,
            "watermark_id": watermark_id,
            "timestamp": datetime.now(timezone.utc),
            "original_filename": file.filename,
            "watermarked_filename": f"watermarked_{file.filename}",
            "status": "Embedded",
        }

        watermarks_collection.insert_one(watermark_record)

        media_type = "video/mp4"
        if file.filename.lower().endswith(".wav"):
            media_type = "audio/wav"

        return StreamingResponse(
            io.BytesIO(watermarked_bytes),
            media_type=media_type,
            headers={
                "Content-Disposition": f"attachment; filename=watermarked_{file.filename}"
            },
        )

    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(
            status_code=500,
            detail=f"Error processing file: {str(e)}",
        )

# ========== DETECT WATERMARK ==========

@app.post("/api/watermark/detect", response_model=WatermarkDetectionResult)
async def detect_watermark_endpoint(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
):
    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded")

    file_bytes = await file.read()

    try:
        watermark_id = detect_watermark(file_bytes)

        if watermark_id:
            watermark_record = watermarks_collection.find_one(
                {"watermark_id": watermark_id}
            )

            if watermark_record:
                detection_record = {
                    "user_id": str(current_user["_id"]),
                    "email": current_user["email"],
                    "user_full_name": current_user["full_name"],
                    "content_id": watermark_record.get("content_id"),
                    "watermark_id": watermark_id,
                    "timestamp": datetime.now(timezone.utc),
                    "original_filename": watermark_record.get("original_filename"),
                    "status": "Detected",
                }
                watermarks_collection.insert_one(detection_record)

                return WatermarkDetectionResult(
                    detected=True,
                    watermark_id=watermark_id,
                    user_email=watermark_record.get("email"),
                    user_full_name=watermark_record.get("user_full_name"),
                    content_id=watermark_record.get("content_id"),
                    timestamp=watermark_record.get("timestamp"),
                )

        failed_record = {
            "user_id": str(current_user["_id"]),
            "email": current_user["email"],
            "user_full_name": current_user["full_name"],
            "content_id": None,
            "watermark_id": None,
            "timestamp": datetime.now(timezone.utc),
            "original_filename": file.filename,
            "status": "No Watermark",
        }
        watermarks_collection.insert_one(failed_record)

        return WatermarkDetectionResult(detected=False)

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error detecting watermark: {str(e)}",
        )

# ========== HISTORY ==========

@app.get("/api/watermarks/history")
async def get_watermark_history(
    current_user: dict = Depends(get_current_user),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
):
    skip = (page - 1) * limit

    pipeline = [
        {"$match": {"user_id": str(current_user["_id"])}},
        {"$sort": {"timestamp": -1}},
        {"$skip": skip},
        {"$limit": limit},
        {
            "$project": {
                "_id": {"$toString": "$_id"},
                "user_id": 1,
                "email": 1,
                "user_full_name": 1,
                "content_id": 1,
                "watermark_id": 1,
                "timestamp": {
                    "$dateToString": {
                        "format": "%Y-%m-%dT%H:%M:%S.%LZ",
                        "date": "$timestamp",
                    }
                },
                "original_filename": 1,
                "watermarked_filename": 1,
                "status": 1,
            }
        },
    ]

    watermarks = list(watermarks_collection.aggregate(pipeline))

    total_pipeline = [
        {"$match": {"user_id": str(current_user["_id"])}},
        {"$count": "total"},
    ]
    total_result = list(watermarks_collection.aggregate(total_pipeline))
    total_logs = total_result[0]["total"] if total_result else 0

    return {
        "logs": watermarks,
        "total": total_logs,
        "page": page,
        "limit": limit,
        "pages": (total_logs + limit - 1) // limit,
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
