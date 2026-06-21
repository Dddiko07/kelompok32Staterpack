const Resi = require("../models/resiModel");
const { Op } = require("sequelize");
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

/**
 * Ambil userId dari token
 */
function getUserIdFromReq(req) {
  return req.user?.id || req.userId || req.user?.userId;
}

/**
 * Helper normalisasi resi
 */
function normalizeResi(val) {
  return (val || "")
    .toString()
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "");
}

/**
 * ======================================================
 * GET /resi
 * List + filter + default auto-filter
 * ======================================================
 */
exports.getResiList = async (req, res) => {
  try {
    const userId = getUserIdFromReq(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { search, jasa_kirim, status, sumber, tanggal, start, end } = req.query;

    const where = { user_id: userId };

    // DEFAULT (jika tidak pakai filter apa pun)
    const noFilter =
      !search &&
      !jasa_kirim &&
      !status &&
      !sumber &&
      !tanggal &&
      !start &&
      !end;

    if (noFilter) {
      where.sumber = "scan";
      where.status = "unmatched";
    }

    // ================= FILTER UI =================
    if (jasa_kirim) where.jasa_kirim = jasa_kirim;
    if (status) where.status = status;
    if (sumber) where.sumber = sumber;

    if (tanggal) {
      where.tanggal = tanggal;
    }

    if (start && end) {
      where.tanggal = {
        [Op.between]: [start, end],
      };
    }

    if (search) {
      where[Op.or] = [
        { nomor_resi: { [Op.iLike]: `%${search}%` } },
        { nama_barang: { [Op.iLike]: `%${search}%` } },
        { nama_toko: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const data = await Resi.findAll({
      where,
      order: [["created_at", "DESC"]],
    });

    res.json(data);
  } catch (err) {
    console.error("getResiList:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ======================================================
 * GET /resi/scan
 * LIST KHUSUS SCAN
 * ======================================================
 */
exports.getScanList = async (req, res) => {
  try {
    const userId = getUserIdFromReq(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { status, search, start, end } = req.query;

    const where = {
      user_id: userId,
      sumber: "scan",
    };

    if (status) where.status = status;

    if (start && end) {
      where.tanggal = { [Op.between]: [start, end] };
    }

    if (search) {
      where[Op.or] = [
        { nomor_resi: { [Op.iLike]: `%${search}%` } },
        { jasa_kirim: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const data = await Resi.findAll({
      where,
      order: [["created_at", "DESC"]],
    });

    res.json(data);
  } catch (err) {
    console.error("getScanList:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ======================================================
 * GET /resi/marketplace
 * LIST KHUSUS MARKETPLACE (FIXED: Unified, Status Filter & Date Sort)
 * ======================================================
 */
exports.getMarketplaceList = async (req, res) => {
  try {
    const userId = getUserIdFromReq(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { mp, search, start, end, status } = req.query;

    const where = {
      user_id: userId,
      sumber: "marketplace",
    };

    // FIX: Terapkan filter status agar bisa melihat Matched/Unmatched di satu menu
    if (status) where.status = status;
    if (mp) where.jasa_kirim = mp.toLowerCase();

    // Filter berdasarkan rentang tanggal order
    if (start && end) {
      where.tanggal_order = { [Op.between]: [start, end] };
    }

    if (search) {
      where[Op.or] = [
        { nomor_resi: { [Op.iLike]: `%${search}%` } },
        { nama_barang: { [Op.iLike]: `%${search}%` } },
        { nama_toko: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const data = await Resi.findAll({
      where,
      // FIX: Urutkan berdasarkan tanggal order terbaru
      order: [
        ["tanggal_order", "DESC"],
        ["created_at", "DESC"]
      ],
    });

    res.json(data);
  } catch (err) {
    console.error("getMarketplaceList:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ======================================================
 * POST /resi/scan (Satuan)
 * ======================================================
 */
exports.addResiScan = async (req, res) => {
  try {
    const userId = getUserIdFromReq(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { nomor_resi, jasa_kirim, tanggal } = req.body;

    if (!nomor_resi) {
      return res.status(400).json({ message: "Nomor resi wajib diisi" });
    }

    const data = await Resi.create({
      nomor_resi: normalizeResi(nomor_resi),
      jasa_kirim: jasa_kirim || null,
      tanggal: tanggal || new Date(),
      sumber: "scan",
      status: "unmatched",
      user_id: userId,
      tanggal_scan: new Date(),
    });

    res.status(201).json({ message: "Resi scan tersimpan", data });
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ message: "Resi sudah discan" });
    }
    console.error("addResiScan:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ======================================================
 * POST /resi (Manual)
 * ======================================================
 */
exports.addResi = async (req, res) => {
  try {
    const userId = getUserIdFromReq(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { nomor_resi, nama_barang, nama_toko, jasa_kirim, tanggal } = req.body;

    if (!nomor_resi) {
      return res.status(400).json({ message: "Nomor resi wajib diisi" });
    }

    const data = await Resi.create({
      nomor_resi: normalizeResi(nomor_resi),
      nama_barang: nama_barang || null,
      nama_toko: nama_toko || null,
      jasa_kirim: jasa_kirim || null,
      tanggal: tanggal || new Date(),
      sumber: "manual",
      status: "unmatched",
      user_id: userId,
    });

    res.status(201).json({ message: "Resi manual tersimpan", data });
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ message: "Nomor resi sudah ada" });
    }
    console.error("addResi:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ======================================================
 * POST /resi/import-scan (CSV)
 * ======================================================
 */
exports.uploadScanMiddleware = upload.single("file");

exports.importResiScanCsv = async (req, res) => {
  try {
    const userId = getUserIdFromReq(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    if (!req.file) {
      return res.status(400).json({ message: "File CSV tidak ditemukan" });
    }

    const lines = req.file.buffer
      .toString("utf-8")
      .split(/\r?\n/)
      .filter((l) => l.trim() !== "");

    const dataLines = lines.slice(1);

    let inserted = 0;
    let skipped = 0;

    for (const line of dataLines) {
      const [nomor_resi, jasa_kirim, tanggal] = line.split(",");
      if (!nomor_resi) continue;

      try {
        await Resi.create({
          nomor_resi: normalizeResi(nomor_resi),
          jasa_kirim: jasa_kirim?.trim() || null,
          tanggal: tanggal?.trim() || new Date(),
          sumber: "scan",
          status: "unmatched",
          user_id: userId,
          tanggal_scan: new Date(),
        });
        inserted++;
      } catch (err) {
        if (err.name === "SequelizeUniqueConstraintError") {
          skipped++;
        }
      }
    }

    res.json({ message: "Import scan selesai", inserted, skipped });
  } catch (err) {
    console.error("importResiScanCsv:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ======================================================
 * POST /resi/import-marketplace (CSV)
 * ======================================================
 */
exports.importMarketplaceCsv = async (req, res) => {
  try {
    const userId = getUserIdFromReq(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    if (!req.file) {
      return res.status(400).json({ message: "File CSV tidak ditemukan" });
    }

    const marketplace = (req.body.marketplace || "shopee").toLowerCase();
    const lines = req.file.buffer
      .toString("utf-8")
      .split(/\r?\n/)
      .filter((l) => l.trim() !== "");

    const dataLines = lines.slice(1);

    let inserted = 0;
    let skipped = 0;

    for (const line of dataLines) {
      const cols = line.split(",");
      const nomor_resi = cols[0];
      const nama_barang = cols[1];
      const nama_toko = cols[2];
      const tanggal_order = cols[3];

      if (!nomor_resi) continue;

      try {
        await Resi.create({
          nomor_resi: normalizeResi(nomor_resi),
          nama_barang: nama_barang?.trim() || null,
          nama_toko: nama_toko?.trim() || null,
          jasa_kirim: marketplace,
          tanggal: new Date(),
          sumber: "marketplace",
          status: "unmatched",
          user_id: userId,
          tanggal_order: tanggal_order?.trim() || null,
        });
        inserted++;
      } catch (err) {
        if (err.name === "SequelizeUniqueConstraintError") {
          skipped++;
        }
      }
    }

    res.json({ message: "Import marketplace selesai", marketplace, inserted, skipped });
  } catch (err) {
    console.error("importMarketplaceCsv:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ======================================================
 * POST /resi/import-marketplace-paste
 * ======================================================
 */
exports.importMarketplacePaste = async (req, res) => {
  try {
    const userId = getUserIdFromReq(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { marketplace, text } = req.body;

    if (!marketplace) return res.status(400).json({ message: "Marketplace wajib dipilih" });
    if (!text || text.trim() === "") return res.status(400).json({ message: "Data paste kosong" });

    const mp = marketplace.toLowerCase();
    const lines = text.split(/\r?\n/).map((l) => l.trim()).filter((l) => l !== "");

    if (lines.length < 3) {
      return res.status(400).json({ message: "Format paste kurang. Minimal: toko + 1 resi + 1 barang" });
    }

    const nama_toko = lines[0];
    const isResi = (val) => {
      if (!val) return false;
      const v = normalizeResi(val);
      return /^JX[0-9]{8,}$/.test(v) || /^NJVTT[0-9]{8,}$/.test(v) || /^[A-Z0-9]{10,}$/.test(v);
    };

    const resiList = [];
    const barangList = [];
    let mode = "resi";

    for (let i = 1; i < lines.length; i++) {
      const row = lines[i];
      if (mode === "resi") {
        if (isResi(row)) {
          resiList.push(normalizeResi(row));
        } else {
          mode = "barang";
          barangList.push(row.trim());
        }
      } else {
        barangList.push(row.trim());
      }
    }

    if (resiList.length === 0) return res.status(400).json({ message: "Tidak ada nomor resi terdeteksi." });
    if (barangList.length === 0) return res.status(400).json({ message: "Tidak ada nama barang terdeteksi." });

    let inserted = 0;
    let skipped = 0;
    const max = Math.min(resiList.length, barangList.length);

    for (let i = 0; i < max; i++) {
      try {
        await Resi.create({
          nomor_resi: resiList[i],
          nama_barang: barangList[i] || null,
          nama_toko: nama_toko || null,
          jasa_kirim: mp,
          tanggal: new Date(),
          sumber: "marketplace",
          status: "unmatched",
          user_id: userId,
        });
        inserted++;
      } catch (err) {
        if (err.name === "SequelizeUniqueConstraintError") {
          skipped++;
        }
      }
    }

    res.json({ message: "Import paste selesai", marketplace: mp, inserted, skipped });
  } catch (err) {
    console.error("importMarketplacePaste:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ======================================================
 * PUT /resi/:id (Edit)
 * ======================================================
 */
exports.editResi = async (req, res) => {
  try {
    const userId = getUserIdFromReq(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;
    const data = await Resi.findOne({ where: { id, user_id: userId } });

    if (!data) return res.status(404).json({ message: "Resi tidak ditemukan" });

    const { nomor_resi, nama_barang, nama_toko, jasa_kirim, tanggal, sumber, status } = req.body;

    await data.update({
      nomor_resi: nomor_resi !== undefined ? normalizeResi(nomor_resi) : data.nomor_resi,
      nama_barang: nama_barang !== undefined ? nama_barang : data.nama_barang,
      nama_toko: nama_toko !== undefined ? nama_toko : data.nama_toko,
      jasa_kirim: jasa_kirim !== undefined ? jasa_kirim : data.jasa_kirim,
      tanggal: tanggal !== undefined ? tanggal : data.tanggal,
      sumber: sumber !== undefined ? sumber : data.sumber,
      status: status !== undefined ? status : data.status,
    });

    res.json({ message: "Resi berhasil diupdate", data });
  } catch (err) {
    console.error("editResi:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ======================================================
 * DELETE /resi/:id
 * ======================================================
 */
exports.removeResi = async (req, res) => {
  try {
    const userId = getUserIdFromReq(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;
    const data = await Resi.findOne({ where: { id, user_id: userId } });

    if (!data) return res.status(404).json({ message: "Resi tidak ditemukan" });

    await data.destroy();
    return res.json({ message: "Resi berhasil dihapus" });
  } catch (err) {
    console.error("removeResi:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * ======================================================
 * POST /resi/delete-selected
 * ======================================================
 */
exports.deleteSelectedResi = async (req, res) => {
  try {
    const userId = getUserIdFromReq(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "Tidak ada data yang dipilih" });
    }

    const deleted = await Resi.destroy({
      where: { id: ids, user_id: userId },
    });

    return res.json({ message: "Hapus data terpilih berhasil", deleted });
  } catch (err) {
    console.error("deleteSelectedResi:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * ======================================================
 * POST /resi/match (FIXED: Update both sources permanently)
 * ======================================================
 */
exports.matchResi = async (req, res) => {
  try {
    const userId = getUserIdFromReq(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { marketplace } = req.body;
    if (!marketplace) return res.status(400).json({ message: "Marketplace wajib dipilih" });

    const mp = marketplace.toLowerCase();

    // 1) Ambil semua scan (unmatched)
    const scanResi = await Resi.findAll({
      where: { user_id: userId, sumber: "scan", status: "unmatched" },
    });

    // 2) Ambil semua marketplace (sesuai mp)
    const marketResi = await Resi.findAll({
      where: { user_id: userId, sumber: "marketplace", jasa_kirim: mp },
    });

    const marketMap = new Map();
    for (const r of marketResi) {
      const nomor = normalizeResi(r.nomor_resi);
      if (nomor) marketMap.set(nomor, r);
    }

    const scanSet = new Set();
    for (const s of scanResi) {
      const nomor = normalizeResi(s.nomor_resi);
      if (nomor) scanSet.add(nomor);
    }

    const matchedRows = [];
    const unmatchedScanRows = [];
    let matchedCount = 0;

    // 3) Proses Matching
    for (const s of scanResi) {
      const nomor = normalizeResi(s.nomor_resi);
      if (!nomor) continue;

      if (marketMap.has(nomor)) {
        const m = marketMap.get(nomor);

        // FIX: Update status keduannya di DATABASE secara permanen
        await s.update({ status: "matched" });
        await m.update({ status: "matched" });

        matchedCount++;
        matchedRows.push({
          nomor_resi: nomor,
          nama_barang: m.nama_barang,
          nama_toko: m.nama_toko,
          marketplace: mp,
          tanggal_scan: s.tanggal_scan,
          tanggal_order: m.tanggal_order,
        });
      } else {
        unmatchedScanRows.push({
          nomor_resi: nomor,
          jasa_kirim: s.jasa_kirim,
          tanggal_scan: s.tanggal_scan,
        });
      }
    }

    // 4) Identify unmatched marketplace rows
    const unmatchedMarketplaceRows = [];
    for (const m of marketResi) {
      const nomor = normalizeResi(m.nomor_resi);
      // Jika resi marketplace ini belum 'matched', masukkan ke daftar unmatched
      if (nomor && m.status !== "matched") {
        unmatchedMarketplaceRows.push({
          nomor_resi: nomor,
          nama_barang: m.nama_barang,
          nama_toko: m.nama_toko,
          marketplace: mp,
          tanggal_order: m.tanggal_order,
        });
      }
    }

    res.json({
      message: "Matching selesai dan status tersimpan",
      marketplace: mp,
      total_scan: scanResi.length,
      total_marketplace: marketResi.length,
      matched_count: matchedCount,
      matched: matchedRows,
      unmatched_scan: unmatchedScanRows,
      unmatched_marketplace: unmatchedMarketplaceRows,
    });
  } catch (err) {
    console.error("matchResi:", err);
    res.status(500).json({ message: "Server error" });
  }
};