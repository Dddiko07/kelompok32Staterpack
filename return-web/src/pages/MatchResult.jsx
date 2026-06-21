import { useState } from "react";
import api from "../utils/api";
import * as XLSX from "xlsx"; // Pastikan sudah install: npm install xlsx

const MatchResult = () => {
  const [marketplace, setMarketplace] = useState("shopee");
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [matched, setMatched] = useState([]);
  const [unmatchedScan, setUnmatchedScan] = useState([]);
  const [unmatchedMarketplace, setUnmatchedMarketplace] = useState([]);

  const [alertMsg, setAlertMsg] = useState(null);
  const [alertType, setAlertType] = useState("success");

  const showAlert = (msg, type = "success") => {
    setAlertMsg(msg);
    setAlertType(type);
    setTimeout(() => setAlertMsg(null), 2500);
  };

  // 1. FUNGSI PROSES MATCHING
  const handleMatch = async () => {
    if (!window.confirm(`Jalankan proses matching untuk "${marketplace}"?`)) return;

    try {
      setLoading(true);
      const res = await api.post("/resi/match", { marketplace });

      setMatched(Array.isArray(res.data.matched) ? res.data.matched : []);
      setUnmatchedScan(Array.isArray(res.data.unmatched_scan) ? res.data.unmatched_scan : []);
      setUnmatchedMarketplace(Array.isArray(res.data.unmatched_marketplace) ? res.data.unmatched_marketplace : []);

      showAlert(`Matching selesai! Found: ${res.data.matched_count || 0}`, "success");
    } catch (err) {
      console.error(err);
      showAlert(err?.response?.data?.message || "Gagal melakukan matching", "error");
    } finally {
      setLoading(false);
    }
  };

  // 2. FUNGSI SIMPAN KE DATABASE (SINKRONISASI STATUS)
  const handleSaveToDb = async () => {
    if (matched.length === 0) {
      showAlert("Tidak ada data matched untuk disimpan", "error");
      return;
    }

    if (!window.confirm(`Simpan permanen ${matched.length} data matched ke database?`)) return;

    try {
      setIsSaving(true);
      await api.post("/resi/save-match", { 
        marketplace,
        data: matched 
      });

      showAlert("Data berhasil disinkronkan ke database!", "success");
    } catch (err) {
      console.error(err);
      showAlert("Gagal menyimpan data", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // 3. FUNGSI EXPORT EXCEL
  const handleExportExcel = () => {
    if (matched.length === 0 && unmatchedScan.length === 0 && unmatchedMarketplace.length === 0) {
      showAlert("Tidak ada data untuk diexport", "error");
      return;
    }

    const wb = XLSX.utils.book_new();

    // Sheet 1: Matched
    const wsMatched = XLSX.utils.json_to_sheet(matched);
    XLSX.utils.book_append_sheet(wb, wsMatched, "Matched");

    // Sheet 2: Unmatched Scan
    const wsUnScan = XLSX.utils.json_to_sheet(unmatchedScan);
    XLSX.utils.book_append_sheet(wb, wsUnScan, "Unmatched Scan");

    // Sheet 3: Unmatched Marketplace
    const wsUnMarket = XLSX.utils.json_to_sheet(unmatchedMarketplace);
    XLSX.utils.book_append_sheet(wb, wsUnMarket, "Unmatched Marketplace");

    XLSX.writeFile(wb, `Matching_Report_${marketplace}_${new Date().getTime()}.xlsx`);
    showAlert("Berhasil export ke Excel");
  };

  const handleCopyUnmatchedMarketplace = async () => {
    if (!unmatchedMarketplace.length) return;
    try {
      const text = unmatchedMarketplace.map((x) => x.nomor_resi).join("\n");
      await navigator.clipboard.writeText(text);
      showAlert("Resi unmatched berhasil dicopy");
    } catch (err) {
      showAlert("Gagal copy ke clipboard", "error");
    }
  };

  return (
    <div className="page">
      {alertMsg && (
        <div className={`alert ${alertType === "error" ? "alert--error" : "alert--success"}`}>
          {alertMsg}
        </div>
      )}

      <div className="page-header">
        <h1 className="page__title">Hasil Matching Sistem</h1>
      </div>

      {/* PANEL AKSI */}
      <div className="card card--shadow" style={{ marginBottom: 24 }}>
        <div className="filter-grid" style={{ marginBottom: 16 }}>
          <select
            className="form__input"
            value={marketplace}
            onChange={(e) => setMarketplace(e.target.value)}
            disabled={loading || isSaving}
          >
            <option value="shopee">Shopee</option>
            <option value="tokopedia">Tokopedia</option>
            <option value="lazada">Lazada</option>
            <option value="tiktok">TikTok</option>
          </select>

          <button className="btn btn--primary" onClick={handleMatch} disabled={loading || isSaving}>
            {loading ? "🔄 Memproses..." : "1. Jalankan Matching"}
          </button>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button 
            className="btn btn--success" 
            onClick={handleSaveToDb}
            disabled={loading || isSaving || matched.length === 0}
          >
            {isSaving ? "💾 Menyimpan..." : "2. Simpan ke DB"}
          </button>

          <button 
            className="btn btn--outline" 
            onClick={handleExportExcel}
            disabled={loading || (matched.length === 0 && unmatchedScan.length === 0)}
          >
            📥 Export Excel
          </button>

          <button
            className="btn btn--outline"
            onClick={handleCopyUnmatchedMarketplace}
            disabled={loading || unmatchedMarketplace.length === 0}
          >
            📋 Copy Unmatched
          </button>
        </div>
      </div>

      {/* TABEL MATCHED */}
      <div className="card card--shadow card--spaced">
        <h2 style={{ marginTop: 0 }}>
          ✅ Matched <span className="badge badge--success">{matched.length}</span>
        </h2>
        {matched.length === 0 ? (
          <p className="text-muted">Klik "Jalankan Matching" untuk melihat hasil.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>No</th>
                <th>Nomor Resi</th>
                <th>Barang</th>
                <th>Toko</th>
                <th>Marketplace</th>
              </tr>
            </thead>
            <tbody>
              {matched.map((r, i) => (
                <tr key={`matched-${r.nomor_resi}-${i}`}>
                  <td>{i + 1}</td>
                  <td style={{ fontWeight: 700 }}>{r.nomor_resi}</td>
                  <td>{r.nama_barang || "-"}</td>
                  <td>{r.nama_toko || "-"}</td>
                  <td><span className="badge badge--primary">{r.marketplace}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* TABEL UNMATCHED SCAN */}
      <div className="card card--shadow card--spaced">
        <h2 style={{ marginTop: 0 }}>
          ⚠️ Unmatched Scan <span className="badge badge--warning">{unmatchedScan.length}</span>
        </h2>
        {unmatchedScan.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>No</th>
                <th>Nomor Resi</th>
                <th>Kurir</th>
              </tr>
            </thead>
            <tbody>
              {unmatchedScan.map((r, i) => (
                <tr key={`un-scan-${r.nomor_resi}-${i}`}>
                  <td>{i + 1}</td>
                  <td style={{ fontWeight: 700 }}>{r.nomor_resi}</td>
                  <td>{r.jasa_kirim || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p className="text-muted">Semua data scan sinkron.</p>}
      </div>

      {/* TABEL UNMATCHED MARKETPLACE */}
      <div className="card card--shadow card--spaced">
        <h2 style={{ marginTop: 0 }}>
          ⚠️ Unmatched Marketplace <span className="badge badge--warning">{unmatchedMarketplace.length}</span>
        </h2>
        {unmatchedMarketplace.length > 0 ? (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nomor Resi</th>
                  <th>Barang</th>
                  <th>Toko</th>
                </tr>
              </thead>
              <tbody>
                {unmatchedMarketplace.map((r, i) => (
                  <tr key={`un-market-${r.nomor_resi}-${i}`}>
                    <td>{i + 1}</td>
                    <td style={{ fontWeight: 700 }}>{r.nomor_resi}</td>
                    <td>{r.nama_barang || "-"}</td>
                    <td>{r.nama_toko || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ marginTop: 12, fontSize: "0.9rem", color: "#666" }}>
              * Data di atas adalah pesanan yang belum discan di gudang.
            </p>
          </>
        ) : <p className="text-muted">Semua data marketplace sudah ter-scan.</p>}
      </div>
    </div>
  );
};

export default MatchResult;