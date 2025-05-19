"use client";
import { useState } from 'react';
import ErrorMessage from './ErrorMessage';

export default function ItemForm({ onAdd }) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'Nama barang wajib diisi';
    if (!/^[1-9]\d*$/.test(quantity)) errs.quantity = 'Jumlah harus angka positif';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    await onAdd({ name: name.trim(), quantity: Number(quantity) });
    setName('');
    setQuantity('');
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
      <div>
        <label htmlFor="name" className="block font-medium">Nama Barang</label>
        <input
          id="name"
          type="text"
          maxLength={100}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded p-2"
        />
        <ErrorMessage message={errors.name} />
      </div>

      <div>
        <label htmlFor="quantity" className="block font-medium">Jumlah</label>
        <input
          id="quantity"
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full border rounded p-2"
        />
        <ErrorMessage message={errors.quantity} />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Catat Barang
      </button>
    </form>
  );
}