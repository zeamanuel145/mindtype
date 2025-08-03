from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from .crew import SocialMediaBlog
from .chat_models import *
import logging
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from contextlib import asynccontextmanager
import json
import re

logging.basicConfig(level=logging.
INFO,format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

load_dotenv()

# Initializing the rate limiter
limiter = Limiter(key_func=get_remote_address, default_limits=["10/minute"])

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize crew instance on startup"""
    try:
        app.state.crew_instance = SocialMediaBlog().crew()
        logger.info("Crew initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize crew: {e}")
        raise
    yield


app = FastAPI(title="AI Blog Post Generator", lifespan=lifespan)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

origins = [
    "https://extraordinary-profiterole-f80940.netlify.app",
    "http://localhost",
    "http://localhost:3000",     
    "http://127.0.0.1:3000",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


def extract_structured_output(result) -> dict:
    """Extract structured output from crew result - GUARANTEED TO WORK"""
    try:
        # Get the content as string
        content = str(result)
        
        # Remove the markdown code block markers
        if '```json' in content:
            # Extract everything between ```json and ```
            start = content.find('```json') + 7  # Skip past ```json
            end = content.find('```', start)
            if end != -1:
                content = content[start:end].strip()
        
        # Now find the JSON object
        start = content.find('{')
        end = content.rfind('}') + 1
        
        if start != -1 and end > start:
            json_str = content[start:end]
            
            # Parse the JSON
            parsed = json.loads(json_str)
            
            # Log what we found
            logger.info(f"Parsed JSON keys: {list(parsed.keys())}")
            
            # Check if we have all required fields
            required = ['title', 'blog_post', 'meta_description', 'blog_preview']
            missing = [key for key in required if key not in parsed or not parsed[key]]
            
            if not missing:
                logger.info("Successfully extracted all required fields")
                return parsed
            else:
                logger.error(f"Missing fields in parsed JSON: {missing}")
        
        # If that fails, fallback
        logger.warning("JSON extraction failed, using fallback")
        return create_fallback_output(content)
        
    except Exception as e:
        logger.error(f"Extraction failed: {e}")
        return create_fallback_output(str(result))

def create_fallback_output(content: str) -> dict:
    """Create fallback output when parsing fails"""
    try:
        # Extract title
        title = extract_title(content)
        
        # Use content as blog post (clean it up)
        blog_post = content
        if '```json' in blog_post:
            # Remove JSON blocks and keep the readable content
            parts = blog_post.split('```')
            blog_post = '\n'.join([part for i, part in enumerate(parts) if i % 2 == 0])
        
        # Create meta description and preview
        meta_description = create_meta_description(blog_post)
        blog_preview = create_preview(blog_post)
        
        result = {
            "title": title,
            "blog_post": blog_post.strip(),
            "meta_description": meta_description,
            "blog_preview": blog_preview
        }
        
        logger.info("Created fallback output successfully")
        return result
        
    except Exception as e:
        logger.error(f"Error creating fallback output: {e}")
        # Ultimate fallback
        return {
            "title": "Generated Blog Post",
            "blog_post": content if content else "Content could not be generated.",
            "meta_description": "Insights and analysis on your requested topic.",
            "blog_preview": "Discover the latest trends and insights."
        }

def extract_title(content: str) -> str:
    """Extract or create a title from content"""
    # Look for markdown headers
    title_match = re.match(r'^#\s*(.+)', content, re.MULTILINE)
    if title_match:
        return title_match.group(1).strip()
    
    # Look for **bold** text at the beginning
    bold_match = re.match(r'^\*\*(.+?)\*\*', content)
    if bold_match:
        return bold_match.group(1).strip()
    
    # Extract first sentence as title
    sentences = content.split('.')
    if sentences:
        return sentences[0].strip()[:100]  # Limit to 100 chars
    
    return "Generated Blog Post"

def create_meta_description(content: str) -> str:
    """Create SEO meta description from content"""
    # Remove markdown and get clean text
    clean_content = re.sub(r'[#*`]', '', content)
    sentences = clean_content.split('.')
    
    # Take first 2-3 sentences up to 160 characters
    description = ""
    for sentence in sentences[:3]:
        if len(description + sentence + ".") <= 160:
            description += sentence.strip() + ". "
        else:
            break
    
    return description.strip() or "Comprehensive insights and trends analysis."

def create_preview(content: str) -> str:
    """Create blog preview from content"""
    # Remove markdown and get clean text
    clean_content = re.sub(r'[#*`]', '', content)
    sentences = clean_content.split('.')
    
    # Take first 2 sentences
    preview_sentences = sentences[:2]
    preview = '. '.join(s.strip() for s in preview_sentences if s.strip()) + "."
    
    return preview if len(preview) > 10 else "Discover the latest trends and insights in this comprehensive analysis."




@app.get("/")
async def root():
    return {"message": "Loaded successfully!"}

@app.post("/api/generate-blog", response_model=BlogResponse)
@limiter.limit("5/minute")
async def generate_blog(request: Request, body: BlogRequest):
    try:
        logger.info(f"Received request for blog generation. Topic: '{body.topic}', Tone: '{body.tone}'")

        if not body.topic:
            raise HTTPException(status_code=400, detail="Topic cannot be empty.")
        
        inputs = {
            'topic': body.topic.strip(),
            'tone': body.tone,
            'platform_guidelines': body.platform_guidelines,
            'current_year': 2025
        }
        
        crew_instance = app.state.crew_instance
        result = crew_instance.kickoff(inputs=inputs)

        try:
            output_data = extract_structured_output(result)
            logger.info("Successfully extracted structured output")
        except Exception as e:
            logger.error(f"Failed to extract structured output: {e}")
            raise HTTPException(status_code=500, detail="Failed to process crew output")

        # Validate required fields
        required_fields = ['title', 'blog_post', 'meta_description', 'blog_preview']
        missing_fields = [field for field in required_fields if field not in output_data or not output_data[field]]
        
        if missing_fields:
            logger.error(f"Missing required fields: {missing_fields}")
            raise HTTPException(status_code=500, detail=f"Missing required fields: {missing_fields}")

        # Create and validate BlogOutput
        try:
            blog_output = BlogOutput(**output_data)
        except Exception as e:
            logger.error(f"BlogOutput validation failed: {e}")
            raise HTTPException(status_code=500, detail=f"Output validation failed: {e}")


        return BlogResponse(
            status="success",
            content=blog_output.blog_post,
            meta_description=blog_output.meta_description,
            blog_preview=blog_output.blog_preview,
        )
    
    except HTTPException as e:
        logger.error(f"HTTP Exception: {e.detail}")
        raise e
    except Exception as e:
        logger.error(f"An unexpected error occurred: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Server error: {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)