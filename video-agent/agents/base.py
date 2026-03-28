"""Abstract base class for all agents."""

from __future__ import annotations
from abc import ABC, abstractmethod


class BaseAgent(ABC):
    name: str = "Agent"

    def log(self, msg: str) -> None:
        print(f"  [{self.name}] {msg}", flush=True)

    @abstractmethod
    def run(self, **kwargs) -> dict:
        """Execute the agent's task. Input/output shapes defined by subclasses."""
        ...
