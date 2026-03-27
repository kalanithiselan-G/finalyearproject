from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class WatermarkRecord(BaseModel):
    user_id: str
    email: str
    content_id: str
    watermark_id: str
    timestamp: datetime
    original_filename: str
    watermarked_filename: str


class WatermarkDetectionResult(BaseModel):
    detected: bool
    watermark_id: str | None = None
    user_email: str | None = None
    user_full_name: str | None = None
    content_id: str | None = None
    timestamp: datetime | None = None
