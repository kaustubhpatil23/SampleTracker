import { useState, useMemo } from "react";
import { FaSearch, FaRedo } from "react-icons/fa";
import "../styles/TrackingForm.css";

const TrackingForm = ({ onTrack }) => {
  const [trackingNumbers, setTrackingNumbers] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaError, setCaptchaError] = useState("");

  // Generate random 6-character CAPTCHA
  const captchaText = useMemo(() => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate CAPTCHA
    if (captchaInput.toUpperCase() !== captchaText) {
      setCaptchaError("CAPTCHA verification failed!");
      return;
    }

    setCaptchaError("");
    onTrack(trackingNumbers.split(",").map((num) => num.trim()));
  };

  const refreshCaptcha = () => {
    setCaptchaInput("");
    setCaptchaError("");
    // Force re-render to generate new CAPTCHA
    window.location.reload();
  };

  return (
    <div className="tracking-form-container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <div className="input-group">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Enter tracking numbers (e.g. V99116648, V99116649)"
              value={trackingNumbers}
              onChange={(e) => setTrackingNumbers(e.target.value)}
              required
            />
          </div>
          <div className="form-header">
            <p>
              To track multiple consignments please enter any combination of up
              to 25 DTDC tracking numbers, separated by comma.
            </p>
          </div>

          <div className="captcha-group">
            <div className="captcha-container">
              <div className="captcha-display">
                <span className="captcha-text">{captchaText}</span>
                <button
                  type="button"
                  onClick={refreshCaptcha}
                  className="refresh-btn"
                  aria-label="Refresh CAPTCHA"
                >
                  <FaRedo />
                </button>
              </div>
              <input
                type="text"
                placeholder="Enter CAPTCHA"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                required
                className="captcha-input"
              />
              {captchaError && (
                <div className="error-message">{captchaError}</div>
              )}
            </div>

            <button type="submit" className="track-button">
              TRACK
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TrackingForm;
