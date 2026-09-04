from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, File, HTTPException, UploadFile

from config import ALLOWED_EXTENSIONS, MAX_FILE_SIZE_MB, UPLOAD_PATH
from services.audio_preprocessor import AudioPreprocessor

router = APIRouter(prefix="/api", tags=["upload"])


@router.post("/upload")
async def upload_audio(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file was uploaded.")

    extension = Path(file.filename).suffix.lower()
    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}",
        )

    contents = await file.read()
    max_bytes = MAX_FILE_SIZE_MB * 1024 * 1024
    if len(contents) > max_bytes:
        raise HTTPException(
            status_code=400,
            detail=f"File exceeds the maximum allowed size of {MAX_FILE_SIZE_MB} MB.",
        )

    UPLOAD_PATH.mkdir(parents=True, exist_ok=True)
    file_name = f"{uuid4().hex}{extension}"
    file_path = UPLOAD_PATH / file_name
    with file_path.open("wb") as destination:
        destination.write(contents)

    preprocessor = AudioPreprocessor(output_dir=str(UPLOAD_PATH / "cleaned"))
    result = preprocessor.preprocess(str(file_path))
    return result
