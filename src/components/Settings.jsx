import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../page-styles/Settings.css";
import auth from "../services/auth";

export default function Settings() {
  const [isPrivate, setIsPrivate] = useState(false);
  const [language, setLanguage] = useState("English");
  const [theme, setTheme] = useState("Light");

  useEffect(() => {
    document.title = "Settings";
  }, []);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.logout(navigate);
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  const handleSave = () => {
    // Placeholder: Save settings to the API
    console.log({
      isPrivate,
      language,
      theme,
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
        <div className="settings-option">
          <label htmlFor="language-select">Language:</label>
          <select
            id="language-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
          </select>
        </div>
        <div className="settings-option">
          <label htmlFor="theme-select">Theme:</label>
          <select
            id="theme-select"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            <option value="Light">Light</option>
            <option value="Dark">Dark</option>
          </select>
        </div>
        <ul>
          <li>Help Center</li>
          <li>About</li>
          <li onclick={handleLogout}>Logout</li>
        </ul>
      </div>

      {/* Save Button */}
      <div className="settings-save">
        <button onClick={handleSave}>Save Settings</button>
      </div>
    </div>
  );
}
