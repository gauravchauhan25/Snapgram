import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../page-styles/Settings.css";
import auth from "../services/auth";

export default function Settings() {
  const [isLightTheme, setIsLightTheme] = useState(false);

  const handleThemeToggle = () => {
    setIsLightTheme(!isLightTheme);
    document.body.classList.toggle("light-theme-variables");
    document.body.style.transition = "all 500ms ease";
  };

  const [isPrivate, setIsPrivate] = useState(false);
  const [language, setLanguage] = useState("English");
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Settings";
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      const isLogout = await auth.logout();
      if (isLogout) {
        window.location.reload();
        navigate("/sign-in");
      } else {
        alert("Error logging out!");
      }
    } catch (error) {
      alert("Logout failed:", error.message);
    }
  };

  const handleSave = () => {
    console.log({
      isPrivate,
      language,
    });
    alert("Settings saved successfully!");
  };

  return (
    <div className="settings-container">
      <h1 className="settings-title">Settings</h1>

      {/* Account Section */}
      <div className="settings-section">
        <h2>Account</h2>
        <ul>
          <li>Edit Profile</li>
          <li>Change Password</li>
          <li>Two-Factor Authentication</li>
          <li>Linked Accounts</li>
        </ul>
      </div>

      {/* Privacy Section */}
      <div className="settings-section">
        <h2>Privacy</h2>
        <div className="settings-option">
          <span>Private Account</span>
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={() => setIsPrivate(!isPrivate)}
          />
        </div>
        <ul>
          <li>Blocked Accounts</li>
          <li>Activity Status</li>
          <li>Story Controls</li>
        </ul>
      </div>

      {/* Notifications Section */}
      <div className="settings-section">
        <h2>Notifications</h2>
        <ul>
          <li>Push Notifications</li>
          <li>Email and SMS</li>
          <li>Live and IGTV</li>
          <li>Comments</li>
        </ul>
      </div>

      {/* General Section */}
      <div className="settings-section">
        <h2>General</h2>
        <ul>
          <li>Language</li>
          <li onClick={handleThemeToggle}>{` ${
            isLightTheme ? "Light Theme Mode" : "Dark Theme Mode"
          }`}</li>
          <li>Help Center</li>
          <li>About</li>
          <li onclick={handleLogout}>Logout</li>
        </ul>
      </div>

      {/* Save Button */}
      <div className="settings-save">
        <button onClick={handleLogout}>Save Settings</button>
      </div>
    </div>
  );
}
