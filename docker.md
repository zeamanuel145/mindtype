# 🧠 MindType Social Media Blog API

This is a FastAPI-based backend service for the MindType AI-powered blog assistant. It uses Docker and Docker Compose for development and deployment.

---

## 🚀 Features

- FastAPI for building APIs
- Dockerized for easy deployment
- Uvicorn as the ASGI server
- Supports automatic reloading and .env-based configuration
- Connected to a chatbot frontend via API

---

## 🐳 Docker Setup

### 🔧 Requirements

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/install/)

---

## 🏗️ Build and Run the App

### 1. Clone the Repository

```bash
git clone https://github.com/zeamanuel145/mindtype.git
cd mindtype-social-media-blog
```
### 2. Create a .env file
In the project root directory, create a .env file and populate it with your environment variables (e.g. API keys).

### 3. Run the App with Docker Compose

```bash

docker-compose up --build

```
### 4. Rebuilding Containers
If you update dependencies or change the Dockerfile, rebuild with:

```bash

docker-compose up --build --force-recreate

```

## 🔍File Structure
```bash
.
├── docker-compose.yml      # Defines services
├── Dockerfile              # Image build instructions
├── requirements.txt        # Python dependencies
├── pyproject.toml          # Project metadata
├── .env                    # Environment variables (not committed)
└── src/
    └── social_media_blog/
        └── app.py          # FastAPI app entry point

```

## 🧪Testing the API
Once running, test the endpoints using:

- http://localhost:8000/docs → FastAPI Swagger UI

- curl or Postman to call /api/generate-blog with a POST request like:

```bash

curl -X POST http://localhost:8000/api/generate-blog \
     -H "Content-Type: application/json" \
     -d '{"topic": "AI in education"}'

```

## 🛑Stop the Containers
```bash
docker-compose down
```

## 🛠️ Notes
- Make sure the backend URL in your frontend matches the container port (e.g. http://localhost:8000).

- If deploying on Render, choose the correct branch and point it to your Docker service or build script.

## 👥 Authors
- Eric Theuri


