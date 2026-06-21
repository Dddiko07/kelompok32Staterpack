import { useEffect, useState } from "react";
import api from "../utils/api";

const todayStr = new Date().toLocaleDateString("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const Home = () => {
  const [marketplace, setMarketplace] = useState("shopee");

  const [stats, setStats] = useState({
    scan_total: 0,
    scan_matched: 0,
    scan_unmatched: 0,
    marketplace_total: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStats = async () => {
    try {
      setLoading(true);

      const scanRes = await api.get("/resi/scan");
      const scanList = Array.isArray(scanRes.data) ? scanRes.data : [];

      const mpRes = await api.get("/resi/marketplace", {
        params: { mp: marketplace },
      });

      const mpList = Array.isArray(mpRes.data) ? mpRes.data : [];

      setStats({
        scan_total: scanList.length,
        scan_matched: scanList.filter(
          (x) => x.status === "matched"
        ).length,
        scan_unmatched: scanList.filter(
          (x) => x.status === "unmatched"
        ).length,
        marketplace_total: mpList.length,
      });
    } catch (err) {
      setError("Gagal memuat dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, [marketplace]);

  return (
    <div className="page">
      {/* HERO */}
      <div className="dashboard-hero">
        <div>
          <div className="dashboard-badge">
            RETURN UKHTI DASHBOARD
          </div>

          <h1 className="dashboard-title">
            Kelola Retur Marketplace
            <br />
            Lebih Cepat & Akurat
          </h1>

          <p className="dashboard-subtitle">
            Pantau seluruh aktivitas scan,
            marketplace, dan hasil matching
            dalam satu dashboard modern.
          </p>
        </div>

        <div className="dashboard-marketplace">
          <label>Pilih Marketplace</label>

          <select
            className="form__input"
            value={marketplace}
            onChange={(e) => setMarketplace(e.target.value)}
          >
            <option value="shopee">Shopee</option>
            <option value="tokopedia">Tokopedia</option>
            <option value="lazada">Lazada</option>
            <option value="tiktok">TikTok Shop</option>
          </select>
        </div>
      </div>

      {/* INFO */}
      <div className="dashboard-date">
        📅 Data diperbarui • {todayStr}
      </div>

      {error && (
        <div className="alert alert--error">
          {error}
        </div>
      )}

      {loading ? (
        <div className="card">
          Memuat data dashboard...
        </div>
      ) : (
        <>
          {/* STATISTIK */}
          <div className="dashboard-stats">

            <div className="dashboard-card dashboard-card--blue">
              <div className="dashboard-icon">📦</div>

              <div>
                <div className="dashboard-label">
                  Total Scan
                </div>

                <div className="dashboard-value">
                  {stats.scan_total}
                </div>
              </div>
            </div>

            <div className="dashboard-card dashboard-card--green">
              <div className="dashboard-icon">✅</div>

              <div>
                <div className="dashboard-label">
                  Matched
                </div>

                <div className="dashboard-value">
                  {stats.scan_matched}
                </div>
              </div>
            </div>

            <div className="dashboard-card dashboard-card--orange">
              <div className="dashboard-icon">⏳</div>

              <div>
                <div className="dashboard-label">
                  Unmatched
                </div>

                <div className="dashboard-value">
                  {stats.scan_unmatched}
                </div>
              </div>
            </div>

            <div className="dashboard-card dashboard-card--purple">
              <div className="dashboard-icon">🏪</div>

              <div>
                <div className="dashboard-label">
                  Marketplace
                </div>

                <div className="dashboard-value">
                  {stats.marketplace_total}
                </div>
              </div>
            </div>

          </div>

          {/* QUICK ACTION */}
          <div className="dashboard-section">
            <h2>Aktivitas Sistem</h2>

            <div className="dashboard-activity">
              <div>
                📷 Scan Resi Aktif
              </div>

              <div>
                🛒 Marketplace {marketplace}
              </div>

              <div>
                🧩 Matching Siap Digunakan
              </div>

              <div>
                ⚡ Sistem Berjalan Normal
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;