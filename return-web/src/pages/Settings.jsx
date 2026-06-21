import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";

const Settings = () => {
  const { theme, setTheme } = useTheme();

  const [courierPreset, setCourierPreset] = useState(
    "JNE,J&T,SiCepat,AnterAja"
  );
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedCouriers = localStorage.getItem("ru_couriers");
    if (savedCouriers) setCourierPreset(savedCouriers);
  }, []);

  const handleSave = (e) => {
    e.preventDefault();

    // rapikan input (hapus spasi berlebih)
    const normalized = courierPreset
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean)
      .join(",");

    localStorage.setItem("ru_couriers", normalized);
    setCourierPreset(normalized);

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="page">
      <h1 className="page__title">Pengaturan</h1>
      <p className="page__subtitle">
        Sesuaikan preferensi tampilan dan preset jasa kirim.
      </p>

      {saved && (
        <div className="alert alert--success">
          Pengaturan berhasil disimpan.
        </div>
      )}

      <form
        onSubmit={handleSave}
        className="form card card--shadow"
        style={{ maxWidth: 450 }}
      >
        {/* THEME */}
        <label className="form__label">
          Tema
          <select
            className="form__input"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            <option value="light">Terang</option>
            <option value="dark">Gelap</option>
          </select>
        </label>

        {/* COURIER PRESET */}
        <label className="form__label">
          Preset Jasa Kirim (pisahkan dengan koma)
          <input
            className="form__input"
            value={courierPreset}
            onChange={(e) => setCourierPreset(e.target.value)}
            placeholder="JNE,J&T,SiCepat,AnterAja"
          />
        </label>

        <button type="submit" className="btn btn--primary form__submit">
          Simpan Pengaturan
        </button>
      </form>
    </div>
  );
};

export default Settings;
