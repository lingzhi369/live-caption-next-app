import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;
    const filePath = path.join(process.cwd(), 'users.json');

    const users = fs.existsSync(filePath)
      ? JSON.parse(fs.readFileSync(filePath, 'utf-8'))
      : [];

    const user = users.find((user) => user.email === email && user.password === password);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful', email });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
