from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any


@dataclass
class AnalysisResult:
    call_id: str
    transcript: str = ""
    summary: dict[str, Any] = field(default_factory=dict)
    quality_score: int = 0
    issue_category: str = "General Inquiry"
    resolution_status: str = "Pending"
    recommendations: list[str] = field(default_factory=list)
