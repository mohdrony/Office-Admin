import "./login.scss";
import { useState } from "react";
import { NavLink } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    // TODO: call backend login endpoint later
    console.log({ email, password });
  };

  return (
    <div className="login">
      <div className="loginHeader">
        <div className="brand">urbanegestalt</div>
        <div className="subtitle">Sign in to continue</div>
      </div>

      <form className="loginForm" onSubmit={onSubmit}>
        <label className="field">
          <span className="label">Email</span>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            required
          />
        </label>

        <label className="field">
          <span className="label">Password</span>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </label>

        <button className="primaryBtn" type="submit">
          Sign in
        </button>

        <div className="metaRow">
          <label className="remember">
            <input type="checkbox" />
            <span>Remember me</span>
          </label>

          <NavLink to="#" className="link">
            Forgot password?
          </NavLink>
        </div>
      </form>

      <div className="loginFooter">
        <span className="hint">Admin access only (for now).</span>
      </div>
    </div>
  );
}
