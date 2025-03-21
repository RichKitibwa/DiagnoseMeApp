from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app import schemas, models, database, auth, repository
from app.models import UserRole
from secrets import token_urlsafe

router = APIRouter()

@router.post("/create_patient")
async def create_patient(
    patient: schemas.PatientCreate, 
    db: AsyncSession = Depends(database.get_db), 
    current_user: models.User = Depends(auth.get_current_user),
):
    print(f"Received patient data: {patient}", flush=True)
    print(f"Current user: {current_user}", flush=True)

    if current_user.user_role != UserRole.DOCTOR:
        raise HTTPException(status_code=403, detail="Only doctors can create patients")
    
    organisation = await repository.get_organisation_by_user_id(db, current_user.id)
    if not organisation:
        raise HTTPException(status_code=400, detail="Doctor does not have an associated organization")
    print(f"Retrieved organisation: {organisation}", flush=True)

    # Generate a temporary password for the patient
    temporary_password = token_urlsafe(8)  # Generates a secure, random password
    hashed_password = auth.get_password_hash(temporary_password)
    
    try:
        patient_data = models.User(
            username=patient.username,
            email=patient.email,
            hashed_password=hashed_password,
            user_role=UserRole.PATIENT,
            gender=patient.gender,
            date_of_birth=patient.date_of_birth,
            patient_phone_number=patient.patient_phone_number,
            allergies=patient.allergies,
            chronic_illnesses=patient.chronic_illnesses,
            next_of_kin_name=patient.next_of_kin_name,
            next_of_kin_phone_number=patient.next_of_kin_phone_number,
            created_by=current_user.username,
            updated_by=current_user.username
        )
        db.add(patient_data)
        await db.flush()
        print(f"Patient data after flush: {patient_data}", flush=True)

        # Link patient to organization
        organisation_user = models.OrganisationUser(
            organisation_id=organisation.id,
            user_id=patient_data.id,
            user_role=UserRole.PATIENT,
            created_by=current_user.username,
            updated_by=current_user.username,
        )
        print(f"Creating organisation user: {organisation_user}", flush=True)
        db.add(organisation_user)
        await db.commit()
        await db.refresh(patient_data)
        await db.refresh(organisation_user)

        # Send the temporary password to the patient
        await auth.send_temporary_patient_password(patient_data.email, temporary_password)

    except Exception as e:
        print("Error while creating patient:", e, flush=True)
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create patient: {str(e)}")    

    return {"message": "Patient created successfully", "patient_id": str(patient_data.id)}

@router.get("/get_patients")
async def get_patients(
    db: AsyncSession = Depends(database.get_db), 
    current_user: models.User = Depends(auth.get_current_user)
):
    if current_user.user_role != UserRole.DOCTOR:
        raise HTTPException(status_code=403, detail="Only doctors can access this data")
    
    organisation = await repository.get_organisation_by_user_id(db, current_user.id)
    if not organisation:
        raise HTTPException(status_code=400, detail="Doctor does not have an associated organization")
    
    result = await db.execute(
        select(models.User)
        .join(models.OrganisationUser, models.User.id == models.OrganisationUser.user_id)
        .where(models.OrganisationUser.organisation_id == organisation.id)
        .where(models.User.user_role == UserRole.PATIENT)
    )
    patients = result.scalars().all()
    return patients

@router.get("/patient/{patient_id}", response_model=schemas.PatientCreate)
async def get_patient_details(
    patient_id: UUID,
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    if current_user.user_role != UserRole.DOCTOR:
        raise HTTPException(status_code=403, detail="Only doctors can access this data")

    # Retrieve the doctor's organization
    organisation = await repository.get_organisation_by_user_id(db, current_user.id)
    if not organisation:
        raise HTTPException(status_code=400, detail="Doctor does not have an associated organization")

    # Fetch the patient details
    result = await db.execute(
        select(models.User)
        .join(models.OrganisationUser, models.User.id == models.OrganisationUser.user_id)
        .where(models.OrganisationUser.organisation_id == organisation.id)
        .where(models.User.id == patient_id)
    )
    patient = result.scalars().first()

    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    return patient
