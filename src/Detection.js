import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function Detection() {
  const [detecting, setDetecting] = useState(false);
  const [status, setStatus] = useState("Idle");
  const navigate = useNavigate();

  // useRef keeps these stable across re-renders without triggering re-renders,
  // and they reset correctly when the component unmounts.
  const bufferRef = useRef([]);
  const lastTriggerRef = useRef(0);

  useEffect(() => {
    if (!detecting) return;

    const validatePothole = () => {
      const now = Date.now();
      if (now - lastTriggerRef.current < 5000) return; // 5-second cooldown

      const strongHits = bufferRef.current.filter(d => Math.abs(d.value) > 18);
      if (strongHits.length >= 2) {
        lastTriggerRef.current = now;
        bufferRef.current = [];
        triggerReport(strongHits.length);
      }
    };

    const handler = (event) => {
      const z = event.acceleration?.z;
      if (!z) return;

      const now = Date.now();
      if (Math.abs(z) > 18) {
        bufferRef.current.push({ time: now, value: z });
        // Keep only the last 3 seconds of data
        bufferRef.current = bufferRef.current.filter(d => now - d.time < 3000);
        validatePothole();
      }
    };

    window.addEventListener("devicemotion", handler);
    return () => window.removeEventListener("devicemotion", handler);
  }, [detecting]);

  const triggerReport = (confidenceHits) => {
    setStatus("Validating...");

    if (!navigator.geolocation) {
      setStatus("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const speed = pos.coords.speed;

        if (speed !== null && speed < 2) {
          setStatus("Ignored (low speed)");
          return;
        }

        try {
          const res = await fetch("/api/reports", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              description: "Auto-detected pothole",
              latitude: lat,
              longitude: lng,
              confidence: confidenceHits,
            }),
          });
          const data = await res.json();
          setStatus(data.message || "Pothole detected");
        } catch {
          setStatus("Error sending report");
        }
      },
      (err) => {
        if (err.code === 1) setStatus("Permission denied");
        else if (err.code === 2) setStatus("Location unavailable");
        else if (err.code === 3) setStatus("Location timeout");
        else setStatus("Location error");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div className="detectContainer">
      <div className="detectCard">
        <h2 className="detectTitle">Pothole Detection</h2>
        <p className="detectSub">
          Keep your phone stable while driving. Detection runs automatically.
        </p>
        <button
          className={`detectBtn ${detecting ? "stopBtn" : "startBtn"}`}
          onClick={() => setDetecting(!detecting)}
        >
          {detecting ? "Stop Detection" : "Start Detection"}
        </button>
        <div className="statusBox">
          <span className={detecting ? "activeDot" : "inactiveDot"}></span>
          Status: {status}
        </div>
        <div className="homeLink" onClick={() => navigate("/")}>
          Back to Dashboard
        </div>
      </div>
    </div>
  );
}

export default Detection;