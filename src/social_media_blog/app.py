from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from .chat_models import *
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from contextlib import asynccontextmanager
from langchain.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.output_parsers import StrOutputParser
from .db_handler import logger
from typing import Union
from .crew import SocialMediaBlog,llm, knowledge_base
import os
import json

load_dotenv()


limiter = Limiter(key_func=get_remote_address, default_limits=["5/minute"])

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


app = FastAPI(title="AI Blog Post Generator", 
              lifespan=lifespan, 
              description="Chatbot backend for Mindtype, a social blog comapny",
              version="1.1")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)
origins = [
   "https://mindtypex.netlify.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

def get_langchain_llm():
    if os.getenv("GOOGLE_API_KEY"):
        logger.info("Using ChatGoogleGenerativeAI for LangChain components.")
        return ChatGoogleGenerativeAI(model="gemini-2.5-pro", google_api_key=os.getenv("GOOGLE_API_KEY"), temperature=0.5)
    else:
        logger.error("No valid API key found for Gemini.")
        raise ValueError("GOOGLE_API_KEY not found.")
    
general_chat_llm = ChatGroq(
    model=os.getenv("GROQ_MODEL"),
    api_key=os.getenv("GROQ_API_KEY"),
    temperature=0.7
)


langchain_llm = get_langchain_llm()

async def route_query(user_request: str) -> str:
    """Route queries intelligently between CrewAI (health) or LangChain (general chat)."""
    router_prompt = ChatPromptTemplate.from_template(
        """
        You are a routing expert. Decide whether to route the user query to 
        'crewai' (for content generation) or 'langchain' (for general chat).
        Beforemaking the decision, thoroughly analyze the user's input. If they directly mention to generate a blog, in whatever way, then you know definitely the route is crewai. If the user's input is unclear, ask it is definitely langchain. General queries for example, what mindtype does and what type of content they generate, that is a langchain query. Intelligently analyze the user's request to determine clearly and without a doubt, what route is to be taken.
        Respond with one word only: crewai or langchain.
        
        User: "{query}"
        Response:
        """
    )
    router_chain = router_prompt | general_chat_llm| StrOutputParser()


    try:
        decision = await router_chain.ainvoke({"query": user_request})
        return decision.strip().lower()
    except Exception as e:
        logger.exception("Router LLM failed. Proceeding with langchain")
        return "langchain"

def assistant(user_query: str):
    chat_prompt_template = ChatPromptTemplate.from_template(
    """
You are the official general support AI Chatbot for **Mindtype**.
Mindtype is a company founded by **DirectEd scholars** after working on a project, and we focus on high-quality **blog posts and content**.

Keep replies **brief, realistic, and chat-like** — like a responsive support assistant.
Do **not** repeat long intros or greetings in every reply.

---
If a user's question or input is unclear, handle it intelligently by either asking for more information or mention that you did not understand them. Be intelligent.

### 📘 Knowledge Base (for reference only, do not dump unless asked):
- **Focus:** High-quality blog posts, insights, and content creation.
- **Founding:** Established by DirectEd scholars following a successful project.
- **Core Process:** Blog generation is handled by a specialized **CrewAI team** (internal process).
- **General Support:** This LangChain-based chat handles general questions, company info, and navigation.
- **Goal:** To share knowledge and foster discussion.

---

### 🚨 Handling Off-topic:
- If question is unrelated → Answer briefly, but politely warn in a warm but professional method. For example:
  *"Note: I can mainly assist with Mindtype, our content, or company info. But you can only inform them perdiodically, not after every single chat. For example you warn the first time then a subtle warning the third time followed bu another warning the 5th"* Alternate the way you produce this message so that it does not appear as a hardcoded  message but instead a real-time chatbot or a human.

---

### ⚡ Style:
- **Tone:** Professional, knowledgeable, and concise.
- **Length:** 1–3 short sentences.
- **Formatting:** Use simple lists/emojis if it aids clarity.

---

    Context: {context}
👤 User: {user_query}
💬 Chatbot:
    """
)

    try:
        docs = knowledge_base.invoke(user_query)
        context = "\n".join([doc.page_content for doc in docs]).strip() if docs else ""
    except Exception as e:
        logger.exception(f"Retriever failed")
        context = ""

    chain = chat_prompt_template | general_chat_llm| StrOutputParser()

    return chain.invoke({
        "user_query": user_query,
        "context": context })

@app.get("/")
async def root():
    return {"message": "Loaded successfully! Visit /docs"}


@app.post("/chat", response_model=Union[BlogResponse, ChatResponse])
@limiter.limit("5/minute")
async def generate_blog(request: Request, body: BlogRequest):
    route_decision = await route_query(user_request=body.topic)
    
    # Initialize a default error response for robust fallback
    error_response = BlogResponse(
        status="error",
        title="Blog Generation Failed",
        content="Blog generation failed due to an unexpected error. Please try again later.",
        meta_description="Error in processing the request.",
        blog_preview=""
    )

    try:
        if route_decision == "langchain":
            logger.info("Routing conversation to Langchain...")
            response_text = assistant(body.topic)
            if response_text:
                logger.info("Chatbot returned an answer!")
                return ChatResponse(response=response_text)
            else:
                logger.warning("Langchain returned no response.")
                return ChatResponse(response="Sorry, I couldn't generate a response.")
                
        elif route_decision == "crewai":
            logger.info("Routing conversation to Crewai")
            crew_instance = request.app.state.crew_instance
            
            try:
                # 1. Execute CrewAI pipeline
                response = crew_instance.kickoff(inputs={'topic': body.topic, "tone": body.tone})
                raw_output = response.raw
                logger.info("CREW Pipeline completed successfully")

                # --- START: Robust JSON Wrangle Logic (The fix!) ---
                cleaned_output = raw_output.strip()
                logger.debug(f"Raw output size: {len(raw_output)}. Cleaned output size: {len(cleaned_output)}")
                
                # Check for and remove common markdown code fences (```json ... ```)
                if cleaned_output.startswith("```"):
                    logger.debug("Attempting to clean markdown fences.")
                    try:
                        # Split after the first line (e.g., ```json) and before the last line (e.g., ```)
                        # This handles multiple lines of output
                        cleaned_output = cleaned_output.split('\n', 1)[1].rsplit('\n', 1)[0].strip()
                    except IndexError:
                        pass
                
                # 2. Basic validation check after cleaning
                if not cleaned_output or not (cleaned_output.startswith('{') and cleaned_output.endswith('}')):
                    logger.error(f"CrewAI output is empty or not a valid JSON structure after cleaning: {repr(cleaned_output[:50])}...")
                    error_response.content = "CrewAI output was not valid JSON. Check agent prompts."
                    error_response.meta_description = "Invalid JSON structure."
                    return error_response

                # 3. Attempt JSON loading on the cleaned string
                try: 
                    result = json.loads(cleaned_output)
                    
                    # 4. Extract fields from the resulting dictionary
                    title = result.get("title", "Untitled")
                    content = result.get("blog_post", "")
                    meta_description = result.get("meta_description", "")
                    blog_preview = result.get("blog_preview", "")
                    
                    return BlogResponse(
                        status="success",
                        title=title,
                        content=content,
                        meta_description=meta_description,
                        blog_preview=blog_preview
                    )
                except json.JSONDecodeError as e:
                    logger.exception(f"JSON Decode Error after cleaning. Problematic output: {repr(cleaned_output)}")
                    error_response.content = "Failed to parse final output as JSON. Check agent output structure."
                    error_response.meta_description = "JSON decoding failed."
                    return error_response
                # --- END: Robust JSON Wrangle Logic ---

            except Exception as e:
                logger.exception("Crew pipeline failed during execution.")
                error_response.content = "Blog generation failed. An internal CrewAI error occurred."
                error_response.meta_description = "CrewAI execution error."
                return error_response

        else:
            # Handle invalid route decision
            error_response.content = "Invalid route or unsupported query type."
            error_response.meta_description = "Routing decision failed."
            return error_response
            
    except Exception as e:
        logger.exception("Top-level exception in generate_blog")
        return error_response

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)