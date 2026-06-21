export function convertResiToCSV(data = []) {
  if (!Array.isArray(data) || data.length === 0) return "";

  const header = [
    "nomor_resi",
    "nama_barang",
    "nama_toko",
    "jasa_kirim",
    "tanggal",
  ];

  const rows = data.map((item) => [
    item.nomor_resi ?? "",
    item.nama_barang ?? "",
    item.nama_toko ?? "",
    item.jasa_kirim ?? "",
    item.tanggal
      ? new Date(item.tanggal).toISOString().slice(0, 10)
      : "",
  ]);

  return [header, ...rows]
    .map((row) =>
      row
        .map((cell) =>
          `"${String(cell).replace(/"/g, '""')}"`
        )
        .join(",")
    )
    .join("\r\n"); // Excel-friendly
}
