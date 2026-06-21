import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const res = await login(email, password);

    if (!res.success) {
      setError(res.message || "Login gagal");
      return;
    }

    navigate("/scan");
  };

  return (
    <div className="auth-page">

      {/* ================= LEFT SIDE ================= */}
      <div className="auth-left">
        <div className="auth-left__content">

          <div className="auth-badge">
            RETURN UKHTI
          </div>

          <h1 className="auth-heading">
            Kelola Retur Marketplace
            <br />
            Lebih Mudah
          </h1>

          <p className="auth-description">
            Sistem pencatatan, monitoring,
            dan pencocokan resi retur
            untuk seller marketplace,
            admin toko, dan gudang.
          </p>

          <div className="auth-features">

            <div className="auth-feature">
              📷 Scan Resi Cepat
            </div>

            <div className="auth-feature">
              🏪 Multi Marketplace
            </div>

            <div className="auth-feature">
              📊 Dashboard Modern
            </div>

            <div className="auth-feature">
              🔄 Matching Otomatis
            </div>

          </div>

        </div>
      </div>

      {/* ================= RIGHT SIDE ================= */}
      <div className="auth-right">

        <div className="auth-card">

          <div className="auth-logo">
            📦
          </div>

          <h2 className="auth-title">
            Masuk ke ReturnUkhti
          </h2>

          <p className="auth-subtitle">
            Selamat datang kembali.
          </p>

          {error && (
            <div className="alert alert--error">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="form"
          >

            <label className="form__label">
              Email

              <input
                type="email"
                className="form__input"
                placeholder="Masukkan email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);

                  if (error) {
                    setError("");
                  }
                }}
                required
              />
            </label>

            <label className="form__label">
              Password

              <input
                type="password"
                className="form__input"
                placeholder="Masukkan password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);

                  if (error) {
                    setError("");
                  }
                }}
                required
              />
            </label>

            <button
              type="submit"
              className="btn btn--primary auth-submit"
              disabled={
                loading ||
                !email.trim() ||
                !password.trim()
              }
            >
              {loading
                ? "Memproses..."
                : "Masuk"}
            </button>

          </form>

          <div className="auth-footer">
            Belum punya akun?

            <Link to="/register">
              Daftar sekarang
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Login;