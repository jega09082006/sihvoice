from __future__ import annotations

import re
from collections import Counter


class BertService:
    MODEL_NAME = "nlptown/bert-base-multilingual-uncased-sentiment"
    DISPLAY_NAME = "BERT Text Sentiment & Context Analyzer"

    def __init__(self) -> None:
        self.model = None
        self.model_error = None

        try:
            from transformers import pipeline

            self.model = pipeline("sentiment-analysis", model=self.MODEL_NAME)
        except Exception as exc:  # pragma: no cover - depends on external model registry
            self.model_error = str(exc)

    @staticmethod
    def _sentiment(label: str) -> str:
        normalized = label.lower()
        if normalized in {"positive", "label_4", "label_3"} or normalized.endswith(("4 stars", "5 stars")):
            return "Positive"
        if normalized in {"negative", "label_0", "label_1"} or normalized.endswith(("1 star", "2 stars")):
            return "Negative"
        return "Neutral"

    @staticmethod
    def _key_phrases(segments: list[dict]) -> list[str]:
        stop_words = {
            "about", "after", "again", "also", "been", "from", "have", "that",
            "this", "they", "there", "their", "these", "with", "your", "you",
            "are", "was", "were", "will", "would", "could", "should", "the",
            "and", "for", "not", "but", "our", "what", "when", "where",
        }
        words = re.findall(r"[A-Za-z][A-Za-z'-]{3,}", " ".join(
            str(segment.get("text", "")) for segment in segments
        ).lower())
        return [word for word, _ in Counter(word for word in words if word not in stop_words).most_common(8)]

    def analyze_sentiment(self, labeled_transcript: list[dict]) -> dict:
        timeline = []
        for segment in labeled_transcript:
            text = str(segment.get("text", "")).strip()
            sentiment = "Neutral"
            confidence = 0.0

            if text and self.model is not None:
                try:
                    prediction = self.model(text[:512])[0]
                    sentiment = self._sentiment(str(prediction.get("label", "")))
                    confidence = float(prediction.get("score", 0.0))
                except Exception as exc:  # pragma: no cover - runtime model fallback
                    self.model_error = str(exc)
            elif text:
                self.model_error = self.model_error or "Model unavailable; using neutral sentiment fallback."

            timeline.append({
                "speaker": segment.get("speaker", "Unknown"),
                "start": float(segment.get("start", 0.0)),
                "end": float(segment.get("end", 0.0)),
                "text": text,
                "sentiment": sentiment,
                "confidence": confidence,
            })

        def dominant(speaker: str) -> str:
            sentiments = [item["sentiment"] for item in timeline if item["speaker"] == speaker]
            return Counter(sentiments).most_common(1)[0][0] if sentiments else "Neutral"

        sentiment_counts = Counter(item["sentiment"] for item in timeline)
        overall = sentiment_counts.most_common(1)[0][0] if sentiment_counts else "Neutral"
        result = {
            "caller_dominant_sentiment": dominant("Caller"),
            "operator_dominant_sentiment": dominant("Operator"),
            "sentiment_timeline": timeline,
            "overall_text_sentiment": overall,
            "key_phrases": self._key_phrases(labeled_transcript),
            "model_used": self.DISPLAY_NAME,
        }
        if self.model_error:
            result["warning"] = self.model_error
        return result
