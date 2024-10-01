import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app import schemas, repository, database, auth
from ..constants import UserRole, UserStatus
from app.auth import is_valid_registration_number

router = APIRouter()

@router.post("/signup")
async def signup(user: schemas.UserCreate, db: AsyncSession = Depends(database.get_db)):
    if user.user_role == UserRole.DOCTOR and not is_valid_registration_number(user.registration_number):
        raise HTTPException(status_code=400, detail="Invalid registration number. Please provide a valid registration number.")

    db_user = await repository.get_user_by_email(db, user.email)
    if db_user:
        raise HTTPException(status_code=400, detail=f"The email '{user.email}' is already registered. Please log in or use a different email address.")
    
    # Create the user
    created_user = await repository.create_user(db=db, user=user)
    
    # Generate OTP and set user status
    otp = auth.generate_otp()
    created_user.verification_code = otp
    created_user.user_status = UserStatus.PENDING_VERIFICATION

    # Save the changes to the database
    db.add(created_user)
    await db.commit()
    await db.refresh(created_user)

    # Send the OTP email
    await auth.send_otp_via_email(created_user.email, otp)

    return {
        "message": "User successfully signed up. Please check your email for the OTP to complete verification.",
        "user_id": str(created_user.id)
    }

@router.post("/verify-otp")
async def verify_otp(otp_verification: schemas.OTPVerification, db: AsyncSession = Depends(database.get_db)):
    is_verified = await auth.verify_otp(db, otp_verification.user_id, otp_verification.otp)
    if not is_verified:
        raise HTTPException(status_code=400, detail="Invalid OTP or expired")
    
    return {"message": "OTP verified successfully"}

@router.post("/login")
async def login(user: schemas.UserCreate, db: AsyncSession = Depends(database.get_db)):
    db_user = await auth.authenticate_user(db, user.username, user.password)
    if not db_user or db_user.user_status != UserStatus.ACTIVE:
        raise HTTPException(status_code=400, detail="Incorrect username or password or account not verified")
    
    access_token = auth.create_access_token(data={"sub": db_user.username, "role": db_user.user_role.value})
    return {"access_token": access_token, "token_type": "bearer", "userRole": db_user.user_role}
