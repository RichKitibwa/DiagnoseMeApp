from sqlalchemy import Column, String, Integer, ForeignKey, DateTime, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from .database import Base
import uuid
from app.constants import UserStatus, UserRole, CaseStatus

class User(Base):
    __tablename__ = "user"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String, nullable=False)
    user_status = Column(Enum(UserStatus), default=UserStatus.PENDING_VERIFICATION)
    user_role = Column(Enum(UserRole), nullable=False)
    registration_number = Column(String, nullable=True)
    verification_code = Column(String, nullable=True)
    gender = Column(String, nullable=True)
    date_of_birth = Column(DateTime, nullable=True)
    patient_phone_number = Column(String, nullable=True)
    allergies = Column(String, nullable=True)
    chronic_illnesses = Column(String, nullable=True)
    next_of_kin_name = Column(String, nullable=True)
    next_of_kin_phone_number = Column(String, nullable=True)

class Organisation(Base):
    __tablename__ = "organisation"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("user.id"))
    clinic_name = Column(String, nullable=False)
    location = Column(String, nullable=False)
    user = relationship("User", back_populates="organisations")

class OrganisationUser(Base):
    __tablename__ = "organisation_user"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    organisation_id = Column(UUID(as_uuid=True), ForeignKey("organisation.id"))
    user_id = Column(UUID(as_uuid=True), ForeignKey("user.id"))
    user_role = Column(Enum(UserRole), nullable=False)
    organisation = relationship("Organisation", back_populates="organisation_users")
    user = relationship("User", back_populates="organisation_users")

class Case(Base):
    __tablename__ = "case"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    doctor_id = Column(UUID(as_uuid=True), ForeignKey("user.id"))
    patient_id = Column(UUID(as_uuid=True), ForeignKey("user.id"))
    organisation_id = Column(UUID(as_uuid=True), ForeignKey("organisation.id"))
    title = Column(String, nullable=False)
    diagnosis = Column(String, nullable=True)
    medication = Column(String, nullable=True)
    status = Column(Enum(CaseStatus), default=CaseStatus.OPEN)
    doctor = relationship("User", foreign_keys=[doctor_id])
    patient = relationship("User", foreign_keys=[patient_id])
    organisation = relationship("Organisation")

User.organisations = relationship("Organisation", order_by=Organisation.id, back_populates="user")
User.organisation_users = relationship("OrganisationUser", order_by=OrganisationUser.id, back_populates="user")
Organisation.organisation_users = relationship("OrganisationUser", order_by=OrganisationUser.id, back_populates="organisation")
