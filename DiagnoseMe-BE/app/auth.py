import os
import random
import string
import aiosmtplib
import uuid
from email.message import EmailMessage
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession
from jose import JWTError, jwt
from passlib.context import CryptContext
from dotenv import load_dotenv
from typing import Optional
from datetime import datetime, timedelta
from app.models import User
from app.database import get_db
from app import repository, database
from app.constants import UserStatus 

load_dotenv()

SECRET_KEY = os.getenv("JWT_SECRET")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# SMTP Configuration 
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USERNAME = os.getenv("SMTP_USERNAME") 
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

# JWT token creation
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.now()+ (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    print(f"Generated JWT Token: {encoded_jwt}")
    print(f"JWT Payload: {to_encode}") 
    return encoded_jwt

async def authenticate_user(db: AsyncSession, username: str, password: str):
    user = await repository.get_user_by_username(db, username)
    if not user or not verify_password(password, user.hashed_password):
        return False
    return user

def generate_otp(length=6):
    return ''.join(random.choices(string.digits, k=length))

async def send_otp_via_email(email: str, otp: str):
    message = EmailMessage()
    message["From"] = SMTP_USERNAME
    message["To"] = email
    message["Subject"] = "Your OTP Verification Code"
    message.set_content(f"Your OTP verification code is: {otp}. Please use this to complete your registration.")

    try:
        await aiosmtplib.send(
            message,
            hostname=SMTP_SERVER,
            port=SMTP_PORT,
            start_tls=True,
            username=SMTP_USERNAME,
            password=SMTP_PASSWORD,
        )
        print(f"OTP email sent successfully to {email}")
    except Exception as e:
        print(f"Failed to send OTP email: {e}")
        raise HTTPException(status_code=500, detail="Failed to send OTP email")

async def send_temporary_patient_password(email: str, temporary_password: str):
    message = EmailMessage()
    message["From"] = SMTP_USERNAME
    message["To"] = email
    message["Subject"] = "Your Temporary Password for Login"
    message.set_content(f"Your temporary password is: {temporary_password}\nPlease log in and change your password.")

    try:
        await aiosmtplib.send(
            message,
            hostname=SMTP_SERVER,
            port=SMTP_PORT,
            start_tls=True,
            username=SMTP_USERNAME,
            password=SMTP_PASSWORD,
        )
        print(f"Temporary password sent successfully to {email}")
    except Exception as e:
        print(f"Failed to send temporary password to patient email: {e}")
        raise HTTPException(status_code=500, detail="Failed to send temporary password email")

async def verify_otp(db: AsyncSession, user_id: uuid.UUID, otp: str):
    user = await repository.get_user(db, user_id)
    if user and user.verification_code == otp:
        user.user_status = UserStatus.ACTIVE
        db.add(user)
        await db.commit()
        return True
    return False

async def get_current_user(db: AsyncSession = Depends(get_db), token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("user_id")
        username: str = payload.get("username")
        role: str = payload.get("role")

        if not user_id or not username:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = await repository.get_user(db, user_id=user_id)
    if not user or user.username != username or user.user_role.value != role:
        raise credentials_exception
    return user

def is_valid_registration_number(registration_number):
    with open("app/registration_numbers.txt", "r") as file:
        valid_numbers = file.read().splitlines()
    return registration_number in valid_numbers
