from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum


class ToneEnum(str, Enum):
    professional = "professional"
    casual = "casual"
    informative = "informative"
    engaging = "engaging"

class BlogRequest(BaseModel):
    topic: str = Field(..., min_length=1, max_length=500, description="The topic for the blog post")
    tone: ToneEnum = Field(default=ToneEnum.informative, description="The tone of the blog post")

class BlogOutput(BaseModel): # This is what comes from summarizing Task
    """Output model for the blog generation crew"""
    title: str = Field(..., description="The blog post title")
    blog_post: str = Field(..., description="The complete blog post content")
    meta_description: str = Field(..., description="SEO meta description")
    blog_preview: str = Field(..., description="Brief preview of the blog post")

class BlogResponse(BaseModel):
    status: str = Field(default="success")
    title: str = Field(..., description="The generated blog content's title")
    content: str = Field(..., description="The generated blog content")
    meta_description: str = Field(..., description="SEO meta description")
    blog_preview: str = Field(..., description="Brief preview of the blog post")


class ChatResponse(BaseModel):
    response: str

class LoginRequest(BaseModel):
    email: str = Field(..., description="User's email address")
    password: str = Field(..., description="User's password")
    first_name: Optional[str] = Field(None,description="User's first name")
    last_name: Optional[str] = Field(None,description="User's last name")

class AccountResponse(BaseModel):
    
    email: str = Field(..., description="User's email address")
    password: str = Field(..., description="User's password")