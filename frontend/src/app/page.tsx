'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';

// Nilai ini seharusnya sesuai dengan URL backend Express.js Anda
const API_BASE_URL = 'http://localhost:3000/api';

export default function HomePage() {
  // State untuk form
  const [namaBarang, setNamaBarang] = useState('');
  const [jumlah, setJumlah] = useState('');
  const [errors, setErrors] = useState({});
  
  // State untuk data dan UI
  const [daftarBarang, setDaftarBarang] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  
  // State untuk pencarian
  const [searchMode, setSearchMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Ambil data barang saat komponen dimuat
  useEffect(() => {
    fetchBarang();
  }, []);

  // Fungsi untuk mengambil daftar barang terbaru dari API
  const fetchBarang = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/barang/latest`);
      if (!response.ok) {
        throw new Error('Gagal mengambil data dari server');
      }
      const result = await response.json();
      
      if (result.success) {
        setDaftarBarang(result.data);
      } else {
        throw new Error(result.message || 'Gagal memuat data');
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setStatusMessage('Gagal memuat data: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Validasi form input
  const validateForm = () => {
    const newErrors = {};
    if (!namaBarang.trim()) {
      newErrors.namaBarang = 'Nama barang wajib diisi';
    } else if (namaBarang.length > 100) {
      newErrors.namaBarang = 'Nama barang maksimal 100 karakter';
    }

    const jumlahNum = parseInt(jumlah, 10);
    if (jumlah === '' || isNaN(jumlahNum) || jumlahNum <= 0) {
      newErrors.jumlah = 'Jumlah harus angka positif';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Fungsi untuk menangani submit form pencatatan barang baru
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const newItem = {
      namaBarang: namaBarang.trim(),
      jumlah: parseInt(jumlah, 10),
    };

    setIsLoading(true);
    setStatusMessage('Menyimpan data...');

    try {
      const response = await fetch(`${API_BASE_URL}/barang`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Gagal menyimpan data');
      }

      // Tampilkan pesan dari API
      setStatusMessage(result.message || 'Data berhasil disimpan!');
      
      // Refresh data setelah berhasil menambahkan item baru
      if (searchMode && result.data && result.data.namaBarang && 
          result.data.namaBarang.toLowerCase().includes(searchTerm.toLowerCase())) {
        searchBarang(); // Refresh hasil pencarian jika item yang ditambahkan sesuai dengan kata kunci pencarian
      } else {
        // Reset pencarian dan tampilkan semua barang
        setSearchMode(false);
        setSearchTerm('');
        await fetchBarang();
      }
      
      // Reset form
      setNamaBarang('');
      setJumlah('');
      setErrors({});
      
      // Hapus status message setelah 3 detik
      setTimeout(() => {
        setStatusMessage('');
      }, 3000);
    } catch (error) {
      console.error("Error saving data:", error);
      setStatusMessage('Gagal menyimpan data: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi untuk mencari barang berdasarkan nama
  const searchBarang = async () => {
    if (!searchTerm.trim()) {
      setSearchMode(false);
      return fetchBarang();
    }
    
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/barang/name/${encodeURIComponent(searchTerm.trim())}`);
      
      if (response.status === 404) {
        setDaftarBarang([]);
        setStatusMessage(`Barang dengan nama "${searchTerm}" tidak ditemukan`);
        return;
      }
      
      if (!response.ok) {
        throw new Error('Gagal mencari data');
      }
      
      const result = await response.json();
      
      if (result.success) {
        // Dari satu hasil menjadi array
        setDaftarBarang([result.data]);
      } else {
        throw new Error(result.message || 'Gagal mencari data');
      }
    } catch (error) {
      console.error("Error searching data:", error);
      setStatusMessage('Gagal mencari data: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi untuk menambah jumlah barang yang sudah ada
  const handleAddQuantity = async (namaBarangInput, jumlahInput) => {
    if (!namaBarangInput.trim() || isNaN(parseInt(jumlahInput)) || parseInt(jumlahInput) <= 0) {
      return setStatusMessage('Data tidak valid untuk penambahan jumlah');
    }
    
    setIsLoading(true);
    setStatusMessage('Menambah jumlah barang...');

    try {
      const response = await fetch(`${API_BASE_URL}/barang/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          namaBarang: namaBarangInput.trim(),
          jumlah: parseInt(jumlahInput)
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Gagal menambah jumlah barang');
      }

      // Tampilkan pesan dari API
      setStatusMessage(result.message || 'Jumlah barang berhasil ditambahkan!');
      
      // Refresh data
      if (searchMode) {
        searchBarang();
      } else {
        await fetchBarang();
      }
      
      // Hapus status message setelah 3 detik
      setTimeout(() => {
        setStatusMessage('');
      }, 3000);
    } catch (error) {
      console.error("Error adding quantity:", error);
      setStatusMessage('Gagal menambah jumlah: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi untuk reset pencarian
  const resetSearch = () => {
    setSearchTerm('');
    setSearchMode(false);
    fetchBarang();
  };

  // Fungsi untuk format tanggal
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  };

  return (
    <>
      <Head>
        <title>Pencatatan Barang Gudang</title>
        <meta name="description" content="Sistem pencatatan barang masuk gudang dengan backend API" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-4xl min-h-screen bg-gray-50">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-8">
          Sistem Pencatatan Barang Masuk
        </h1>

        {/* Status Message */}
        {statusMessage && (
          <div className={`mb-4 p-3 rounded-md ${statusMessage.includes('Gagal') || statusMessage.includes('tidak ditemukan') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {statusMessage}
          </div>
        )}

        {/* Form Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {/* Form Pencatatan Barang */}
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
              Catat Barang Baru
            </h2>
            <div>
              <label htmlFor="namaBarang" className="block text-sm font-medium text-gray-700 mb-1">
                Nama Barang:
              </label>
              <input
                type="text"
                id="namaBarang"
                value={namaBarang}
                onChange={(e) => setNamaBarang(e.target.value)}
                maxLength={100}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                aria-describedby="namaBarangError"
                disabled={isLoading}
              />
              {errors.namaBarang && <p className="mt-1 text-xs text-red-600" id="namaBarangError">{errors.namaBarang}</p>}
            </div>

            <div>
              <label htmlFor="jumlah" className="block text-sm font-medium text-gray-700 mb-1">
                Jumlah:
              </label>
              <input
                type="number"
                id="jumlah"
                value={jumlah}
                onChange={(e) => setJumlah(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                aria-describedby="jumlahError"
                disabled={isLoading}
              />
              {errors.jumlah && <p className="mt-1 text-xs text-red-600" id="jumlahError">{errors.jumlah}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out disabled:bg-indigo-400"
              disabled={isLoading}
            >
              {isLoading ? 'Menyimpan...' : 'Catat Barang'}
            </button>
            <p className="text-xs text-gray-500 mt-2">
              Catatan: Jika barang sudah ada, jumlahnya akan ditambahkan secara otomatis.
            </p>
          </form>

          {/* Form Tambah Jumlah */}
          <form onSubmit={(e) => {
            e.preventDefault();
            handleAddQuantity(namaBarang, jumlah);
          }} className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
              Tambah Jumlah Barang
            </h2>
            <div>
              <label htmlFor="namaBarangAdd" className="block text-sm font-medium text-gray-700 mb-1">
                Nama Barang (Harus Sudah Ada):
              </label>
              <input
                type="text"
                id="namaBarangAdd"
                value={namaBarang}
                onChange={(e) => setNamaBarang(e.target.value)}
                maxLength={100}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="jumlahAdd" className="block text-sm font-medium text-gray-700 mb-1">
                Jumlah Tambahan:
              </label>
              <input
                type="number"
                id="jumlahAdd"
                value={jumlah}
                onChange={(e) => setJumlah(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out disabled:bg-green-400"
              disabled={isLoading}
            >
              {isLoading ? 'Menyimpan...' : 'Tambah Jumlah'}
            </button>
            <p className="text-xs text-gray-500 mt-2">
              Gunakan ini khusus untuk menambah jumlah barang yang sudah ada di database.
            </p>
          </form>
        </div>

        {/* Bagian Pencarian */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-grow">
              <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700 mb-1">
                Cari Barang:
              </label>
              <input
                type="text"
                id="searchTerm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Masukkan nama barang..."
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                disabled={isLoading}
              />
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              <button
                type="button"
                onClick={() => {
                  setSearchMode(true);
                  searchBarang();
                }}
                className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out disabled:bg-blue-400"
                disabled={isLoading}
              >
                Cari
              </button>
              {searchMode && (
                <button
                  type="button"
                  onClick={resetSearch}
                  className="py-2 px-4 bg-gray-600 text-white font-semibold rounded-md shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150 ease-in-out"
                  disabled={isLoading}
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabel Daftar Barang */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
            {searchMode ? `Hasil Pencarian: "${searchTerm}"` : 'Daftar Barang Masuk (10 Terbaru)'}
          </h2>
          {isLoading && <p className="text-gray-500">Memuat data...</p>}
          {!isLoading && daftarBarang.length === 0 ? (
            <p className="text-gray-500">{searchMode ? 'Tidak ada barang yang sesuai dengan pencarian.' : 'Belum ada barang yang dicatat.'}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama Barang
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jumlah
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal Pencatatan
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {daftarBarang.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.namaBarang}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.jumlah}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(item.tanggalCatat)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}