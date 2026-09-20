import asyncio
import json
from pathlib import Path

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from services.audio_preprocessor import AudioPreprocessor
from services.bert_service import BertService
from services.catboost_service import CatBoostService
from services.diarization_service import DiarizationService
from services.firebase_service import FirebaseService
from services.opensmile_service import OpenSmileService
from services.wav2vec2_service import Wav2Vec2Service
from services.whisper_service import WhisperService

router = APIRouter(prefix="/api/analyze", tags=["analysis"])


class TranscribeRequest(BaseModel):
    audio_path: str


class DiarizeRequest(BaseModel):
    audio_path: str
    transcript_segments: list[dict] = Field(default_factory=list)


class ParallelRequest(BaseModel):
    audio_path: str
    labeled_transcript: list[dict] = Field(default_factory=list)


class FuseRequest(BaseModel):
    emotion_result: dict
    acoustic_result: dict
    bert_result: dict = Field(default_factory=dict)


class FullPipelineRequest(BaseModel):
    audio_path: str


@router.post("/transcribe")
def transcribe_audio(payload: TranscribeRequest):
    audio_file = Path(payload.audio_path)
    if not audio_file.exists():
        raise HTTPException(status_code=404, detail="Audio file not found.")

    service = WhisperService()
    return service.transcribe(str(audio_file))


@router.post("/diarize")
def diarize_audio(payload: DiarizeRequest):
    audio_file = Path(payload.audio_path)
    if not audio_file.exists():
        raise HTTPException(status_code=404, detail="Audio file not found.")

    service = DiarizationService()
    return service.diarize(str(audio_file), payload.transcript_segments)


@router.post("/parallel")
async def analyze_parallel(payload: ParallelRequest):
    audio_file = Path(payload.audio_path)
    if not audio_file.exists():
        raise HTTPException(status_code=404, detail="Audio file not found.")

    wav2vec2_service = Wav2Vec2Service()
    opensmile_service = OpenSmileService()
    bert_service = BertService()

    wav2vec2_result, opensmile_result, bert_result = await asyncio.gather(
        asyncio.to_thread(wav2vec2_service.analyze_emotion, str(audio_file), payload.labeled_transcript),
        asyncio.to_thread(opensmile_service.extract_features, str(audio_file)),
        asyncio.to_thread(bert_service.analyze_sentiment, payload.labeled_transcript),
    )

    return {
        "wav2vec2": wav2vec2_result,
        "opensmile": opensmile_result,
        "bert": bert_result,
    }


@router.post("/fuse")
def fuse_analysis(payload: FuseRequest):
    service = CatBoostService()
    return service.predict(payload.emotion_result, payload.acoustic_result, payload.bert_result)


@router.post("/full-pipeline")
async def full_pipeline(payload: FullPipelineRequest):
    audio_file = Path(payload.audio_path)
    if not audio_file.exists():
        raise HTTPException(status_code=404, detail="Audio file not found.")

    async def event_generator():
        dispatcher = AudioPreprocessor(output_dir="uploads/cleaned")
        preprocessed = dispatcher.preprocess(str(audio_file))
        yield f"data: {json.dumps({'step': 'preprocessing', 'status': 'complete', 'progress': 15})}\n\n"

        whisper_service = WhisperService()
        whisper_result = whisper_service.transcribe(preprocessed["cleaned_audio_path"])
        yield f"data: {json.dumps({'step': 'whisper', 'status': 'complete', 'progress': 30})}\n\n"

        diarization_service = DiarizationService()
        diarized = diarization_service.diarize(
            preprocessed["cleaned_audio_path"],
            whisper_result.get("segments", []),
        )
        yield f"data: {json.dumps({'step': 'diarization', 'status': 'complete', 'progress': 45})}\n\n"

        wav2vec2_service = Wav2Vec2Service()
        opensmile_service = OpenSmileService()
        bert_service = BertService()
        wav2vec2_result, opensmile_result, bert_result = await asyncio.gather(
            asyncio.to_thread(wav2vec2_service.analyze_emotion, preprocessed["cleaned_audio_path"], diarized.get("labeled_transcript", [])),
            asyncio.to_thread(opensmile_service.extract_features, preprocessed["cleaned_audio_path"]),
            asyncio.to_thread(bert_service.analyze_sentiment, diarized.get("labeled_transcript", [])),
        )
        yield f"data: {json.dumps({'step': 'wav2vec2', 'status': 'complete', 'progress': 55})}\n\n"
        yield f"data: {json.dumps({'step': 'opensmile', 'status': 'complete', 'progress': 65})}\n\n"
        yield f"data: {json.dumps({'step': 'bert', 'status': 'complete', 'progress': 75})}\n\n"

        fusion = CatBoostService().predict(wav2vec2_result, opensmile_result, bert_result)
        final_result = {
            "preprocessing": preprocessed,
            "whisper": whisper_result,
            "diarization": diarized,
            "emotion": wav2vec2_result,
            "acoustics": opensmile_result,
            "bert": bert_result,
            "fusion": fusion,
        }
        yield f"data: {json.dumps({'step': 'catboost', 'status': 'complete', 'progress': 88})}\n\n"

        firebase_service = FirebaseService()
        call_id = firebase_service.save_call_record({**final_result, "call_id": "CALL-2024-0001"})
        final_result["call_id"] = call_id
        yield f"data: {json.dumps({'step': 'firebase', 'status': 'complete', 'progress': 96, 'call_id': call_id})}\n\n"
        yield f"data: {json.dumps({'step': 'done', 'status': 'complete', 'progress': 100, 'result': final_result})}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")
