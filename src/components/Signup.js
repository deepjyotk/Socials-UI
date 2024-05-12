import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [dbErrors, setDbErrors] = useState("");

  const navigate = useNavigate();

  const validateInput = () => {
    const { firstname, lastname, email, password } = formData;
    let newErrors = {};
    let formIsValid = true;

    if (!firstname || firstname.length < 3) {
      formIsValid = false;
      newErrors["firstname"] = "First name must be at least 3 characters.";
    }

    if (!lastname || lastname.length < 3) {
      formIsValid = false;
      newErrors["lastname"] = "Last name must be at least 3 characters.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      formIsValid = false;
      newErrors["email"] = "Email is not valid.";
    }

    const passwordRegex = /^[a-zA-Z\d]{6,}$/;
    if (!password || password.length < 6) {
      formIsValid = false;
      newErrors["password"] = "Password must be at least 6 characters, include an uppercase letter, a lowercase letter, and a number.";
    }

    setErrors(newErrors);
    return formIsValid;
  }

  const submitSignup = async (e) => {
    e.preventDefault();
    if (validateInput()) {
      const fullName = `${formData.firstname.trim()} ${formData.lastname.trim()}`;
      const sendData = {
        name: fullName,
        password: formData.password,
        email: formData.email
      };

      try {
        const response = await axios.post('https://vvkqufgiv7.execute-api.us-east-1.amazonaws.com/dev/auth/register', sendData, {
          headers: {
            "Content-Type": "application/json"
          }
        });

        console.log(response.data);
        const dataToPass = {
          email: formData.email
        }
        navigate( "/otpinput", {state: {...dataToPass} });
      } catch (error) {
        if (error.response && error.response.status === 409) {
          setDbErrors('User already exists.');
        } else {
          setDbErrors('An error occurred. Please try again.');
        }
        console.error('Error:', error.response ? error.response.data : error);
      }
    }
  }

  return (
    <div className="home">
      <section id="signup-form">
        <div className="container">
          <h1>
            <img className="login-logo" src="socials-logo-2.png" alt="Socials Logo" />
          </h1>
          <form onSubmit={submitSignup}>
            <div className="form-group">
              <input
                type="text"
                name="firstname"
                autoFocus
                className="form-control"
                placeholder="First Name"
                onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                value={formData.firstname}
              />
              {errors.firstname && <div className="error">{errors.firstname}</div>}
            </div>
            <div className="form-group">
              <input
                type="text"
                name="lastname"
                className="form-control"
                placeholder="Last Name"
                onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                value={formData.lastname}
              />
              {errors.lastname && <div className="error">{errors.lastname}</div>}
            </div>
            <div className="form-group">
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Email Address"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                value={formData.email}
              />
              {errors.email && <div className="error">{errors.email}</div>}
            </div>
            <div className="form-group">
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Password"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                value={formData.password}
              />
              {errors.password && <div className="error">{errors.password}</div>}
            </div>
            <button type="submit" className="btn instagradient logbtn">Sign Up</button>
            {dbErrors && <div className="db-error">{dbErrors}</div>}
          </form>
          <div className="box">
            <p>Already have an account? <a href="/login">Log In</a></p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Signup;
