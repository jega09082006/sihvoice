from __future__ import annotations

from datetime import datetime


def generate_call_id() -> str:
    now = datetime.now()
    year = now.strftime("%Y")
    sequence = now.strftime("%d%H%M%S")
    return f"CALL-{year}-{sequence}"
