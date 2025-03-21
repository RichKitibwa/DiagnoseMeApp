from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app import schemas, models, database, auth

router = APIRouter()

@router.post("/")
async def create_organisation(
    organisation: schemas.OrganisationCreate, 
    db: AsyncSession = Depends(database.get_db), 
    current_user: models.User = Depends(auth.get_current_user)
):
    organisation_data = models.Organisation(
        user_id=current_user.id,
        clinic_name=organisation.clinic_name,
        location=organisation.location,
        created_by=current_user.id
    )
    db.add(organisation_data)
    await db.commit()
    await db.refresh(organisation_data)

    return {"message": "Organisation created successfully", "organisation_id": str(organisation_data.id)}
