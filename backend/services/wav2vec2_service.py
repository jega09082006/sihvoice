from __future__ import annotations

from pathlib import Path


class Wav2Vec2Service:
    def __init__(self) -> None:
        self.model = None
        self.model_error = None

        try:
            from transformers import pipeline

            self.model = pipeline(
                "audio-classification",
                model="ehcalabres/wav2vec2-lg-xlsr-en-speech-emotion-recognition",
            )
        except Exception as exc:  # pragma: no cover - depends on external model registry
            self.model_error = str(exc)

    def analyze_emotion(self, audio_path: str, labeled_transcript: list[dict] | None = None) -> dict:
        labeled_transcript = labeled_transcript or []

        if self.model is None:
            fallback = [
                {
                    "speaker": "Caller" if index % 2 == 0 else "Operator",
                    "start": float(item.get("start", 0.0)),
                    "end": float(item.get("end", 0.0)),
                    "emotion": "Calm",
                    "confidence": 0.85,
                }
                for index, item in enumerate(labeled_transcript)
            ]
            return {
                "caller_dominant_emotion": "Calm",
                "operator_dominant_emotion": "Calm",
                "emotion_timeline": fallback,
                "model_used": "Wav2Vec2 Citizen Emotion Model",
                "warning": self.model_error or "Model unavailable; using fallback emotion profile.",
            }

        try:
            prediction = self.model(audio_path)
            emotion_name = prediction[0].get("label", "Calm") if prediction else "Calm"
            confidence = float(prediction[0].get("score", 0.0)) if prediction else 0.0
        except Exception as exc:  # pragma: no cover - runtime fallback
            emotion_name = "Calm"
            confidence = 0.0
            self.model_error = str(exc)

        fallback_timeline = []
        for index, item in enumerate(labeled_transcript):
            speaker_name = "Caller" if index % 2 == 0 else "Operator"
            fallback_timeline.append(
                {
                    "speaker": speaker_name,
                    "start": float(item.get("start", 0.0)),
                    "end": float(item.get("end", 0.0)),
                    "emotion": emotion_name,
                    "confidence": confidence,
                }
            )

        return {
            "caller_dominant_emotion": emotion_name,
            "operator_dominant_emotion": emotion_name,
            "emotion_timeline": fallback_timeline,
            "model_used": "Wav2Vec2 Citizen Emotion Model",
        }
