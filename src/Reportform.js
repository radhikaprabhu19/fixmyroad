import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

function ReportForm() {
  const navigate = useNavigate();

  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [loading, setLoading] = useState(false);

  const fileRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!latitude || !longitude) {
      alert("Please detect location first");
      return;
    }

    const formData = new FormData();
    formData.append("description", description);
    formData.append("photo", photo);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/reports", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      alert(data.message);

      // reset form
      fileRef.current.value = "";
      setDescription("");
      setPhoto(null);
      setLatitude("");
      setLongitude("");

      navigate("/map");

    } catch (err) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    });
  };

  return (
    <div className="reportOuter">
      <div className="reportBox">

        {/* LEFT */}
        <div className="reportImageSide">
          <h2 className="startTitle">Let’s report road issues!</h2>

          <p className="startSub">
            Help authorities identify potholes and road damages faster.
          </p>

          <img src="/report.png" alt="road" className="reportImg" />
        </div>

        {/* RIGHT */}
        <div className="reportFormSide">
          <div className="formCard">
            <h2 className="reportHeading">Report Road Damage</h2>

            <form className="formStack" onSubmit={handleSubmit}>

              <button type="button" className="locBtn" onClick={detectLocation}>
                Detect My Location
              </button>

              {latitude && (
                <div className="successText">Location detected ✅</div>
              )}

              <textarea
                className="inputBox"
                placeholder="Describe road issue"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />

              <label className="uploadBtn">
                {photo ? photo.name : "Choose Image"}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhoto(e.target.files[0])}
                />
              </label>

              {/* ✅ SUBMIT BUTTON */}
              <button className="submitBtn" type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Submit Report"}
              </button>

              <div className="homeLink" onClick={() => navigate("/")}>
                Back to Dashboard
              </div>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ReportForm;