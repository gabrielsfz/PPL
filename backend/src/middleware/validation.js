const { body } = require('express-validator');

const validateBarang = [
  body('namaBarang')
    .trim()
    .notEmpty()
    .withMessage('Nama barang wajib diisi')
    .isLength({ max: 100 })
    .withMessage('Nama barang maksimum 100 karakter'),
  
  body('jumlah')
    .notEmpty()
    .withMessage('Jumlah wajib diisi')
    .isInt({ min: 1 })
    .withMessage('Jumlah harus angka positif')
    .toInt()
];

module.exports = validateBarang;
