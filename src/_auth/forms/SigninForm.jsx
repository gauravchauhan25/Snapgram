import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./signup.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../services/appwrite";
import { useUserContext } from "../../context/AuthContext";
import bgImage from "./social-media-bg.webp";

const SigninForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { checkAuthUser } = useUserContext();
  const navigate = useNavigate();

  const showToastAlert = (text) => {
    toast.error(text, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (password.length < 8 || password.length > 255) {
      showToastAlert("Password must be between 8 and 255 characters.");
      return;
    }

    try {
      setLoading(true);
      const session = await api.login({ email, password });

      if (session) {
        window.location.reload();
        navigate("/");
      } else {
        showToastAlert("Error logging in");
      }

      const isLoggedIn = await checkAuthUser();
      if (isLoggedIn) {
        window.location.reload();
        navigate("/");
      } else {
        return;
      }
    } catch (error) {
      showToastAlert("Error logging in!");
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.loginWithGoogle();
    } catch (error) {
      console.error("Error logging in:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Log In - Snapgram";
  }, []);

  return (
    <>
      <div className="signup-main">
        <div className="signup-container">
          <div className="logo-s">
            <img
              src="https://cdn-icons-png.flaticon.com/128/185/185985.png"
              className="logo-snapgram"
              alt="logo"
            />
            <h3>Snapgram</h3>
          </div>

          <h4>User Login</h4>
          <p>To use Snapgram, please login!</p>

          <form onSubmit={handleLogin}>
            <label htmlFor="email">Enter you email</label>
            <input
              type="email"
              className=""
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label htmlFor="password">Password</label>
            <input
              type="password"
              className=""
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit" className="btn-signup" disabled={loading}>
              {loading ? "Logging In..." : "Log In"}
            </button>
            <p>OR</p>

            <button type="button" className="btn-google" onClick={googleLogin}>
              Sign In with Google!
            </button>

            <p>
              Don't have an account?{" "}
              <Link to="/sign-up" className="login-badge">
                Sign up
              </Link>
            </p>
          </form>
        </div>
        <div className="back-image">
          <img
            src={bgImage}
            // src="https://img.freepik.com/free-photo/customer-experience-creative-collage_23-2149371194.jpg?semt=ais_hybrid"
            alt="background"
          />
        </div>
      </div>
    </>
  );
};

export default SigninForm;
