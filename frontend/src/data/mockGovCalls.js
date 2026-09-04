export const MOCK_GOV_CALLS = [
  {
    id: "CALL-2026-0094",
    title: "Intercept Alpha-9 (Eastern Sector)",
    uploadDate: "2026-09-03 11:42:10",
    timestamp: "18 mins ago",
    duration: "04:18",
    durationSec: 258,
    numSpeakers: 2,
    speakers: ["Subject Alpha", "Target B"],
    dominantEmotion: "Agitated",
    riskScore: 88,
    threatKeywordsCount: 5,
    flaggedPhrases: ["wire transfer", "unauthorized channel", "access code", "server bypass", "payload"],
    status: "Flagged",
    classification: "TOP SECRET // NOFORN",
    audioSize: "8.4 MB",
    fileName: "intercept_alpha9_raw.wav",
    format: "WAV",
    transcript: [
      { time: "00:04", speaker: "Subject Alpha", text: "Did you clear the wire transfer through the off-grid server?", emotion: "Deceptive-tone" },
      { time: "00:14", speaker: "Target B", text: "Yes, but the encrypted link dropped twice during transmission.", emotion: "Stressed" },
      { time: "00:28", speaker: "Subject Alpha", text: "Use the server bypass payload immediately. We cannot leave a digital footprint.", emotion: "Agitated" },
      { time: "01:05", speaker: "Target B", text: "Understood. Re-verifying the access code for stage two extraction.", emotion: "Agitated" },
      { time: "01:45", speaker: "Subject Alpha", text: "Confirm when the unauthorized channel is closed.", emotion: "Deceptive-tone" },
      { time: "03:10", speaker: "Target B", text: "Channel closed. Data package purged from buffer.", emotion: "Calm" }
    ],
    acousticStats: {
      avgPitch: "235 Hz",
      speechRate: "195 wpm",
      silenceRatio: "14%",
      vocalTremor: "High",
      stressLevel: "89%"
    }
  },
  {
    id: "CALL-2026-0093",
    title: "Comms Tap Bravo-4 (Sector 7)",
    uploadDate: "2026-09-03 10:15:44",
    timestamp: "1 hr ago",
    duration: "02:45",
    durationSec: 165,
    numSpeakers: 2,
    speakers: ["Operative 1", "Source X"],
    dominantEmotion: "Deceptive-tone",
    riskScore: 72,
    threatKeywordsCount: 3,
    flaggedPhrases: ["classified schematic", "off-shore node", "proxy route"],
    status: "Flagged",
    classification: "SECRET // EYES ONLY",
    audioSize: "5.1 MB",
    fileName: "bravo4_tap_record.mp3",
    format: "MP3",
    transcript: [
      { time: "00:03", speaker: "Source X", text: "The classified schematic has been fragmented across three nodes.", emotion: "Deceptive-tone" },
      { time: "00:18", speaker: "Operative 1", text: "Ensure the proxy route remains active until verification is complete.", emotion: "Stressed" },
      { time: "01:02", speaker: "Source X", text: "Off-shore node confirmed connection at 0900 hours.", emotion: "Deceptive-tone" }
    ],
    acousticStats: {
      avgPitch: "195 Hz",
      speechRate: "160 wpm",
      silenceRatio: "22%",
      vocalTremor: "Moderate",
      stressLevel: "68%"
    }
  },
  {
    id: "CALL-2026-0092",
    title: "Secure Terminal Sync #407",
    uploadDate: "2026-09-03 08:30:12",
    timestamp: "3 hrs ago",
    duration: "06:12",
    durationSec: 372,
    numSpeakers: 2,
    speakers: ["Commander Ray", "Analyst Vance"],
    dominantEmotion: "Calm",
    riskScore: 24,
    threatKeywordsCount: 0,
    flaggedPhrases: [],
    status: "Analyzed",
    classification: "CONFIDENTIAL",
    audioSize: "12.8 MB",
    fileName: "routine_terminal_sync.flac",
    format: "FLAC",
    transcript: [
      { time: "00:05", speaker: "Commander Ray", text: "Daily perimeter telemetry checks completed. All systems nominal.", emotion: "Calm" },
      { time: "00:30", speaker: "Analyst Vance", text: "Logs synchronized with central data hub. No anomalies detected.", emotion: "Calm" }
    ],
    acousticStats: {
      avgPitch: "145 Hz",
      speechRate: "135 wpm",
      silenceRatio: "30%",
      vocalTremor: "Low",
      stressLevel: "18%"
    }
  },
  {
    id: "CALL-2026-0091",
    title: "Intercept Charlie-2 (Logistics Dispatch)",
    uploadDate: "2026-09-02 22:14:00",
    timestamp: "14 hrs ago",
    duration: "03:50",
    durationSec: 230,
    numSpeakers: 2,
    speakers: ["Subject Gamma", "Courier 9"],
    dominantEmotion: "Stressed",
    riskScore: 61,
    threatKeywordsCount: 2,
    flaggedPhrases: ["rerouted cargo", "override key"],
    status: "Analyzed",
    classification: "SECRET",
    audioSize: "7.2 MB",
    fileName: "charlie2_logistics.wav",
    format: "WAV",
    transcript: [
      { time: "00:06", speaker: "Subject Gamma", text: "Shipment rerouted cargo must bypass central customs screening.", emotion: "Stressed" },
      { time: "00:45", speaker: "Courier 9", text: "Applying override key to clearance barrier now.", emotion: "Stressed" }
    ],
    acousticStats: {
      avgPitch: "210 Hz",
      speechRate: "175 wpm",
      silenceRatio: "18%",
      vocalTremor: "Moderate",
      stressLevel: "58%"
    }
  },
  {
    id: "CALL-2026-0090",
    title: "Intercept Delta-1 (Satellite Patch)",
    uploadDate: "2026-09-02 18:05:30",
    timestamp: "18 hrs ago",
    duration: "05:04",
    durationSec: 304,
    numSpeakers: 3,
    speakers: ["Speaker A", "Speaker B", "Unknown Relay"],
    dominantEmotion: "Agitated",
    riskScore: 94,
    threatKeywordsCount: 6,
    flaggedPhrases: ["hard drive wipe", "substation offline", "zero-day exploit", "encrypted link", "unauthorized access", "detonation"],
    status: "Flagged",
    classification: "TOP SECRET // RESTRICTED",
    audioSize: "10.1 MB",
    fileName: "delta1_sat_intercept.m4a",
    format: "M4A",
    transcript: [
      { time: "00:02", speaker: "Speaker A", text: "Initiate zero-day exploit against regional grid substation offline.", emotion: "Agitated" },
      { time: "00:20", speaker: "Speaker B", text: "Target substation offline confirmed. Executing hard drive wipe now.", emotion: "Agitated" },
      { time: "01:15", speaker: "Unknown Relay", text: "Detonation signal queued on encrypted link.", emotion: "Deceptive-tone" }
    ],
    acousticStats: {
      avgPitch: "260 Hz",
      speechRate: "210 wpm",
      silenceRatio: "10%",
      vocalTremor: "Extreme",
      stressLevel: "95%"
    }
  },
  {
    id: "CALL-2026-0089",
    title: "Border Checkpoint Audio Audio-08",
    uploadDate: "2026-09-02 14:12:11",
    timestamp: "1 day ago",
    duration: "01:55",
    durationSec: 115,
    numSpeakers: 2,
    speakers: ["Guard Alpha", "Vehicle Operator"],
    dominantEmotion: "Neutral",
    riskScore: 35,
    threatKeywordsCount: 1,
    flaggedPhrases: ["expired permit"],
    status: "Pending",
    classification: "RESTRICTED",
    audioSize: "3.6 MB",
    fileName: "border_cp08.ogg",
    format: "OGG",
    transcript: [
      { time: "00:04", speaker: "Guard Alpha", text: "Please present your biometric ID and transit pass.", emotion: "Neutral" },
      { time: "00:15", speaker: "Vehicle Operator", text: "Here is my pass. The secondary clearance has an expired permit notation.", emotion: "Neutral" }
    ],
    acousticStats: {
      avgPitch: "155 Hz",
      speechRate: "140 wpm",
      silenceRatio: "25%",
      vocalTremor: "Low",
      stressLevel: "32%"
    }
  }
];
