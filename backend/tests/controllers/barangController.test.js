// tests/controllers/BarangController.test.js
const BarangController = require('../../src/controllers/barangController');
const Barang = require('../../src/models/Barang');
const { validationResult } = require('express-validator');

// Mock dependencies
jest.mock('../../src/models/Barang');
jest.mock('express-validator');

describe('BarangController', () => {
  let req, res, mockConsoleError;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Mock console.error
    mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Setup mock request and response objects
    req = {
      body: {},
      params: {},
      query: {}
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    // Default mock for validationResult (no errors)
    validationResult.mockReturnValue({
      isEmpty: () => true,
      array: () => []
    });
  });

  afterEach(() => {
    mockConsoleError.mockRestore();
  });

  describe('create', () => {
    test('should create new barang successfully', async () => {
      // Arrange
      const requestData = {
        namaBarang: '  Laptop Dell  ',
        jumlah: '5'
      };

      const mockNewBarang = {
        id: 1,
        namaBarang: 'Laptop Dell',
        jumlah: 5,
        tanggalCatat: new Date(),
        update: jest.fn()
      };

      req.body = requestData;
      Barang.findOne.mockResolvedValue(null); // Barang tidak ada
      Barang.create.mockResolvedValue(mockNewBarang);

      // Act
      await BarangController.create(req, res);

      // Assert
      expect(Barang.findOne).toHaveBeenCalledWith({
        where: { namaBarang: 'Laptop Dell' }
      });
      expect(Barang.create).toHaveBeenCalledWith({
        namaBarang: 'Laptop Dell',
        jumlah: 5
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Barang baru berhasil dicatat',
        data: {
          id: 1,
          namaBarang: 'Laptop Dell',
          jumlah: 5,
          tanggalCatat: mockNewBarang.tanggalCatat,
          isNewItem: true
        }
      });
    });

    test('should add quantity to existing barang', async () => {
      // Arrange
      const requestData = {
        namaBarang: 'Laptop Dell',
        jumlah: '3'
      };

      const mockExistingBarang = {
        id: 1,
        namaBarang: 'Laptop Dell',
        jumlah: 5,
        tanggalCatat: new Date('2023-01-01'),
        update: jest.fn().mockImplementation(function(updateData) {
          this.jumlah = updateData.jumlah;
          this.tanggalCatat = updateData.tanggalCatat;
          return Promise.resolve(this);
        })
      };

      req.body = requestData;
      Barang.findOne.mockResolvedValue(mockExistingBarang);

      // Act
      await BarangController.create(req, res);

      // Assert
      expect(Barang.findOne).toHaveBeenCalledWith({
        where: { namaBarang: 'Laptop Dell' }
      });
      expect(mockExistingBarang.update).toHaveBeenCalledWith({
        jumlah: 8,
        tanggalCatat: expect.any(Date)
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Jumlah barang berhasil ditambahkan. Total sekarang: 8',
        data: {
          id: 1,
          namaBarang: 'Laptop Dell',
          jumlah: 8,
          tanggalCatat: expect.any(Date),
          isNewItem: false
        }
      });
    });

    test('should handle validation errors', async () => {
      // Arrange
      const validationErrors = [
        { msg: 'Nama barang wajib diisi' },
        { msg: 'Jumlah harus berupa angka positif' }
      ];

      validationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => validationErrors
      });

      req.body = { namaBarang: '', jumlah: 0 };

      // Act
      await BarangController.create(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation error',
        errors: ['Nama barang wajib diisi', 'Jumlah harus berupa angka positif']
      });
    });

    test('should handle sequelize validation errors', async () => {
      // Arrange
      const sequelizeError = new Error('Validation failed');
      sequelizeError.name = 'SequelizeValidationError';
      sequelizeError.errors = [
        { message: 'Nama barang maksimum 100 karakter' }
      ];

      req.body = { namaBarang: 'Valid Name', jumlah: '5' };
      Barang.findOne.mockResolvedValue(null);
      Barang.create.mockRejectedValue(sequelizeError);

      // Act
      await BarangController.create(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation error',
        errors: ['Nama barang maksimum 100 karakter']
      });
    });

    test('should handle internal server error', async () => {
      // Arrange
      const error = new Error('Database connection failed');
      req.body = { namaBarang: 'Valid Name', jumlah: '5' };
      Barang.findOne.mockRejectedValue(error);

      // Act
      await BarangController.create(req, res);

      // Assert
      expect(mockConsoleError).toHaveBeenCalledWith('Error creating barang:', error);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Internal server error'
      });
    });
  });

  describe('addQuantity', () => {
    test('should add quantity to existing barang successfully', async () => {
      // Arrange
      const requestData = {
        namaBarang: '  Mouse Logitech  ',
        jumlah: '10'
      };

      const mockExistingBarang = {
        id: 2,
        namaBarang: 'Mouse Logitech',
        jumlah: 15,
        tanggalCatat: new Date('2023-01-01'),
        update: jest.fn().mockImplementation(function(updateData) {
          this.jumlah = updateData.jumlah;
          this.tanggalCatat = updateData.tanggalCatat;
          return Promise.resolve(this);
        })
      };

      req.body = requestData;
      Barang.findOne.mockResolvedValue(mockExistingBarang);

      // Act
      await BarangController.addQuantity(req, res);

      // Assert
      expect(Barang.findOne).toHaveBeenCalledWith({
        where: { namaBarang: 'Mouse Logitech' }
      });
      expect(mockExistingBarang.update).toHaveBeenCalledWith({
        jumlah: 25,
        tanggalCatat: expect.any(Date)
      });
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Jumlah barang berhasil ditambahkan',
        data: {
          id: 2,
          namaBarang: 'Mouse Logitech',
          jumlahSebelum: 15,
          jumlahDitambah: 10,
          jumlahSekarang: 25,
          tanggalCatat: expect.any(Date)
        }
      });
    });

    test('should return 404 when barang not found', async () => {
      // Arrange
      req.body = { namaBarang: 'Barang Tidak Ada', jumlah: '5' };
      Barang.findOne.mockResolvedValue(null);

      // Act
      await BarangController.addQuantity(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Barang tidak ditemukan. Gunakan endpoint create untuk menambah barang baru.'
      });
    });

    test('should handle validation errors', async () => {
      // Arrange
      validationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => [{ msg: 'Jumlah wajib diisi' }]
      });

      req.body = { namaBarang: 'Valid Name', jumlah: '' };

      // Act
      await BarangController.addQuantity(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation error',
        errors: ['Jumlah wajib diisi']
      });
    });
  });

  describe('getLatest', () => {
    test('should return latest 10 barang successfully', async () => {
      // Arrange
      const mockBarangList = [
        {
          id: 1,
          namaBarang: 'Laptop Dell',
          jumlah: 5,
          tanggalCatat: new Date('2023-12-01')
        },
        {
          id: 2,
          namaBarang: 'Mouse Logitech',
          jumlah: 10,
          tanggalCatat: new Date('2023-11-30')
        }
      ];

      Barang.findAll.mockResolvedValue(mockBarangList);

      // Act
      await BarangController.getLatest(req, res);

      // Assert
      expect(Barang.findAll).toHaveBeenCalledWith({
        order: [['tanggalCatat', 'DESC']],
        limit: 10,
        attributes: ['id', 'namaBarang', 'jumlah', 'tanggalCatat']
      });
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockBarangList
      });
    });

    test('should handle database error', async () => {
      // Arrange
      const error = new Error('Database error');
      Barang.findAll.mockRejectedValue(error);

      // Act
      await BarangController.getLatest(req, res);

      // Assert
      expect(mockConsoleError).toHaveBeenCalledWith('Error fetching barang:', error);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Internal server error'
      });
    });
  });

  describe('getAll', () => {
    test('should return paginated barang list with default pagination', async () => {
      // Arrange
      const mockResult = {
        count: 25,
        rows: [
          {
            id: 1,
            namaBarang: 'Laptop Dell',
            jumlah: 5,
            tanggalCatat: new Date()
          }
        ]
      };

      req.query = {}; // No pagination params
      Barang.findAndCountAll.mockResolvedValue(mockResult);

      // Act
      await BarangController.getAll(req, res);

      // Assert
      expect(Barang.findAndCountAll).toHaveBeenCalledWith({
        order: [['tanggalCatat', 'DESC']],
        limit: 10,
        offset: 0,
        attributes: ['id', 'namaBarang', 'jumlah', 'tanggalCatat']
      });
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockResult.rows,
        pagination: {
          currentPage: 1,
          totalPages: 3,
          totalItems: 25,
          itemsPerPage: 10
        }
      });
    });

    test('should return paginated barang list with custom pagination', async () => {
      // Arrange
      const mockResult = {
        count: 25,
        rows: []
      };

      req.query = { page: '2', limit: '5' };
      Barang.findAndCountAll.mockResolvedValue(mockResult);

      // Act
      await BarangController.getAll(req, res);

      // Assert
      expect(Barang.findAndCountAll).toHaveBeenCalledWith({
        order: [['tanggalCatat', 'DESC']],
        limit: 5,
        offset: 5,
        attributes: ['id', 'namaBarang', 'jumlah', 'tanggalCatat']
      });
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockResult.rows,
        pagination: {
          currentPage: 2,
          totalPages: 5,
          totalItems: 25,
          itemsPerPage: 5
        }
      });
    });

    test('should handle database error', async () => {
      // Arrange
      const error = new Error('Database error');
      Barang.findAndCountAll.mockRejectedValue(error);

      // Act
      await BarangController.getAll(req, res);

      // Assert
      expect(mockConsoleError).toHaveBeenCalledWith('Error fetching all barang:', error);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Internal server error'
      });
    });
  });

  describe('getByName', () => {
    test('should return barang by name successfully', async () => {
      // Arrange
      const mockBarang = {
        id: 1,
        namaBarang: 'Laptop Dell',
        jumlah: 5,
        tanggalCatat: new Date()
      };

      req.params = { namaBarang: '  Laptop Dell  ' };
      Barang.findOne.mockResolvedValue(mockBarang);

      // Act
      await BarangController.getByName(req, res);

      // Assert
      expect(Barang.findOne).toHaveBeenCalledWith({
        where: { namaBarang: 'Laptop Dell' },
        attributes: ['id', 'namaBarang', 'jumlah', 'tanggalCatat']
      });
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockBarang
      });
    });

    test('should return 404 when barang not found', async () => {
      // Arrange
      req.params = { namaBarang: 'Barang Tidak Ada' };
      Barang.findOne.mockResolvedValue(null);

      // Act
      await BarangController.getByName(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Barang tidak ditemukan'
      });
    });

    test('should handle database error', async () => {
      // Arrange
      const error = new Error('Database error');
      req.params = { namaBarang: 'Valid Name' };
      Barang.findOne.mockRejectedValue(error);

      // Act
      await BarangController.getByName(req, res);

      // Assert
      expect(mockConsoleError).toHaveBeenCalledWith('Error fetching barang by name:', error);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Internal server error'
      });
    });
  });
});