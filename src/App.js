import React from 'react';
import { BrowserRouter } from "react-router-dom";
import Main from "./components/Main";

let lgt =  function(){
  window.localStorage.clear();
  window.location.href= "./login";
}

function App() {
  return (
      
          <div>
            <Main />
          </div>
       
  );
}

export default App;
