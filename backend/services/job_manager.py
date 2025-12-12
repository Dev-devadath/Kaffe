"""Job state management service."""
import uuid
from typing import Optional, Dict
from datetime import datetime
import asyncio
from models.job import JobRequest, JobState, JobStatus
from utils.logger import logger


class JobManager:
    """Manages job state in memory."""
    
    def __init__(self):
        """Initialize job manager with in-memory storage."""
        self._jobs: Dict[str, JobState] = {}
        self._lock = asyncio.Lock()
    
    async def create_job(self, request: JobRequest) -> str:
        """
        Create a new job and return its ID.
        
        Args:
            request: Job request data
        
        Returns:
            Job ID (UUID string)
        """
        async with self._lock:
            # Use provided job_id or generate new one
            job_id = request.job_id or str(uuid.uuid4())
            
            # Check if job_id already exists
            if job_id in self._jobs:
                logger.warning(f"Job ID {job_id} already exists, generating new one")
                job_id = str(uuid.uuid4())
            
            # Create job state
            job_state = JobState(
                job_id=job_id,
                user_id=request.user_id,
                text_prompt=request.text_prompt,
                image_url=str(request.image_url) if request.image_url else None,
                meta=request.meta,
                status=JobStatus.PENDING,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            
            self._jobs[job_id] = job_state
            logger.info(f"Created job {job_id} with status {job_state.status}")
            
            return job_id
    
    async def get_job(self, job_id: str) -> Optional[JobState]:
        """
        Retrieve a job by ID.
        
        Args:
            job_id: Job ID to retrieve
        
        Returns:
            JobState if found, None otherwise
        """
        async with self._lock:
            return self._jobs.get(job_id)
    
    async def update_job(
        self,
        job_id: str,
        status: Optional[JobStatus] = None,
        error: Optional[str] = None,
        result: Optional[Dict] = None
    ) -> bool:
        """
        Update job state.
        
        Args:
            job_id: Job ID to update
            status: New status (optional)
            error: Error message (optional)
            result: Result data to add (optional)
        
        Returns:
            True if job was updated, False if job not found
        """
        async with self._lock:
            job = self._jobs.get(job_id)
            if not job:
                logger.warning(f"Attempted to update non-existent job {job_id}")
                return False
            
            if status:
                job.update_status(status, error)
            
            if result:
                job.add_result(result)
            
            logger.debug(f"Updated job {job_id}: status={status}, has_result={result is not None}")
            return True
    
    async def list_jobs(
        self,
        user_id: Optional[str] = None,
        status: Optional[JobStatus] = None,
        limit: int = 100
    ) -> list[JobState]:
        """
        List jobs with optional filtering.
        
        Args:
            user_id: Filter by user ID (optional)
            status: Filter by status (optional)
            limit: Maximum number of jobs to return
        
        Returns:
            List of JobState objects
        """
        async with self._lock:
            jobs = list(self._jobs.values())
            
            # Apply filters
            if user_id:
                jobs = [j for j in jobs if j.user_id == user_id]
            
            if status:
                jobs = [j for j in jobs if j.status == status]
            
            # Sort by created_at descending
            jobs.sort(key=lambda x: x.created_at, reverse=True)
            
            return jobs[:limit]
    
    async def delete_job(self, job_id: str) -> bool:
        """
        Delete a job.
        
        Args:
            job_id: Job ID to delete
        
        Returns:
            True if deleted, False if not found
        """
        async with self._lock:
            if job_id in self._jobs:
                del self._jobs[job_id]
                logger.info(f"Deleted job {job_id}")
                return True
            return False


# Global job manager instance
job_manager = JobManager()

