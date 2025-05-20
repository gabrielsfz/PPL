// controllers/barangController.js
const { validationResult } = require('express-validator');
const Barang = require('../models/Barang');
const { Op } = require('sequelize');

class BarangController {
  // Mencatat barang baru atau menambah jumlah barang yang sudah ada
  static async create(req, res) {
    try {
      // Validasi input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: errors.array().map(error => error.msg)
        });
      }

      const { namaBarang, jumlah } = req.body;
      const namaBarangTrimmed = namaBarang.trim();
      const jumlahParsed = parseInt(jumlah);

      // Cek apakah barang sudah ada
      const existingBarang = await Barang.findOne({
        where: { namaBarang: namaBarangTrimmed }
      });

      let barang;
      let isNewItem = false;

      if (existingBarang) {
        // Jika barang sudah ada, tambahkan jumlahnya
        const newJumlah = existingBarang.jumlah + jumlahParsed;
        
        await existingBarang.update({
          jumlah: newJumlah,
          tanggalCatat: new Date() // Update tanggal catat
        });
        
        barang = existingBarang;
        isNewItem = false;
      } else {
        // Jika barang belum ada, buat entri baru
        barang = await Barang.create({
          namaBarang: namaBarangTrimmed,
          jumlah: jumlahParsed
        });
        isNewItem = true;
      }

      res.status(201).json({
        success: true,
        message: isNewItem 
          ? 'Barang baru berhasil dicatat' 
          : `Jumlah barang berhasil ditambahkan. Total sekarang: ${barang.jumlah}`,
        data: {
          id: barang.id,
          namaBarang: barang.namaBarang,
          jumlah: barang.jumlah,
          tanggalCatat: barang.tanggalCatat,
          isNewItem
        }
      });
    } catch (error) {
      console.error('Error creating barang:', error);
      
      // Handle Sequelize validation errors
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.errors.map(err => err.message)
        });
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Fungsi khusus untuk menambah jumlah barang yang sudah ada
  static async addQuantity(req, res) {
    try {
      // Validasi input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: errors.array().map(error => error.msg)
        });
      }

      const { namaBarang, jumlah } = req.body;
      const namaBarangTrimmed = namaBarang.trim();
      const jumlahParsed = parseInt(jumlah);

      // Cari barang yang sudah ada
      const existingBarang = await Barang.findOne({
        where: { namaBarang: namaBarangTrimmed }
      });

      if (!existingBarang) {
        return res.status(404).json({
          success: false,
          message: 'Barang tidak ditemukan. Gunakan endpoint create untuk menambah barang baru.'
        });
      }

      // Tambahkan jumlah barang
      const oldJumlah = existingBarang.jumlah;
      const newJumlah = oldJumlah + jumlahParsed;
      
      await existingBarang.update({
        jumlah: newJumlah,
        tanggalCatat: new Date()
      });

      res.json({
        success: true,
        message: `Jumlah barang berhasil ditambahkan`,
        data: {
          id: existingBarang.id,
          namaBarang: existingBarang.namaBarang,
          jumlahSebelum: oldJumlah,
          jumlahDitambah: jumlahParsed,
          jumlahSekarang: newJumlah,
          tanggalCatat: existingBarang.tanggalCatat
        }
      });
    } catch (error) {
      console.error('Error adding quantity:', error);
      
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.errors.map(err => err.message)
        });
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Mendapatkan daftar barang terbaru (10 entri)
  static async getLatest(req, res) {
    try {
      const barangList = await Barang.findAll({
        order: [['tanggalCatat', 'DESC']],
        limit: 10,
        attributes: ['id', 'namaBarang', 'jumlah', 'tanggalCatat']
      });

      res.json({
        success: true,
        data: barangList
      });
    } catch (error) {
      console.error('Error fetching barang:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Mendapatkan semua barang dengan pagination
  static async getAll(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const { count, rows } = await Barang.findAndCountAll({
        order: [['tanggalCatat', 'DESC']],
        limit,
        offset,
        attributes: ['id', 'namaBarang', 'jumlah', 'tanggalCatat']
      });

      res.json({
        success: true,
        data: rows,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: limit
        }
      });
    } catch (error) {
      console.error('Error fetching all barang:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Mendapatkan detail barang berdasarkan nama
  static async getByName(req, res) {
    try {
      const { namaBarang } = req.params;
      
      const barang = await Barang.findOne({
        where: { namaBarang: namaBarang.trim() },
        attributes: ['id', 'namaBarang', 'jumlah', 'tanggalCatat']
      });

      if (!barang) {
        return res.status(404).json({
          success: false,
          message: 'Barang tidak ditemukan'
        });
      }

      res.json({
        success: true,
        data: barang
      });
    } catch (error) {
      console.error('Error fetching barang by name:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = BarangController;