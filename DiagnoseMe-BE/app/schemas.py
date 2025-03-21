import uuid
from pydantic import BaseModel, EmailStr, validator
from uuid import UUID
from typing import Dict, Optional
from datetime import datetime, date
from app.constants import UserStatus, UserRole

class UserBase(BaseModel):
    username: str
    email: EmailStr
    user_role: UserRole

class UserCreate(UserBase):
    password: str
    registration_number: Optional[str] = None
    verification_code: Optional[str] = None 
    clinic: Optional[str] = None  
    location: Optional[str] = None 
    gender: Optional[str] = None
    date_of_birth: Optional[date] = None
    patient_phone_number: Optional[str] = None
    allergies: Optional[str] = None
    chronic_illnesses: Optional[str] = None
    next_of_kin_name: Optional[str] = None
    next_of_kin_phone_number: Optional[str] = None

class PatientCreate(UserBase):
    gender: Optional[str] = None
    date_of_birth: Optional[date] = None
    patient_phone_number: Optional[str] = None
    allergies: Optional[str] = None
    chronic_illnesses: Optional[str] = None
    next_of_kin_name: Optional[str] = None
    next_of_kin_phone_number: Optional[str] = None   

class LoginSchema(BaseModel):
    username: str
    password: str
    
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

class OrganisationCreate(BaseModel):
    clinic_name: str
    location: str
    user_id: UUID

    class Config:
        orm_mode = True

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

class OrganisationUserCreate(BaseModel):
    organisation_id: UUID
    user_id: UUID
    user_role: UserRole

    class Config:
        orm_mode = True

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

class DiagnosisInput(BaseModel):
    patient_data: Dict[str, str]
    chat_history: Optional[str] = ""

class DiagnosisResponse(BaseModel):
    model_response: str
    diagnosis_complete: bool
    updated_chat_history: str 
