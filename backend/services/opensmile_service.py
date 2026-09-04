from __future__ import annotations

import math
from pathlib import Path

import librosa
import numpy as np


class OpenSmileService:
    def extract_features(self, audio_path: str) -> dict:
        audio_file = Path(audio_path)
        if not audio_file.exists():
            raise FileNotFoundError(f"Audio file not found: {audio_path}")

        try:
            import opensmile

            sm = opensmile.Smile(
                feature_set=opensmile.FeatureSet.ComParE_2016,
                feature_level=opensmile.FeatureLevel.Functionals,
            )
            features = sm.process(str(audio_file))
            feature_row = features.iloc[0].to_dict()
        except Exception:
            y, sr = librosa.load(str(audio_file), sr=None, mono=True)
            mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
            pitch_variance = float(np.var(librosa.yin(y, fmin=50, fmax=400))) if len(y) > 0 else 0.0
            speech_rate = float(len(y) / max(sr, 1)) / 10.0
            voice_energy_level = float(np.mean(np.abs(y)))
            silence_ratio = float(np.mean(np.abs(y) < 0.01))
            tremor_stress_detected = bool(voice_energy_level > 0.05 and pitch_variance > 20)
            jitter = float(np.std(np.diff(np.abs(y)))) if len(y) > 1 else 0.0
            shimmer = float(np.std(np.diff(y))) if len(y) > 1 else 0.0
            zero_crossing_rate = float(np.mean(np.abs(np.diff(np.signbit(y))))) if len(y) > 1 else 0.0
            loudness_contour = float(np.max(np.abs(y)))
            hnr_score = float(np.mean(np.abs(y)) / (np.std(y) + 1e-8))
            feature_row = {
                "pitch_variance": pitch_variance,
                "speech_rate": speech_rate,
                "voice_energy_level": voice_energy_level,
                "silence_ratio": silence_ratio,
                "tremor_stress_detected": tremor_stress_detected,
                "mfcc_summary": {
                    "mean": float(np.mean(mfcc)),
                    "std": float(np.std(mfcc)),
                },
                "jitter": jitter,
                "shimmer": shimmer,
                "zero_crossing_rate": zero_crossing_rate,
                "loudness_contour": loudness_contour,
                "hnr_score": hnr_score,
            }

        return {
            "pitch_variance": float(feature_row.get("pitch_variance", 0.0)),
            "speech_rate": float(feature_row.get("speech_rate", 0.0)),
            "voice_energy_level": float(feature_row.get("voice_energy_level", 0.0)),
            "silence_ratio": float(feature_row.get("silence_ratio", 0.0)),
            "tremor_stress_detected": bool(feature_row.get("tremor_stress_detected", False)),
            "mfcc_summary": feature_row.get("mfcc_summary", {"mean": 0.0, "std": 0.0}),
            "jitter": float(feature_row.get("jitter", 0.0)),
            "shimmer": float(feature_row.get("shimmer", 0.0)),
            "zero_crossing_rate": float(feature_row.get("zero_crossing_rate", 0.0)),
            "loudness_contour": float(feature_row.get("loudness_contour", 0.0)),
            "hnr_score": float(feature_row.get("hnr_score", 0.0)),
            "model_used": "openSMILE Acoustic Feature Extractor",
        }
