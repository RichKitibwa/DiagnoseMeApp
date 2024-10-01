import os
import uvicorn
from fastapi import FastAPI
from app.database import engine, Base
from app.routers import auth, organisations, users

app = FastAPI()

app.include_router(auth.router, prefix="/auth", tags=["auth"])
# app.include_router(organisations.router, prefix="/organisations", tags=["organisations"])
# app.include_router(users.router, prefix="/users", tags=["users"])

@app.on_event("startup")
async def on_startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

@app.get("/")
async def read_root():
    return {"message": "Welcome to DiagnoseMe API"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)
