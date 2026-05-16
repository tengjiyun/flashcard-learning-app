from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class FlashcardBase(BaseModel):
    deck: str = Field(default="General", min_length=1, max_length=100)
    front: str = Field(min_length=1)
    back: str = Field(min_length=1)


class FlashcardCreate(FlashcardBase):
    pass


class FlashcardUpdate(BaseModel):
    deck: str | None = Field(default=None, min_length=1, max_length=100)
    front: str | None = Field(default=None, min_length=1)
    back: str | None = Field(default=None, min_length=1)


class FlashcardOut(FlashcardBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    owner_id: int
    created_at: datetime
    updated_at: datetime
