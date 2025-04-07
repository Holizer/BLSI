from pydantic import BaseModel, Field
from typing import Optional

class CancellationReasons(BaseModel):
    cancellation_reason_id: int
    reason: str

class UpdateCancellationReasons(BaseModel):
    reason: str

class CreateCancellationReasons(BaseModel):
    reason: str