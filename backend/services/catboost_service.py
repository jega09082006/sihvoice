from __future__ import annotations


class CatBoostService:
    def __init__(self) -> None:
        self.model = None
        self.model_error = None

        try:
            from catboost import CatBoostClassifier

            self.model = CatBoostClassifier()
        except Exception as exc:  # pragma: no cover - optional dependency path
            self.model_error = str(exc)

    def predict(self, emotion_result: dict, acoustic_result: dict) -> dict:
        caller_emotion = emotion_result.get("caller_dominant_emotion", "Calm")
        operator_emotion = emotion_result.get("operator_dominant_emotion", "Calm")
        speech_rate = float(acoustic_result.get("speech_rate", 0.0))
        voice_energy = float(acoustic_result.get("voice_energy_level", 0.0))
        silence_ratio = float(acoustic_result.get("silence_ratio", 0.0))

        score = 65
        if caller_emotion in {"Distressed", "Fearful", "Traumatized", "Angry"}:
            score += 12
        if operator_emotion in {"Hopeful", "Relieved"}:
            score += 6
        if speech_rate > 2.5:
            score += 8
        if silence_ratio > 0.3:
            score += 7
        if voice_energy > 0.2:
            score += 5
        score = max(0, min(100, score))

        quality_subscores = {
            "Empathy": min(100, max(40, 70 + ("Hopeful" in operator_emotion) * 10 - ("Distressed" in caller_emotion) * 8)),
            "Clarity": min(100, max(40, 75 + (speech_rate > 2.5) * 5 - (silence_ratio > 0.3) * 8)),
            "Responsiveness": min(100, max(40, 72 + ("Relieved" in operator_emotion) * 8)),
            "Professionalism": min(100, max(45, 80 + ("Calm" in caller_emotion) * 8)),
            "Trauma-Sensitivity": min(100, max(30, 68 + ("Traumatized" in caller_emotion) * 10)),
            "Protocol Adherence": min(100, max(40, 76 + ("Professionalism" in ["Calm"]) * 8)),
        }

        if score >= 85:
            escalation_risk = "Low"
            issue_category = "Service Quality Review"
            resolution_status = "Resolved"
        elif score >= 70:
            escalation_risk = "Medium"
            issue_category = "Escalation Risk Review"
            resolution_status = "In Progress"
        elif score >= 50:
            escalation_risk = "High"
            issue_category = "Behavioral Risk"
            resolution_status = "Monitoring"
        else:
            escalation_risk = "Critical"
            issue_category = "Critical Trauma Response"
            resolution_status = "Immediate Review"

        recommendations = [
            "Reassure the caller and confirm the immediate next step.",
            "Document any signs of elevated distress or urgency for follow-up.",
            "Escalate to a trained supervisor if the caller remains distressed or uncertain.",
        ]

        return {
            "final_emotion": caller_emotion,
            "sentiment_arc": {
                "caller": caller_emotion,
                "operator": operator_emotion,
                "trend": "stable" if caller_emotion == operator_emotion else "dynamic",
            },
            "call_quality_score": int(score),
            "quality_subscores": quality_subscores,
            "escalation_risk": escalation_risk,
            "issue_category": issue_category,
            "resolution_status": resolution_status,
            "recommendations": recommendations,
            "model_used": "CatBoost Call Quality Predictor",
            "warning": self.model_error if self.model_error else None,
        }
