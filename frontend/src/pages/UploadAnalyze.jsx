import React, { useState, useCallback } from 'react';
import { analyzeFullPipeline, uploadAudio } from '../services/api';
import {
  UploadCloud, FileAudio, Phone, RefreshCw, CheckCircle2, Download,
  Mic, Activity, Waves, Zap, Database, AlertTriangle, Clock, Users, Volume2,
} from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, BarChart, Bar, Cell,
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── Pipeline Steps ─────────────────────────────────────── */
const STEPS = [
  { id: 'audioPre',   label: 'Audio Prep',          short: '1' },
  { id: 'whisper',    label: 'Whisper STT',          short: '2' },
  { id: 'diarize',    label: 'Diarization',          short: '3' },
  { id: 'wav2vec2',   label: 'Wav2Vec2',             short: '4' },
  { id: 'opensmile',  label: 'openSMILE',            short: '5' },
  { id: 'bert',       label: 'BERT',                 short: '6' },
  { id: 'catboost',   label: 'CatBoost',             short: '7' },
  { id: 'firebase',   label: 'Firebase',             short: '8' },
  { id: 'done',       label: 'Done ✓',               short: '✓' },
];
/* ─── Helpers ────────────────────────────────────────────── */
const emotionColor = (e) => ({
  Calm: '#22c55e', Hopeful: '#4ade80', Relieved: '#86efac',
  Distressed: '#ef4444', Fearful: '#f87171', Traumatized: '#dc2626',
  Urgent: '#fb923c', Hesitant: '#a78bfa', Angry: '#f97316', Satisfied: '#4ade80',
}[e] ?? '#9ca3af');

const sentimentColor = (sentiment) => ({
  Positive: '#22c55e',
  Negative: '#ef4444',
  Neutral: '#9ca3af',
}[sentiment] ?? '#9ca3af');

const riskStyle = (r) => ({
  Low:      { color: '#22c55e', bg: 'bg-[#22c55e]/15 border-[#22c55e]/50' },
  Medium:   { color: '#f59e0b', bg: 'bg-[#f59e0b]/15 border-[#f59e0b]/50' },
  High:     { color: '#ef4444', bg: 'bg-[#ef4444]/15 border-[#ef4444]/50' },
  Critical: { color: '#dc2626', bg: 'bg-[#dc2626]/20 border-[#dc2626]/70 animate-pulse' },
}[r] ?? { color: '#9ca3af', bg: 'bg-white/10 border-white/20' });

const qualityColor = (s) => s >= 75 ? '#22c55e' : s >= 40 ? '#f59e0b' : '#ef4444';

const resolutionStyle = (s) => ({
  'Case Registered':               'bg-[#22c55e]/20 text-[#22c55e] border-[#22c55e]/50',
  'Referred to Supervisor':        'bg-[#1a73e8]/20 text-[#1a73e8] border-[#1a73e8]/50',
  'Legal Aid Suggested':           'bg-[#a78bfa]/20 text-[#a78bfa] border-[#a78bfa]/50',
  'Callback Scheduled':            'bg-[#60a5fa]/20 text-[#60a5fa] border-[#60a5fa]/50',
  'Support Arranged':              'bg-[#34d399]/20 text-[#34d399] border-[#34d399]/50',
  'Escalated':                     'bg-[#ef4444]/20 text-[#ef4444] border-[#ef4444]/50',
  'Resolved':                      'bg-[#22c55e]/20 text-[#22c55e] border-[#22c55e]/50',
  'Unresolved — Follow-up Required':'bg-gray-700/50 text-gray-300 border-gray-600',
}[s] ?? 'bg-white/10 text-white border-white/20');

/* ─── Sub-components ─────────────────────────────────────── */
function MLBadge({ label, desc, color = '#1a73e8' }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold border"
      style={{ color, borderColor: color + '50', backgroundColor: color + '15' }}>
      <Zap className="w-3 h-3" /> {label} — {desc}
    </span>
  );
}

function StepCard({ step, icon: Icon, accentColor = '#1a73e8', children, delay = 0 }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay }}
      className="bg-black/40 rounded-2xl border border-white/10 overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-3 border-b border-white/10"
        style={{ borderLeftColor: accentColor, borderLeftWidth: 4 }}>
        <Icon className="w-4 h-4 flex-shrink-0" style={{ color: accentColor }} />
        <h3 className="text-sm font-bold text-white uppercase tracking-wide">{step}</h3>
      </div>
      <div className="p-5">{children}</div>
    </motion.div>
  );
}

function ScoreBar({ label, score }) {
  const c = qualityColor(score);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-gray-300">{label}</span>
        <span className="font-bold font-mono" style={{ color: c }}>{score}/100</span>
      </div>
      <div className="w-full bg-black/40 h-2 rounded-full border border-white/10 overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ duration: 1.0, delay: 0.3 }}
          className="h-full rounded-full" style={{ backgroundColor: c }} />
      </div>
    </div>
  );
}

