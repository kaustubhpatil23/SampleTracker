import { FaTruck } from "react-icons/fa";
import "../styles/Header.css";
const Header = () => (
  <header className="app-header">
    <h1 className="app-title">
      <FaTruck className="app-icon" /> Package Tracker
    </h1>
  </header>
);

export default Header;
