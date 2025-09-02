import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import bgImage from "./social-media-bg.webp";
import "./signup.css";
import api from "../../services/appwrite";
import { useAuthContext } from "../../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";

const SignupForm = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  // const { checkAuthUser } = useAuthContext();

  useEffect(() => {
    document.title = "Sign Up - Snapgram";
  }, []);

 const validateInputs = ({ username, password, phoneNumber }) => {
  if (!username) {
    return "Username is required!";
  }

  if (/\s/.test(username)) {
    return "Username cannot contain spaces!";
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return "Username should contain only a-z, 0-9 and underscores!";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters!";
  }

  if (!/^\d{10}$/.test(phoneNumber)) {
    return "Invalid Phone Number!";
  }

  return null; // ✅ no errors
};

const handleSignIn = async (e) => {
  e.preventDefault();

  const errorMsg = validateInputs({ username, password, phoneNumber });
  if (errorMsg) {
    toast.error(errorMsg);
    return;
  }

  try {
    const userNameExists = await api.checkUsername(username);
    if (userNameExists) {
      toast.error("Username already exists! Try with a new one.");
      return;
    }

    setLoading(true);
    const newUser = await api.createAccount({
      email,
      password,
      name,
      username,
      phoneNumber,
    });

    if (newUser) {
      toast.success("Account created!");
      navigate("/sign-in");
    }
  } catch (error) {
    toast.error("Error creating account!");
    console.log(error);
  } finally {
    setLoading(false);
  }
};


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

            <h4>Create a new Account</h4>
            <p>To use Snapgram, please enter your details!</p>

            <form onSubmit={handleSignIn}>
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

              <label htmlFor="username">Create Username</label>
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
                {loading ? "Creating..." : "Create Account"}
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
            <img src={bgImage} alt="background" />
          </div>
        </div>
      </div>
    </>
  );
};

export default SignupForm;
