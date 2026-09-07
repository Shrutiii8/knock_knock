from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from app.api.routers import stations, trains, live_status, pnr, schedule, search, auth, bookings, eta

app = FastAPI(
    title="IRCTC Clone Backend API",
    description="FastAPI Backend for IRCTC clone, scalable for ML integration.",
    version="1.0.0"
)

import os
from dotenv import load_dotenv

load_dotenv()

# Configure CORS for frontend
cors_origins_env = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")
origins = [origin.strip() for origin in cors_origins_env.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(stations.router, prefix="/api/stations", tags=["Stations"])
app.include_router(trains.router, prefix="/api/trains", tags=["Trains"])
app.include_router(live_status.router, prefix="/api/live-status", tags=["Live Status"])
app.include_router(pnr.router, prefix="/api/pnr", tags=["PNR"])
app.include_router(schedule.router, prefix="/api/schedule", tags=["Schedule"])
app.include_router(search.router, prefix="/api/search", tags=["Search"])
app.include_router(eta.router, prefix="/api/eta", tags=["ETA"])
app.include_router(auth.router, prefix="/api")
app.include_router(bookings.router, prefix="/api")

@app.get("/")
def root():
    return {"message": "Welcome to IRCTC Clone Backend API"}

@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "Backend is running smoothly!"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
