import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();
const API = process.env.REACT_APP_API_URL;

export const AuthProvider = ({ children }) => {
  const token = localStorage.getItem("auth_token");
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!token) return;

    axios
      .get(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
