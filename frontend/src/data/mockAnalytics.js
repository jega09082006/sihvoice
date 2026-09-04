export const MOCK_EMOTION_DISTRIBUTION = [
  { name: 'Happy', value: 35, color: '#00ff88' },
  { name: 'Neutral', value: 40, color: '#00d4ff' },
  { name: 'Frustrated', value: 15, color: '#ffb703' },
  { name: 'Angry', value: 10, color: '#ff4757' },
];

export const MOCK_SENTIMENT_7DAYS = [
  { day: 'Mon', score: 68, calls: 240, escalation: 9.2 },
  { day: 'Tue', score: 74, calls: 310, escalation: 7.8 },
  { day: 'Wed', score: 71, calls: 285, escalation: 8.5 },
  { day: 'Thu', score: 79, calls: 340, escalation: 6.4 },
  { day: 'Fri', score: 72, calls: 390, escalation: 8.9 },
  { day: 'Sat', score: 84, calls: 120, escalation: 4.1 },
  { day: 'Sun', score: 88, calls: 95,  escalation: 3.5 },
];

export const MOCK_30DAY_EMOTIONS = Array.from({ length: 30 }, (_, i) => {
  const dayNum = i + 1;
  const baseHappy = 35 + Math.sin(i * 0.4) * 8 + (Math.random() * 4 - 2);
  const baseNeutral = 38 + Math.cos(i * 0.3) * 6 + (Math.random() * 4 - 2);
  const baseFrustrated = 16 + Math.sin(i * 0.5) * 4 + (Math.random() * 3 - 1.5);
  const baseAngry = 11 - Math.sin(i * 0.4) * 3 + (Math.random() * 2 - 1);
  return {
    date: `Day ${dayNum}`,
    Happy: Math.max(10, Math.round(baseHappy)),
    Neutral: Math.max(10, Math.round(baseNeutral)),
    Frustrated: Math.max(2, Math.round(baseFrustrated)),
    Angry: Math.max(1, Math.round(baseAngry)),
  };
});

export const MOCK_ACOUSTIC_RADAR = [
  { feature: 'Pitch (Hz)', Customer: 220, Agent: 175, fullMark: 300 },
  { feature: 'Tempo (BPM)', Customer: 145, Agent: 125, fullMark: 200 },
  { feature: 'Energy (dB)', Customer: 78, Agent: 60, fullMark: 100 },
  { feature: 'Silence Ratio (%)', Customer: 32, Agent: 15, fullMark: 50 },
  { feature: 'Speech Rate (WPM)', Customer: 190, Agent: 150, fullMark: 250 },
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const MOCK_HEATMAP_GRID = DAYS.map((day) => {
  const hours = Array.from({ length: 24 }, (_, hour) => {
    let intensity = Math.floor(Math.random() * 20);
    if (hour >= 9 && hour <= 17) {
      intensity = Math.floor(45 + Math.random() * 50);
    } else if (hour >= 7 && hour <= 20) {
      intensity = Math.floor(20 + Math.random() * 35);
    }
    return { hour, volume: intensity };
  });
  return { day, hours };
});
