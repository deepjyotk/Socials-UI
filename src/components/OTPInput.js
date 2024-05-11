import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/axialConfig' ;
import {  useLocation } from 'react-router-dom';



function OTPInput() {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [timer, setTimer] = useState(60);
  const history = useNavigate();
  const location = useLocation();
  const email = location.state?.email; 

  useEffect(() => {
    let interval = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer > 1) return prevTimer - 1;
        clearInterval(interval);
        setButtonDisabled(false);
        return 0;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Auto-focus to next input field if there's another input to move to
    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (otp.includes("")) {
      alert("Please fill all the fields");
      return;
    }

    try {
      const confirmationOtpModel  = {
        email: email,
        confirmation_code : otp.join("")
      }
      const response = await api.post("auth/confirm",confirmationOtpModel);

      if (response.status === 200) {
        // Assuming 'push' is the path you want to navigate to after successful OTP
        history.replace("/feed");
      }
    } catch (error) {
      alert("Failed to verify OTP. Please try again.");
      console.error("Error:", error.response ? error.response.data : error);
    }
  };

  const resendOTP = () => {
    setButtonDisabled(true);
    setTimer(60);
    let interval = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer > 1) return prevTimer - 1;
        clearInterval(interval);
        setButtonDisabled(false);
        return 0;
      });
    }, 1000);
    // Here, you might want to implement actual OTP resend functionality
  };

  return (
    <form onSubmit={handleSubmit}>
      <p>Enter the OTP sent to your number:</p>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {otp.map((data, index) => (
          <input
            key={index}
            type="text"
            name="otp"
            maxLength="1"
            value={data}
            onChange={e => handleChange(e.target, index)}
            onFocus={e => e.target.select()}
            style={{ width: "45px", marginRight: "12px", textAlign: "center" }}
          />
        ))}
      </div>
      <div style={{ marginTop: "20px" }}>
        <button type="submit">Submit OTP</button>
        <button type="button" onClick={resendOTP} disabled={buttonDisabled} style={{ marginLeft: "20px" }}>
          Resend OTP ({timer})
        </button>
      </div>
    </form>
  );
}

export default OTPInput;