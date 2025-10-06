from crewai import Agent, Crew, Process, Task, LLM
from crewai.project import CrewBase, agent, crew, task
from crewai.agents.agent_builder.base_agent import BaseAgent
import pandas as pd
from typing import List
from db_handler import logger
from .chat_models import BlogOutput
import os

logger = logger()
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
            logger.warning("Failed to load config files: %s", e)
            self.agents_config = {}
            self.tasks_config = {}

        self.agents: List[BaseAgent] = []
        self.tasks: List[Task] = []
    
    @agent
    def trend_hunter(self) -> Agent:
        return Agent(
            config=self.agents_config['trend_hunter'], # type: ignore[index]
            tools=[web_search_tool,duckduckgo_tool_func,google_trends_tool],
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