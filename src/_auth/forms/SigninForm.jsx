import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./signup.css";
import api from "../../services/appwrite";
import { useAuthContext } from "../../context/AuthContext";
import bgImage from "./social-media-bg.webp";
import { googleIcon } from "../../assets/categories";
import toast, { Toaster } from "react-hot-toast";

const SigninForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { checkAuthUser } = useAuthContext();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (password.length < 8 || password.length > 255) {
      toast.error("Invalid Password");
      return;
    }

    try {
      setLoading(true);
      const session = await api.login({ email, password });

      if (session) {
        window.location.reload();
        navigate("/");
      }

      const isLoggedIn = await checkAuthUser();
      if (isLoggedIn) {
        window.location.reload();
        navigate("/");
      } else {
        navigate("/sign-in");
      }
    } catch (error) {
      toast.error("Incorrect email or password!");
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async (e) => {
    e.preventDefault();

    try {
      await api.loginWithGoogle();
    } catch (error) {
      toast.error("Error logging in with Google!");
    }
  };

  useEffect(() => {
    document.title = "Log In - Snapgram";
  }, []);

  return (
    <>
      <Toaster />
      <div className="fade-in">
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
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className=""
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <label htmlFor="password">Password</label>
              <input
                type="password"
                className=""
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button type="submit" className="btn-signup" disabled={loading}>
                {loading ? "Logging In..." : "Log In"}
              </button>
              <p>OR</p>

              <button
                type="button"
                className="btn-google"
                onClick={googleLogin}
              >
                {googleIcon.icon} Sign In with Google!
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
            <img src={bgImage} alt="background" />
          </div>
        </div>
      </div>
    </>
  );
};

export default SigninForm;
