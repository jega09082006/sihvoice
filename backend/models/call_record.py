from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any


@dataclass
class CallRecord:
    call_id: str
    audio_path: str
    transcript: str = ""
    speaker_segments: list[dict[str, Any]] = field(default_factory=list)
    emotion_summary: dict[str, Any] = field(default_factory=dict)
    quality_score: int = 0
    issue_category: str = "General Inquiry"
    resolution_status: str = "Pending"
    recommendations: list[str] = field(default_factory=list)
    created_at: str = ""
    escalation_risk: str = "Low"
    metadata: dict[str, Any] = field(default_factory=dict)
