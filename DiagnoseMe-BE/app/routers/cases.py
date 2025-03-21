from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app import schemas, models, database, auth
from app.models import CaseStatus, UserRole

router = APIRouter()

@router.post("/create_case")
async def create_case(
    case: schemas.CaseCreate, 
    db: AsyncSession = Depends(database.get_db), 
    current_user: models.User = Depends(auth.get_current_user)
):
    if current_user.user_role != UserRole.DOCTOR:
        raise HTTPException(status_code=403, detail="Only doctors can create cases")
    
    case_data = models.Case(
        doctor_id=current_user.id,
        patient_id=case.patient_id,
        organisation_id=case.organisation_id,
        title=case.title,
        diagnosis=case.diagnosis,
        medication=case.medication,
        status=CaseStatus.OPEN,
        created_by=current_user.id
    )
    db.add(case_data)
    await db.commit()
    await db.refresh(case_data)

    return {"message": "Case created successfully", "case_id": str(case_data.id)}

@router.get("/get_cases")
async def get_cases(
    db: AsyncSession = Depends(database.get_db), 
    current_user: models.User = Depends(auth.get_current_user)
):
    if current_user.user_role != UserRole.DOCTOR:
        raise HTTPException(status_code=403, detail="Only doctors can access this data")
    
    cases = await db.execute(select(models.Case).where(models.Case.doctor_id == current_user.id))
    return {"cases": cases.scalars().all()}
