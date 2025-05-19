let store = [];

export default function handler(req, res) {
  const { method } = req;
  if (method === 'GET') {
    return res.status(200).json(store);
  }
  if (method === 'POST') {
    const { name, quantity } = req.body;
    const date = new Date().toISOString();
    store.unshift({ name, quantity, date });
    return res.status(201).json({ name, quantity, date });
  }
  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${method} Not Allowed`);
}