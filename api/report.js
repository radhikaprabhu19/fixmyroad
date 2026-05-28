// In-memory store — pre-loaded with your existing reports.json data.
// Data resets on cold start; this is fine for demo / MVP.
let reports = [
  { id: 1775221055199, description: "Pothole", latitude: 12.9824, longitude: 76.1136, photo: null, type: "manual", confidence: 1 },
  { id: 1776159463484, description: "Auto-detected pothole", latitude: 12.6534027, longitude: 75.4136054, photo: null, type: "auto", confidence: 2 },
  { id: 1776171661695, description: "Road damage", latitude: 12.8543, longitude: 74.8406, photo: null, type: "auto", confidence: 1 },
  { id: 1776680922212, description: "Pothole", latitude: 12.9617, longitude: 75.191, photo: null, type: "auto", confidence: 1 }
];

function isDuplicate(newReport) {
  return reports.some(r =>
    Math.abs(r.latitude - newReport.latitude) < 0.0002 &&
    Math.abs(r.longitude - newReport.longitude) < 0.0002
  );
}

module.exports = function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "GET") {
    return res.json(reports.map(r => ({ type: "manual", confidence: 1, ...r })));
  }

  if (req.method === "POST") {
    const body = req.body || {};
    const lat = Number(body.latitude);
    const lng = Number(body.longitude);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return res.status(400).json({ message: "Invalid coordinates" });
    }

    const report = {
      id: Date.now(),
      description: String(body.description || "Auto-detected pothole").trim().slice(0, 500),
      latitude: lat,
      longitude: lng,
      photo: body.photo || null,
      type: body.photo ? "manual" : "auto",
      confidence: Number(body.confidence) || 1,
    };

    if (isDuplicate(report)) {
      return res.json({ message: "Duplicate report ignored" });
    }

    reports.push(report);
    return res.json({ message: "Report received successfully", report });
  }

  if (req.method === "DELETE") {
    const id = Number(req.query.id);
    if (!id) return res.status(400).json({ message: "Missing report id" });
    const before = reports.length;
    reports = reports.filter(r => r.id !== id);
    if (reports.length === before) {
      return res.status(404).json({ message: "Report not found" });
    }
    return res.json({ message: "Report deleted" });
  }

  return res.status(405).json({ message: "Method not allowed" });
};