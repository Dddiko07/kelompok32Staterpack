import React from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="main--full" style={{ overflowX: "hidden" }}>

      {/* NAVBAR */}
      <nav className="landing-navbar">
        <div className="sidebar__brand">
          <div className="sidebar__logo" style={{ background: "linear-gradient(135deg, #00d2ff, #0066ff)" }}>📦</div>
          <span style={{ fontWeight: 800, letterSpacing: "-0.03em" }}>Rekap Resi</span>
        </div>

        <div className="landing-nav__links">
          <a href="#fitur" className="landing-nav__link">Fitur</a>
          <a href="#cara-kerja" className="landing-nav__link">Cara Kerja</a>
          <a href="#marketplace" className="landing-nav__link">Marketplace</a>
          <a href="#testimoni" className="landing-nav__link">Testimoni</a>
        </div>

        <div className="filter-actions">
          <button
            className="btn btn--ghost"
            onClick={() => navigate("/login")}
            style={{ border: "none", color: "var(--text-main)" }}
          >
            Masuk
          </button>

          <button
            className="btn btn--primary"
            onClick={() => navigate("/register")}
          >
            Mulai Gratis →
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="landing-hero">
        <div>
          <div className="landing-hero__badge" style={{ background: "rgba(0, 102, 255, 0.15)", color: "#00d2ff" }}>
            PLATFORM LOGISTIK RETURN #1 UNTUK UMKM
          </div>

          <h1 className="landing-hero__title">
            Kelola Resi Return
            <br />
            <span>Lebih Cepat</span>
            <br />
            & Lebih Akurat
          </h1>

          <p className="landing-hero__subtitle">
          Tidak perlu lagi mencatat retur secara manual.
          Rekap Resi membantu Anda mengelola seluruh proses pengembalian barang, 
          mulai dari pencatatan resi hingga verifikasi data, dalam satu tempat yang mudah digunakan.
          </p>

          {/* LIST CHECKLIST HIJAU */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "var(--text-muted)" }}>
              <span style={{ color: "#00e676", fontWeight: "bold" }}>✔</span> Gratis selamanya untuk paket dasar
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "var(--text-muted)" }}>
              <span style={{ color: "#00e676", fontWeight: "bold" }}>✔</span> Setup kurang dari 5 menit
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "var(--text-muted)" }}>
              <span style={{ color: "#00e676", fontWeight: "bold" }}>✔</span> Tidak perlu kartu kredit
            </div>
          </div>

          {/* HERO ACTIONS BUTTON */}
          <div className="filter-actions">
            <button
              className="btn btn--primary"
              style={{ padding: "12px 28px" }}
              onClick={() => navigate("/register")}
            >
              Mulai Gratis Sekarang →
            </button>

            <button
              className="btn btn--ghost"
              style={{ padding: "12px 24px", display: "inline-flex", alignItems: "center", gap: "8px" }}
              onClick={() => navigate("/login")}
            >
              <span>▶</span> Lihat Demo
            </button>
          </div>

          {/* MINI STATS HERO */}
          <div style={{ display: "flex", gap: "40px", marginTop: "48px", borderTop: "1px solid var(--border-soft)", paddingTop: "24px" }}>
            <div>
              <h4 style={{ fontSize: "24px", margin: "0 0 4px 0", fontWeight: "700" }}>50K+</h4>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>Resi diproses</p>
            </div>
            <div>
              <h4 style={{ fontSize: "24px", margin: "0 0 4px 0", fontWeight: "700" }}>500+</h4>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>Pengguna aktif</p>
            </div>
            <div>
              <h4 style={{ fontSize: "24px", margin: "0 0 4px 0", fontWeight: "700" }}>99.9%</h4>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>Uptime SLA</p>
            </div>
          </div>
        </div>

        {/* KANAN: LIVE PREVIEW FRAME (Dashboard Rekap Resi) */}
        <div className="card" style={{ padding: "24px", background: "rgba(17, 24, 54, 0.6)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: "600" }}>
              <span style={{ color: "#0066ff" }}>■</span> Dashboard Rekap Resi
            </div>
            <div style={{ display: "flex", gap: "6px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ef4444" }}></span>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#fbbf24" }}></span>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e" }}></span>
            </div>
          </div>

          {/* GRID STATS DI DALAM PREVIEW CARD */}
          <div className="cards-grid" style={{ marginBottom: "24px", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
            <div className="card" style={{ padding: "12px", textAlign: "center", background: "rgba(255,255,255,0.03)" }}>
              <h3 className="card__value" style={{ fontSize: "20px" }}>51</h3>
              <p className="card__label" style={{ margin: 0, fontSize: "11px" }}>Total Resi</p>
            </div>

            <div className="card" style={{ padding: "12px", textAlign: "center", background: "rgba(255,255,255,0.03)" }}>
              <h3 className="card__value" style={{ fontSize: "20px" }}>9</h3>
              <p className="card__label" style={{ margin: 0, fontSize: "11px" }}>Hari Ini</p>
            </div>

            <div className="card" style={{ padding: "12px", textAlign: "center", background: "rgba(255,255,255,0.03)" }}>
              <h3 className="card__value" style={{ fontSize: "20px" }}>94%</h3>
              <p className="card__label" style={{ margin: 0, fontSize: "11px" }}>Match Rate</p>
            </div>
          </div>

          {/* PREVIEW RESI TERBARU LIST */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "8px", fontWeight: "600" }}>RESI TERBARU</div>
            
            <div className="dashboard-row" style={{ padding: "10px 4px" }}>
              <span style={{ fontFamily: "monospace", fontSize: "13px" }}>240130X8N2RNS00121</span>
              <span className="dashboard-row__status dashboard-row__status--matched" style={{ background: "rgba(74, 222, 128, 0.1)", padding: "2px 8px", borderRadius: "4px", fontSize: "11px" }}>Diterima</span>
            </div>

            <div className="dashboard-row" style={{ padding: "10px 4px" }}>
              <span style={{ fontFamily: "monospace", fontSize: "13px" }}>JP3235520211002212</span>
              <span className="dashboard-row__status dashboard-row__status--pending" style={{ background: "rgba(251, 191, 36, 0.1)", padding: "2px 8px", borderRadius: "4px", fontSize: "11px" }}>Dalam Proses</span>
            </div>

            <div className="dashboard-row" style={{ padding: "10px 4px" }}>
              <span style={{ fontFamily: "monospace", fontSize: "13px" }}>SPXID03881002A</span>
              <span className="dashboard-row__status dashboard-row__status--unmatched" style={{ background: "rgba(248, 113, 113, 0.1)", padding: "2px 8px", borderRadius: "4px", fontSize: "11px" }}>Menunggu</span>
            </div>

            <div className="dashboard-row" style={{ padding: "10px 4px", border: "none" }}>
              <span style={{ fontFamily: "monospace", fontSize: "13px" }}>ANTM0182810055</span>
              <span style={{ color: "#a5b4fc", background: "rgba(165, 180, 252, 0.1)", padding: "2px 8px", borderRadius: "4px", fontSize: "11px" }}>Selesai</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="page" id="fitur" style={{ marginTop: '80px', alignItems: 'center' }}>
        <h2 className="page__title" style={{ fontSize: '32px' }}>Fitur Utama</h2>
        <p className="page__subtitle" style={{ marginBottom: "20px" }}>Semua alat yang Anda butuhkan untuk memproses retur ekosistem toko online.</p>

        <div className="cards-grid" style={{ width: '100%', marginTop: '20px' }}>
          <div className="card" style={{ textAlign: 'center', padding: '36px 20px' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>📷</div>
            <h3 className="page__title" style={{ fontSize: '20px' }}>Scan Resi</h3>
            <p className="page__subtitle">Input data resi kembali jauh lebih cepat lewat kamera atau barcode scanner.</p>
          </div>

          <div className="card" style={{ textAlign: 'center', padding: '36px 20px' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>🏪</div>
            <h3 className="page__title" style={{ fontSize: '20px' }}>Marketplace</h3>
            <p className="page__subtitle">Kelola integrasi multi-akun data marketplace terpusat dalam satu sistem.</p>
          </div>

          <div className="card" style={{ textAlign: 'center', padding: '36px 20px' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>🔄</div>
            <h3 className="page__title" style={{ fontSize: '20px' }}>Matching</h3>
            <p className="page__subtitle">Pencocokan data otomatis mendeteksi manipulasi atau kecocokan klaim resi.</p>
          </div>

          <div className="card" style={{ textAlign: 'center', padding: '36px 20px' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>📊</div>
            <h3 className="page__title" style={{ fontSize: '20px' }}>Monitoring</h3>
            <p className="page__subtitle">Pantau seluruh siklus proses retur barang dari status komplain hingga selesai.</p>
          </div>
        </div>
      </section>

      {/* CARA KERJA */}
      <section
        className="page"
        id="cara-kerja"
        style={{ marginTop: "80px", alignItems: "center" }}
      >
        <h2 className="page__title" style={{ fontSize: "32px" }}>
          Cara Kerja
        </h2>
        <p
          className="page__subtitle"
          style={{ marginBottom: "30px" }}
        >
          Proses retur barang menjadi lebih mudah, cepat, dan terorganisir.
        </p>

        <div className="cards-grid" style={{ width: "100%" }}>
          <div className="card" style={{ textAlign: "center", padding: "30px" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📦</div>
            <h3>Terima Barang Return</h3>
            <p className="page__subtitle">
              Barang yang dikembalikan pelanggan diterima oleh tim gudang.
            </p>
          </div>

          <div className="card" style={{ textAlign: "center", padding: "30px" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📷</div>
            <h3>Scan Nomor Resi</h3>
            <p className="page__subtitle">
              Scan barcode atau QR code untuk memasukkan data secara otomatis.
            </p>
          </div>

          <div className="card" style={{ textAlign: "center", padding: "30px" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>✅</div>
            <h3>Verifikasi Data</h3>
            <p className="page__subtitle">
              Cocokkan data retur dengan marketplace dan pesanan.
            </p>
          </div>

          <div className="card" style={{ textAlign: "center", padding: "30px" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📊</div>
            <h3>Rekap Otomatis</h3>
            <p className="page__subtitle">
              Data tersimpan otomatis dan siap diekspor ke Excel.
            </p>
          </div>
        </div>
      </section>

      {/* MARKETPLACE */}
      <section
        className="page"
        id="marketplace"
        style={{ marginTop: "80px", alignItems: "center" }}
      >
        <h2 className="page__title" style={{ fontSize: "32px" }}>
          Marketplace yang Didukung
        </h2>
        <p
          className="page__subtitle"
          style={{ marginBottom: "30px" }}
        >
          Kelola retur dari berbagai marketplace dalam satu dashboard.
        </p>

        <div className="cards-grid" style={{ width: "100%" }}>
          <div className="card" style={{ textAlign: "center", padding: "40px" }}>
            <div style={{ fontSize: "56px", marginBottom: "16px" }}>🛒</div>
            <h3>Shopee</h3>
            <p className="page__subtitle">
              Sinkronisasi dan pencatatan retur dari Shopee.
            </p>
          </div>

          <div className="card" style={{ textAlign: "center", padding: "40px" }}>
            <div style={{ fontSize: "56px", marginBottom: "16px" }}>🎵</div>
            <h3>TikTok Shop</h3>
            <p className="page__subtitle">
              Monitoring retur dari TikTok Shop lebih mudah.
            </p>
          </div>

          <div className="card" style={{ textAlign: "center", padding: "40px" }}>
            <div style={{ fontSize: "56px", marginBottom: "16px" }}>🏬</div>
            <h3>Tokopedia</h3>
            <p className="page__subtitle">
              Kelola seluruh data retur Tokopedia secara terpusat.
            </p>
          </div>

          <div className="card" style={{ textAlign: "center", padding: "40px" }}>
            <div style={{ fontSize: "56px", marginBottom: "16px" }}>🚚</div>
            <h3>Lazada</h3>
            <p className="page__subtitle">
              Rekap data pengembalian Lazada dalam satu sistem.
            </p>
          </div>
        </div>
      </section>

      {/* TESTIMONI */}
      <section
        className="page"
        id="testimoni"
        style={{ marginTop: "80px", alignItems: "center" }}
      >
        <h2 className="page__title" style={{ fontSize: "32px" }}>
          Apa Kata Pengguna?
        </h2>
        <p
          className="page__subtitle"
          style={{ marginBottom: "30px" }}
        >
          Dipercaya oleh seller, admin toko, dan tim operasional.
        </p>

        <div className="cards-grid" style={{ width: "100%" }}>
          <div className="card" style={{ padding: "32px" }}>
            <div style={{ fontSize: "20px", marginBottom: "12px" }}>
              ⭐⭐⭐⭐⭐
            </div>
            <p className="page__subtitle">
              "Sebelumnya kami mencatat retur secara manual. Setelah memakai
              Rekap Resi, prosesnya jauh lebih cepat dan rapi."
            </p>
            <strong>Admin Toko Fashion</strong>
          </div>

          <div className="card" style={{ padding: "32px" }}>
            <div style={{ fontSize: "20px", marginBottom: "12px" }}>
              ⭐⭐⭐⭐⭐
            </div>
            <p className="page__subtitle">
              "Rekonsiliasi bulanan sekarang hanya butuh beberapa menit.
              Semua data sudah tersusun otomatis."
            </p>
            <strong>GM Operasional</strong>
          </div>

          <div className="card" style={{ padding: "32px" }}>
            <div style={{ fontSize: "20px", marginBottom: "12px" }}>
              ⭐⭐⭐⭐⭐
            </div>
            <p className="page__subtitle">
              "Fitur scan barcode sangat membantu gudang kami memproses
              ratusan retur setiap hari."
            </p>
            <strong>Supervisor Gudang</strong>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="page" style={{ alignItems: 'center', textAlign: 'center', padding: '100px 0' }}>
        <h2 className="page__title" style={{ fontSize: '36px', marginBottom: '16px' }}>Siap Mengelola Retur Lebih Mudah?</h2>
        <p className="page__subtitle" style={{ marginBottom: "32px", maxWidth: "500px" }}>Bergabunglah dengan ratusan seller lain yang telah menghemat waktu operasional retur hingga 80%.</p>
        <button
          className="btn btn--primary"
          style={{ padding: '14px 36px', fontSize: '16px', fontWeight: "600" }}
          onClick={() => navigate("/register")}
        >
          Daftar Sekarang
        </button>
      </section>

      {/* FOOTER */}
      <footer className="page__subtitle" style={{ textAlign: 'center', padding: '32px 0', borderTop: '1px solid var(--border-soft)' }}>
        © 2026 ReturnUkhti — Platform Logistik Return Terpercaya.
      </footer>
    </div>
  );
}