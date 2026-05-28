import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({ iconUrl: markerIcon, shadowUrl: markerShadow });
L.Marker.prototype.options.icon = DefaultIcon;

function MapView() {
  const [reports, setReports] = useState([]);

  useEffect(() => { fetchReports(); }, []);

  const fetchReports = async () => {
    try {
      const res = await fetch("/api/reports");
      const data = await res.json();
      setReports(data);
    } catch (err) {
      console.error("Error fetching reports:", err);
    }
  };

  const deleteReport = async (id) => {
    if (!window.confirm("Delete this report?")) return;
    try {
      await fetch(`/api/reports?id=${id}`, { method: "DELETE" });
      setReports(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      alert("Could not delete report");
    }
  };

  return (
    <div>
      <MapContainer
        center={
          reports.length > 0
            ? [Number(reports[0].latitude), Number(reports[0].longitude)]
            : [12.9716, 77.5946]
        }
        zoom={7}
        style={{ height: "80vh", width: "90%", margin: "50px auto" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {reports.map((report, index) => {
          const lat = Number(report.latitude);
          const lng = Number(report.longitude);
          if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

          return (
            <Marker key={index} position={[lat, lng]}>
              <Popup>
                {report.photo && (
                  <img src={report.photo} style={{ width: 180, marginBottom: 10 }} alt="road issue" />
                )}
                <div><strong>{report.description}</strong></div>
                <div style={{ fontSize: 12, color: "#555", marginTop: 5 }}>
                  Type: {report.type}
                </div>
                <div style={{ fontSize: 12, color: "#555" }}>
                  Confidence: {report.confidence}
                </div>
                <button
                  onClick={() => deleteReport(report.id)}
                  style={{
                    marginTop: 10,
                    padding: "6px 14px",
                    background: "#c62828",
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontSize: 12,
                    width: "100%",
                  }}
                >
                  Delete report
                </button>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

export default MapView;