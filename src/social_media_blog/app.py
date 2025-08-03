from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from .crew import SocialMediaBlog
from .chat_models import *
import logging


logging.basicConfig(level=logging.
INFO,format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

load_dotenv()
app = FastAPI(title="AI Blog Post Generator")

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
async def generate_blog(request: BlogRequest):
    try:
        logger.info(f"Received request for blog generation. Topic: '{request.topic}', Tone: '{request.tone}'")

        if not request.topic and request.topic.lower() != "auto-generate-topic":
            raise HTTPException(status_code=400, detail="Topic cannot be empty.")
        
        inputs = {
            'topic': request.topic,
            'tone': request.tone,
            'platform_guidelines': request.platform_guidelines,
            'current_year': 2025
        }
        
        crew_instance = SocialMediaBlog().crew()
        
        # The kickoff method orchestrates the agents sequentially
        final_output = crew_instance.kickoff(inputs=inputs)
        
        # Assuming the final output contains all generated data
        # Your tasks.yaml saves to specific files, let's read from them
        try:
            with open("final_blog_post.md", "r") as f:
                content = f.read()
            with open("summary.md", "r") as f:
                summary_data = f.read()
        except FileNotFoundError:
            logger.error("Output files not found after crew execution.")
            raise HTTPException(status_code=500, detail="Crew execution failed to produce output files.")

        # Parse summary data (assuming a simple format)
        # This parsing logic can be more complex based on how your agent writes the summary
        summary_lines = summary_data.split('\n')
        meta_description = summary_lines[0] if summary_lines else ""
        blog_preview = "\n".join(summary_lines[1:]) if len(summary_lines) > 1 else ""

        return BlogResponse(
            status="success",
            content=content,
            meta_description=meta_description,
            blog_preview=blog_preview,
        )
    
    except HTTPException as e:
        logger.error(f"HTTP Exception: {e.detail}")
        raise e
    except Exception as e:
        logger.error(f"An unexpected error occurred: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"An unexpected server error occurred: {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)