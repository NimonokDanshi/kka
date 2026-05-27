from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.services.fhir import get_observations, get_patients

app = FastAPI(title="Med-Visualize Backend")

origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/patients")
def patients():
    return get_patients()

@app.get("/observations")
def observations(patient_id: str = None):
    return get_observations(patient_id)

