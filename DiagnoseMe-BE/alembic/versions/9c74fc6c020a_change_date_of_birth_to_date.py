"""change date_of_birth to Date

Revision ID: 9c74fc6c020a
Revises: 3adff6d93684
Create Date: 2025-01-18 15:42:33.883248

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9c74fc6c020a'
down_revision: Union[str, None] = '3adff6d93684'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column(
        'user', 'date_of_birth',
        existing_type=sa.DateTime(),
        type_=sa.Date(),
        existing_nullable=True
    )


def downgrade() -> None:
    op.alter_column(
        'user', 'date_of_birth',
        existing_type=sa.Date(),
        type_=sa.DateTime(),
        existing_nullable=True
    )
