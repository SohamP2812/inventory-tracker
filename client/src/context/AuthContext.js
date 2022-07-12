import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState();

  useEffect(() => {
    setToken(getToken());
  }, []);

  function getToken() {
    const tokenString = localStorage.getItem("token");
    const userToken = JSON.parse(tokenString);
    axios.defaults.headers.common["x-access-token"] = userToken;
    return userToken;
  }

  function saveToken(userToken) {
    localStorage.setItem("token", JSON.stringify(userToken));
    setToken(userToken);
  }

  function login(email, password) {
    return axios
      .post("/api/users/login", {
        email: email,
        password: password,
      })
      .then((response) => {
        saveToken(response.data.user.token);
      });
  }

  function signup(username, email, password) {
    return axios
      .post("/api/users/register", {
        email: email,
        username: username,
        password: password,
      })
      .then((response) => {
        saveToken(response.data.user.token);
      });
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
