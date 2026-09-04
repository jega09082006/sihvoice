import os
from pathlib import Path

from config import WHISPER_MODEL_SIZE


class WhisperService:
    def __init__(self) -> None:
        self.model_name = os.getenv("WHISPER_MODEL_SIZE", WHISPER_MODEL_SIZE)
        self.model = None
        self.model_error = None

        try:
            import whisper

            self.model = whisper.load_model(self.model_name)
        except Exception as exc:  # pragma: no cover - depends on optional runtime packages
            self.model_error = str(exc)

    def transcribe(self, audio_path: str) -> dict:
        audio_file = Path(audio_path)
        if not audio_file.exists():
            raise FileNotFoundError(f"Audio file not found: {audio_path}")

        if self.model is None:
            return {
                "full_transcript": "Transcription unavailable because Whisper model could not be loaded.",
                "language_detected": "unknown",
                "confidence_score": 0.0,
                "segments": [],
                "model_used": "Speech Transcription Engine",
                "warning": self.model_error or "Whisper model was not initialized.",
            }

        result = self.model.transcribe(
            str(audio_file),
            word_timestamps=True,
            fp16=False,
        )

        segments = []
        for segment in result.get("segments", []):
            words = []
            for word in segment.get("words", []):
                words.append(
                    {
                        "word": word.get("word", ""),
                        "start": float(word.get("start", 0.0)),
                        "end": float(word.get("end", 0.0)),
                    }
                )

            segments.append(
                {
                    "start": float(segment.get("start", 0.0)),
                    "end": float(segment.get("end", 0.0)),
                    "text": segment.get("text", ""),
                    "words": words,
                }
            )

        return {
            "full_transcript": result.get("text", ""),
            "language_detected": result.get("language", "unknown"),
            "confidence_score": float(result.get("confidence", 0.0)),
            "segments": segments,
            "model_used": "Speech Transcription Engine",
        }
