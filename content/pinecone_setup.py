from langchain_pinecone import PineconeVectorStore
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from pinecone import Pinecone,ServerlessSpec
# from embedding_data import text_chunks, embeddings
from dotenv import load_dotenv
import os
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)
try:
    load_dotenv()
    PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
    GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
    if not PINECONE_API_KEY:
        raise ValueError("PINECONE_API_KEY environment variable not set. Please set it in your .env file.")
    if not GOOGLE_API_KEY:
        raise ValueError("GOOGLE_API_KEY environment variable not set. Please set it to your .env file")

    pc = Pinecone(api_key=PINECONE_API_KEY)
    logger.info("Pinecone client initialized successfully.")
except Exception as e:
    logger.error(f"Error initializing Pinecone client or loading API key: {e}", exc_info=True)
    raise RuntimeError(f"Failed to initialize Pinecone: {e}")

index_name = os.getenv("PINECONE_INDEX_NAME")
embedding_dimension = 768
embeddings = GoogleGenerativeAIEmbeddings(
        model="models/embedding-001",
        google_api_key=GOOGLE_API_KEY
    )
# try:
#     existing_indexes = pc.list_indexes().names()
#     logger.info(f"Existing Pinecone indexes: {existing_indexes}")

#     if index_name not in existing_indexes:
#         logger.info(f"Pinecone index '{index_name}' does not exist. Creating new index...")
#         pc.create_index(
#             name=index_name,
#             dimension=embedding_dimension,
#             metric="cosine",
#             spec=ServerlessSpec(cloud="aws", region='us-east-1')
#         )
#         while not pc.describe_index(index_name).status['ready']:
#             logger.info(f"Waiting for index '{index_name}' to be ready...")
#             time.sleep(1)
#         logger.info(f"Pinecone index '{index_name}' created and ready.")
#         logger.info(f"Populating Pinecone index '{index_name}' with {len(text_chunks)} documents...")
#         PineconeVectorStore.from_texts(
#             [t.page_content for t in text_chunks],
#             embedding=embeddings,
#             index_name=index_name
#         )
#         logger.info(f"Pinecone index '{index_name}' populated successfully.")
#     else:
#         logger.info(f"Pinecone index '{index_name}' already exists. Continuing")
# except exception as e:
#     logger.error("Error accessing Pinecone Index: {e}", exc_info=True)
#     raise RuntimeError(f"Failed to manage Pinecone index: {e}")

try:
    knowledge_base = PineconeVectorStore.from_existing_index(
        index_name=index_name,
        embedding=embeddings
    )
    logger.info(f"Successfully connected to existing Pinecone index '{index_name}'.")

except Exception as e:
    logger.error(f"Error with Pinecone index '{index_name}': {e}", exc_info=True)
    raise RuntimeError(f"Failed to manage Pinecone index: {e}")
