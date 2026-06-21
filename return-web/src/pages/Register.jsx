import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { register, loading } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await register(name, email, password);

    if (!res.success) {
      setError(res.message);
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-card">
        <h1 className="auth-title">Daftar Akun</h1>
        <p className="auth-subtitle">
          Buat akun untuk mulai mengelola resi retur.
        </p>

        {error && <div className="alert alert--error">{error}</div>}

        <form onSubmit={handleSubmit} className="form">
          <label className="form__label">
            Nama
            <input
              type="text"
              className="form__input"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError("");
              }}
              required
            />
          </label>

          <label className="form__label">
            Email
            <input
              type="email"
              className="form__input"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              required
            />
          </label>

          <label className="form__label">
            Password
            <input
              type="password"
              className="form__input"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
              required
            />
          </label>

          <button
            type="submit"
            className="btn btn--primary form__submit"
            disabled={loading || !name || !email || !password}
          >
            {loading ? "Memproses..." : "Daftar"}
          </button>
        </form>

        <p className="auth-footer">
          Sudah punya akun? <Link to="/login">Masuk</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
