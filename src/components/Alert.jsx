import { Alert as BSAlert } from "react-bootstrap";
import PropTypes from "prop-types";
import "../styles/Alert.css";

const Alert = ({ variant, message, onClose, icon: Icon }) => {
  return (
    <BSAlert
      variant={variant}
      dismissible={!!onClose}
      onClose={onClose}
      className={`custom-alert alert-${variant}`}
    >
      <div className="alert-content">
        {Icon && <Icon className="alert-icon" />}
        <span className="alert-message">{message}</span>
      </div>
    </BSAlert>
  );
};

Alert.propTypes = {
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "success",
    "danger",
    "warning",
    "info",
    "light",
    "dark",
  ]),
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  icon: PropTypes.elementType,
};

Alert.defaultProps = {
  variant: "info",
  onClose: null,
  icon: null,
};

export default Alert;
