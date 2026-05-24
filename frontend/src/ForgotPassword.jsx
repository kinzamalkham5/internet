import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      setIsDarkMode(false);
      document.body.classList.add("light-mode-theme");
    } else {
      setIsDarkMode(true);
      document.body.classList.remove("light-mode-theme");
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      localStorage.setItem("theme", "dark");
      document.body.classList.remove("light-mode-theme");
    } else {
      localStorage.setItem("theme", "light");
      document.body.classList.add("light-mode-theme");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      alert("Please enter your email");
      return;
    }
    setIsSubmitted(true);
  };

  return (
    <div className={`login-page ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="fan-container">
        <div className="fan">
          <div className="blade blade1"></div>
          <div className="blade blade2"></div>
          <div className="blade blade3"></div>
          <div className="fan-center"></div>
        </div>
      </div>

      <div className="login-container">
        <div className="login-card">
          <div className="top-nav">
            <span className="switchd">Switched</span>
            <div className="nav-items">
              <span>Internet</span>
              <span>Provider</span>
              <span>Company</span>
              <span 
                className={`light-mode-toggle ${!isDarkMode ? 'active' : ''}`} 
                onClick={toggleTheme}
              >
                {isDarkMode ? '☀️ Light' : '🌙 Dark'}
              </span>
              <span className="login-nav" onClick={() => navigate("/")} style={{ cursor: 'pointer' }}>Log In</span>
              <span className="signup-nav">Sign Up</span>
            </div>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit}>
              <div className="welcome-section">
                <h2>Reset Password</h2>
                <p className="subtitle">Enter your email address to reset your password</p>
              </div>

              <div className="form-group">
                <input
                  type="email"
                  className="email-input"
                  placeholder="user@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="login-row">
                <button type="submit" className="login-btn">
                  send link... <span className="arrow">→</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="welcome-section" style={{ textAlign: "center", padding: "10px 0" }}>
              <h2>Check Your Email</h2>
              <p className="subtitle" style={{ marginBottom: "25px", lineHeight: "1.6" }}>
                We've sent a password reset link to <strong>{email}</strong>. Please check your inbox and follow the instructions.
              </p>
              <div className="login-row" style={{ justifyContent: "center" }}>
                <button className="login-btn" onClick={() => navigate("/")}>
                  ← back to login
                </button>
              </div>
            </div>
          )}

          <div className="create-account" style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
            Already remember your password? <a href="#" onClick={(e) => { e.preventDefault(); navigate("/"); }}>Log In</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
