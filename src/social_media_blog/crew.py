from crewai import Agent, Crew, Process, Task, LLM
from crewai.project import CrewBase, agent, crew, task
from crewai.agents.agent_builder.base_agent import BaseAgent
from crewai.tools import tool
from typing import List
from dotenv import load_dotenv
from ddgs import DDGS
from bs4 import BeautifulSoup
from crewai.tools import tool
from dotenv import load_dotenv
import pandas as pd
from pathlib import Path
from .db_handler import logger, get_knowledge_base
from .chat_models import BlogOutput
import os
import requests


load_dotenv()
knowledge_base = get_knowledge_base()

def get_llm():
    try:
        return LLM(
            model="gemini/gemini-2.5-pro",
            api_key=os.getenv("GOOGLE_API_KEY"),
            temperature=0.5
        )
    except Exception as e:
        logger.error(f"Failed to connect to Gemini... : {e}")
        raise ValueError(f"Failed to connect to Gemini")

llm = get_llm()

@tool
def web_search_tool(query: str) -> str:
    """A tool to search the web for current information."""
    try:
        max_results= 5
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


@CrewBase
class SocialMediaBlog():
    """SocialMediaBlog crew"""
    def __init__(self):
        import os
        import yaml

        base_dir = Path(__file__).resolve().parent
        config_dir = str(base_dir/"config")

        try:
            with open(os.path.join(config_dir, "agents.yaml"), "r") as f:
                self.agents_config = yaml.safe_load(f)
            with open(os.path.join(config_dir, "tasks.yaml"), "r") as f:
                self.tasks_config = yaml.safe_load(f)
            logger.info("Configuration files loaded successfully")
        except Exception as e:
            logger.warning("Failed to load config files: %s", e)
            self.agents_config = {}
            self.tasks_config = {}

        self.agents: List[BaseAgent] = []
        self.tasks: List[Task] = []

    @agent
    def research_agent(self) -> Agent:
        return Agent(
            config=self.agents_config["research_agent"],
            tools=[web_search_tool],
            verbose=True,
            llm=llm
        )

    @agent
    def writing_agent(self) -> Agent:
        return Agent(
            config=self.agents_config["writing_agent"],
            verbose=True,
            llm=llm
        )

    @agent
    def summarizing_agent(self) -> Agent:
        return Agent(
            config=self.agents_config["summarizing_agent"],
            verbose=True,
            llm=llm
        )

    @task
    def research_task(self) -> Task:
        return Task(
            config=self.tasks_config["research_task"],
            agent=self.research_agent()
                            )
    
    @task
    def writing_task(self) -> Task:
        return Task(
            config=self.tasks_config["writing_task"],
            agent=self.writing_agent(),
            depends_on=[self.research_task()],
            run_mode=Process.sequential
        )

    @task
    def summarizing_task(self) -> Task:
        return Task(
            config=self.tasks_config["summarizing_task"],
            agent=self.summarizing_agent(),
            output_pydantic_model=BlogOutput,
            depends_on=[self.writing_task()],
            run_mode=Process.sequential
        )

    @crew
    def crew(self) -> Crew:
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential,
            verbose=True,
            llm=llm
        )