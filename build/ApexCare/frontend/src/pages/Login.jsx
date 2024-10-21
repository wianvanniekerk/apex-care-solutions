import React, {useState} from "react";
import logo from "../assets/1 1.png";
import "../styles.css";

export const LoginPage = () => {
    const [isLoading, setIsLoading] = useState(false);

    const Verify = () =>{
        setIsLoading(true);
        setTimeout(() => {
            window.location.href = "home";
        }, 2000);
    }


  return (
    <div className="login-page">
      <div className="div">
        <img className="element" alt="Element" src={logo} />
        <div className="text-wrapper-2">Username</div>
        <div className="input-field">
          <div className="input">
            <div className="text-wrapper">Value</div>
          </div>
        </div>
        <div className="text-wrapper-3">Password</div>
        <div className="input-field">
          <div className="input">
            <div className="text-wrapper">Value</div>
          </div>
        </div>
        <button type="submit" id="loginButton" onClick={Verify} className={isLoading ? "load": ""}>
            {isLoading ? "Completed" : "Verify"}
          </button>
      </div>
    </div>
  );
};