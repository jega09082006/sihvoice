import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { getCallById, getDashboardRecords, getDashboardSummary } from '../services/api';
import {
  Search,
  ChevronDown,
  ChevronUp,
  Eye,
  X,
  Mic,
  FileSpreadsheet,
  Phone,
  BarChart2,
  AlertOctagon,
  Tag,
  Waves,
} from 'lucide-react';
import { motion } from 'framer-motion';

/* ─── Helpers ──────────────────────────────────────────── */
const CATEGORIES = ['All', 'Complaint', 'Support Request', 'Emergency Report', 'Feedback', 'Follow-up', 'General Inquiry', 'Escalation', 'Other'];
const RESOLUTION_OPTIONS = ['All', 'Case Registered', 'Referred to Supervisor', 'Legal Aid Suggested', 'Callback Scheduled', 'Support Arranged', 'Escalated', 'Resolved', 'Unresolved — Follow-up Required'];

const getQualityColor = (score) => {
  if (score >= 75) return '#22c55e';
  if (score >= 40) return '#f59e0b';
  return '#ef4444';
};

const getResolutionStyle = (status) => {
  switch (status) {
    case 'Case Registered':               return 'bg-[#22c55e]/20 text-[#22c55e] border-[#22c55e]/50';
    case 'Referred to Supervisor':        return 'bg-[#1a73e8]/20 text-[#1a73e8] border-[#1a73e8]/50';
    case 'Legal Aid Suggested':           return 'bg-[#a78bfa]/20 text-[#a78bfa] border-[#a78bfa]/50';
    case 'Callback Scheduled':            return 'bg-[#60a5fa]/20 text-[#60a5fa] border-[#60a5fa]/50';
    case 'Support Arranged':              return 'bg-[#34d399]/20 text-[#34d399] border-[#34d399]/50';
    case 'Escalated':                     return 'bg-[#ef4444]/20 text-[#ef4444] border-[#ef4444]/50';
    case 'Resolved':                      return 'bg-[#22c55e]/20 text-[#22c55e] border-[#22c55e]/50';
    default:                              return 'bg-[#f59e0b]/20 text-[#f59e0b] border-[#f59e0b]/50';
  }
};

const getEmotionColor = (emotion) => {
  const m = { Calm: '#22c55e', Satisfied: '#4ade80', Distressed: '#ef4444', Frustrated: '#f59e0b', Confused: '#a78bfa', Urgent: '#fb923c', Fearful: '#f87171', Traumatized: '#dc2626', Hesitant: '#a78bfa', Angry: '#f97316', Hopeful: '#4ade80' };
  return m[emotion] ?? '#9ca3af';
};

const getRowAccent = (call) => {
  if (call.escalationRisk === 'Critical' || call.escalationRisk === 'High') return 'bg-[#ef4444]/8 border-l-4 border-l-[#ef4444]';
  if (call.resolutionStatus?.includes('Unresolved')) return 'bg-[#f59e0b]/8 border-l-4 border-l-[#f59e0b]';
  return '';
};

