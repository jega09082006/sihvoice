from __future__ import annotations

from datetime import datetime
from pathlib import Path

from config import FIREBASE_CREDENTIALS_PATH
from utils.file_handler import read_json, save_json
from utils.id_generator import generate_call_id


class FirebaseService:
    def __init__(self) -> None:
        self._store_path = Path(__file__).resolve().parent.parent / "uploads" / "call_records.json"
        try:
            self._store: dict[str, dict] = read_json(self._store_path)
        except FileNotFoundError:
            self._store = {}
        self._initialized = False
        self._db = None

        if not FIREBASE_CREDENTIALS_PATH:
            return

        credentials_path = Path(FIREBASE_CREDENTIALS_PATH)
        if not credentials_path.is_absolute():
            credentials_path = Path(__file__).resolve().parent.parent / credentials_path
        if not credentials_path.exists():
            raise FileNotFoundError(
                f"Firebase credentials file was not found: {credentials_path}"
            )

        import firebase_admin
        from firebase_admin import credentials, firestore

        try:
            firebase_admin.get_app()
        except ValueError:
            firebase_admin.initialize_app(credentials.Certificate(str(credentials_path)))

        self._db = firestore.client()
        self._initialized = True

    def _next_call_id(self) -> str:
        return generate_call_id()

    def save_call_record(self, result: dict) -> str:
        call_id = self._next_call_id()
        record = {
            "call_id": call_id,
            "saved_at": datetime.utcnow().isoformat(),
            "result": result,
        }

        if self._db is not None:
            self._db.collection("call_records").document(call_id).set(record)
        else:
            self._store[call_id] = record
            save_json(self._store_path, self._store)

        return call_id

    def get_all_records(self) -> list:
        if self._db is not None:
            docs = self._db.collection("call_records").stream()
            return [doc.to_dict() for doc in docs]
        return list(self._store.values())

    def get_record_by_id(self, call_id: str) -> dict:
        if self._db is not None:
            doc = self._db.collection("call_records").document(call_id).get()
            return doc.to_dict() if doc.exists else {}
        return self._store.get(call_id, {})

    def get_summary_stats(self) -> dict:
        records = self.get_all_records()
        total_calls = len(records)

        quality_scores = []
        issues = []
        for record in records:
            payload = record.get("result", record)
            quality_scores.append(float(payload.get("call_quality_score", 0)))
            issues.append(payload.get("issue_category", "General Inquiry"))

        avg_quality_score = round(sum(quality_scores) / total_calls, 2) if total_calls else 0.0
        escalation_rate = round(
            sum(1 for record in records if record.get("result", record).get("escalation_risk") in {"High", "Critical"}) / total_calls,
            2,
        ) if total_calls else 0.0
        most_common_issue = max(set(issues), key=issues.count) if issues else "General Inquiry"

        return {
            "total_calls": total_calls,
            "avg_quality_score": avg_quality_score,
            "escalation_rate": escalation_rate,
            "most_common_issue": most_common_issue,
        }
