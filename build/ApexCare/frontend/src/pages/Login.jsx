import React, {useState, useEffect} from "react";
import logo from "../assets/1 1.png";
import axios from 'axios';
import "../styles.css";

export const LoginPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
      setUsername('');
      setPassword('');
    }, []);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);

      try{
        const response = await axios.post('http://localhost:8081/login', {username, password});
        setMessage(response.data.message);
        setTimeout(() => {
          window.location.href = "home";
      }, 2000);
      setTimeout(() => {
        setIsLoading(false);
        setUsername('');
      setPassword('');
    }, 2000);
      
      }catch(error){
        setMessage(error.response.data.error);
        setIsLoading(false);
        setUsername('');
        setPassword('');
      }
    };


  return (
    <div className="login-page">
      <form onSubmit={handleSubmit}>
        <img className="element" alt="Element" src={logo} />
        <div>
          <label>Username:</label>
          <input className="input-field" type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label>Password:</label>
          <input className="input-field" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit" id="loginButton" className={isLoading ? "load": ""}>
            {isLoading ? "Completed" : "Verify"}
          </button>
      </form>
      {message && <p>{message}</p>}
     
    </div>
  );
};