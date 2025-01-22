import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./signup.css";
import SigninForm from "./SigninForm";
import auth from '../../services/auth';


const SignupForm = () => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);


  async function handleSubmit() {
    auth.createAccount(email, password, name);
    auth.login(email , password);
  }

  return (
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
        <p>To use snapgram, Please enter your details!</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Name</label>
          <input
              type="text"
              name="name"
              placeholder="Your Name"
          />

          <label htmlFor="email">Email</label>
          <input
              type="email"
              name="email"
              placeholder="your@email.com"
          />

          <label htmlFor="username">Phone Number</label>
          <input
              type="number"
              name="phoneNumber"
              placeholder="+91 XXXXXXXX"
          />
          <label htmlFor="password">Password</label>
          <input
              type="password"
              name="password"
              placeholder="Password"
          />

          <button className="btn-signup">Sign Up</button>
          <p>OR</p>
          <button className="btn-google">Sign up with Google!</button>

          <p>
            Already have a account?{" "}
            <Link to="/sign-in" className="login-badge">
              Log In
            </Link>
          </p>
        </form>
      </div>

      <div className="back-image">
        <img
          src="https://img.freepik.com/free-photo/customer-experience-creative-collage_23-2149371194.jpg?semt=ais_hybrid"
          alt=""
        />
      </div>
    </div>
  );
};

export default SignupForm;
