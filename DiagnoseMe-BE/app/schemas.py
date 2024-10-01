import uuid
from pydantic import BaseModel, EmailStr
from uuid import UUID
from typing import Optional
from datetime import datetime
from app.constants import UserStatus, UserRole

class UserBase(BaseModel):
    username: str
    email: EmailStr
    user_role: UserRole

class UserCreate(UserBase):
    password: str
    registration_number: Optional[str] = None
    verification_code: Optional[str] = None 

class UserRead(UserBase):
    id: UUID
    user_status: UserStatus

    class Config:
        orm_mode = True
        from_attributes = True 

class UserUpdate(UserBase):
    password: Optional[str] = None

class OTPVerification(BaseModel):
    user_id: uuid.UUID
    otp: str

class OrganisationBase(BaseModel):
    clinic_name: str
    location: str

class OrganisationCreate(OrganisationBase):
    user_id: UUID

class Organisation(OrganisationBase):
    id: UUID
    user_id: UUID

    class Config:
        orm_mode = True
        from_attributes = True 

class OrganisationUserBase(BaseModel):
    user_id: UUID
    organisation_id: UUID
    user_role: UserRole

class OrganisationUserCreate(OrganisationUserBase):
    pass

class OrganisationUser(OrganisationUserBase):
    id: UUID

    class Config:
        orm_mode = True
        from_attributes = True

class CaseBase(BaseModel):
    title: str
    diagnosis: Optional[str] = None
    medication: Optional[str] = None
    status: Optional[str] = None

class CaseCreate(CaseBase):
    doctor_id: UUID
    patient_id: UUID
    organisation_id: UUID

class Case(CaseBase):
    id: UUID

    class Config:
        orm_mode = True
        from_attributes = True
