export default function ItemList({ items }) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-2">Daftar 10 Barang Terbaru</h2>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">No</th>
              <th className="border p-2">Nama</th>
              <th className="border p-2">Jumlah</th>
              <th className="border p-2">Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {items.slice(0, 10).map((item, i) => (
              <tr key={i}>
                <td className="border p-2 text-center">{i + 1}</td>
                <td className="border p-2">{item.name}</td>
                <td className="border p-2 text-center">{item.quantity}</td>
                <td className="border p-2 text-center">{new Date(item.date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }