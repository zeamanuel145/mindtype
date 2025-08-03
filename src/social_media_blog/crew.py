from crewai import Agent, Crew, Process, Task, LLM
from crewai.project import CrewBase, agent, crew, task
from crewai.agents.agent_builder.base_agent import BaseAgent
from crewai.tools import tool
from langchain_community.tools import DuckDuckGoSearchRun
from typing import List
from content.pinecone_setup import knowledge_base
from .chat_models import BlogOutput
import os
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
)
logger = logging.getLogger(__name__)


@tool
def rag_tool(query: str) -> str:
    """A tool to retrieve relevant context from the Pinecone knowledge base."""
    try:
        logger.info(f"RAG Tool: Searching for documents related to the topic: '{query}'...")
        retrieved_docs = knowledge_base.similarity_search(query, k=5)
        context = "\n\n".join([doc.page_content for doc in retrieved_docs])
        
        if not context:
            logger.warning("RAG Tool: No relevant information found.")
            return "No relevant information found in the knowledge base."
        
        logger.info(f"RAG Tool: Successfully retrieved context.")
        return context
    except Exception as e:
        logger.error(f"RAG Tool: Error during retrieval - {e}", exc_info=True)
        return f"Error retrieving context from knowledge base: {e}. Please proceed without."

@tool
def web_search_tool(query: str) -> str:
    """A tool to search the web for current information."""
    try:
        logger.info(f"Web Search Tool: Searching for: '{query}'...")
        search_tool_instance = DuckDuckGoSearchRun()
        results = search_tool_instance.run(query)
        logger.info(f"Web Search Tool: Successfully retrieved search results.")
        return results
    except Exception as e:
        logger.error(f"Web Search Tool: Error during search - {e}", exc_info=True)
        return f"Error searching the web: {e}. Please proceed without web search results."

@tool
def duckduckgo_tool_func(query: str) -> str:
    """A wrapper around DuckDuckGoSearchRun for use with crewai.project."""
    try:
        logger.info(f"DuckDuckGo Tool: Searching for: '{query}'...")
        search_tool_instance = DuckDuckGoSearchRun()
        results = search_tool_instance.run(query)
        logger.info(f"DuckDuckGo Tool: Successfully retrieved search results.")
        return results
    except Exception as e:
        logger.error(f"DuckDuckGo Tool: Error during search - {e}", exc_info=True)
        return f"Error searching the web: {e}. Please proceed without web search results."

def get_llm():
    try:
        return LLM(
            model="gemini/gemini-1.5-flash",
            api_key=os.getenv("GOOGLE_API_KEY"),
            temperature=0.5
        )
    except Exception as e:
        logger.error(f"Failed to connect to Gemini... : {e}")
        raise ValueError(f"Failed to connect to Gemini")

@CrewBase
class SocialMediaBlog():
    """SocialMediaBlog crew"""
    def __init__(self):
        import os
        import yaml

        base_dir = os.path.dirname(__file__)
        config_dir = os.path.join(base_dir, "config")

        try:
            with open(os.path.join(config_dir, "agents.yaml"), "r") as f:
                self.agents_config = yaml.safe_load(f)
            with open(os.path.join(config_dir, "tasks.yaml"), "r") as f:
                self.tasks_config = yaml.safe_load(f)
            logger.info("Configuration files loaded successfully")
        except Exception as e:
            logging.warning("Failed to load config files: %s", e)
            self.agents_config = {}
            self.tasks_config = {}

        self.agents: List[BaseAgent] = []
        self.tasks: List[Task] = []
    
    @agent
    def trend_hunter(self) -> Agent:
        return Agent(
            config=self.agents_config['trend_hunter'], # type: ignore[index]
            tools=[web_search_tool,duckduckgo_tool_func],
            verbose=True,
            llm=get_llm()
        )

    @agent
    def editor_agent(self) -> Agent:
        return Agent(
            config=self.agents_config['editor_agent'], # type: ignore[index]
            tools=[duckduckgo_tool_func],
            verbose=True,
            llm=get_llm()
        )

    @agent
    def writer_agent(self) -> Agent:
        return Agent(
            config=self.agents_config['writer_agent'], # type: ignore[index]
            tools=[rag_tool],
            verbose=True,
            llm=get_llm()
        )

    @agent
    def summarizer_agent(self) -> Agent:
        return Agent(
            config=self.agents_config['summarizer_agent'], # type: ignore[index]
            verbose=True,
            llm=get_llm()
        )
    
    @task
    def trend_hunting_task(self) -> Task:
        return Task(
            config=self.tasks_config['trend_hunting_task'], # type: ignore[index]
            agent=self.trend_hunter()
        )

    @task
    def research_task(self) -> Task:
        return Task(
            config=self.tasks_config['research_task'], # type: ignore[index]
            agent=self.editor_agent()
        )

    @task
    def reporting_task(self) -> Task:
        return Task(
            config=self.tasks_config['reporting_task'], # type: ignore[index]
            agent=self.writer_agent()
        )

    @task
    def summarizing_task(self) -> Task:
        return Task(
            config=self.tasks_config['summarizing_task'], # type: ignore[index]
            agent=self.summarizer_agent(),
            output_pydantic_model = BlogOutput,
        )

    @crew
    def crew(self) -> Crew:
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential,
            verbose=True,
        )