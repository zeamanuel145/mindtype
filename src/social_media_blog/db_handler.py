# from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader, DirectoryLoader
from langchain_cohere import CohereEmbeddings
from langchain_pinecone import PineconeVectorStore
# from pinecone import Pinecone, ServerlessSpec
from dotenv import load_dotenv
# from pathlib import Path
import logging
import os

load_dotenv()
def logger():
    logging.basicConfig(level=logging.INFO,
                        format='%(asctime)s - %(filename)s - %(levelname)s - %(message)s')
    logger = logging.getLogger(__name__)
    return logger
index_name = os.getenv("PINECONE_INDEX")
logger = logger()

# try:

#     main_directory = Path(__file__).resolve().parent.parent.parent
#     logger.info(f"Registered the file's directory as: {main_directory}")
#     pdf_directory = main_directory/"content"
#     logger.info(f"Registered the pdfs location as : {pdf_directory}")
#     persist_directory = main_directory/"db"
#     logger.info(f"Registered the db directory as: {persist_directory}")
# except Exception as e:
#     logger.exception("Failed to load the necessary folders")

# try:
#     loader = DirectoryLoader(pdf_directory,
#                                     loader_cls=PyPDFLoader,
#                                     glob="*.pdf")
#     logger.info("Created the loader")
# except Exception as e:
#     logger.exception("Failed to initialize the loader")
# try:
#     text_splitter = RecursiveCharacterTextSplitter(chunk_size=50, chunk_overlap=20)
#     logger.info("Initialized the text splitter")
# except Exception as e:
#     logger.exception("Failed to initialize the text splitter")

# try:
#     pdf_data = loader.load()
#     logger.info("Successfully loaded the pdf files")
#     pdf_chunks = text_splitter.split_documents(pdf_data)
#     logger.info("Successfully created chunks of the loaded data")
# except Exception as e:
#     logger.exception("Error in handling of the loaded pdf files")


# try:
#     pc=Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
#     logger.info("Initialized Pinecone")
#     existing_indexes = pc.list_indexes().names()
#     logger.info(f"Existing Pinecone indexes: {existing_indexes}")

#     if index_name not in existing_indexes:
#         logger.info(f"Pinecone index '{index_name}' does not exist. Creating new index...")
#         pc.create_index(
#             name=index_name,
#             dimension=1024,
#             metric="cosine",
#             spec=ServerlessSpec(cloud="aws", region='us-east-1')
#         )
#         while not pc.describe_index(index_name).status['ready']:
#             import time
#             logger.info(f"Waiting for index '{index_name}' to be ready...")
#             time.sleep(0.5)
#         logger.info(f"Pinecone index '{index_name}' created and ready.")
#         logger.info(f"Populating Pinecone index '{index_name}' with {len(pdf_chunks)} documents...")
#         PineconeVectorStore.from_texts(
#             [t.page_content for t in pdf_chunks],
#             embedding=embeddings,
#             index_name=index_name
#         )
#         logger.info(f"Pinecone index '{index_name}' populated successfully.")
#     else:
#         logger.info(f"Pinecone index '{index_name}' already exists. Continuing")
# except Exception as e:
#     logger.exception("Error accessing Pinecone Index")

def get_knowledge_base():

    try:
        embeddings = CohereEmbeddings(
            model="embed-english-v3.0",
            cohere_api_key=os.getenv("COHERE_API_KEY")
        )
        logger.info("Successfully created the embedding model")
    except Exception as e:
        logger.exception("Failed to initialize the embedding model")

    try:
        knowledge_base = PineconeVectorStore.from_existing_index(
            index_name=index_name,
            embedding=embeddings
        ).as_retriever()
        logger.info(f"Successfully connected to existing Pinecone index '{index_name}'.")
        return knowledge_base
    except Exception as e:
        logger.exception("Error with Pinecone index...")
        return None

if __name__ == "__main__":
    knowledge_base = get_knowledge_base()
    logger.info("Knowledge base ready")
