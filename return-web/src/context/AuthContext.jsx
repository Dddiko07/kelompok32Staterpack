import { createContext, useContext, useEffect, useState } from "react";
import api from "../utils/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  // =====================
  // LOAD TOKEN & USER SAAT REFRESH
  // =====================
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken) {
      setToken(savedToken);
    }

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, []);

  // =====================
  // LOGIN
  // =====================
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setToken(token);
      setUser(user);

      return { success: true };
    } catch (err) {
      console.error("LOGIN ERR", err.response?.data || err.message);
      return {
        success: false,
        message:
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Login gagal",
      };
    } finally {
      setLoading(false);
    }
  };

  // =====================
  // REGISTER
  // =====================
  const register = async (name, email, password) => {
    setLoading(true);
    try {
      await api.post("/auth/register", { name, email, password });
      return { success: true };
    } catch (err) {
      console.error("REGISTER ERR", err.response?.data || err.message);
      return {
        success: false,
        message:
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Registrasi gagal",
      };
    } finally {
      setLoading(false);
    }
  };

  // =====================
  // LOGOUT
  // =====================
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const isAuth = !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuth,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
