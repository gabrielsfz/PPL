import { render, screen } from '@testing-library/react';
import ItemList from '../components/ItemList';

test('render maksimal 10 entri', () => {
  const items = Array.from({ length: 12 }, (_, i) =>( { name: `Item${i}`, quantity: i+1, date: new Date().toISOString() }));
  render(<ItemList items={items} />);
  // 10 rows + header
  expect(screen.getAllByRole('row')).toHaveLength(11);
});