# MINDTYPE

A multi-agent AI system that collaborates to generate high-quality, SEO-friendly blog content for social media platforms using [crewAI](https://crewai.com), FastAPI, and tools like DuckDuckGo, Pinecone, and Gemini.

## 🚀 Features
- Multi-agent task delegation via CrewAI
- Integration with Gemini (Google Generative AI)
- DuckDuckGo and Pinecone-based contextual research
- Rate-limited FastAPI backend
- Structured blog output (title, meta, preview, full post)
- Easy deployment via Docker and Render

---

## 📦 Setup

### 1. Python version
Ensure you're using **Python 3.10–3.13** (UV requires <3.14):

```bash

python3 --version

```

### 2. Clone and install dependencies
```bash
git clone https://github.com/zeamanuel145/mindtype.git
cd social-media-blog-crew

# Install uv if needed
pip install uv

# Install dependencies
uv pip install -r requirements.txt

```
### 3. Environment Setup
Create a .env file and set your keys:
```env
GOOGLE_API_KEY=your_google_api_key
```

### 4. ⚙️ Configuration
You can define agents and tasks here:



- src/social_media_blog/config/agents.yaml – agent roles and goals

- src/social_media_blog/config/tasks.yaml – tasks agents collaborate on

- src/social_media_blog/crew.py – logic that wires it all together

### 5. 🧪 Running the API
To launch your FastAPI server locally:
```bash

uvicorn src.social_media_blog.app:app --reload
```

Then go to:
📍 **http://localhost:8000/docs** to try it out via Swagger UI.

## 📤 Deployment on Render (Docker)
1. Set up a new Web Service on Render.com
2. Choose Docker as the environment
3. Set start command to:
```bash
uvicorn src.social_media_blog.app:app --host 0.0.0.0 --port 8000
```
4. Add your environment variables (GOOGLE_API_KEY, etc.)

## 🧠 API Endpoint
POST /api/generate-blog
```json


{
  "topic": "AI in Healthcare",
  "tone": "informative",
  "platform_guidelines": "LinkedIn best practices"
}

```
Returns: 
```json
{
  "status": "success",
  "content": "Full blog post...",
  "meta_description": "AI is transforming the healthcare industry...",
  "blog_preview": "Discover how AI is reshaping medical innovation..."
}
```

## Project Structure
```bash

social_media_blog/
├── app.py               # FastAPI app
├── crew.py              # CrewAI integration
├── chat_models.py       # Pydantic models
├── config/
│   ├── agents.yaml
│   └── tasks.yaml
├── content/
│   └── pinecone_setup.py
└── ...


```
## 👥 Authors
- ## 👥 Author

- [Eric Theuri](https://github.com/TheuriEric)