/* ─── Summary Card ────────────────────────────────────── */
function SummaryCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="bg-black/40 rounded-2xl border border-white/10 p-5 flex flex-col justify-between gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">{label}</span>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: color + '20', border: `1px solid ${color}40` }}>
          <Icon className="w-4.5 h-4.5" style={{ color }} />
        </div>
      </div>
      <div>
        <div className="text-3xl font-black font-mono" style={{ color }}>{value}</div>
        {sub && <div className="text-xs text-gray-500 mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────── */
export default function Analytics() {
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [searchQuery, setSearchQuery]           = useState('');
  const [categoryFilter, setCategoryFilter]     = useState('All');
  const [resolutionFilter, setResolutionFilter] = useState('All');
  const [scoreMin, setScoreMin]                 = useState(0);
  const [sortField, setSortField]               = useState('uploadDate');
  const [sortOrder, setSortOrder]               = useState('desc');
  const [expandedRowId, setExpandedRowId]       = useState(null);
  const [selectedReport, setSelectedReport]     = useState(null);
  const [csvExported, setCsvExported]           = useState(false);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const [apiRecords, apiSummary] = await Promise.all([getDashboardRecords(), getDashboardSummary()]);
      setRecords(apiRecords.map((record) => {
        const result = record.result || record;
        const fusion = result.fusion || {};
        const emotion = result.emotion || {};
        const acoustics = result.acoustics || {};
        const diarization = result.diarization || {};
        return {
          ...result,
          id: record.call_id || result.call_id,
          category: fusion.issue_category || 'General Inquiry',
          issueCategory: fusion.issue_category || 'General Inquiry',
          duration: `${result.preprocessing?.duration_seconds || 0}s`,
          uploadDate: record.saved_at || result.created_at || '—',
          dominantCitizenEmotion: emotion.caller_dominant_emotion || '—',
          operatorScore: fusion.quality_subscores?.Professionalism || 0,
          callQualityScore: fusion.call_quality_score || 0,
          resolutionStatus: fusion.resolution_status || '—',
          escalationRisk: fusion.escalation_risk || 'Low',
          issuesCount: 0,
          transcript: (diarization.labeled_transcript || []).map((line) => ({ ...line, time: `${line.start}s` })),
          acousticStats: {
            pitchVariance: acoustics.pitch_variance || 0,
            speechRate: acoustics.speech_rate || 0,
            voiceEnergyLevel: Math.round((acoustics.voice_energy_level || 0) * 100),
            silenceRatio: acoustics.silence_ratio || 0,
            tremorStress: acoustics.tremor_stress_detected ? 'Detected' : 'Not Detected',
            hnr: acoustics.hnr_score || 0,
            jitterShimmer: `${acoustics.jitter || 0} / ${acoustics.shimmer || 0}`,
            mfccSummary: JSON.stringify(acoustics.mfcc_summary || {}),
          },
          recommendations: fusion.recommendations || [],
        };
      }));
      setSummary(apiSummary);
    } catch {
      setLoadError('Backend offline — cannot load records');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  /* ── Computed values ── */
  const totalCalls        = summary.total_calls ?? records.length;
  const avgOperatorScore  = Math.round(summary.avg_quality_score ?? 0);
  const escalationRate    = Math.round((summary.escalation_rate ?? 0) * 100);
  const topIssue          = summary.most_common_issue ?? '—';

  /* ── Filtered & sorted calls ── */
  const filteredCalls = useMemo(() => {
    return records
      .filter((c) => {
        const q = searchQuery.toLowerCase();
        const matchesSearch = !q || c.id.toLowerCase().includes(q) || c.issueCategory.toLowerCase().includes(q) || c.category?.toLowerCase().includes(q);
        const matchesCat    = categoryFilter === 'All' || c.category === categoryFilter;
        const matchesRes    = resolutionFilter === 'All' || c.resolutionStatus === resolutionFilter;
        const matchesScore  = c.callQualityScore >= scoreMin;
        return matchesSearch && matchesCat && matchesRes && matchesScore;
      })
      .sort((a, b) => {
        let av = a[sortField], bv = b[sortField];
        if (['operatorScore', 'callQualityScore', 'issuesCount'].includes(sortField)) { av = Number(av); bv = Number(bv); }
        if (av < bv) return sortOrder === 'asc' ? -1 : 1;
        if (av > bv) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [records, searchQuery, categoryFilter, resolutionFilter, scoreMin, sortField, sortOrder]);

  const handleSort = (field) => {
    if (sortField === field) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortOrder('desc'); }
  };

  const SortTh = ({ field, children }) => (
    <th className="p-4 cursor-pointer hover:text-white whitespace-nowrap select-none" onClick={() => handleSort(field)}>
      {children} {sortField === field && (sortOrder === 'asc' ? '↑' : '↓')}
    </th>
  );

  const handleExportCSV = () => {
    const headers = ['Call ID', 'Date & Time', 'Call Category', 'Duration', 'Caller Emotion', 'Operator Score', 'Call Quality', 'Resolution', 'Issues'];
    const rows = filteredCalls.map((c) => [c.id, c.uploadDate, c.category, c.duration, c.dominantCitizenEmotion, c.operatorScore, c.callQualityScore, c.resolutionStatus, c.issuesCount]);
    const csv = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csv));
    link.setAttribute('download', `call_analytics_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setCsvExported(true);
    setTimeout(() => setCsvExported(false), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-[calc(100vh-84px)] bg-[#0a0a0f] text-gray-100 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 font-mono"
    >

      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-black/60 border border-white/10 shadow-2xl relative">
        <div className="absolute top-0 left-0 h-full w-1.5 bg-gradient-to-b from-[#1a73e8] to-[#f59e0b] rounded-l-2xl"></div>
        <div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#1a73e8]/20 border border-[#1a73e8]/50 text-[#1a73e8] tracking-widest uppercase">
            ANALYTICS DASHBOARD
          </span>
          <h1 className="text-2xl font-black tracking-tight text-white mt-1 uppercase font-sans">
            Deep Analytics — Call Records
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Firebase-synced audit database · Supervisor use only
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="px-5 py-2.5 rounded-xl bg-[#1a73e8]/20 hover:bg-[#1a73e8]/30 border border-[#1a73e8]/50 text-[#1a73e8] font-bold text-xs flex items-center gap-2 transition-all shrink-0"
        >
          <FileSpreadsheet className="w-4 h-4" />
          {csvExported ? '✓ Exported CSV!' : 'Export All as CSV'}
        </button>
        <button
          onClick={loadDashboard}
          disabled={loading}
          className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs transition-all shrink-0 disabled:opacity-50"
        >
          {loading ? 'Loading…' : 'Refresh'}
        </button>
      </div>

      {/* ── SUMMARY CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-sans">
        <SummaryCard icon={Phone}       label="Total Calls Analyzed"   value={totalCalls}          sub="This reporting period"          color="#1a73e8" />
        <SummaryCard icon={BarChart2}   label="Avg Operator Score"      value={`${avgOperatorScore}`} sub="Across all categories"          color="#22c55e" />
        <SummaryCard icon={AlertOctagon}label="Escalation Rate"         value={`${escalationRate}%`}  sub="Calls requiring escalation"     color="#f59e0b" />
        <SummaryCard icon={Tag}         label="Most Common Issue Category" value={topIssue}        sub="Most reported issue type"       color="#a78bfa" />
      </div>

      {/* ── FILTER BAR ── */}
      <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-wrap items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Call ID, category, or issue…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#1a73e8]"
          />
        </div>

        {/* Call Category */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs">
          <span className="text-gray-400 uppercase">Call Category:</span>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-transparent border-none text-white font-bold focus:outline-none cursor-pointer">
            {CATEGORIES.map((c) => <option key={c} value={c} className="bg-[#0a0a0f]">{c}</option>)}
          </select>
        </div>

        {/* Resolution */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs">
          <span className="text-gray-400 uppercase">Resolution:</span>
          <select value={resolutionFilter} onChange={(e) => setResolutionFilter(e.target.value)}
            className="bg-transparent border-none text-white font-bold focus:outline-none cursor-pointer">
            {RESOLUTION_OPTIONS.map((r) => <option key={r} value={r} className="bg-[#0a0a0f]">{r}</option>)}
          </select>
        </div>

        {/* Min Score */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs">
          <span className="text-gray-400 uppercase">Min Quality Score:</span>
          <input
            type="number"
            min={0} max={100}
            value={scoreMin}
            onChange={(e) => setScoreMin(Number(e.target.value))}
            className="w-14 bg-transparent border-none text-white font-bold focus:outline-none text-center"
          />
        </div>

        <span className="text-xs text-gray-500 ml-auto">{filteredCalls.length} records</span>
      </div>

      {/* ── TABLE ── */}
      <div className="bg-black/40 rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
        {loadError && <div className="p-6 text-center text-red-300">{loadError}</div>}
        {loading && <div className="p-6 text-center text-gray-400">Loading records…</div>}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-gray-400 uppercase text-[11px]">
                <SortTh field="id">Call ID</SortTh>
                <SortTh field="uploadDate">Date &amp; Time</SortTh>
                <th className="p-4">Call Category</th>
                <th className="p-4">Duration</th>
                <th className="p-4">Caller Emotion</th>
                <SortTh field="operatorScore">Operator Score</SortTh>
                <SortTh field="callQualityScore">Quality Score</SortTh>
                <th className="p-4">Resolution</th>
                <SortTh field="issuesCount">Issues</SortTh>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredCalls.length > 0 ? filteredCalls.map((call) => {
                const isExpanded = expandedRowId === call.id;
                const qColor = getQualityColor(call.callQualityScore);
                const opColor = getQualityColor(call.operatorScore);
                return (
                  <React.Fragment key={call.id}>
                    <tr className={`transition-colors hover:bg-white/10 ${getRowAccent(call)}`}>
                      <td className="p-4 font-bold text-white">
                        <div className="flex items-center gap-2">
                          <button onClick={() => setExpandedRowId(isExpanded ? null : call.id)}
                            className="p-1 rounded hover:bg-white/10 text-gray-400">
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                          {call.id}
                        </div>
                      </td>
                      <td className="p-4 text-gray-300">{call.uploadDate}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded bg-[#1a73e8]/15 border border-[#1a73e8]/30 text-[#1a73e8] font-semibold">{call.category}</span>
                      </td>
                      <td className="p-4 text-gray-300">{call.duration}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded border font-semibold"
                          style={{ color: getEmotionColor(call.dominantCitizenEmotion), borderColor: getEmotionColor(call.dominantCitizenEmotion) + '60', backgroundColor: getEmotionColor(call.dominantCitizenEmotion) + '18' }}>
                          {call.dominantCitizenEmotion}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="font-black" style={{ color: opColor }}>{call.operatorScore}</span>
                        <span className="text-gray-500">/100</span>
                      </td>
                      <td className="p-4">
                        <span className="font-black" style={{ color: qColor }}>{call.callQualityScore}</span>
                        <span className="text-gray-500">/100</span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded text-[10px] uppercase font-bold border ${getResolutionStyle(call.resolutionStatus)}`}>
                          {call.resolutionStatus}
                        </span>
                      </td>
                      <td className="p-4">
                        {call.issuesCount > 0
                          ? <span className="px-2 py-0.5 rounded bg-[#f59e0b]/20 border border-[#f59e0b]/40 text-[#f59e0b] font-bold">{call.issuesCount} Detected</span>
                          : <span className="text-gray-500">0</span>}
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={async () => setSelectedReport(await getCallById(call.id).then((record) => ({ ...call, ...(record.result || record) })))}
                          className="px-3 py-1.5 rounded-lg bg-[#1a73e8]/20 hover:bg-[#1a73e8]/30 border border-[#1a73e8]/50 text-[#1a73e8] font-bold text-xs transition-all flex items-center gap-1.5 ml-auto">
                          <Eye className="w-3.5 h-3.5" /> View Report
                        </button>
                      </td>
                    </tr>

                    {/* ── Expanded Row ── */}
                    {isExpanded && (
                      <tr className="bg-black/70 border-b border-white/10">
                        <td colSpan={10} className="p-4">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* Mini transcript */}
                            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                              <div className="text-[11px] font-bold text-[#1a73e8] uppercase mb-2 flex items-center gap-1.5">
                                <Mic className="w-3.5 h-3.5" /> Transcript Preview
                              </div>
                              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                                {call.transcript.map((u, i) => (
                                  <div key={i} className="text-xs text-gray-300">
                                    <span className="font-bold text-white">[{u.time}] {u.speaker}: </span>{u.text}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* openSMILE Acoustic Snapshot */}
                            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                              <div className="text-[11px] font-bold text-[#a78bfa] uppercase mb-2 flex items-center gap-1.5">
                                <Waves className="w-3.5 h-3.5" /> openSMILE Acoustic Snapshot
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                {[
                                  { k: 'Pitch', v: call.acousticStats.pitchVariance },
                                  { k: 'Energy', v: `${call.acousticStats.voiceEnergyLevel}/100` },
                                  { k: 'Speech Rate', v: call.acousticStats.speechRate },
                                  { k: 'Stress', v: call.acousticStats.tremorStress },
                                ].map((row) => (
                                  <div key={row.k} className="bg-black/40 p-2 rounded-lg">
                                    <div className="text-[10px] text-gray-500 uppercase">{row.k}</div>
                                    <div className="text-gray-200 font-bold">{row.v}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              }) : (
                <tr>
                  <td colSpan={10} className="p-10 text-center text-gray-500">
                    No call records match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── FULL REPORT MODAL ── */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-end animate-fadeIn" onClick={(e) => e.target === e.currentTarget && setSelectedReport(null)}>
          <div className="w-full max-w-2xl bg-[#0d0d18] border-l border-white/10 h-full p-6 overflow-y-auto flex flex-col gap-6">

            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-white/10">
              <div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getResolutionStyle(selectedReport.resolutionStatus)}`}>
                  {selectedReport.resolutionStatus}
                </span>
                <h3 className="text-xl font-bold text-white mt-1">{selectedReport.id}</h3>
                <p className="text-xs text-gray-400">{selectedReport.category} · {selectedReport.uploadDate} · {selectedReport.duration}</p>
              </div>
              <button onClick={() => setSelectedReport(null)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Score Grid */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Operator Score', value: `${selectedReport.operatorScore}`, color: getQualityColor(selectedReport.operatorScore) },
                { label: 'Quality Score',  value: `${selectedReport.callQualityScore}`, color: getQualityColor(selectedReport.callQualityScore) },
                { label: 'Issues Found',   value: `${selectedReport.issuesCount}`,   color: '#f59e0b' },
              ].map((s) => (
                <div key={s.label} className="bg-white/5 p-3 rounded-xl border border-white/10 text-center">
                  <div className="text-[10px] text-gray-400">{s.label}</div>
                  <div className="text-2xl font-black mt-1" style={{ color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Caller Emotion + Issue Category */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <div className="text-[10px] text-gray-400 mb-1">Dominant Caller Emotion</div>
                <div className="font-bold" style={{ color: getEmotionColor(selectedReport.dominantCitizenEmotion) }}>{selectedReport.dominantCitizenEmotion}</div>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <div className="text-[10px] text-gray-400 mb-1">Issue Category</div>
                <div className="font-bold text-[#f59e0b]">{selectedReport.issueCategory}</div>
              </div>
            </div>

            {/* Transcript */}
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-3">
                <Mic className="w-4 h-4 text-[#1a73e8]" /> Call Transcript
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {selectedReport.transcript.map((u, i) => (
                  <div key={i} className={`p-3 rounded-xl border ${u.speaker === 'Operator' ? 'bg-[#1a73e8]/10 border-[#1a73e8]/30' : 'bg-[#f59e0b]/10 border-[#f59e0b]/30'}`}>
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="font-bold text-white">[{u.time}] {u.speaker}</span>
                      <span style={{ color: getEmotionColor(u.emotion) }}>{u.emotion}</span>
                    </div>
                    <p className="text-xs text-gray-200">{u.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Acoustic Snapshot */}
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-3">
                <Waves className="w-4 h-4 text-[#a78bfa]" /> openSMILE Acoustic Features
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { k: 'Pitch Variance', v: selectedReport.acousticStats.pitchVariance },
                  { k: 'Speech Rate',    v: selectedReport.acousticStats.speechRate },
                  { k: 'Voice Energy',   v: `${selectedReport.acousticStats.voiceEnergyLevel}/100` },
                  { k: 'Silence Ratio',  v: selectedReport.acousticStats.silenceRatio },
                  { k: 'Tremor/Stress',  v: selectedReport.acousticStats.tremorStress },
                  { k: 'HNR Score',      v: `${selectedReport.acousticStats.hnr}/100` },
                  { k: 'Jitter & Shimmer', v: selectedReport.acousticStats.jitterShimmer },
                  { k: 'MFCCs',          v: selectedReport.acousticStats.mfccSummary },
                ].map((row) => (
                  <div key={row.k} className="bg-white/5 p-2.5 rounded-lg border border-white/10">
                    <div className="text-[10px] text-gray-500 uppercase">{row.k}</div>
                    <div className="text-gray-200 font-medium mt-0.5">{row.v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-3">
                <span className="text-[#f59e0b]">💡</span> Supervisor Recommendations
              </div>
              <ul className="space-y-2">
                {selectedReport.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-200 p-3 bg-[#f59e0b]/8 border border-[#f59e0b]/25 rounded-xl">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#f59e0b]/20 text-[#f59e0b] text-[10px] font-black flex items-center justify-center">{i + 1}</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>

            <button onClick={() => setSelectedReport(null)}
              className="mt-2 w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all">
              Close Report
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="pt-6 border-t border-white/10 text-center">
        <p className="text-xs text-gray-500">Voice Recognizer and Management — Development Build</p>
      </div>
    </motion.div>
  );
}
