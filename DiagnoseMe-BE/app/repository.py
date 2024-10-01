from sqlalchemy.orm import Session
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from app import models, schemas, auth
import uuid

async def get_user_by_email(db: Session, email: str):
    result = await db.execute(select(models.User).where(models.User.email == email))
    return result.scalars().first()

async def get_user_by_username(db: Session, username: str):
    result = await db.execute(select(models.User).where(models.User.username == username))
    return result.scalars().first()

async def get_user(db: AsyncSession, user_id: uuid.UUID):
    result = await db.execute(select(models.User).where(models.User.id == user_id))
    return result.scalars().first()

async def create_user(db: AsyncSession, user: schemas.UserCreate):
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(
        id=uuid.uuid4(),
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        user_role=user.user_role,
        registration_number=user.registration_number,
    )
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)

    return db_user

async def create_organisation(db: AsyncSession, organisation: schemas.OrganisationCreate):
    db_organisation = models.Organisation(
        id=uuid.uuid4(),
        clinic_name=organisation.clinic_name,
        location=organisation.location,
        user_id=organisation.user_id,
    )
    db.add(db_organisation)
    await db.commit()
    await db.refresh(db_organisation)
    return db_organisation

async def create_organisation_user(db: AsyncSession, organisation_user: schemas.OrganisationUserCreate):
    db_organisation_user = models.OrganisationUser(
        id=uuid.uuid4(),
        organisation_id=organisation_user.organisation_id,
        user_id=organisation_user.user_id,
        user_role=organisation_user.user_role,
    )
    db.add(db_organisation_user)
    await db.commit()
    await db.refresh(db_organisation_user)
    return db_organisation_user

async def create_case(db: AsyncSession, case: schemas.CaseCreate):
    db_case = models.Case(
        id=uuid.uuid4(),
        title=case.title,
        diagnosis=case.diagnosis,
        medication=case.medication,
        status=case.status,
        doctor_id=case.doctor_id,
        patient_id=case.patient_id,
        organisation_id=case.organisation_id,
    )
    db.add(db_case)
    await db.commit()
    await db.refresh(db_case)
    return db_case
