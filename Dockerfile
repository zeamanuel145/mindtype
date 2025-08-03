# Use a slim Python image for a smaller container size
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app

# Copy pyproject.toml and requirements.txt first to leverage Docker cache
# This speeds up subsequent builds if dependencies haven't changed
COPY pyproject.toml .
COPY requirements.txt .

# Install poetry and then install dependencies
# We use poetry because your project structure indicates it
RUN pip install --no-cache-dir poetry && \
    poetry config virtualenvs.create false && \
    poetry install --no-root --only main

# Copy the rest of the application code
COPY . .

# Expose the port the FastAPI application runs on
EXPOSE 8000

# Set the entrypoint to run the FastAPI application with Uvicorn
CMD ["uvicorn", "src.social_media_blog.app:app", "--host", "0.0.0.0", "--port", "8000"]