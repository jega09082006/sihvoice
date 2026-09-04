import os
from pathlib import Path

from dotenv import load_dotenv


load_dotenv()

BASE_DIR = Path(__file__).resolve().parent


def _split_csv(value: str) -> list[str]:
    return [item.strip() for item in value.split(",") if item.strip()]


FIREBASE_CREDENTIALS_PATH = os.getenv("FIREBASE_CREDENTIALS_PATH", "")
WHISPER_MODEL_SIZE = os.getenv("WHISPER_MODEL_SIZE", "base")
HF_TOKEN = os.getenv("HF_TOKEN", "")
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads/")
MAX_FILE_SIZE_MB = int(os.getenv("MAX_FILE_SIZE_MB", "50"))
ALLOWED_EXTENSIONS = tuple(
    _split_csv(os.getenv("ALLOWED_EXTENSIONS", ".mp3,.wav,.ogg,.m4a,.flac"))
)

UPLOAD_PATH = BASE_DIR / UPLOAD_DIR
