import { useState, useMemo } from "react";
import {
  Form,
  Button,
  InputGroup,
  Alert,
  Card,
  Spinner,
  ProgressBar,
} from "react-bootstrap";
import { FaSearch, FaRedo, FaTruck } from "react-icons/fa";
import { fetchTrackingData } from "../services/api";
import "../styles/TrackingForm2.css";

const TrackingForm = () => {
  // Form state
  const [trackingNumbers, setTrackingNumbers] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Results state
  const [error, setError] = useState(null);
  const [trackingData, setTrackingData] = useState(null);

  // Generate CAPTCHA
  const captchaText = useMemo(() => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setTrackingData(null);

    try {
      // Verify CAPTCHA
      if (captchaInput.toUpperCase() !== captchaText) {
        throw new Error("CAPTCHA verification failed!");
      }

      // Process tracking numbers
      const numbers = trackingNumbers
        .split(",")
        .map((num) => num.trim())
        .filter((num) => num.length > 0);

      if (numbers.length === 0) {
        throw new Error("Please enter at least one tracking number");
      }

      // Fetch data for the first tracking number
      const data = await fetchTrackingData(numbers[0]);

      if (!data) {
        throw new Error(`Tracking number ${numbers[0]} not found`);
      }

      // Transform data to match expected structure
      const transformedData = {
        TrackingNumber: data.trackingNumber || data.TrackingNumber,
        ReferenceNo: data.refNo || data.ReferenceNo,
        Origin: data.origin || data.Origin,
        Destination: data.destination || data.Destination,
        BookedOn: data.bookedOn || data.BookedOn,
        Status: data.status || data.Status,
        History: data.history || data.History || [],
      };

      setTrackingData(transformedData);
    } catch (err) {
      setError(err.message || "Failed to fetch tracking data");
    } finally {
      setIsLoading(false);
    }
  };

  const refreshCaptcha = () => {
    setCaptchaInput("");
    setError(null);
    // Generate new CAPTCHA by forcing re-render
    setTrackingNumbers("");
  };

  // Calculate progress percentage based on status
  const getProgressPercentage = (history) => {
    const statusOrder = [
      "Booked",
      "Accepted",
      "Picked Up",
      "In Transit",
      "At Destination",
      "Delivered",
    ];

    if (!history || history.length === 0) return 0;

    const lastStatus = history[0].status;
    const statusIndex = statusOrder.indexOf(lastStatus);

    return statusIndex >= 0
      ? Math.round(((statusIndex + 1) / statusOrder.length) * 100)
      : 0;
  };

  // Get status color for progress bar
  const getStatusVariant = (status) => {
    switch ((status || "").toLowerCase()) {
      case "delivered":
        return "success";
      case "in transit":
        return "info";
      case "at destination":
        return "primary";
      case "picked up":
        return "warning";
      case "accepted":
        return "secondary";
      case "booked":
        return "dark";
      default:
        return "secondary";
    }
  };

  // Format history for display
  const formatHistory = (history) => {
    if (!history || history.length === 0) return [];

    const historyItem = history[0];
    const formatted = [];

    if (historyItem.SoftdataUpload) {
      formatted.push({
        status: "Softdata Upload",
        details: historyItem.SoftdataUpload,
      });
    }
    if (historyItem.PickedUp) {
      formatted.push({
        status: "Picked Up",
        details: historyItem.PickedUp,
      });
    }
    if (historyItem.Accepted) {
      formatted.push({
        status: "Accepted",
        details: historyItem.Accepted,
      });
    }
    if (historyItem.InTransit) {
      formatted.push({
        status: "In Transit",
        details: historyItem.InTransit,
      });
    }
    if (historyItem.AtDestination) {
      formatted.push({
        status: "At Destination",
        details: historyItem.AtDestination,
      });
    }
    if (historyItem.Delivered) {
      formatted.push({
        status: "Delivered",
        details: historyItem.Delivered,
      });
    }

    return formatted;
  };

  return (
    <div className="tracking-container">
      <Form onSubmit={handleSubmit} className="tracking-form">
        <Form.Group className="mb-3">
          <Form.Label>Enter tracking numbers:</Form.Label>
          <InputGroup>
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="e.g. V99116676"
              value={trackingNumbers}
              onChange={(e) => setTrackingNumbers(e.target.value)}
              disabled={isLoading}
            />
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Security Verification</Form.Label>
          <div className="d-flex gap-2 align-items-end">
            <div className="flex-grow-1">
              <div className="d-flex align-items-center gap-2 mb-2">
                <div className="captcha-display bg-light p-2 rounded">
                  <span className="captcha-text fw-bold">{captchaText}</span>
                </div>
                <Button
                  variant="outline-secondary"
                  onClick={refreshCaptcha}
                  size="sm"
                  disabled={isLoading}
                >
                  <FaRedo />
                </Button>
              </div>
              <Form.Control
                type="text"
                placeholder="Enter CAPTCHA"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button
              variant="danger"
              type="submit"
              disabled={
                isLoading || !trackingNumbers.trim() || !captchaInput.trim()
              }
              className="track-button"
            >
              {isLoading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Tracking...
                </>
              ) : (
                "TRACK"
              )}
            </Button>
          </div>
        </Form.Group>

        {error && (
          <Alert variant="danger" className="d-flex align-items-center">
            <FaTruck className="me-2" />
            {error}
          </Alert>
        )}

        {trackingData && (
          <Card className="mt-3 tracking-results">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">
                <FaTruck className="me-2" />
                TRACKING DETAILS: {trackingData.TrackingNumber}
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="row mb-3">
                <div className="col-md-6 mb-3 mb-md-0">
                  <p>
                    <strong>Reference No:</strong> {trackingData.ReferenceNo}
                  </p>
                  <p>
                    <strong>Origin:</strong> {trackingData.Origin}
                  </p>
                  <p>
                    <strong>Destination:</strong> {trackingData.Destination}
                  </p>
                </div>
                <div className="col-md-6">
                  <p>
                    <strong>Booked On:</strong> {trackingData.BookedOn}
                  </p>
                  <p>
                    <strong>Status:</strong>
                    <span
                      className={`status-${(trackingData.Status || "")
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {" " + trackingData.Status}
                    </span>
                  </p>
                </div>
              </div>

              <h6>Delivery Progress:</h6>
              <div className="mb-3">
                <ProgressBar
                  now={getProgressPercentage(trackingData.History)}
                  variant={getStatusVariant(trackingData.Status)}
                  label={`${getProgressPercentage(trackingData.History)}%`}
                  animated={trackingData.Status !== "Delivered"}
                />
              </div>

              <div className="progress-steps">
                {formatHistory(trackingData.History).map(
                  (event, index, arr) => (
                    <div key={index} className="progress-step">
                      <div
                        className={`step-indicator ${
                          index === arr.length - 1 ? "active" : ""
                        }`}
                      >
                        {event.status === "Delivered" ? (
                          <span className="step-icon">✓</span>
                        ) : (
                          <span className="step-number">{index + 1}</span>
                        )}
                      </div>
                      <div className="step-details">
                        <div className="step-status">{event.status}</div>
                        <div className="step-meta">{event.details}</div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </Card.Body>
          </Card>
        )}
      </Form>
    </div>
  );
};

export default TrackingForm;
