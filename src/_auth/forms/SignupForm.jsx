import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./signup.css";
import api from "../../services/appwrite";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUserContext } from "../../context/AuthContext";
import bgImage from "./social-media-bg.webp";

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

const showToastSuccess = (text) => {
  toast.success(text, {
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

const SignupForm = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { checkAuthUser } = useUserContext();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 8 || password.length > 255) {
      showToastAlert("Password must be between 8 and 255 characters.");
      return;
    }

    try {
      setLoading(true);
      const newUser = await api.createAccount({
        email,
        password,
        name,
        username,
        phoneNumber,
      });

      if (!newUser) {
        showToastAlert("Error creating account");
        return;
      } else if (newUser) {
        showToastSuccess("Account created! Login Now!");
      }
    } catch (error) {
      showToastAlert(error);
      console.log(error);
    } finally {
      setLoading(false);
      navigate("/sign-in");
    }
  };

  useEffect(() => {
    document.title = "Sign Up - Snapgram";
  }, []);

  return (
    <>
      <ToastContainer />
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

          <h4>Create a new Account</h4>
          <p>To use Snapgram, please enter your details!</p>

          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              type="number"
              name="phoneNumber"
              placeholder="+91 XXXXXXXX"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />

            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" className="btn-signup" disabled={loading}>
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
            {/* <p>OR</p> */}

            <p>
              Already have an account?{" "}
              <Link to="/sign-in" className="login-badge">
                Log In
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

export default SignupForm;
