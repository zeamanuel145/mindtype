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
    "https://extraordinary-profiterole-f80940.netlify.app",
    "http://localhost",
    "http://localhost:3000",     
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:8000",
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
    route_decision = await route_query(user_request=body.topic
    )
    try:
        if route_decision == "langchain":
            logger.info("Routing conversation to Langchain...")
            response_text = assistant(body.topic)
            if response_text:
                logger.info("Chatbot returned an answer!")
            return ChatResponse(response=response_text)
        elif route_decision == "crewai":
            logger.info("Routing conversation to Crewai")
            try:
                crew_instance = request.app.state.crew_instance
                response =  crew_instance.kickoff(inputs={'topic': body.topic, "tone": body.tone})
                logger.info("CREW Pipeline completed successfully")
                try: 
                    result = json.loads(response.raw)
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
                except Exception as e:
                    logger.exception("Failed to wrangle Crewai's output")
            except Exception as e:
                logger.exception("Crew pipeline failed")
                return BlogResponse(
                status="error",
                title="Generation Failed",
                content="Blog generation failed. Please try again later.",
                meta_description="Error in CREW pipeline.",
                blog_preview=""
                )
        else:
            return BlogResponse(
        status="error",
        content="Invalid route or unsupported query type.",
        meta_description="Please check your query.",
        blog_preview=""
    )
    except Exception as e:
        logger.exception("Chatbot failed to return a response")
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)