import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./signup.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import auth from "../../services/auth";

const SignupForm = () => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const userAccount = await auth.createAccount({ email, password, name });

      if (userAccount) {
        showToastSuccess("Account created! You can login now!");
        console.log("Account created successfully.");
        navigate("/sign-in");
      } else {
        showToastAlert("No account created!");
        console.log("No account created!");
      }
    } catch (error) {
      console.error("Error creating account:", error.message);
      showToastAlert("Error creating account!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Snapgram - Sign Up";
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
            />

            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              type="number"
              name="phoneNumber"
              placeholder="+91 XXXXXXXX"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />

            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit" className="btn-signup" disabled={loading}>
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
            <p>OR</p>
            <button type="button" className="btn-google">
              Sign up with Google!
            </button>

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
            src="https://img.freepik.com/free-photo/customer-experience-creative-collage_23-2149371194.jpg?semt=ais_hybrid"
            alt="Signup Background"
          />
        </div>
      </div>
    </>
  );
};

export default SignupForm;
