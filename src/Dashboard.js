import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Dashboard() {
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    // optional: clear after use
    setDeferredPrompt(null);
  };

  return (
    <>
      <div className="hero">
        <div className="topBrand">FixMyRoad </div>
        <div className="heroContent">
          <h1 className="mainTitle">Report potholes and damages easily.</h1>

          <p className="subText">
            FixMyRoad helps citizens quickly report damaged roads, potholes and
            safety issues. Your reports help authorities identify and repair
            roads faster to make travel safer
          </p>

          <div className="btnGroup">
            <button onClick={() => navigate("/report")}>Report Issue</button>
            <button onClick={() => navigate("/map")}>View Map</button>
            <button onClick={() => navigate("/detect")}>Start Detection</button>
            {deferredPrompt && (
              <button onClick={handleInstall}>Install App</button>
            )}
          </div>
          <p className="bottom">©{new Date().getFullYear()} FixMyRoad. Making roads safer together</p>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
