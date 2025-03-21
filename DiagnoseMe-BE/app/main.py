import os
import uvicorn
from fastapi import FastAPI
from app.database import engine, Base
from app.routers import auth, organisations, users, patients, cases
from fastapi.middleware.cors import CORSMiddleware
from app.services.vectorstore_manager import initialize_vectorstore
from app.routers import diagnosis

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(patients.router, prefix="/patients", tags=["patients"])
app.include_router(cases.router, prefix="/cases", tags=["cases"])
app.include_router(organisations.router, prefix="/organisations", tags=["organisations"])
app.include_router(diagnosis.router, prefix="/diagnosis", tags=["Diagnosis"])

@app.on_event("startup")
async def on_startup():
    print("Starting up...")
    initialize_vectorstore()
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

@app.get("/")
async def read_root():
    return {"message": "Welcome to DiagnoseMe API"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)

#Run app using uvicorn app.main:app --reload --host 0.0.0.0 --port 8080