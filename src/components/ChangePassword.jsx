import { ToastContainer } from "react-toastify";
import "../page-styles/EditProfile.css";
import { useEffect, useState } from "react";
import api from "../services/appwrite";
import { useProfileContext } from "../context/ProfileContext";
import { showToastAlert, showToastSuccess } from "../popup/react-toats";

const ChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const [currPassword, setCurrPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(false);

  const { userProfile } = useProfileContext();

  useEffect(() => {
    document.title = "Change Password";
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (newPassword !== confirmPassword) {
        setError(true);
        setLoading(false);
        return;
      }

      if(newPassword.length < 8) {
        showToastAlert("Password must be at least 8 characters long!");   
        setLoading(false);
        return; 
      }
      
      const email = userProfile.email;

      const update = await api.changePassword({
        email,
        currPassword,
        newPassword,
      });

      if (!update) {
        showToastAlert("Current password is not correct!");
      } else {
        showToastSuccess("Password Changed!");
        setCurrPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }

      
    } catch (error) {
      console.log("Error changing Password :: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="edit-container">
        <h1 className="title">Change Password</h1>

        <form onSubmit={handleChangePassword}>
          <div className="form-group">
            <label htmlFor="currPassword" className="label">
              Current Password
            </label>

            <input
              type="text"
              id="currPassword"
              className="input"
              onChange={(e) => setCurrPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword" className="label">
              New Password
            </label>
            <input
              type="text"
              id="newPassword"
              className="input"
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="label">
              Confirm New Password
            </label>
            <input
              type="text"
              id="confirmPassword"
              className="input"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <p className="error-message">{error ? "Do not match!" : "" }</p>

          <button type="submit" className="edit-btn" disabled={loading}>
            {loading ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </>
  );
};

export default ChangePassword;
