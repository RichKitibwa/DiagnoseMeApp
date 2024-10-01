from enum import Enum

class UserStatus(str, Enum):
    PENDING_VERIFICATION = "PENDING_VERIFICATION"
    ACTIVE = "ACTIVE"

class UserRole(str, Enum):
    DOCTOR = "DOCTOR"
    PATIENT = "PATIENT"

class CaseStatus(str, Enum):
    OPEN = "OPEN"
    CLOSED = "CLOSED"
