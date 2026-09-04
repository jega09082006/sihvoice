const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, options);
  if (!response.ok) {
    let detail = `Request failed with status ${response.status}`;
    try {
      const body = await response.json();
      detail = body.detail || detail;
    } catch {
      // Keep the HTTP status when the server does not return JSON.
    }
    throw new Error(detail);
  }
  return response.json();
}

export function uploadAudio(file) {
  const formData = new FormData();
  formData.append("file", file);
  return request("/upload", { method: "POST", body: formData });
}

export function analyzeFullPipeline(audioFilePath, onProgress) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(`${BASE_URL}/analyze/full-pipeline`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audio_path: audioFilePath }),
      });
      if (!response.ok || !response.body) {
        throw new Error(`Pipeline request failed with status ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let lastResult = null;

      while (true) {
        const { value, done } = await reader.read();
        buffer += decoder.decode(value || new Uint8Array(), { stream: !done });
        const events = buffer.split("\n\n");
        buffer = events.pop() || "";

        for (const event of events) {
          const line = event.split("\n").find((entry) => entry.startsWith("data:"));
          if (!line) continue;
          const data = JSON.parse(line.slice(5).trim());
          onProgress(data);
          if (data.step === "done") {
            lastResult = data.result;
          }
        }
        if (done) break;
      }

      if (!lastResult) throw new Error("Pipeline stream ended before completion.");
      resolve(lastResult);
    } catch (error) {
      reject(error);
    }
  });
}

export async function getDashboardRecords() {
  const data = await request("/dashboard/records");
  return data.records || data;
}

export function getDashboardSummary() {
  return request("/dashboard/summary");
}

export function getCallById(callId) {
  return request(`/dashboard/records/${encodeURIComponent(callId)}`);
}
