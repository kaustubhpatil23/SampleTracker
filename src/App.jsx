import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/Header";
import TrackingForm from "./components/TrackingForm2";
import TrackingDetails from "./components/TrackingDetails";
import Loader from "./components/Loader";
import Alert from "./components/Alert";
import { fetchTrackingData } from "./services/api";

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (trackingNumber) => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchTrackingData(trackingNumber);
      if (result) {
        setData(result);
      } else {
        setError("Tracking number not found");
      }
    } catch (err) {
      setError("Failed to fetch tracking data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container app-container">
      <Header />
      <TrackingForm onSubmit={handleSubmit} isLoading={loading} />
      {loading && <Loader />}
      {error && <Alert variant="danger" message={error} />}
      {data && <TrackingDetails data={data} />}
    </div>
  );
}

export default App;
