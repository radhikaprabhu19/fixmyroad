import MapView from "./Mapview";
import { useNavigate } from "react-router-dom";

function FullMapPage() {
  const navigate = useNavigate();
  return (
    <div style={{ height: "100vh" }}>
      <MapView />
        <button className="dashbutton"
        onClick={() => navigate("/")}
      >
        Back to Dashboard
      </button>
    </div>
  );
}

export default FullMapPage;
