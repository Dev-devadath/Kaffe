"""Base agent class for all agents."""
from abc import ABC, abstractmethod
from typing import Dict, Any, Optional, Tuple
from utils.logger import logger


class BaseAgent(ABC):
    """Abstract base class for all agents."""
    
    def __init__(self, name: str):
        """
        Initialize base agent.
        
        Args:
            name: Agent name for logging
        """
        self.name = name
        self.logger = logger
    
    @abstractmethod
    async def execute(self, **kwargs) -> Dict[str, Any]:
        """
        Execute the agent's main logic.
        
        This method must be implemented by subclasses.
        
        Args:
            **kwargs: Agent-specific parameters
        
        Returns:
            Dictionary with agent results
        
        Raises:
            NotImplementedError: If not implemented by subclass
        """
        raise NotImplementedError("Subclasses must implement execute()")
    
    async def validate_inputs(self, **kwargs) -> Tuple[bool, Optional[str]]:
        """
        Validate inputs before execution.
        
        Override in subclasses for specific validation.
        
        Args:
            **kwargs: Input parameters to validate
        
        Returns:
            Tuple of (is_valid, error_message)
        """
        return True, None
    
    def log_info(self, message: str):
        """Log info message."""
        self.logger.info(f"[{self.name}] {message}")
    
    def log_error(self, message: str, exc_info: bool = False):
        """Log error message."""
        self.logger.error(f"[{self.name}] {message}", exc_info=exc_info)
    
    def log_debug(self, message: str):
        """Log debug message."""
        self.logger.debug(f"[{self.name}] {message}")

