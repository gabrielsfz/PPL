import { render, screen, fireEvent } from '@testing-library/react';
import ItemForm from '../components/ItemForm';

describe('ItemForm Validasi', () => {
  const mockOnAdd = jest.fn();

  beforeEach(() => mockOnAdd.mockClear());

  test('error jika nama kosong', () => {
    render(<ItemForm onAdd={mockOnAdd} />);
    fireEvent.click(screen.getByText('Catat Barang'));
    expect(screen.getByText('Nama barang wajib diisi')).toBeInTheDocument();
    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  test('error jika jumlah tidak valid', () => {
    render(<ItemForm onAdd={mockOnAdd} />);
    fireEvent.change(screen.getByLabelText(/Jumlah/), { target: { value: '0' } });
    fireEvent.click(screen.getByText('Catat Barang'));
    expect(screen.getByText('Jumlah harus angka positif')).toBeInTheDocument();
  });

  test('panggil onAdd jika valid', () => {
    render(<ItemForm onAdd={mockOnAdd} />);
    fireEvent.change(screen.getByLabelText(/Nama Barang/), { target: { value: 'Besi' } });
    fireEvent.change(screen.getByLabelText(/Jumlah/), { target: { value: '10' } });
    fireEvent.click(screen.getByText('Catat Barang'));
    expect(mockOnAdd).toHaveBeenCalledWith({ name: 'Besi', quantity: 10 });
  });
});