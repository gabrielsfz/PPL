"use client";
import { useState, useEffect } from 'react';
import ItemForm from '../components/ItemForm';
import ItemList from '../components/ItemList';
import { getItems, postItem } from '../services/api';

export default function Home() {
  const [items, setItems] = useState([]);

  const fetchItems = async () => {
    try {
      const res = await getItems();
      setItems(res.data.reverse());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchItems() }, []);

  const handleAdd = async (item) => {
    await postItem(item);
    fetchItems();
  };

  return (
    <main className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📦 Gudang – Pencatatan Barang Masuk</h1>
      <ItemForm onAdd={handleAdd} />
      <ItemList items={items} />
    </main>
  );
}