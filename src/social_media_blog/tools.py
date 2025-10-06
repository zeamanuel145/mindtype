from ddgs import DDGS
from bs4 import BeautifulSoup
from pytrends.request import TrendReq
from crewai.tools import tool
from langchain_groq import ChatGroq
from dotenv import load_dotenv
import pandas as pd
import requests
import os
from db_handler import logger, knowledge_base

logger = logger()
load_dotenv()

@tool
def google_trends_tool(query: str) -> str:
    """
    Analyzes Google Trends for a given query and returns related topics and queries.
    This helps identify current search trends and popular sub-topics.
    The output is a detailed report on related searches and trending topics.
    """
    try:
        pytrends = TrendReq(hl='en-US', tz=360)
        
        # Build payload with the user's query
        pytrends.build_payload([query], cat=0, timeframe='today 3-m', geo='US')
        
        # Get the top 5 related queries
        related_queries = pytrends.related_queries().get(query, {})
        top_queries = related_queries.get('top', pd.DataFrame()).head(5)
        
        # Get the top 5 related topics
        related_topics = pytrends.related_topics().get(query, {})
        top_topics = related_topics.get('top', pd.DataFrame()).head(5)
        
        result_str = f"Google Trends Analysis for '{query}' (Past 3 months, US):\n\n"
        
        if not top_queries.empty:
            result_str += "Top 5 Related Queries:\n"
            result_str += '\n'.join([f"- {row['query']} (Score: {row['value']})" for index, row in top_queries.iterrows()])
        else:
            result_str += "No related queries found.\n"
        
        if not top_topics.empty:
            result_str += "\n\nTop 5 Related Topics:\n"
            result_str += '\n'.join([f"- {row['topic_title']} (Type: {row['topic_type']}, Score: {row['value']})" for index, row in top_topics.iterrows()])
        else:
            result_str += "No related topics found.\n"
        
        logger.info(f"Google Trends Tool: Found related queries and topics for '{query}'")
        return result_str
        
    except Exception as e:
        logger.error(f"Google Trends Tool failed: {e}", exc_info=True)
        return "Failed to fetch Google Trends data. Please proceed with general knowledge."

@tool
def web_search_tool(query: str, max_results: int = 5) -> str:
    try:
        logger.info(f"Web Search Tool: searching for: {query}")
        results_txt = ""

        with DDGS() as ddgs:
            results = [r for r in ddgs.text(query=query, max_results=max_results)]
        
        if not results:
            return "No results found for your query"
        
        logger.info(f"Web search Tool: Retrieved {len(results)} search results.")
        articles = []

        for i, result in enumerate(results, 1):
            title = result.get("title", "No title")
            link = result.get("href", None)
            snippet = result.get("body", "")
            if not link:
                continue

            logger.info(f"Fetching article {i}: {title} ({link})")

            try:
                response = requests.get(link, timeout=8)
                soup = BeautifulSoup(response.text, "html.parser")

                paragraphs = [p.get_text() for p in soup.find_all("p")]
                article_text = "\n".join(paragraphs[:-1])

                articles.append(f"### {title}\n🔗 {link}\n\n{article_text}\n")
            except Exception as e:
                logger.warning(f"Skipping {link}: {e}")
                continue

        if not articles:
            return "No readable articles found from the search results."
        
        results_text = "\n\n---\n\n".join(articles)
        logger.info("Web Search Tool: Successfully extracted article content.")
        return results_text

    except Exception as e:
        logger.exception(f"Web Search Tool failed: {e}")
        return f"Error searching the web: {e}"


                
@tool
def rag_tool(query: str) -> str:
    """A tool to retrieve relevant context from the Pinecone knowledge base."""
    try:
        logger.info(f"RAG Tool: Searching for documents related to the topic: '{query}'...")
        retrieved_docs = knowledge_base.get_relevant_documents(query)
        context = "\n\n".join([doc.page_content for doc in retrieved_docs])
        
        if not context:
            logger.warning("RAG Tool: No relevant information found.")
            return "No relevant information found in the knowledge base."
        
        logger.info(f"RAG Tool: Successfully retrieved context.")
        return context
    except Exception as e:
        logger.error(f"RAG Tool: Error during retrieval - {e}", exc_info=True)
        return f"Error retrieving context from knowledge base: {e}. Please proceed without."

def get_llm():
    try:
        return ChatGroq(
            model=os.getenv("GROQ_MODEL"),
            api_key=os.getenv("GROQ_API_KEY"),
            temperature=0.7,
            reasoning_effort="medium"
        )
    except Exception as e:
        logger.exception(f"Failed to connect to Groq AI model... : {e}")
        
    
