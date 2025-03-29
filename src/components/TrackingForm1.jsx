import { useState, useMemo } from "react";
import {
  Form,
  Button,
  InputGroup,
  Alert,
  Card,
  Spinner,
} from "react-bootstrap";
import { FaSearch, FaRedo, FaTruck } from "react-icons/fa";
import { fetchTrackingData } from "../services/api";
import "../styles/TrackingForm1.css";

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

    // Verify CAPTCHA
    if (captchaInput.toUpperCase() !== captchaText) {
      setError("CAPTCHA verification failed!");
      setIsLoading(false);
      return;
    }

    // Process tracking numbers
    const numbers = trackingNumbers
      .split(",")
      .map((num) => num.trim())
      .filter((num) => num.length > 0);

    if (numbers.length === 0) {
      setError("Please enter at least one tracking number");
      setIsLoading(false);
      return;
    }

    try {
      // Fetch data for the first tracking number (modify if you need multiple)
      const data = await fetchTrackingData(numbers[0]);

      if (!data) {
        throw new Error(`Tracking number ${numbers[0]} not found`);
      }

      setTrackingData(data);
    } catch (err) {
      setError(err.message || "Failed to fetch tracking data");
    } finally {
      setIsLoading(false);
    }
  };

  const refreshCaptcha = () => {
    setCaptchaInput("");
    setError(null);
    window.location.reload();
  };

  return (
    <div className="tracking-container">
      <Form onSubmit={handleSubmit} className="tracking-form">
        <Form.Group className="mb-3">
          <Form.Label>Enter tracking numbers :</Form.Label>
          <InputGroup>
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="e.g. V99116648"
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

        {/* Tracking Results Display */}
        {trackingData && (
          <Card className="mt-3 tracking-results">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">
                <FaTruck className="me-2" />
                TRACKING DETAILS: {trackingData.trackingNumber}
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="row mb-3">
                <div className="col-md-6 mb-3 mb-md-0">
                  <p>
                    <strong>Reference No:</strong> {trackingData.refNo}
                  </p>
                  <p>
                    <strong>Origin:</strong> {trackingData.origin}
                  </p>
                  <p>
                    <strong>Destination:</strong> {trackingData.destination}
                  </p>
                </div>
                <div className="col-md-6">
                  <p>
                    <strong>Booked On:</strong> {trackingData.bookedOn}
                  </p>
                  <p>
                    <strong>Status:</strong>
                    <span
                      className={`status-${trackingData.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {" " + trackingData.status}
                    </span>
                  </p>
                </div>
              </div>

              <h6>Shipment History:</h6>
              <div className="timeline-container">
                <div className="timeline">
                  {trackingData.history.map((event, index) => (
                    <div key={index} className="timeline-item">
                      <div className="timeline-marker"></div>
                      <div className="timeline-content">
                        <p className="mb-1">
                          <strong>{event.status}</strong>
                        </p>
                        <p className="text-muted mb-0">
                          {event.location} • {event.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card.Body>
          </Card>
        )}
      </Form>
    </div>
  );
};

export default TrackingForm;
