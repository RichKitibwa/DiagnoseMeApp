from sqlalchemy.ext.declarative import as_declarative
from sqlalchemy import Column, DateTime, String, func
from sqlalchemy.orm import declared_attr

@as_declarative()
class Auditable:
    __abstract__ = True

    @declared_attr
    def created_by(cls):
        return Column(String, nullable=True)

    @declared_attr
    def updated_by(cls):
        return Column(String, nullable=True)

    @declared_attr
    def created_at(cls):
        return Column(DateTime(timezone=False), server_default=func.now(), nullable=True)

    @declared_attr
    def updated_at(cls):
        return Column(DateTime(timezone=False), onupdate=func.now(), nullable=True)
