import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { logout, user } = useAuth();

  return (
    <aside className="sidebar">
      {/* BRAND */}
      <div className="sidebar__brand">
        <div className="sidebar__logo">📦</div>
        <div>
          <div className="sidebar__title">ReturnUkhti</div>
          <div className="sidebar__subtitle">
            {user?.name ? `Halo, ${user.name}` : "Sistem Matching Resi"}
          </div>
        </div>
      </div>

      {/* NAV */}
      <nav className="sidebar__nav">
        <NavLink
          to="/scan"
          className={({ isActive }) =>
            "sidebar__link" + (isActive ? " sidebar__link--active" : "")
          }
        >
          <span className="sidebar__icon">📷</span>
          <span>Data Scan</span>
        </NavLink>

        <NavLink
          to="/marketplace"
          className={({ isActive }) =>
            "sidebar__link" + (isActive ? " sidebar__link--active" : "")
          }
        >
          <span className="sidebar__icon">🛒</span>
          <span>Data Marketplace</span>
        </NavLink>

        <NavLink
          to="/match"
          className={({ isActive }) =>
            "sidebar__link" + (isActive ? " sidebar__link--active" : "")
          }
        >
          <span className="sidebar__icon">🧩</span>
          <span>Hasil Matching</span>
        </NavLink>

        <div className="sidebar__divider" />

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            "sidebar__link" + (isActive ? " sidebar__link--active" : "")
          }
        >
          <span className="sidebar__icon">⚙️</span>
          <span>Pengaturan</span>
        </NavLink>
      </nav>

      {/* FOOTER */}
      <div className="sidebar__footer">
        <button className="sidebar__logout" onClick={logout}>
          Keluar
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
