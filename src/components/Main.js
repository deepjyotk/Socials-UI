import React, { Component } from "react";
import Signup from "./Signup";
import Login from "./Login";
import Profile from "./Profile";
import Feed from "./Feed";
import OTPInput from "./OTPInput";

import { BrowserRouter, Routes, Route } from "react-router-dom";



class Main extends Component {
  render() {
      return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/otpinput" element={<OTPInput />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/feed" element={<Feed />} />
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </BrowserRouter>
    );
   
  }
}

export default Main;
