import os
from pathlib import Path

import librosa
import noisereduce as nr
import numpy as np
import soundfile as sf
from scipy import signal


class AudioPreprocessor:
    def __init__(self, output_dir: str = "uploads/cleaned") -> None:
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)

    def load_audio(self, file_path):
        waveform, sample_rate = librosa.load(file_path, sr=None, mono=False)
        if waveform.ndim == 1:
            waveform = waveform[np.newaxis, :]
        return waveform, sample_rate

    def preprocess(self, file_path: str) -> dict:
        original = Path(file_path)
        waveform, sample_rate = self.load_audio(str(original))

        if waveform.ndim > 1:
            waveform = np.mean(waveform, axis=0)

        waveform = waveform.astype(np.float32)
        reduced = nr.reduce_noise(y=waveform, sr=sample_rate)
        noise_suppression_applied = bool(np.mean(np.abs(reduced - waveform)) > 1e-6)

        waveform = reduced
        peak = np.max(np.abs(waveform)) if np.max(np.abs(waveform)) > 0 else 1.0
        target_peak = 10 ** (-3 / 20)
        waveform = waveform * (target_peak / peak)
        gain_normalized = True

        nyquist = sample_rate / 2.0
        low = 300 / nyquist
        high = 3400 / nyquist
        b, a = signal.butter(4, [low, high], btype="bandpass")
        waveform = signal.filtfilt(b, a, waveform)
        bandpass_filtered = True

        if waveform.ndim > 1:
            waveform = np.mean(waveform, axis=0)
        waveform = librosa.to_mono(waveform)

        target_sr = 16000
        waveform = librosa.resample(waveform, orig_sr=sample_rate, target_sr=target_sr)
        duration_seconds = float(len(waveform)) / float(target_sr)

        cleaned_name = f"{original.stem}_cleaned.wav"
        cleaned_path = self.output_dir / cleaned_name
        sf.write(str(cleaned_path), waveform.astype(np.float32), target_sr)

        return {
            "cleaned_audio_path": str(cleaned_path),
            "duration_seconds": round(duration_seconds, 3),
            "sample_rate": target_sr,
            "noise_suppression_applied": noise_suppression_applied,
            "gain_normalized": gain_normalized,
            "bandpass_filtered": bandpass_filtered,
            "original_format": original.suffix.lower().lstrip("."),
            "file_size_mb": round(os.path.getsize(file_path) / (1024 * 1024), 3),
        }
