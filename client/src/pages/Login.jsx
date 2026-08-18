import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";
import "../components/Button.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { login, register } = useAuth();
  const navigate = useNavigate();

  async function handleLogin() {
    const result = await login(email, password);
    if (result.success) {
      navigate("/");
    } else {
      setMessage(result.error);
    }
  }

  async function handleRegister() {
    const result = await register(email, password);
    if (result.success) {
      setMessage("Registered! Now log in.");
    } else {
      setMessage(result.error);
    }
  }

  return (
	
	<div className="auth-page">
		<h1>Login / Register</h1>
			<input
				type="email"
				placeholder="Email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
			/>
			<input
				type="password"
				placeholder="Password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
			/>
		<button className="btn-ember" onClick={handleLogin}>Log In</button>
		<button className="btn-ember" onClick={handleRegister}>Register</button>
		{message && <p className="auth-message">{message}</p>}
	</div>
	
  );
}

export default Login;