import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../utils/api";

const MarketplaceResi = () => {
  const [resi, setResi] = useState([]);
  const [loading, setLoading] = useState(true);

  // marketplace
  const [marketplace, setMarketplace] = useState("shopee");

  // filter
  const [search, setSearch] = useState("");
  const [namaTokoFilter, setNamaTokoFilter] = useState("");
  // --- TAMBAHAN FILTER STATUS ---
  const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'matched', 'unmatched'

  // import csv
  const [importing, setImporting] = useState(false);

  // multi delete
  const [selectedIds, setSelectedIds] = useState([]);
  const [deletingSelected, setDeletingSelected] = useState(false);

  // alert
  const [alertMsg, setAlertMsg] = useState(null);
  const [alertType, setAlertType] = useState("success");

  // ===============================
  // FORM INPUT (TABEL)
  // ===============================
  const [namaTokoInput, setNamaTokoInput] = useState("");
  const [rows, setRows] = useState([{ nomor_resi: "", nama_barang: "" }]);
  const [savingTable, setSavingTable] = useState(false);

  // ===============================
  // PASTE INPUT (RESI + BARANG)
  // ===============================
  const [pasteResiText, setPasteResiText] = useState("");
  const [pasteBarangText, setPasteBarangText] = useState("");

  const showAlert = (msg, type = "success") => {
    setAlertMsg(msg);
    setAlertType(type);
    setTimeout(() => setAlertMsg(null), 2500);
  };

  // ===============================
  // FETCH MARKETPLACE (DENGAN FILTER STATUS)
  // ===============================
  const fetchMarketplace = useCallback(
    async (params = {}) => {
      setLoading(true);
      try {
        // Gabungkan parameter bawaan dengan status filter
        const finalParams = { 
          mp: marketplace, 
          status: statusFilter !== "all" ? statusFilter : undefined,
          ...params 
        };

        const res = await api.get("/resi/marketplace", {
          params: finalParams,
        });

        setResi(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
        showAlert("Gagal mengambil data marketplace", "error");
      } finally {
        setLoading(false);
      }
    },
    [marketplace, statusFilter] // Fetch ulang jika status filter atau marketplace berubah
  );

  useEffect(() => {
    fetchMarketplace();
    setSelectedIds([]); // Reset pilihan saat filter berubah
  }, [fetchMarketplace]);

  // filter realtime (Debounce search)
  useEffect(() => {
    const t = setTimeout(() => {
      const params = {};
      if (search) params.search = search;
      fetchMarketplace(params);
    }, 350);

    return () => clearTimeout(t);
  }, [search, fetchMarketplace]);

  // ===============================
  // GROUPING TOKO
  // ===============================
  const groupedByStore = useMemo(() => {
    const groups = {};
    for (const r of resi) {
      const key = r.nama_toko || "TANPA TOKO";
      if (!groups[key]) groups[key] = [];
      groups[key].push(r);
    }
    return groups;
  }, [resi]);

  // filter toko (client side)
  const filteredGroups = useMemo(() => {
    if (!namaTokoFilter.trim()) return groupedByStore;

    const q = namaTokoFilter.toLowerCase();
    const out = {};
    for (const [toko, items] of Object.entries(groupedByStore)) {
      if (toko.toLowerCase().includes(q)) out[toko] = items;
    }
    return out;
  }, [groupedByStore, namaTokoFilter]);

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

    if (
      !window.confirm(
        `Hapus ${selectedIds.length} data marketplace yang dipilih?`
      )
    ) {
      return;
    }

    try {
      setDeletingSelected(true);

      await api.post("/resi/delete-selected", {
        ids: selectedIds,
      });

      setResi((prev) => prev.filter((r) => !selectedIds.includes(r.id)));
      setSelectedIds([]);

      showAlert("Data marketplace terpilih berhasil dihapus");
    } catch (err) {
      console.error(err);
      showAlert("Gagal menghapus data terpilih", "error");
    } finally {
      setDeletingSelected(false);
    }
  };

  // ===============================
  // IMPORT CSV MARKETPLACE
  // ===============================
  const handleImportMarketplace = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".csv")) {
      showAlert("File harus CSV", "error");
      e.target.value = "";
      return;
    }

    if (!window.confirm(`Import marketplace dari "${file.name}" ?`)) {
      e.target.value = "";
      return;
    }

    try {
      setImporting(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("marketplace", marketplace);

      await api.post("/resi/import-marketplace", formData);

      showAlert("Import marketplace berhasil");
      fetchMarketplace();
    } catch (err) {
      console.error(err);
      showAlert("Gagal import marketplace", "error");
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

  // ===============================
  // TABEL INPUT (TAMBAH/HAPUS BARIS)
  // ===============================
  const addRow = () => {
    setRows((prev) => [...prev, { nomor_resi: "", nama_barang: "" }]);
  };

  const removeRow = (idx) => {
    setRows((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateRow = (idx, key, value) => {
    setRows((prev) =>
      prev.map((r, i) => (i === idx ? { ...r, [key]: value } : r))
    );
  };

  const clearTable = () => {
    setNamaTokoInput("");
    setRows([{ nomor_resi: "", nama_barang: "" }]);
    setPasteResiText("");
    setPasteBarangText("");
  };

  const normalizeResi = (val) => {
    return (val || "")
      .toString()
      .trim()
      .toUpperCase()
      .replace(/\s+/g, "");
  };

  const handlePasteResiToTable = () => {
    if (!pasteResiText.trim()) {
      showAlert("Paste resi masih kosong", "error");
      return;
    }

    const lines = pasteResiText
      .split(/\r?\n/)
      .map((l) => normalizeResi(l))
      .filter((l) => l !== "");

    if (lines.length === 0) {
      showAlert("Tidak ada resi valid terdeteksi", "error");
      return;
    }

    const unique = [];
    const seen = new Set();
    for (const r of lines) {
      if (!seen.has(r)) {
        seen.add(r);
        unique.push(r);
      }
    }

    setRows(unique.map((r) => ({ nomor_resi: r, nama_barang: "" })));
    showAlert(`Resi berhasil masuk ke tabel: ${unique.length} baris`);
  };

  const handlePasteBarangToTable = () => {
    if (!pasteBarangText.trim()) {
      showAlert("Paste barang masih kosong", "error");
      return;
    }

    if (!rows.length || (rows.length === 1 && rows[0].nomor_resi === "")) {
      showAlert("Isi resi dulu sebelum isi barang", "error");
      return;
    }

    const lines = pasteBarangText
      .split(/\r?\n/)
      .map((l) => (l || "").trim())
      .filter((l) => l !== "");

    if (lines.length === 0) {
      showAlert("Tidak ada barang valid terdeteksi", "error");
      return;
    }

    setRows((prev) => {
      const updated = [...prev];
      const max = Math.min(updated.length, lines.length);

      for (let i = 0; i < max; i++) {
        updated[i] = {
          ...updated[i],
          nama_barang: lines[i],
        };
      }

      return updated;
    });

    showAlert(`Barang berhasil diisi ke ${Math.min(rows.length, lines.length)} baris`);
  };

  const handleSaveTable = async () => {
    if (!namaTokoInput.trim()) {
      showAlert("Nama toko wajib diisi", "error");
      return;
    }

    const cleanRows = rows
      .map((r) => ({
        nomor_resi: normalizeResi(r.nomor_resi || ""),
        nama_barang: (r.nama_barang || "").trim(),
      }))
      .filter((r) => r.nomor_resi !== "" && r.nama_barang !== "");

    if (cleanRows.length === 0) {
      showAlert("Isi minimal 1 baris Resi + Barang", "error");
      return;
    }

    const text =
      [
        namaTokoInput.trim(),
        ...cleanRows.map((r) => r.nomor_resi),
        ...cleanRows.map((r) => r.nama_barang),
      ].join("\n") + "\n";

    if (
      !window.confirm(
        `Import ${cleanRows.length} data untuk toko "${namaTokoInput}"?`
      )
    ) {
      return;
    }

    try {
      setSavingTable(true);

      await api.post("/resi/import-marketplace-paste", {
        marketplace,
        text,
      });

      showAlert("Input tabel berhasil disimpan");
      clearTable();
      fetchMarketplace();
    } catch (err) {
      console.error(err);
      showAlert(
        err?.response?.data?.message || "Gagal menyimpan data tabel",
        "error"
      );
    } finally {
      setSavingTable(false);
    }
  };

  return (
    <div className="page">
      {alertMsg && (
        <div
          className={`alert ${
            alertType === "error" ? "alert--error" : "alert--success"
          }`}
        >
          {alertMsg}
        </div>
      )}

      <div className="page-header">
        <h1 className="page__title">Data Marketplace</h1>
        <span className="badge badge--primary">
          Total: <strong>{resi.length}</strong>
        </span>
      </div>

      {/* ================= INPUT TABEL ================= */}
      <div className="card card--shadow" style={{ marginBottom: 16 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <h2 style={{ margin: 0 }}>🏪 Input Data Marketplace (Rapi)</h2>

          <span className="badge badge--primary">
            {marketplace.toUpperCase()}
          </span>
        </div>

        <div
          style={{
            marginTop: 12,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
          }}
        >
          <select
            className="form__input"
            value={marketplace}
            onChange={(e) => {
              setMarketplace(e.target.value);
              setSelectedIds([]);
            }}
            disabled={savingTable || importing || deletingSelected}
          >
            <option value="shopee">Shopee</option>
            <option value="tokopedia">Tokopedia</option>
            <option value="lazada">Lazada</option>
            <option value="tiktok">TikTok</option>
          </select>

          <input
            className="form__input"
            placeholder="Nama toko (wajib)"
            value={namaTokoInput}
            onChange={(e) => setNamaTokoInput(e.target.value)}
            disabled={savingTable || importing || deletingSelected}
          />
        </div>

        {/* ================= PASTE RESI ================= */}
        <div style={{ marginTop: 14 }}>
          <label style={{ fontWeight: 700, display: "block", marginBottom: 6 }}>
            📦 Paste daftar resi (1 baris 1 resi)
          </label>

          <textarea
            className="form__input"
            rows={6}
            placeholder={`Contoh:
JX6699576042
JX6690909146
SPXID05855073191C`}
            value={pasteResiText}
            onChange={(e) => setPasteResiText(e.target.value)}
            disabled={savingTable}
          />

          <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
            <button
              type="button"
              className="btn btn--primary"
              onClick={handlePasteResiToTable}
              disabled={savingTable}
            >
              📥 Isi Resi ke Tabel
            </button>

            <button
              type="button"
              className="btn btn--danger"
              onClick={() => setPasteResiText("")}
              disabled={savingTable}
            >
              Clear Paste Resi
            </button>
          </div>
        </div>

        {/* ================= PASTE BARANG ================= */}
        <div style={{ marginTop: 18 }}>
          <label style={{ fontWeight: 700, display: "block", marginBottom: 6 }}>
            🛍️ Paste daftar barang (1 baris 1 barang)
          </label>

          <textarea
            className="form__input"
            rows={6}
            placeholder={`Contoh:
Hijab Bella Square
Gamis Syari
Kemeja Putih`}
            value={pasteBarangText}
            onChange={(e) => setPasteBarangText(e.target.value)}
            disabled={savingTable}
          />

          <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
            <button
              type="button"
              className="btn btn--primary"
              onClick={handlePasteBarangToTable}
              disabled={savingTable}
            >
              📥 Isi Barang ke Tabel
            </button>

            <button
              type="button"
              className="btn btn--danger"
              onClick={() => setPasteBarangText("")}
              disabled={savingTable}
            >
              Clear Paste Barang
            </button>
          </div>

          <p style={{ marginTop: 8, opacity: 0.7 }}>
            Barang akan diisi sesuai urutan baris resi di tabel.
          </p>
        </div>

        {/* ================= TABLE INPUT ================= */}
        <div style={{ marginTop: 12, overflowX: "auto" }}>
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: 60 }}>No</th>
                <th>Nomor Resi</th>
                <th>Nama Barang</th>
                <th style={{ width: 120 }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, idx) => (
                <tr key={`row-input-${idx}`}>
                  <td>{idx + 1}</td>

                  <td>
                    <input
                      className="form__input"
                      placeholder="Contoh: JX123..."
                      value={r.nomor_resi}
                      onChange={(e) =>
                        updateRow(idx, "nomor_resi", e.target.value)
                      }
                      disabled={savingTable}
                    />
                  </td>

                  <td>
                    <input
                      className="form__input"
                      placeholder="Contoh: Hijab / Baju / dll"
                      value={r.nama_barang}
                      onChange={(e) =>
                        updateRow(idx, "nama_barang", e.target.value)
                      }
                      disabled={savingTable}
                    />
                  </td>

                  <td>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        className="btn btn--outline"
                        onClick={addRow}
                        type="button"
                        disabled={savingTable}
                      >
                        + Baris
                      </button>

                      <button
                        className="btn btn--danger"
                        onClick={() => removeRow(idx)}
                        type="button"
                        disabled={savingTable || rows.length === 1}
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            className="btn btn--primary"
            onClick={handleSaveTable}
            disabled={savingTable || importing || deletingSelected}
          >
            {savingTable ? "Menyimpan..." : "💾 Simpan ke Database"}
          </button>

          <button className="btn btn--danger" onClick={clearTable} disabled={savingTable}>
            Clear
          </button>

          <label className="btn btn--outline">
            {importing ? "Importing..." : "Import Marketplace (CSV)"}
            <input
              type="file"
              accept=".csv"
              hidden
              onChange={handleImportMarketplace}
              disabled={importing || savingTable || deletingSelected}
            />
          </label>

          <button className="btn btn--outline" onClick={() => fetchMarketplace()} disabled={loading}>
            🔄 Refresh
          </button>

          <button
            className="btn btn--danger"
            onClick={handleDeleteSelected}
            disabled={
              deletingSelected ||
              importing ||
              savingTable ||
              selectedIds.length === 0
            }
          >
            {deletingSelected
              ? "Menghapus..."
              : `Hapus Terpilih (${selectedIds.length})`}
          </button>
        </div>

        <p style={{ marginTop: 10, opacity: 0.75 }}>
          💡 Nama toko dipakai untuk semua baris. Isi minimal 1 baris Resi + Barang.
        </p>
      </div>

      {/* ================= FILTER LIST ================= */}
      <div className="filter-grid card card--shadow">
        <input
          className="form__input"
          placeholder="Cari resi / barang / toko..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* --- TAMBAHAN SELECT FILTER STATUS --- */}
        <select
          className="form__input"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">🔍 Semua Status</option>
          <option value="matched">✅ Matched (Sudah Scan)</option>
          <option value="unmatched">❌ Unmatched (Belum Scan)</option>
        </select>

        <input
          className="form__input"
          placeholder="Filter nama toko (opsional)"
          value={namaTokoFilter}
          onChange={(e) => setNamaTokoFilter(e.target.value)}
        />
      </div>

      {/* ================= TABLE LIST ================= */}
      {loading ? (
        <p>Memuat data…</p>
      ) : Object.keys(filteredGroups).length === 0 ? (
        <p>Tidak ada data marketplace</p>
      ) : (
        Object.entries(filteredGroups).map(([toko, items]) => {
          const ids = items.map((x) => x.id);
          const allSelected =
            ids.length > 0 && ids.every((id) => selectedIds.includes(id));

          return (
            <div key={toko} className="card card--shadow card--spaced">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <h2 style={{ margin: 0 }}>
                  🏪 {toko} <span className="badge">{items.length}</span>
                </h2>

                <label style={{ display: "flex", gap: 8, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={() => toggleSelectAllInGroup(items)}
                  />
                  Pilih semua
                </label>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th style={{ width: 40 }}>Pilih</th>
                      <th style={{ width: 40 }}>No</th>
                      <th>Resi</th>
                      <th>Barang</th>
                      <th>Status</th>
                      <th>Tanggal</th>
                      <th style={{ width: 80 }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((r, i) => (
                      <tr key={r.id}>
                        <td>
                          <input
                            type="checkbox"
                            checked={isChecked(r.id)}
                            onChange={() => toggleSelect(r.id)}
                          />
                        </td>
                        <td>{i + 1}</td>
                        <td style={{ fontWeight: 700 }}>{r.nomor_resi}</td>
                        <td>{r.nama_barang || "-"}</td>
                        <td>
                          {r.is_matched ? (
                            <span className="badge badge--success">MATCHED</span>
                          ) : (
                            <span className="badge badge--danger">UNMATCHED</span>
                          )}
                        </td>
                        <td>
                          {r.tanggal
                            ? new Date(r.tanggal).toLocaleDateString("id-ID")
                            : "-"}
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

              <p style={{ marginTop: 10, opacity: 0.7 }}>
                Marketplace: <b>{marketplace.toUpperCase()}</b>
              </p>
            </div>
          );
        })
      )}
    </div>
  );
};

export default MarketplaceResi;