from pydantic import BaseModel, Field
from typing import Optional

class BlogRequest(BaseModel):
    topic: str = "auto-generate-topic"
    tone: str = "professional"
    platform_guidelines: str = "Generate blog ost format for tech enthuthiasts"

class BlogResponse(BaseModel):
    status: str
    content: str
    meta_description: str
    blog_preview: str
    
class BlogOutput(BaseModel):
    title: str = Field(..., description="The title of the generated blog post.")
    blog_post: str = Field(..., description="The full Markdown content of the blog post.")
    meta_description: str = Field(..., description="A concise, SEO-friendly meta description for the blog post.")
    blog_preview: str = Field(..., description="A short, catchy preview of the blog post.")
