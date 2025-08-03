from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from .crew import SocialMediaBlog
from .chat_models import *
import logging
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from contextlib import asynccontextmanager

logging.basicConfig(level=logging.
INFO,format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

load_dotenv()

# Initializing the rate limiter
limiter = Limiter(key_func=get_remote_address, default_limits=["10/minute"])

@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.crew_instance = SocialMediaBlog().crew()
    logger.info("Crew initialized successfully")

    yield


app = FastAPI(title="AI Blog Post Generator", lifespan=lifespan)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

origins = [
    "*"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)



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
            'topic': body.topic,
            'tone': body.tone,
            'platform_guidelines': body.platform_guidelines,
            'current_year': 2025
        }
        
        crew_instance = app.state.crew_instance
        result = crew_instance.kickoff(inputs=inputs)

        # Ensure we always work with a dictionary
        if hasattr(result, "dict"):
            result = result.dict()
        elif not isinstance(result, dict):
            result = dict(result)

        logger.debug(f"Crew output: {result}")

        # Try getting structured blog output from known keys
        output_data = result.get("summarizing_task") or result.get("reporting_task") or result.get("final_output") or result

        if not isinstance(output_data, dict):
            logger.error("Crew output missing expected fields.")
            raise HTTPException(status_code=500, detail="Crew execution returned malformed output.")

        blog_output = BlogOutput(**output_data)

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