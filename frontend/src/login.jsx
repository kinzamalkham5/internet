
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const handleLogin = () => {
    if (email === "admin@gmail.com" && password === "123456") {
      navigate("/dashboard");
    } else {
      alert("Wrong Email or Password");
    }
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
              <span className="login-nav">Log In</span>
              <span className="signup-nav">Sign Up</span>
            </div>
          </div>

          <div className="welcome-section">
            <h2>Welcome Back</h2>
            <p className="subtitle">Please enter your email and password</p>
          </div>


          <div className="form-group">
            <input
              type="email"
              className="email-input"
              placeholder="user@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            
            <input
              type="password"
              className="password-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

    
          <p className="terms">
            By login, you agree to our <a href="#">Terms & Conditions</a>
          </p>

           <div className="login-row">
            <button className="login-btn" onClick={handleLogin}>
              login... <span className="arrow">→</span>
            </button>
            <span 
              className="forgot" 
              onClick={() => navigate("/forgot-password")}
              style={{ cursor: "pointer" }}
            >
              Forgot Password?
            </span>
          </div>

        
          <div className="create-account">
            Don't have an account yet? <a href="#">Create Account</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;