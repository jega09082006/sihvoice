from importlib import import_module
import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(
    title="Voice Recognizer and Management Backend",
    version="1.0.0",
    description="FastAPI backend for voice call analysis and dashboard services.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

for route_name in ["upload", "analysis", "dashboard"]:
    try:
        module = import_module(f"api.routes.{route_name}")
        if hasattr(module, "router"):
            app.include_router(module.router)
    except ImportError as exc:
        logging.getLogger(__name__).warning(
            "Route module '%s' is not available yet and will be added in a later phase: %s",
            route_name,
            exc,
        )


@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "service": "Voice Recognizer and Management Backend",
    }


@app.on_event("startup")
async def startup_event():
    print("Backend is running on http://localhost:8000")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
