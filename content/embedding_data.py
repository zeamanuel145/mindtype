# from langchain.text_splitter import RecursiveCharacterTextSplitter
# from langchain_google_genai import GoogleGenerativeAIEmbeddings
# from dotenv import load_dotenv
# from pdf_loader import extracted_pdf_text
# import logging
# import os

# logging.basicConfig(level=logging.INFO,
#                     format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
# logger = logging.getLogger(__name__)

# load_dotenv()
# GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
# if not GOOGLE_API_KEY:
#     raise ValueError("GOOGLE_API_KEY environment variable not set. Please set it in your .env file.")


# #Create text chunks
# def pdf_text_to_chunks(extracted_pdf_text):
#     try:
#         text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
#         text_chunks = text_splitter.split_documents(extracted_pdf_text)

#         logger.info(f"Successfully created {len(text_chunks)} text chunks.")

#         return text_chunks
#     except Exception as e:
#         logger.error(f"Error creating text chunks: {e}", exc_info=True)
#         raise RuntimeError(f"Failed to create text chunks: {e}")


# text_chunks = pdf_text_to_chunks(extracted_pdf_text=extracted_pdf_text)

# try:
#     embeddings = GoogleGenerativeAIEmbeddings(
#         model="models/embedding-001",
#         google_api_key=GOOGLE_API_KEY
#     )
#     query_result = embeddings.embed_query("Hello world")
#     print(len(query_result))
#     logger.info(f"Embedding model loaded successfully. Embedding dimension: {len(query_result)}")
# except Exception as e:
#     logger.error(f"Error loading GoogleGenerativeAI model: {e}", exc_info=True)
#     raise RuntimeError(f"Failed to load embedding model: {e}")