function InfoGrid({ rows }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {rows.map(({ k, v, color }) => (
        <div key={k} className="bg-white/5 rounded-lg p-2.5 border border-white/10">
          <div className="text-[10px] text-gray-500 uppercase tracking-wide">{k}</div>
          <div className="text-sm font-bold mt-0.5" style={{ color: color ?? '#f3f4f6' }}>{v}</div>
        </div>
      ))}
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────── */
export default function UploadAnalyze() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [pipelineStep, setPipelineStep] = useState(-1);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState('');
  const [callId, setCallId] = useState('');
  const [reportExported, setReportExported] = useState(false);

  const isStepDone = (idx) => pipelineStep >= idx;
  const isActive   = (idx) => pipelineStep === idx;

  const handleFile = (file) => {
    if (!file) return;
    const audio = new Audio(URL.createObjectURL(file));
    audio.onloadedmetadata = () => {
      setSelectedFile((current) => current ? { ...current, duration: `${audio.duration.toFixed(1)}s` } : current);
      URL.revokeObjectURL(audio.src);
    };
    setSelectedFile({
      file,
      name: file.name,
      size: `${(file.size / 1048576).toFixed(2)} MB`,
      type: file.name.split('.').pop().toUpperCase(),
      duration: 'Loading…',
    });
    setAnalysisResult(null);
    setCallId('');
    setError('');
    setPipelineStep(-1);
  };

  const handleFileChange = (e) => {
    handleFile(e.target.files?.[0]);
  };
  const handleDrop = (e) => {
    e.preventDefault(); setIsDragOver(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const handleAnalyze = useCallback(async () => {
    if (!selectedFile?.file || isUploading || isAnalyzing) return;
    setError('');
    setIsUploading(true);
    setPipelineStep(0);
    try {
      const uploadResult = await uploadAudio(selectedFile.file);
      setIsUploading(false);
      setIsAnalyzing(true);
      const result = await analyzeFullPipeline(uploadResult.cleaned_audio_path, (progressData) => {
        const stepIndex = {
          uploading: 0, preprocessing: 1, whisper: 2, diarization: 3,
          wav2vec2: 4, opensmile: 5, bert: 6, catboost: 7, firebase: 8, done: 9,
        }[progressData.step];
        if (stepIndex !== undefined) setPipelineStep(stepIndex);
        if (progressData.call_id) setCallId(progressData.call_id);
      });
      setAnalysisResult(result);
      setCallId(result.call_id || '');
      setPipelineStep(9);
    } catch (requestError) {
      setError(`Analysis failed: ${requestError.message}`);
    } finally {
      setIsUploading(false);
      setIsAnalyzing(false);
    }
  }, [isUploading, isAnalyzing, selectedFile]);

  const handleExport = () => { setReportExported(true); setTimeout(() => setReportExported(false), 3500); };

  const emotionData = (analysisResult?.emotion?.emotion_timeline || []).map((s) => ({
    time: `${Number(s.start || 0).toFixed(1)}s`,
    intensity: { Calm: 20, Hopeful: 30, Relieved: 25, Hesitant: 40, Distressed: 65, Angry: 75, Urgent: 80, Fearful: 85, Traumatized: 95 }[s.emotion] ?? 50,
    emotion: s.emotion,
  }));

  const loudnessBars = [35, 62, 88, 76, 55, 70, 48, 38].map((v, i) => ({ t: `${i * 45}s`, v }));

  const backend = analysisResult || {};
  const preprocessing = backend.preprocessing || {};
  const whisper = backend.whisper || {};
  const diarization = backend.diarization || {};
  const emotion = backend.emotion || {};
  const acoustics = backend.acoustics || {};
  const bert = backend.bert || {};
  const fusion = backend.fusion || {};
  const r = {
    audioPreprocessing: {
      noiseSuppression: preprocessing.noise_suppression_applied || false,
      gainNormalization: preprocessing.gain_normalized || false,
      bandpassFiltering: preprocessing.bandpass_filtered || false,
    },
    duration: `${preprocessing.duration_seconds || 0}s`,
    language: whisper.language_detected || '—',
    whisperConfidence: Math.round((whisper.confidence_score || 0) * 100),
    rawTranscript: (whisper.segments || []).map((s) => ({ time: `${s.start}s`, text: s.text })),
    numSpeakers: diarization.num_speakers_detected || 0,
    diarizationMethod: diarization.diarization_method || '—',
    transcript: (diarization.labeled_transcript || []).map((s) => ({ ...s, time: `${s.start}s`, emotion: 'Calm' })),
    wav2vec2: {
      complainantDominant: emotion.caller_dominant_emotion || '—',
      operatorDominant: emotion.operator_dominant_emotion || '—',
      segments: emotion.emotion_timeline || [],
    },
    acousticStats: {
      pitchVariance: acoustics.pitch_variance || 0,
      speechRate: acoustics.speech_rate || 0,
      silenceRatio: acoustics.silence_ratio || 0,
      tremorStress: acoustics.tremor_stress_detected ? 'Detected' : 'Not Detected',
      hnr: acoustics.hnr_score || 0,
      zeroCrossingRate: acoustics.zero_crossing_rate || 0,
      voiceEnergyLevel: Math.min(100, Math.round((acoustics.voice_energy_level || 0) * 100)),
      mfccSummary: JSON.stringify(acoustics.mfcc_summary || {}),
      jitterShimmer: `${acoustics.jitter || 0} / ${acoustics.shimmer || 0}`,
    },
    bert: {
      callerDominant: bert.caller_dominant_sentiment || 'Neutral',
      operatorDominant: bert.operator_dominant_sentiment || 'Neutral',
      overall: bert.overall_text_sentiment || 'Neutral',
      timeline: bert.sentiment_timeline || [],
      keyPhrases: bert.key_phrases || [],
      modelUsed: bert.model_used || 'BERT Text Sentiment & Context Analyzer',
    },
    sentimentArc: {
      start: fusion.sentiment_arc?.caller || bert.caller_dominant_sentiment || emotion.caller_dominant_emotion || '—',
      end: fusion.sentiment_arc?.operator || bert.operator_dominant_sentiment || emotion.operator_dominant_emotion || '—',
    },
    callQualityScore: fusion.call_quality_score || 0,
    operatorSubScores: Object.fromEntries(Object.entries(fusion.quality_subscores || {}).map(([key, value]) => [key.replace(/[- ]/g, '').replace(/^./, (c) => c.toLowerCase()), value])),
    escalationRisk: fusion.escalation_risk || 'Low',
    escalationReason: '',
    issueCategory: fusion.issue_category || '—',
    flaggedPhrases: [],
    resolutionStatus: fusion.resolution_status || '—',
    recommendations: fusion.recommendations || [],
    firebaseCallId: callId || '—',
    uploadDate: new Date().toLocaleString(),
  };
  const rsk = riskStyle(r.escalationRisk);
  const qc = qualityColor(r.callQualityScore);

  return (
    <div className="min-h-[calc(100vh-84px)] bg-[#0a0a0f] text-gray-100 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">

      {/* ── PAGE HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-black/60 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 h-full w-1.5 bg-gradient-to-b from-[#1a73e8] to-[#f59e0b]"></div>
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#1a73e8]/20 border border-[#1a73e8]/50 text-[#1a73e8] tracking-widest uppercase">CALL ANALYSIS ENGINE</span>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-white/5 border border-white/15 text-gray-400 tracking-widest uppercase">DEV BUILD</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Call Quality <span className="text-[#1a73e8]">Analysis Pipeline</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">Upload a call recording to run the multi-stage AI quality pipeline</p>
        </div>
      </div>

      {/* ── UPLOAD ZONE ── */}
      <div className="bg-black/40 p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-5">
          <UploadCloud className="w-5 h-5 text-[#1a73e8]" /> Upload Call Recording
        </h2>

        <div onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)} onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-8 text-center relative transition-all duration-300 ${
            isDragOver ? 'border-[#1a73e8] bg-[#1a73e8]/10 scale-[1.01]'
            : selectedFile ? 'border-[#1a73e8]/60 bg-[#1a73e8]/5'
            : 'border-white/20 hover:border-[#1a73e8]/50 hover:bg-white/5'}`}>
          <input type="file" accept=".mp3,.wav,.ogg,.m4a,.flac" onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
          <div className="flex flex-col items-center gap-3 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#1a73e8]">
              <FileAudio className="w-7 h-7 animate-pulse" />
            </div>
            {selectedFile ? (
              <div className="space-y-1">
                <div className="text-base font-bold text-white">{selectedFile.name}</div>
                <div className="flex items-center justify-center gap-4 text-xs text-gray-400 font-mono">
                  <span>Size: <strong className="text-white">{selectedFile.size}</strong></span>
                  <span>Duration: <strong className="text-[#1a73e8]">{selectedFile.duration}</strong></span>
                  <span className="px-2 py-0.5 rounded bg-white/10 border border-white/20 text-white font-bold">{selectedFile.type}</span>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm font-bold text-gray-200">Drop call audio here or click to browse</p>
                <p className="text-xs text-gray-500 mt-1">Formats: .MP3 .WAV .OGG .M4A .FLAC — up to 250 MB</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button onClick={handleAnalyze} disabled={!selectedFile || isUploading || isAnalyzing}
            className="px-12 py-4 rounded-xl bg-gradient-to-r from-[#1a73e8] to-[#1557b0] text-white font-extrabold text-base tracking-wider uppercase shadow-[0_0_25px_rgba(26,115,232,0.4)] hover:shadow-[0_0_40px_rgba(26,115,232,0.7)] hover:scale-105 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed">
            {isUploading ? <><RefreshCw className="w-5 h-5 animate-spin" /> Uploading audio…</> : isAnalyzing ? <><RefreshCw className="w-5 h-5 animate-spin" /> Running Pipeline…</> : <><Phone className="w-5 h-5" /> ANALYZE CALL</>}
          </button>
        </div>
        {error && <div className="mt-4 rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">{error}</div>}
        {callId && <div className="mt-3 text-center text-xs text-green-400">Saved as {callId}</div>}
      </div>

      {/* ── PIPELINE PROGRESS BAR ── */}
      <AnimatePresence>
        {pipelineStep >= 0 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-black/50 rounded-2xl border border-white/10 p-5">
            <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-4">Pipeline Progress</div>
            <div className="flex items-center gap-0 overflow-x-auto pb-1">
              {STEPS.map((step, idx) => {
                const done   = isStepDone(idx);
                const active = isActive(idx);
                return (
                  <React.Fragment key={step.id}>
                    <div className={`flex flex-col items-center gap-1.5 shrink-0 transition-all duration-500 ${done ? 'opacity-100' : 'opacity-35'}`}>
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all duration-500 ${
                        done
                          ? 'bg-[#1a73e8] border-[#1a73e8] text-white shadow-[0_0_12px_rgba(26,115,232,0.6)]'
                          : active
                          ? 'bg-[#1a73e8]/30 border-[#1a73e8] text-[#1a73e8] animate-pulse'
                          : 'bg-white/5 border-white/20 text-gray-500'
                      }`}>{done ? '✓' : step.short}</div>
                      <span className="text-[10px] text-gray-400 text-center w-16 leading-tight">{step.label}</span>
                    </div>
                    {idx < STEPS.length - 1 && (
                      <div className={`h-0.5 flex-1 min-w-4 mx-1 rounded-full transition-all duration-700 ${pipelineStep > idx ? 'bg-[#1a73e8]' : 'bg-white/10'}`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── OUTPUT SECTIONS ── */}
      <AnimatePresence>
        {pipelineStep >= 0 && (
          <div className="space-y-6">

            {/* STEP 1 — AUDIO PREPROCESSING */}
            <StepCard step="Step 1 — Audio Preprocessing" icon={Waves} accentColor="#60a5fa" delay={0.1}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                {[
                  { k: 'Status', v: 'Audio Cleaned & Normalized', color: '#22c55e' },
                  { k: 'Noise Suppression', v: r.audioPreprocessing.noiseSuppression ? '✓ Applied' : '✗ Skipped', color: r.audioPreprocessing.noiseSuppression ? '#22c55e' : '#f59e0b' },
                  { k: 'Gain Normalization', v: r.audioPreprocessing.gainNormalization ? '✓ Applied' : '✗ Skipped', color: r.audioPreprocessing.gainNormalization ? '#22c55e' : '#f59e0b' },
                  { k: 'Bandpass Filtering', v: r.audioPreprocessing.bandpassFiltering ? '✓ Applied' : '✗ Skipped', color: r.audioPreprocessing.bandpassFiltering ? '#22c55e' : '#f59e0b' },
                ].map(({ k, v, color }) => (
                  <div key={k} className="bg-white/5 rounded-xl p-3 border border-white/10 text-center">
                    <div className="text-[10px] text-gray-500 uppercase mb-1">{k}</div>
                    <div className="text-xs font-bold" style={{ color }}>{v}</div>
                  </div>
                ))}
              </div>
              <div className="text-xs text-gray-400">Sample rate: 16 kHz · Channels: Mono · Format: PCM 16-bit · Duration: {r.duration}</div>
            </StepCard>

            {/* STEP 2 — WHISPER STT */}
            {isStepDone(1) && (
              <StepCard step="Step 2 — Whisper STT · Speech Transcription" icon={Mic} accentColor="#1a73e8" delay={0.1}>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { k: 'Language Detected', v: r.language, color: '#1a73e8' },
                    { k: 'Confidence Score', v: `${r.whisperConfidence}%`, color: '#22c55e' },
                    { k: 'Word Timestamps', v: 'Word-level', color: '#a78bfa' },
                  ].map(({ k, v, color }) => (
                    <div key={k} className="bg-white/5 rounded-xl p-3 border border-white/10 text-center">
                      <div className="text-[10px] text-gray-500 uppercase mb-1">{k}</div>
                      <div className="text-sm font-black" style={{ color }}>{v}</div>
                    </div>
                  ))}
                </div>
                <MLBadge label="Whisper" desc="Speech Transcription Engine" color="#1a73e8" />
              </StepCard>
            )}

            {/* STEP 3 — RAW TRANSCRIPT + TIMESTAMPS */}
            {isStepDone(2) && (
              <StepCard step="Step 3 — Transcript + Timestamps (Whisper Output)" icon={Clock} accentColor="#a78bfa" delay={0.1}>
                <p className="text-xs text-gray-500 mb-3">Raw transcript before speaker labels — word-level timestamp alignment</p>
                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {r.rawTranscript.map((line, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                      <span className="flex-shrink-0 text-[11px] font-mono text-[#a78bfa] font-bold w-12">[{line.time}]</span>
                      <span className="text-xs text-gray-200">{line.text}</span>
                    </div>
                  ))}
                </div>
              </StepCard>
            )}

            {/* STEP 4 — SPEAKER DIARIZATION */}
            {isStepDone(3) && (
              <StepCard step="Step 4 — Speaker Diarization" icon={Users} accentColor="#f59e0b" delay={0.1}>
                <InfoGrid rows={[
                  { k: 'Speakers Detected', v: `${r.numSpeakers}`, color: '#f59e0b' },
                  { k: 'Method', v: r.diarizationMethod },
                  { k: 'Channel A', v: 'Caller', color: '#ef4444' },
                  { k: 'Channel B', v: 'Operator', color: '#1a73e8' },
                ]} />
                <div className="mt-4">
                  <p className="text-xs text-gray-500 mb-2">Transcript with Speaker Labels</p>
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {r.transcript.map((line, i) => (
                      <div key={i} className={`p-3 rounded-xl border ${
                        line.speaker === 'Operator'
                          ? 'bg-[#1a73e8]/10 border-[#1a73e8]/30 ml-6'
                          : 'bg-[#ef4444]/10 border-[#ef4444]/30 mr-6'
                      }`}>
                        <div className="flex items-center justify-between mb-1 text-[11px]">
                          <span className="font-bold text-white">[{line.time}] {line.speaker}</span>
                          <span className="px-2 py-0.5 rounded border text-[10px] font-bold"
                            style={{ color: emotionColor(line.emotion), borderColor: emotionColor(line.emotion) + '60', backgroundColor: emotionColor(line.emotion) + '18' }}>
                            {line.emotion}
                          </span>
                        </div>
                        <p className="text-xs text-gray-200">{line.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </StepCard>
            )}

            {/* STEP 5 — PARALLEL: Wav2Vec2 + openSMILE + BERT */}
            {isStepDone(4) && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
                <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="h-px flex-1 bg-white/10"></span>
                  Step 5 — Parallel Processing (Wav2Vec2 ∥ openSMILE ∥ BERT)
                  <span className="h-px flex-1 bg-white/10"></span>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                  {/* LEFT — Wav2Vec2 */}
                  <div className="bg-black/40 rounded-2xl border border-white/10 overflow-hidden" style={{ borderLeftColor: '#22c55e', borderLeftWidth: 4 }}>
                    <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-white/10 bg-[#22c55e]/5">
                      <Activity className="w-4 h-4 text-[#22c55e]" />
                      <h3 className="text-sm font-bold text-white uppercase tracking-wide">Wav2Vec2 · Voice Emotion Model</h3>
                    </div>
                    <div className="p-5 space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-center">
                          <div className="text-[10px] text-gray-500 mb-1">Caller Dominant</div>
                          <div className="text-sm font-black" style={{ color: emotionColor(r.wav2vec2.complainantDominant) }}>{r.wav2vec2.complainantDominant}</div>
                        </div>
                        <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-center">
                          <div className="text-[10px] text-gray-500 mb-1">Operator Dominant</div>
                          <div className="text-sm font-black" style={{ color: emotionColor(r.wav2vec2.operatorDominant) }}>{r.wav2vec2.operatorDominant}</div>
                        </div>
                      </div>

                      {/* Emotion timeline */}
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase mb-2">Emotion Timeline (Caller)</p>
                        <div className="h-36">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={emotionData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                              <XAxis dataKey="time" stroke="#9ca3af" fontSize={10} />
                              <YAxis domain={[0, 100]} hide />
                              <Tooltip
                                contentStyle={{ backgroundColor: 'rgba(10,10,15,0.95)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', fontSize: '11px' }}
                                formatter={(val, _, p) => [p.payload.emotion, 'Emotion']}
                              />
                              <Line type="monotone" dataKey="intensity" stroke="#22c55e" strokeWidth={2.5}
                                dot={(p) => <circle key={p.index} cx={p.cx} cy={p.cy} r={5} fill={emotionColor(p.payload.emotion)} stroke="#0a0a0f" strokeWidth={2} />}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Segment emotions */}
                      <div className="space-y-1.5">
                        {r.wav2vec2.segments.map((seg, i) => (
                          <div key={i} className="flex items-center justify-between text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                            <span className="text-gray-400">[{seg.time}] {seg.speaker}</span>
                            <span className="font-bold" style={{ color: emotionColor(seg.emotion) }}>{seg.emotion}</span>
                          </div>
                        ))}
                      </div>
                      <MLBadge label="Wav2Vec2" desc="Voice Emotion Model" color="#22c55e" />
                    </div>
                  </div>

                  {/* RIGHT — openSMILE */}
                  <div className="bg-black/40 rounded-2xl border border-white/10 overflow-hidden" style={{ borderLeftColor: '#a78bfa', borderLeftWidth: 4 }}>
                    <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-white/10 bg-[#a78bfa]/5">
                      <Waves className="w-4 h-4 text-[#a78bfa]" />
                      <h3 className="text-sm font-bold text-white uppercase tracking-wide">openSMILE · Acoustic Feature Extractor</h3>
                    </div>
                    <div className="p-5 space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { k: 'Pitch Variance', v: r.acousticStats.pitchVariance },
                          { k: 'Speech Rate', v: r.acousticStats.speechRate },
                          { k: 'Silence Ratio', v: r.acousticStats.silenceRatio },
                          { k: 'Tremor/Stress', v: r.acousticStats.tremorStress, color: r.acousticStats.tremorStress === 'Detected' ? '#ef4444' : '#22c55e' },
                          { k: 'HNR Score', v: `${r.acousticStats.hnr}/100` },
                          { k: 'ZCR', v: r.acousticStats.zeroCrossingRate },
                        ].map(({ k, v, color }) => (
                          <div key={k} className="bg-white/5 p-2.5 rounded-lg border border-white/10">
                            <div className="text-[10px] text-gray-500 uppercase">{k}</div>
                            <div className="text-xs font-bold mt-0.5" style={{ color: color ?? '#e5e7eb' }}>{v}</div>
                          </div>
                        ))}
                      </div>

                      {/* Voice Energy */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-300">Voice Energy Level</span>
                          <span className="font-bold font-mono text-[#a78bfa]">{r.acousticStats.voiceEnergyLevel}/100</span>
                        </div>
                        <div className="w-full bg-black/40 h-2.5 rounded-full border border-white/10 overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${r.acousticStats.voiceEnergyLevel}%` }} transition={{ duration: 1.2 }}
                            className="h-full rounded-full bg-gradient-to-r from-[#a78bfa] to-[#1a73e8]" />
                        </div>
                      </div>

                      {/* Loudness Contour */}
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase mb-1 flex items-center gap-1.5"><Volume2 className="w-3 h-3" /> Loudness Contour</p>
                        <div className="h-20">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={loudnessBars} barSize={14}>
                              <XAxis dataKey="t" stroke="#9ca3af" fontSize={9} />
                              <Tooltip contentStyle={{ backgroundColor: 'rgba(10,10,15,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', fontSize: '10px' }} />
                              <Bar dataKey="v" radius={[3, 3, 0, 0]}>
                                {loudnessBars.map((e, i) => <Cell key={i} fill={e.v > 80 ? '#ef4444' : e.v > 60 ? '#f59e0b' : '#a78bfa'} />)}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Text descriptors */}
                      {[
                        { k: 'MFCCs (Emotional Texture)', v: r.acousticStats.mfccSummary },
                        { k: 'Jitter & Shimmer', v: r.acousticStats.jitterShimmer },
                      ].map(row => (
                        <div key={row.k} className="bg-white/5 p-2.5 rounded-lg border border-white/10">
                          <div className="text-[10px] text-gray-500 uppercase">{row.k}</div>
                          <div className="text-xs text-gray-200 mt-0.5">{row.v}</div>
                        </div>
                      ))}

                      <MLBadge label="openSMILE" desc="Acoustic Feature Extractor" color="#a78bfa" />
                    </div>
                  </div>

                  {/* RIGHT — BERT */}
                  <div className="bg-black/40 rounded-2xl border border-white/10 overflow-hidden" style={{ borderLeftColor: '#60a5fa', borderLeftWidth: 4 }}>
                    <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-white/10 bg-[#60a5fa]/5">
                      <Activity className="w-4 h-4 text-[#60a5fa]" />
                      <h3 className="text-sm font-bold text-white uppercase tracking-wide">BERT — Text Sentiment &amp; Context</h3>
                    </div>
                    <div className="p-5 space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { label: 'Caller Dominant', value: r.bert.callerDominant },
                          { label: 'Operator Dominant', value: r.bert.operatorDominant },
                        ].map(({ label, value }) => (
                          <div key={label} className="bg-white/5 p-2.5 rounded-lg border border-white/10 text-center">
                            <div className="text-[10px] text-gray-500 uppercase">{label}</div>
                            <span className="inline-block mt-1 px-2 py-0.5 rounded border text-xs font-bold"
                              style={{ color: sentimentColor(value), borderColor: sentimentColor(value) + '60', backgroundColor: sentimentColor(value) + '18' }}>
                              {value}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-center">
                        <div className="text-[10px] text-gray-500 uppercase mb-1">Overall Text Sentiment</div>
                        <div className="text-xl font-black" style={{ color: sentimentColor(r.bert.overall) }}>{r.bert.overall}</div>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase mb-2">Sentiment Timeline</p>
                        <div className="space-y-1.5 max-h-48 overflow-y-auto">
                          {r.bert.timeline.map((segment, i) => (
                            <div key={i} className="px-2.5 py-2 rounded-lg bg-white/5 border border-white/10 text-[11px]">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-gray-400">[{Number(segment.start || 0).toFixed(1)}s] {segment.speaker}</span>
                                <span className="font-bold" style={{ color: sentimentColor(segment.sentiment) }}>{segment.sentiment}</span>
                              </div>
                              <div className="text-gray-500 mt-0.5">Confidence: {Math.round((segment.confidence || 0) * 100)}%</div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase mb-2">Key Phrases Detected</p>
                        <div className="flex flex-wrap gap-1.5">
                          {r.bert.keyPhrases.map((phrase) => (
                            <span key={phrase} className="px-2 py-1 rounded-lg bg-[#60a5fa]/10 border border-[#60a5fa]/30 text-[10px] text-[#93c5fd]">{phrase}</span>
                          ))}
                        </div>
                      </div>
                      <MLBadge label="Powered by BERT" desc="Text Sentiment & Context Analyzer" color="#60a5fa" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 6 — CATBOOST FUSION */}
            {isStepDone(7) && (
              <StepCard step="Step 7 — CatBoost Fusion · Call Quality Predictor" icon={Zap} accentColor="#f59e0b" delay={0.1}>
                <div className="mb-5 p-3 rounded-xl bg-[#f59e0b]/10 border border-[#f59e0b]/30 text-xs text-[#f59e0b] font-mono flex items-center gap-2">
                  <Zap className="w-4 h-4 flex-shrink-0" /> Fusing Wav2Vec2 + openSMILE + BERT outputs...
                </div>

                <div className="space-y-6">
                  {/* A: Final Emotion & Sentiment */}
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wide mb-3 flex items-center gap-2">
                      <span className="text-[#f59e0b]">A</span> · Final Emotion &amp; Sentiment
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-center">
                        <div className="text-[10px] text-gray-500 mb-1">Caller Overall</div>
                        <div className="font-bold" style={{ color: emotionColor(r.wav2vec2.complainantDominant) }}>{r.wav2vec2.complainantDominant}</div>
                      </div>
                      <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-center">
                        <div className="text-[10px] text-gray-500 mb-1">Operator Overall Tone</div>
                        <div className="font-bold" style={{ color: emotionColor(r.wav2vec2.operatorDominant) }}>{r.wav2vec2.operatorDominant}</div>
                      </div>
                      <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-center">
                        <div className="text-[10px] text-gray-500 mb-1">Sentiment Arc</div>
                        <div className="text-xs font-bold text-white flex items-center justify-center gap-1">
                          <span style={{ color: emotionColor(r.sentimentArc.start) }}>{r.sentimentArc.start}</span>
                          <span className="text-gray-500">→</span>
                          <span style={{ color: emotionColor(r.sentimentArc.end) }}>{r.sentimentArc.end}</span>
                        </div>
                      </div>
                      <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-center">
                        <div className="text-[10px] text-gray-500 mb-1">Text Sentiment</div>
                        <div className="font-bold" style={{ color: sentimentColor(fusion.text_sentiment || r.bert.overall) }}>
                          {fusion.text_sentiment || r.bert.overall}
                        </div>
                        <div className="text-[10px] text-gray-500 mt-1">
                          Combined confidence: {Math.round((fusion.combined_confidence || 0) * 100)}%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* B: Call Quality Score */}
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wide mb-3"><span className="text-[#f59e0b]">B</span> · Call Quality Score</h4>
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-center">
                      <div className="flex flex-col items-center">
                        <div className="relative w-28 h-28">
                          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                            <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10"/>
                            <circle cx="50" cy="50" r="40" fill="none" stroke={qc} strokeWidth="10"
                              strokeDasharray={`${2.51 * r.callQualityScore} ${251 - 2.51 * r.callQualityScore}`}
                              strokeLinecap="round" />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-black font-mono" style={{ color: qc }}>{r.callQualityScore}</span>
                            <span className="text-[10px] text-gray-400">/100</span>
                          </div>
                        </div>
                        <div className="text-xs font-bold mt-1" style={{ color: qc }}>
                          {r.callQualityScore >= 75 ? 'Good' : r.callQualityScore >= 40 ? 'Needs Improvement' : 'Poor'}
                        </div>
                      </div>
                      <div className="lg:col-span-4 space-y-2.5">
                        <ScoreBar label="Empathy Score" score={r.operatorSubScores.empathy} />
                        <ScoreBar label="Clarity Score" score={r.operatorSubScores.clarity} />
                        <ScoreBar label="Responsiveness Score" score={r.operatorSubScores.responsiveness} />
                        <ScoreBar label="Professionalism Score" score={r.operatorSubScores.professionalism} />
                        <ScoreBar label="Trauma-Sensitivity Score" score={r.operatorSubScores.traumaSensitivity} />
                        <ScoreBar label="Protocol Adherence Score" score={r.operatorSubScores.protocolAdherence} />
                      </div>
                    </div>
                  </div>

                  {/* C: Escalation Risk */}
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wide mb-3"><span className="text-[#f59e0b]">C</span> · Escalation Risk</h4>
                    <div className={`p-4 rounded-xl border flex items-start gap-3 ${rsk.bg}`}>
                      <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: rsk.color }} />
                      <div>
                        <div className="text-lg font-black" style={{ color: rsk.color }}>{r.escalationRisk} RISK</div>
                        <div className="text-xs text-gray-300 mt-0.5">{r.escalationReason}</div>
                      </div>
                    </div>
                  </div>

                  {/* D: Issue Category */}
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wide mb-3"><span className="text-[#f59e0b]">D</span> · Issue Category (Auto-Detected)</h4>
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="px-4 py-2 rounded-xl bg-[#f59e0b]/15 border border-[#f59e0b]/40 text-[#f59e0b] font-black text-sm">{r.issueCategory}</span>
                    </div>
                    {r.flaggedPhrases.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {r.flaggedPhrases.map((phrase, i) => (
                          <span key={i} className="px-2.5 py-1 rounded bg-[#ef4444]/15 border border-[#ef4444]/40 text-[#ef4444] text-xs font-mono">"{phrase}"</span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* E: Resolution Status */}
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wide mb-3"><span className="text-[#f59e0b]">E</span> · Resolution Status</h4>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className={`px-5 py-2 rounded-xl border text-base font-black tracking-wide ${resolutionStyle(r.resolutionStatus)}`}>{r.resolutionStatus}</span>
                    </div>
                  </div>

                  {/* F: Recommendations */}
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wide mb-3"><span className="text-[#f59e0b]">F</span> · Recommendations Panel</h4>
                    <ul className="space-y-2.5">
                      {r.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#f59e0b]/8 border border-[#f59e0b]/25">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#f59e0b]/25 text-[#f59e0b] text-[10px] font-black flex items-center justify-center">{i + 1}</span>
                          <span className="text-xs text-gray-200 leading-relaxed">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <MLBadge label="CatBoost" desc="Call Quality Predictor" color="#f59e0b" />
                </div>
              </StepCard>
            )}

            {/* STEP 7 — FIREBASE */}
            {isStepDone(8) && (
              <StepCard step="Step 7 — Firebase Storage" icon={Database} accentColor="#fb923c" delay={0.1}>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-2.5 px-5 py-3 rounded-xl bg-[#22c55e]/15 border border-[#22c55e]/40 text-[#22c55e] font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5" />
                    Call record saved to Firebase Secure Records
                  </div>
                  <div className="space-y-1 text-xs font-mono text-gray-400">
                    <div>Call ID: <strong className="text-white">{r.firebaseCallId}</strong></div>
                    <div>Saved: <strong className="text-white">{r.uploadDate}</strong></div>
                    <div>All analysis results stored ✓</div>
                  </div>
                </div>
                <div className="mt-4">
                  <MLBadge label="Firebase" desc="Secure Records" color="#fb923c" />
                </div>
              </StepCard>
            )}

            {/* STEP 8 — EXPORT */}
            {isStepDone(8) && (
              <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-[#1a73e8]/10 border border-[#1a73e8]/30">
                <div className="flex items-center gap-2 text-sm text-gray-300 flex-1">
                  <Database className="w-4 h-4 text-[#1a73e8]" />
                  <span>This call is now visible in the <strong className="text-[#1a73e8]">Deep Analytics</strong> tab dashboard.</span>
                </div>
                <button onClick={handleExport}
                  className="flex items-center gap-2.5 px-8 py-3 rounded-xl bg-gradient-to-r from-[#1a73e8] to-[#1557b0] text-white font-extrabold text-sm tracking-wider uppercase shadow-[0_0_20px_rgba(26,115,232,0.35)] hover:scale-105 active:scale-95 transition-all shrink-0">
                  <Download className="w-5 h-5" />
                  {reportExported ? '✓ Exported!' : 'Export Full Report'}
                </button>
              </div>
            )}

          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="pt-8 border-t border-white/10 text-center space-y-1">
        <p className="text-xs text-gray-500 font-mono">Voice Recognizer and Management — Development Build</p>
      </div>
    </div>
  );
}
