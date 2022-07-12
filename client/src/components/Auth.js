import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Auth({ setToken }) {
  const [loginEmail, setLoginEmail] = useState();
  const [loginPassword, setLoginPassword] = useState();
  const [signupEmail, setSignupEmail] = useState();
  const [signupPassword, setSignupPassword] = useState();
  const [username, setUsername] = useState();
  const [error, setError] = useState();
  const { login, signup } = useContext(AuthContext);

  function handleLogin(event) {
    event.preventDefault();
    setError("");
    login(loginEmail, loginPassword)
      .then((response) => {})
      .catch((error) => {
        setError(error.response.data);
        console.log(error);
      });
  }

  function handleSignup(event) {
    event.preventDefault();
    setError("");
    signup(username, signupEmail, signupPassword)
      .then((response) => {})
      .catch((error) => {
        setError(error.response.data);
        console.log(error);
      });
  }

  return (
    <div className="flex flex-col text-center h-full">
      <p className="text-red-600">{error}</p>
      <div className="m-5">
        <h1 className="font-bold text-3xl">Login</h1>
        <form>
          <label>
            <p>Email</p>
            <input
              className="border-2 border-black"
              type="text"
              onChange={(e) => setLoginEmail(e.target.value)}
            />
          </label>
          <label>
            <p>Password</p>
            <input
              className="border-2 border-black"
              type="password"
              onChange={(e) => setLoginPassword(e.target.value)}
            />
          </label>
          <div>
            <button
              className="bg-slate-200 mt-5 py-1 px-2 rounded-xl"
              onClick={handleLogin}
            >
              Login
            </button>
          </div>
        </form>
      </div>
      <div className="m-5">
        <h1 className="font-bold text-3xl">Sign Up</h1>
        <form>
          <label>
            <p>Email</p>
            <input
              className="border-2 border-black"
              type="text"
              onChange={(e) => setSignupEmail(e.target.value)}
            />
          </label>
          <label>
            <p>Username</p>
            <input
              className="border-2 border-black"
              type="text"
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <label>
            <p>Password</p>
            <input
              className="border-2 border-black"
              type="password"
              onChange={(e) => setSignupPassword(e.target.value)}
            />
          </label>
          <div>
            <button
              className="bg-slate-200 mt-5 py-1 px-2 rounded-xl"
              onClick={handleSignup}
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
