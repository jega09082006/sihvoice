# Voice Recognizer and Management Backend

This backend powers the call analysis pipeline for the React frontend running at http://localhost:5173.

## Project structure

- `main.py` — FastAPI app and CORS configuration
- `config.py` — environment variable loader
- `api/routes/` — API endpoints for upload, analysis, dashboard
- `services/` — audio, Whisper, diarization, emotion, acoustic, fusion, Firebase logic
- `models/` — data models for call records and analysis results
- `utils/` — file and ID helper functions
- `uploads/` — uploaded and cleaned audio files

## Pipeline architecture

1. Audio pre-processing
2. Whisper transcription
3. Speaker diarization
4. Parallel emotion + acoustic feature analysis
5. CatBoost fusion scoring
6. Firebase persistence
7. Dashboard reporting

## Setup

1. Open a terminal in `sih_voice/backend`.
2. Create a virtual environment if needed.
3. Install dependencies:
   ```bash
   python -m pip install -r requirements.txt
   ```
4. Copy `.env.example` to `.env` and add secrets as needed.

## Run

```bash
chmod +x run.sh
./run.sh
```

The backend runs at: http://localhost:8000

## API endpoints

### Health
- `GET /api/health`

### Upload
- `POST /api/upload`

### Analysis
- `POST /api/analyze/transcribe`
- `POST /api/analyze/diarize`
- `POST /api/analyze/parallel`
- `POST /api/analyze/fuse`
- `POST /api/analyze/full-pipeline` (SSE stream)

### Dashboard
- `GET /api/dashboard/records`
- `GET /api/dashboard/records/{call_id}`
- `GET /api/dashboard/summary`

## Frontend integration

The frontend should call the backend from the React app host:

- Frontend: http://localhost:5173
- Backend: http://localhost:8000

CORS is configured to allow http://localhost:5173.
