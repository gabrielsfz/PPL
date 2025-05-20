// routes/barangMasuk.js
const express = require('express');
const router = express.Router();
const BarangController = require('../controllers/barangController');
const validateBarang = require('../middleware/validation');

// POST /api/barang-masuk - Mencatat barang masuk baru
router.post('/', validateBarang, BarangController.create);

// GET /api/barang-masuk/latest - Mendapatkan 10 barang masuk terbaru
router.get('/latest', BarangController.getLatest);

// GET /api/barang-masuk - Mendapatkan semua barang masuk dengan pagination
router.get('/', BarangController.getAll);

module.exports = router;