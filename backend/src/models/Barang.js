const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Barang = sequelize.define('Barang', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  namaBarang: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: {
      name: 'unique_nama_barang',
      msg: 'Nama barang sudah ada, tidak boleh duplikat'
    },
    validate: {
      notEmpty: {
        msg: 'Nama barang wajib diisi'
      },
      len: {
        args: [1, 100],
        msg: 'Nama barang maksimum 100 karakter'
      }
    }
  },
  jumlah: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: {
        msg: 'Jumlah harus berupa angka'
      },
      min: {
        args: [1],
        msg: 'Jumlah harus angka positif'
      }
    }
  },
  tanggalCatat: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false
  }
}, {
  tableName: 'barang',
  timestamps: true,
  createdAt: 'tanggalCatat',
  updatedAt: false
});

module.exports = Barang;