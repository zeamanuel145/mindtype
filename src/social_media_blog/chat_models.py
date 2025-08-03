from pydantic import BaseModel

class BlogRequest(BaseModel):
    topic: str = "auto-generate-topic"
    tone: str = "professional"
    platform_guidelines: str = "Generate blog ost format for tech enthuthiasts"

class BlogResponse(BaseModel):
    status: str
    content: str
    meta_description: str
    blog_preview: str
    
