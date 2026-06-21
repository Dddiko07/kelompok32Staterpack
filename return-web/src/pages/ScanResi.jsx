import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../utils/api";

const ScanResi = () => {
  const [resi, setResi] = useState([]);
  const [loading, setLoading] = useState(true);

  // input scan
  const [nomorResi, setNomorResi] = useState("");
  const [kurir, setKurir] = useState("");

  // filter
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("unmatched");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // import scan
  const [importing, setImporting] = useState(false);

  // multi delete
  const [selectedIds, setSelectedIds] = useState([]);
  const [deletingSelected, setDeletingSelected] = useState(false);

  // alert
  const [alertMsg, setAlertMsg] = useState(null);
  const [alertType, setAlertType] = useState("success");

  const showAlert = (msg, type = "success") => {
    setAlertMsg(msg);
    setAlertType(type);
    setTimeout(() => setAlertMsg(null), 2500);
  };

  // ===============================
  // FUNGSI BUNYI (BARU)
  // ===============================
  const playSound = (type) => {
    const audio = new Audio(type === "success" ? "/sound/success.mp3" : "/sound/error.mp3");
    audio.play().catch(() => {}); // Catch error jika browser memblokir autoplay
  };

  // ===============================
  // FETCH SCAN
  // ===============================
  const fetchScan = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const res = await api.get("/resi/scan", { params });
      setResi(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      showAlert("Gagal mengambil data scan", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchScan({ status: "unmatched" });
  }, [fetchScan]);

  // auto filter realtime
  useEffect(() => {
    const t = setTimeout(() => {
      const params = {};
      if (search) params.search = search;
      if (status) params.status = status;
      if (startDate && endDate) {
        params.start = startDate;
        params.end = endDate;
      }
      fetchScan(params);
    }, 350);
    return () => clearTimeout(t);
  }, [search, status, startDate, endDate, fetchScan]);

  // ===============================
  // GROUPING KURIR
  // ===============================
  const groupedByCourier = useMemo(() => {
    const groups = {};
    for (const r of resi) {
      const key = r.jasa_kirim || "TANPA KURIR";
      if (!groups[key]) groups[key] = [];
      groups[key].push(r);
    }
    return groups;
  }, [resi]);

  // ===============================
  // MULTI DELETE
  // ===============================
  const isChecked = (id) => selectedIds.includes(id);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAllInGroup = (items) => {
    const ids = items.map((x) => x.id);
    const allSelected = ids.every((id) => selectedIds.includes(id));

    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)));
    } else {
      setSelectedIds((prev) => {
        const set = new Set(prev);
        ids.forEach((id) => set.add(id));
        return Array.from(set);
      });
    }
  };

  const handleDeleteSelected = async () => {
    if (!selectedIds.length) {
      showAlert("Belum ada data yang dipilih", "error");
      return;
    }

    if (!window.confirm(`Hapus ${selectedIds.length} data scan yang dipilih?`)) return;

    try {
      setDeletingSelected(true);
      await api.post("/resi/delete-selected", { ids: selectedIds });
      setResi((prev) => prev.filter((r) => !selectedIds.includes(r.id)));
      setSelectedIds([]);
      showAlert("Data scan terpilih berhasil dihapus");
    } catch (err) {
      console.error(err);
      showAlert("Gagal menghapus data terpilih", "error");
    } finally {
      setDeletingSelected(false);
    }
  };

  // ===============================
  // TAMBAH SCAN (DENGAN BUNYI)
  // ===============================
  const handleAddScan = async (e) => {
    e.preventDefault();
    if (!nomorResi.trim()) {
      showAlert("Nomor resi wajib diisi", "error");
      playSound("error"); // Bunyi Gagal
      return;
    }

    try {
      await api.post("/resi/scan", {
        nomor_resi: nomorResi,
        jasa_kirim: kurir || null,
      });

      playSound("success"); // Bunyi Berhasil
      showAlert("Resi berhasil discan");
      setNomorResi("");
      fetchScan({ status });
    } catch (err) {
      console.error(err);
      playSound("error"); // Bunyi Gagal
      showAlert(err?.response?.data?.message || "Gagal scan resi", "error");
    }
  };

  // ===============================
  // IMPORT CSV SCAN (DENGAN BUNYI)
  // ===============================
  const handleImportScan = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".csv")) {
      playSound("error"); // Bunyi Gagal
      showAlert("File harus CSV", "error");
      e.target.value = "";
      return;
    }

    if (!window.confirm(`Import data scan dari "${file.name}" ?`)) {
      e.target.value = "";
      return;
    }

    try {
      setImporting(true);
      const formData = new FormData();
      formData.append("file", file);
      await api.post("/resi/import-scan", formData);

      playSound("success"); // Bunyi Berhasil
      showAlert("Import scan berhasil");
      fetchScan({ status });
    } catch (err) {
      console.error(err);
      playSound("error"); // Bunyi Gagal
      showAlert("Gagal import scan", "error");
    } finally {
      setImporting(false);
      e.target.value = "";
    }
  };

  // ===============================
  // DELETE SINGLE
  // ===============================
  const handleDeleteSingle = async (id, nomor) => {
    if (!window.confirm(`Hapus resi ${nomor}?`)) return;

    try {
      await api.delete(`/resi/${id}`);
      setResi((prev) => prev.filter((r) => r.id !== id));
      setSelectedIds((prev) => prev.filter((x) => x !== id));
      showAlert("Resi berhasil dihapus");
    } catch (err) {
      console.error(err);
      showAlert("Gagal menghapus resi", "error");
    }
  };

  // ... (Sisa kode return JSX tetap sama seperti sebelumnya)
  return (
    <div className="page">
      {alertMsg && (
        <div className={`alert ${alertType === "error" ? "alert--error" : "alert--success"}`}>
          {alertMsg}
        </div>
      )}

      <div className="page-header">
        <h1 className="page__title">Data Scan (Gudang)</h1>
        <span className="badge badge--primary">
          Total: <strong>{resi.length}</strong>
        </span>
      </div>

      {/* ================= ADD SCAN ================= */}
      <div className="card card--shadow" style={{ marginBottom: 16 }}>
        <h2 style={{ marginTop: 0 }}>📦 Scan Resi</h2>

        <form
          onSubmit={handleAddScan}
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr auto",
            gap: 10,
          }}
        >
          <input
            className="form__input"
            placeholder="Masukkan / scan nomor resi..."
            value={nomorResi}
            onChange={(e) => setNomorResi(e.target.value)}
            autoFocus // Opsional: Memudahkan penggunaan scanner
          />

          <input
            className="form__input"
            placeholder="Kurir (opsional)"
            value={kurir}
            onChange={(e) => setKurir(e.target.value)}
          />

          <button className="btn btn--primary" type="submit">
            + Tambah
          </button>
        </form>

        <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
          <label className="btn btn--outline">
            {importing ? "Importing..." : "Import Scan (CSV)"}
            <input
              type="file"
              accept=".csv"
              hidden
              onChange={handleImportScan}
              disabled={importing || deletingSelected}
            />
          </label>

          <button
            className="btn btn--danger"
            onClick={handleDeleteSelected}
            disabled={deletingSelected || importing || selectedIds.length === 0 || loading}
          >
            {deletingSelected ? "Menghapus..." : `Hapus Terpilih (${selectedIds.length})`}
          </button>

          <button className="btn btn--outline" onClick={() => fetchScan({ status })} disabled={loading}>
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* ================= FILTER ================= */}
      <div className="filter-grid card card--shadow">
        <input
          className="form__input"
          placeholder="Cari resi / kurir..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select className="form__input" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Semua Status</option>
          <option value="unmatched">Unmatched</option>
          <option value="matched">Matched</option>
        </select>

        <input type="date" className="form__input" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <input type="date" className="form__input" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </div>

      {/* ================= TABLE ================= */}
      {loading ? (
        <p>Memuat data…</p>
      ) : Object.keys(groupedByCourier).length === 0 ? (
        <p>Tidak ada data scan</p>
      ) : (
        Object.entries(groupedByCourier).map(([courier, items]) => {
          const ids = items.map((x) => x.id);
          const allSelected = ids.length > 0 && ids.every((id) => selectedIds.includes(id));

          return (
            <div key={courier} className="card card--shadow card--spaced">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                <h2 style={{ margin: 0 }}>
                  🚚 {courier} <span className="badge">{items.length}</span>
                </h2>
                <label style={{ display: "flex", gap: 8, cursor: "pointer" }}>
                  <input type="checkbox" checked={allSelected} onChange={() => toggleSelectAllInGroup(items)} />
                  Pilih semua
                </label>
              </div>

              <table className="table">
                <thead>
                  <tr>
                    <th>Pilih</th>
                    <th>No</th>
                    <th>Resi</th>
                    <th>Tanggal</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((r, i) => (
                    <tr key={r.id}>
                      <td>
                        <input type="checkbox" checked={isChecked(r.id)} onChange={() => toggleSelect(r.id)} />
                      </td>
                      <td>{i + 1}</td>
                      <td style={{ fontWeight: 600 }}>{r.nomor_resi}</td>
                      <td>{r.tanggal ? new Date(r.tanggal).toLocaleDateString("id-ID") : "-"}</td>
                      <td>
                        <span className={`badge ${r.status === "matched" ? "badge--success" : "badge--warning"}`}>
                          {r.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn--danger"
                          onClick={() => handleDeleteSingle(r.id, r.nomor_resi)}
                          disabled={deletingSelected}
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })
      )}
    </div>
  );
};

export default ScanResi;