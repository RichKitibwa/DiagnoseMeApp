"""Create tables

Revision ID: 435ab419ca07
Revises: 
Create Date: 2024-09-25 13:07:22.156260

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '435ab419ca07'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('case',
    sa.Column('id', sa.UUID(), nullable=False),
    sa.Column('doctor_id', sa.UUID(), nullable=True),
    sa.Column('patient_id', sa.UUID(), nullable=True),
    sa.Column('organisation_id', sa.UUID(), nullable=True),
    sa.Column('title', sa.String(), nullable=False),
    sa.Column('diagnosis', sa.String(), nullable=True),
    sa.Column('medication', sa.String(), nullable=True),
    sa.Column('status', sa.Enum('OPEN', 'CLOSED', name='casestatus'), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('user',
    sa.Column('id', sa.UUID(), nullable=False),
    sa.Column('username', sa.String(), nullable=True),
    sa.Column('email', sa.String(), nullable=True),
    sa.Column('hashed_password', sa.String(), nullable=False),
    sa.Column('user_status', sa.Enum('PENDING_VERIFICATION', 'ACTIVE', name='userstatus'), nullable=True),
    sa.Column('user_role', sa.Enum('DOCTOR', 'PATIENT', name='userrole'), nullable=False),
    sa.Column('registration_number', sa.String(), nullable=True),
    sa.Column('verification_code', sa.String(), nullable=True),
    sa.Column('gender', sa.String(), nullable=True),
    sa.Column('date_of_birth', sa.DateTime(), nullable=True),
    sa.Column('patient_phone_number', sa.String(), nullable=True),
    sa.Column('allergies', sa.String(), nullable=True),
    sa.Column('chronic_illnesses', sa.String(), nullable=True),
    sa.Column('next_of_kin_name', sa.String(), nullable=True),
    sa.Column('next_of_kin_phone_number', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_user_email'), 'user', ['email'], unique=True)
    op.create_index(op.f('ix_user_username'), 'user', ['username'], unique=True)
    op.create_table('organisation',
    sa.Column('id', sa.UUID(), nullable=False),
    sa.Column('user_id', sa.UUID(), nullable=True),
    sa.Column('clinic_name', sa.String(), nullable=False),
    sa.Column('location', sa.String(), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('organisation_user',
    sa.Column('id', sa.UUID(), nullable=False),
    sa.Column('organisation_id', sa.UUID(), nullable=True),
    sa.Column('user_id', sa.UUID(), nullable=True),
    sa.Column('user_role', sa.Enum('DOCTOR', 'PATIENT', name='userrole'), nullable=False),
    sa.ForeignKeyConstraint(['organisation_id'], ['organisation.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('organisation_user')
    op.drop_table('organisation')
    op.drop_index(op.f('ix_user_username'), table_name='user')
    op.drop_index(op.f('ix_user_email'), table_name='user')
    op.drop_table('user')
    op.drop_table('case')
    # ### end Alembic commands ###