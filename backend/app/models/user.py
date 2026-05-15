from sqlalchemy import Column, DateTime, Enum, Integer, String
from sqlalchemy.sql import func

from ..database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    username = Column(String(64), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(
        Enum("user", "admin", name="user_role"),
        nullable=False,
        default="user",
    )
    created_at = Column(DateTime(timezone=True), server_default=func.now())
