const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Resi = sequelize.define(
  "resi",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    nomor_resi: {
      type: DataTypes.STRING,
      allowNull: false,

      // auto rapihin resi
      set(value) {
        const v = (value || "")
          .toString()
          .trim()
          .toUpperCase()
          .replace(/\s+/g, "");
        this.setDataValue("nomor_resi", v);
      },
    },

    nama_barang: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    nama_toko: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    /**
     * NOTE:
     * - Untuk data SCAN -> ini kurir (JNE, JNT, dll)
     * - Untuk data MARKETPLACE -> ini nama marketplace (shopee, tokopedia, dll)
     */
    jasa_kirim: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    /**
     * sumber hanya 3:
     * scan / marketplace / manual
     */
    sumber: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "scan",
      validate: {
        isIn: [["scan", "marketplace", "manual"]],
      },
    },

    /**
     * status hanya 2:
     * unmatched / matched
     */
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "unmatched",
      validate: {
        isIn: [["unmatched", "matched"]],
      },
    },

    tanggal: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    tanggal_scan: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    tanggal_order: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "resi",
    timestamps: false,
    underscored: true,
  }
);

module.exports = Resi;
