from sqlalchemy.orm import Session
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from app import models, schemas, auth
from app.models import User
import uuid
from uuid import UUID


async def get_user_by_email(db: Session, email: str):
    result = await db.execute(select(models.User).where(models.User.email == email))
    return result.scalars().first()

async def get_user_by_username(db: Session, username: str):
    result = await db.execute(select(models.User).where(models.User.username == username))
    return result.scalars().first()

async def get_user(db: AsyncSession, user_id: uuid.UUID):
    result = await db.execute(select(models.User).where(models.User.id == user_id))
    return result.scalars().first()

async def get_user_by_id(db: AsyncSession, user_id: uuid.UUID):
    result = await db.execute(select(models.User).where(models.User.id == user_id))
    return result.scalars().first()

async def create_user(db: AsyncSession, user: schemas.UserCreate):
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(
        **user.dict(exclude={"password", "clinic", "location"}),
        id=uuid.uuid4(),
        hashed_password=hashed_password,
        created_by="SELF",
        updated_by="SELF",
    )
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    print(f"User created: {db_user}")
    return db_user

async def create_organisation(db: AsyncSession, organisation: schemas.OrganisationCreate, created_by: str):
    db_organisation = models.Organisation(
        **organisation.dict(),
        created_by=created_by,
        updated_by=created_by,
    )
    db.add(db_organisation)
    await db.commit()
    await db.refresh(db_organisation)
    return db_organisation  

async def create_organisation_user(db: AsyncSession, organisation_user: schemas.OrganisationUserCreate, created_by: str):
    db_organisation_user = models.OrganisationUser(
        **organisation_user.dict(),
        created_by=created_by,
        updated_by=created_by,
    )
    print(f"Creating organisation user: {db_organisation_user}")

    db.add(db_organisation_user)
    await db.commit()
    await db.refresh(db_organisation_user)
    return db_organisation_user
  
async def get_organisation_by_user_id(db: AsyncSession, user_id: uuid.UUID):
    result = await db.execute(select(models.Organisation).where(models.Organisation.user_id == user_id))
    return result.scalars().first()

async def create_case(db: AsyncSession, case: schemas.CaseCreate, current_user: models.User):
    db_case = models.Case(
        id=UUID,
        title=case.title,
        diagnosis=case.diagnosis,
        medication=case.medication,
        status=case.status,
        doctor_id=case.doctor_id,
        patient_id=case.patient_id,
        organisation_id=case.organisation_id,
        created_by=current_user.username,
        updated_by=current_user.username,
    )
    db.add(db_case)
    await db.commit()
    await db.refresh(db_case)
    return db_case
