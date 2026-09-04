export const MOCK_CALLS = [
  {
    id: "CALL-8942",
    caller: "+1 (555) 234-5678",
    customerName: "Eleanor Vance",
    agent: "Sarah Connor",
    agentAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    duration: "04:32",
    durationSec: 272,
    emotion: "Frustrated",
    escalationRisk: "High",
    department: "Billing",
    sentimentScore: 34,
    timestamp: "2 mins ago",
    silenceRatio: 0.28,
    speechRate: "185 wpm",
    avgPitch: "210 Hz",
    transcript: [
      { speaker: "Customer", time: "00:05", text: "I've been transferred three times already, and my bill is still wrong!", emotion: "Angry" },
      { speaker: "Agent", time: "00:12", text: "I completely understand your frustration, Eleanor. Let me pull up your account right now.", emotion: "Neutral" },
      { speaker: "Customer", time: "00:24", text: "I was promised a $45 credit last month after the outage, but I see a full charge.", emotion: "Frustrated" },
      { speaker: "Agent", time: "00:35", text: "I see the ticket note here. The credit was authorized on the 15th. I can apply it immediately.", emotion: "Happy" },
      { speaker: "Customer", time: "01:10", text: "Alright, how long until it reflects on my online bank portal?", emotion: "Neutral" },
      { speaker: "Agent", time: "01:18", text: "It will process within 24 hours, and I've sent a direct confirmation email to you.", emotion: "Happy" },
      { speaker: "Customer", time: "02:05", text: "Okay, thank you for resolving this quickly. I appreciate your help.", emotion: "Happy" }
    ],
    diarizationSegments: [
      { speaker: "Customer", start: 0, end: 10, emotion: "Angry" },
      { speaker: "Agent", start: 10, end: 22, emotion: "Neutral" },
      { speaker: "Customer", start: 22, end: 32, emotion: "Frustrated" },
      { speaker: "Agent", start: 32, end: 68, emotion: "Happy" },
      { speaker: "Customer", start: 68, end: 110, emotion: "Neutral" },
      { speaker: "Agent", start: 110, end: 150, emotion: "Happy" },
      { speaker: "Customer", start: 150, end: 272, emotion: "Happy" }
    ]
  },
  {
    id: "CALL-8941",
    caller: "+1 (555) 987-6543",
    customerName: "Marcus Brody",
    agent: "Alex Mercer",
    agentAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    duration: "02:15",
    durationSec: 135,
    emotion: "Happy",
    escalationRisk: "Low",
    department: "Sales",
    sentimentScore: 91,
    timestamp: "5 mins ago",
    silenceRatio: 0.12,
    speechRate: "160 wpm",
    avgPitch: "175 Hz",
    transcript: [
      { speaker: "Customer", time: "00:04", text: "Hi! I wanted to check if the Enterprise plan includes priority support.", emotion: "Happy" },
      { speaker: "Agent", time: "00:10", text: "Hello Marcus! Yes, it includes 24/7 dedicated SLA support and a custom account manager.", emotion: "Happy" },
      { speaker: "Customer", time: "00:18", text: "Awesome! Can we upgrade starting today?", emotion: "Happy" },
      { speaker: "Agent", time: "00:25", text: "Absolutely, I'm initiating the upgrade request right now.", emotion: "Happy" }
    ],
    diarizationSegments: [
      { speaker: "Customer", start: 0, end: 8, emotion: "Happy" },
      { speaker: "Agent", start: 8, end: 16, emotion: "Happy" },
      { speaker: "Customer", start: 16, end: 22, emotion: "Happy" },
      { speaker: "Agent", start: 22, end: 135, emotion: "Happy" }
    ]
  },
  {
    id: "CALL-8940",
    caller: "+1 (555) 444-1212",
    customerName: "Sophia Martinez",
    agent: "David Chen",
    agentAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    duration: "06:45",
    durationSec: 405,
    emotion: "Angry",
    escalationRisk: "High",
    department: "Technical",
    sentimentScore: 18,
    timestamp: "12 mins ago",
    silenceRatio: 0.35,
    speechRate: "205 wpm",
    avgPitch: "245 Hz",
    transcript: [
      { speaker: "Customer", time: "00:03", text: "Your API service has been dropping connections all morning!", emotion: "Angry" },
      { speaker: "Agent", time: "00:11", text: "I'm checking our status page right now, Ms. Martinez.", emotion: "Neutral" },
      { speaker: "Customer", time: "00:20", text: "Don't check status pages, our entire production deployment is stalled!", emotion: "Angry" }
    ],
    diarizationSegments: [
      { speaker: "Customer", start: 0, end: 8, emotion: "Angry" },
      { speaker: "Agent", start: 8, end: 18, emotion: "Neutral" },
      { speaker: "Customer", start: 18, end: 405, emotion: "Angry" }
    ]
  },
  {
    id: "CALL-8939",
    caller: "+1 (555) 777-3311",
    customerName: "James Watson",
    agent: "Elena Rostova",
    agentAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    duration: "03:50",
    durationSec: 230,
    emotion: "Neutral",
    escalationRisk: "Medium",
    department: "Support",
    sentimentScore: 62,
    timestamp: "18 mins ago",
    silenceRatio: 0.18,
    speechRate: "150 wpm",
    avgPitch: "165 Hz",
    transcript: [
      { speaker: "Customer", time: "00:04", text: "I need assistance setting up multi-factor authentication for my team.", emotion: "Neutral" },
      { speaker: "Agent", time: "00:12", text: "I can guide you through the admin console setup step by step.", emotion: "Happy" }
    ],
    diarizationSegments: [
      { speaker: "Customer", start: 0, end: 10, emotion: "Neutral" },
      { speaker: "Agent", start: 10, end: 230, emotion: "Happy" }
    ]
  },
  {
    id: "CALL-8938",
    caller: "+1 (555) 888-9900",
    customerName: "Clara Oswald",
    agent: "Sarah Connor",
    agentAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    duration: "05:12",
    durationSec: 312,
    emotion: "Frustrated",
    escalationRisk: "Medium",
    department: "Billing",
    sentimentScore: 48,
    timestamp: "25 mins ago",
    silenceRatio: 0.22,
    speechRate: "172 wpm",
    avgPitch: "190 Hz",
    transcript: [
      { speaker: "Customer", time: "00:06", text: "Why does my invoice show international roaming charges when I was home?", emotion: "Frustrated" }
    ],
    diarizationSegments: [
      { speaker: "Customer", start: 0, end: 15, emotion: "Frustrated" },
      { speaker: "Agent", start: 15, end: 312, emotion: "Neutral" }
    ]
  },
  {
    id: "CALL-8937",
    caller: "+1 (555) 333-6644",
    customerName: "Liam Hemsworth",
    agent: "Michael Scott",
    agentAvatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    duration: "01:45",
    durationSec: 105,
    emotion: "Happy",
    escalationRisk: "Low",
    department: "Sales",
    sentimentScore: 88,
    timestamp: "32 mins ago",
    silenceRatio: 0.10,
    speechRate: "155 wpm",
    avgPitch: "160 Hz",
    transcript: [
      { speaker: "Customer", time: "00:03", text: "Just calling to confirm our onboarding session tomorrow at 10 AM.", emotion: "Happy" }
    ],
    diarizationSegments: [
      { speaker: "Customer", start: 0, end: 10, emotion: "Happy" },
      { speaker: "Agent", start: 10, end: 105, emotion: "Happy" }
    ]
  }
];
