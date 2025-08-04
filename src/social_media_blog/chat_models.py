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
    platform_guidelines: Optional[str] = Field(default="General social media guidelines", description="Platform-specific guidelines")

class BlogOutput(BaseModel):
    """Output model for the blog generation crew"""
    title: str = Field(..., description="The blog post title")
    blog_post: str = Field(..., description="The complete blog post content")
    meta_description: str = Field(..., description="SEO meta description")
    blog_preview: str = Field(..., description="Brief preview of the blog post")

class BlogResponse(BaseModel):
    status: str = Field(default="success")
    content: str = Field(..., description="The generated blog content")
    meta_description: str = Field(..., description="SEO meta description")
    blog_preview: str = Field(..., description="Brief preview of the blog post")