import React, { useState, useEffect } from 'react';
import './styles/Login.css';
import api from '../config/axialConfig';
import { useNavigate } from 'react-router-dom';


const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [dbErrors, setDbErrors] = useState('');

  useEffect(() => {
    if (localStorage.getItem("Username")) {
      navigate("/feed");
    }
  }, [navigate]);

  const validateInput = () => {
    let isValid = true;
    const newErrors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      isValid = false;
      newErrors['email'] = 'Please enter a valid email.';
    }

    // Password validation (Basic check for demonstration)
    if (!password || password.length < 6) {
      isValid = false;
      newErrors['password'] = 'Password must be at least 6 characters.';
    }

    setErrors(newErrors);
    return isValid;
  };

  var submitLogin = async (e) => {
    e.preventDefault();
    if (validateInput()) {
      try {
        const sendData = {
          password: password,
          email: email
        };
  
        const response = await api.post('auth/login', sendData, {
          headers: {
            "Content-Type": "application/json"
          }
        });
  
        if (response.status === 200) {
          localStorage.setItem("Email", email);
          navigate.push("/feed");
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 401 && error.response.data['message'] === "User account not confirmed") {
            const requestOtpServiceRequestModel = { email: email };
            const requestOtpResponse = await api.post('auth/request_confirm_code', requestOtpServiceRequestModel, {
              headers: {
                "Content-Type": "application/json"
              }
            });
            if (requestOtpResponse.status === 200) {
              navigate.push({pathname: "/otpinput", state:{email: email}});
            }
          } else {
            setDbErrors("Something went wrong: " + error.response.data['message']); // Display specific backend error message if available
          }
        } else {
          // This handles cases where the error response is not received from the backend
          setDbErrors("Something went wrong. Please try again later.");
        }
      }
    }
  };
  

  return (
    <React.Fragment>
      <section id="w3hubs">
        <div className="container ex">
          <h1>
            <img className="login-logo" src="socials-logo-2.png" alt="Login Logo" />
          </h1>
          <form onSubmit={submitLogin}>
            <div className="form-group">
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
              {errors.email && <div className="error">{errors.email}</div>}
            </div>
            <div className="form-group">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
              {errors.password && <div className="error">{errors.password}</div>}
            </div>
            <button type="submit" className="btn instagradient logbtn">Log In</button>
            {dbErrors && <div className="db-error">{dbErrors}</div>}
          </form>
          <h4>OR</h4>
          <div className="box">
            <p className="no-pad">Don't have an account? <a href="/signup">Sign up</a></p>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
};

export default Login;