'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';

const MAX_ITEMS_DISPLAYED = 10;
const LOCAL_STORAGE_KEY = 'daftarBarangMasukTailwind'; // Menggunakan key berbeda untuk menghindari konflik jika ada versi lama

export default function HomePage() {
  const [namaBarang, setNamaBarang] = useState('');
  const [jumlah, setJumlah] = useState('');
  const [daftarBarang, setDaftarBarang] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const storedItems = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedItems) {
      try {
        const parsedItems = JSON.parse(storedItems);
        if (Array.isArray(parsedItems)) {
          setDaftarBarang(parsedItems);
        } else {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([]));
        }
      } catch (error) {
        console.error("Gagal memuat data dari localStorage:", error);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([]));
      }
    }
  }, []);

  useEffect(() => {
    // Hanya simpan jika daftarBarang sudah diinisialisasi dan ada perubahan
    // Ini mencegah penulisan berulang saat komponen pertama kali dimuat jika localStorage kosong
    const initialLoadComplete = daftarBarang.length > 0 || localStorage.getItem(LOCAL_STORAGE_KEY);
    if (initialLoadComplete) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(daftarBarang));
    }
  }, [daftarBarang]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const newItem = {
      id: Date.now(),
      nama: namaBarang,
      jumlah: parseInt(jumlah, 10),
      tanggal: new Date().toISOString(),
    };

    setDaftarBarang(prevItems => [newItem, ...prevItems].slice(0, MAX_ITEMS_DISPLAYED));

    setNamaBarang('');
    setJumlah('');
    setErrors({});
  };

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
        <title>Pencatatan Barang Gudang (Tailwind)</title>
        <meta name="description" content="Sistem pencatatan barang masuk gudang dengan Tailwind CSS" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-3xl min-h-screen bg-gray-50">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-8">
          Sistem Pencatatan Barang Masuk
        </h1>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-10 space-y-4">
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
            />
            {errors.jumlah && <p className="mt-1 text-xs text-red-600" id="jumlahError">{errors.jumlah}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
          >
            Catat Barang
          </button>
        </form>

        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
            Daftar Barang Masuk (10 Terbaru)
            </h2>
            {daftarBarang.length === 0 ? (
            <p className="text-gray-500">Belum ada barang yang dicatat.</p>
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
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.nama}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.jumlah}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(item.tanggal)}</td>
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