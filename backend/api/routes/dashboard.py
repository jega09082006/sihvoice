from fastapi import APIRouter, HTTPException

from services.firebase_service import FirebaseService

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("/records")
def list_records():
    service = FirebaseService()
    return {"records": service.get_all_records()}


@router.get("/records/{call_id}")
def get_record(call_id: str):
    service = FirebaseService()
    record = service.get_record_by_id(call_id)
    if not record:
        raise HTTPException(status_code=404, detail="Call record not found.")
    return record


@router.get("/summary")
def get_summary():
    service = FirebaseService()
    return service.get_summary_stats()
