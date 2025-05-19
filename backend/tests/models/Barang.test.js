// tests/models/Barang.test.js
const Barang = require('../../src/models/Barang');
require('../setup');

describe('Barang Model', () => {
  describe('Validations', () => {
    test('should create a valid barang', async () => {
      const barang = await Barang.create({
        namaBarang: 'Laptop Dell',
        jumlah: 5
      });

      expect(barang.id).toBeDefined();
      expect(barang.namaBarang).toBe('Laptop Dell');
      expect(barang.jumlah).toBe(5);
      expect(barang.tanggalCatat).toBeDefined();
    });

    test('should fail validation when namaBarang is empty', async () => {
      await expect(
        Barang.create({
          namaBarang: '',
          jumlah: 5
        })
      ).rejects.toThrow('Nama barang wajib diisi');
    });

    test('should fail validation when namaBarang is null', async () => {
      await expect(
        Barang.create({
          namaBarang: null,
          jumlah: 5
        })
      ).rejects.toThrow();
    });

    test('should fail validation when namaBarang exceeds 100 characters', async () => {
      const longName = 'A'.repeat(101);
      await expect(
        Barang.create({
          namaBarang: longName,
          jumlah: 5
        })
      ).rejects.toThrow('Nama barang maksimum 100 karakter');
    });

    test('should fail validation when jumlah is negative', async () => {
      await expect(
        Barang.create({
          namaBarang: 'Laptop Dell',
          jumlah: -1
        })
      ).rejects.toThrow('Jumlah harus angka positif');
    });

    test('should fail validation when jumlah is zero', async () => {
      await expect(
        Barang.create({
          namaBarang: 'Laptop Dell',
          jumlah: 0
        })
      ).rejects.toThrow('Jumlah harus angka positif');
    });

    test('should fail validation when jumlah is null', async () => {
      await expect(
        Barang.create({
          namaBarang: 'Laptop Dell',
          jumlah: null
        })
      ).rejects.toThrow();
    });

    test('should accept namaBarang with exactly 100 characters', async () => {
      const exactName = 'A'.repeat(100);
      const barang = await Barang.create({
        namaBarang: exactName,
        jumlah: 1
      });

      expect(barang.namaBarang).toBe(exactName);
    });
  });

  describe('Default Values', () => {
    test('should set tanggalCatat automatically', async () => {
      const beforeCreate = new Date();
      const barang = await Barang.create({
        namaBarang: 'Laptop Dell',
        jumlah: 5
      });
      const afterCreate = new Date();

      expect(barang.tanggalCatat).toBeInstanceOf(Date);
      expect(barang.tanggalCatat.getTime()).toBeGreaterThanOrEqual(beforeCreate.getTime());
      expect(barang.tanggalCatat.getTime()).toBeLessThanOrEqual(afterCreate.getTime());
    });
  });
});