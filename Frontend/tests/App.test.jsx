import { render, screen, fireEvent } from '@testing-library/react';
import Home from '../pages/index';
import * as api from '../services/api';

describe('Home Page', () => {
  test('renders form and list', async () => {
    jest.spyOn(api, 'getItems').mockResolvedValue({ data: [] });
    render(<Home />);
    expect(screen.getByText(/Gudang/)).toBeInTheDocument();
    expect(screen.getByText('Catat Barang')).toBeInTheDocument();
  });

  test('submits form and updates list', async () => {
    const newItem = { name: 'Test', quantity: 5, date: new Date().toISOString() };
    jest.spyOn(api, 'postItem').mockResolvedValue({ data: newItem });
    jest.spyOn(api, 'getItems').mockResolvedValue({ data: [newItem] });
    render(<Home />);
    fireEvent.change(screen.getByLabelText(/Nama Barang/), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/Jumlah/), { target: { value: '5' } });
    fireEvent.click(screen.getByText('Catat Barang'));
    expect(await screen.findByText('Test')).toBeInTheDocument();
  });
});