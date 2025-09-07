import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import bgImage from './social-media-bg.webp';
import './signup.css';
import api from '../../services/appwrite';
import toast, { Toaster } from 'react-hot-toast';

const SignupForm = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Sign Up - Snapgram';
  }, []);

  const validateInputs = ({ username, password, phoneNumber }) => {
    if (!username) {
      return 'Username is required!';
    }
    if (/\s/.test(username)) {
      return 'Username cannot contain spaces!';
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return 'Username should contain only a-z, 0-9 and underscores!';
    }
    if (password.length < 8) {
      return 'Password must be at least 8 characters!';
    }
    if (!/^\d{10}$/.test(phoneNumber)) {
      return 'Invalid Phone Number!';
    }
    return null;
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();

    const errorMsg = validateInputs({ username, password, phoneNumber });
    if (errorMsg) {
      toast.error(errorMsg);
      return;
    }

    try {
      const userNameExists = await api.checkUsername(username);
      if (userNameExists) return toast.error('Username already exists!');
      
      setLoading(true);
      const sent = await api.sendOtp(email, name);

      if (sent) {
        toast.success('OTP sent to your email!');
        setOtpSent(true);
      } else {
        toast.error('Failed to send OTP.');
      }
    } catch (err) {
      toast.error('Something went wrong!');
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) return toast.error('Please enter a 6-digit OTP');

    setLoading(true);
    try {
      const isValid = await api.verifyOtp(email, otp);

      if (isValid) {
        const newUser = await api.createAccount({
          email,
          password,
          name,
          username,
          phoneNumber,
        });

        if(newUser) {
          toast.success('Account created!');
          navigate('/sign-in');
          return;
        }
        toast.error("Error Creating Account!");        
      } else {
        toast.error('Incorrect OTP!');
      }
    } catch (err) {
      toast.error('Error verifying OTP');
      console.log(err);
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

            <form onSubmit={handleSignUpSubmit}>
              <label htmlFor="name" className="block text-sm mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-[#4a1f84]"
                required
              />

              <label htmlFor="email" className="block text-sm mb-1 mt-5">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                value={email}
                className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-[#4a1f84]"
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <label htmlFor="phoneNumber" className="block text-sm mb-1 mt-5">
                Phone Number
              </label>
              <input
                type="number"
                name="phoneNumber"
                placeholder="+91 XXXXXXXX"
                value={phoneNumber}
                className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-[#4a1f84]"
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />

              <label htmlFor="username" className="block text-sm mb-1 mt-5">
                Create Username
              </label>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={username}
                className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-[#4a1f84]"
                onChange={(e) => setUsername(e.target.value)}
                required
              />

              <label htmlFor="password" className="block text-sm mb-1 mt-5">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-[#4a1f84]"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit" className="btn-signup" disabled={loading}>
                {loading ? 'Sending...' : 'Send OTP'}
              </button>

              <p>
                Already have an account?{' '}
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

      {/* OTP Modal */}
      {otpSent && (
        <div className="otp-modal-overlay">
          <div className="otp-modal">
            <h3 className="text-[1.1rem]">Enter OTP</h3>
            <p className="text-[0.9rem]">
              We sent a 6-digit OTP to your email: <strong>{email}</strong>
            </p>

            <input
              type="text"
              maxLength={6}
              value={otp}
              className="w-full px-1 py-1 rounded-lg bg-neutral-800 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-[#4a1f84]"
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter OTP"
              required
            />

            <div className="flex justify-center items-center">
              <button
                onClick={handleVerifyOtp}
                disabled={loading}
                className="px-3 py-2 bg-[#3b1072] hover:bg-[#461f79] transition duration-300 rounded-lg cursor-pointer"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>

              <button
                onClick={() => setOtpSent(false)}
                className="px-3 py-2 bg-red-800 hover:bg-red-900 transition duration-300 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SignupForm;
