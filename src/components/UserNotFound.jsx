import { useNavigate } from "react-router-dom";
import "../page-styles/Profile.css";
import { useEffect } from "react";

const UserNotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "User Not Found";
  }, []);

  return (
    <div className="user-not-found-container">
      <div className="user-not-found-card">
        <h2>Sorry, this page isn't available!</h2>
        <p>The link you followed may be broken, or the page may have been removed. <span className="go-to-snapgram" onClick={() => navigate("/")}>Go back to Snapgram.</span></p>
        {/* <button onClick={() => navigate("/")}>Redirect to Home Page</button> */}
      </div>
    </div>
  );
};

export default UserNotFound;
