import { useState } from 'react';
import { useRouter } from 'next/router';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    setMessage(data.message);

    if (response.ok) {
      router.push('/login');
    }
  };

  return (
    <div className="container">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
      {message && <p className="message">{message}</p>}
      <style jsx>{`
        .container {
          max-width: 400px;
          margin: 50px auto;
          background: white;
          padding: 20px;
          border-radius: var(--border-radius);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        h1 {
          color: var(--sunflower-orange);
          text-align: center;
        }
        .form {
          display: flex;
          flex-direction: column;
        }
        input {
          padding: 12px;
          margin: 10px 0;
          border: 1px solid #ccc;
          border-radius: var(--border-radius);
        }
        button {
          background-color: var(--sunflower-orange);
          color: white;
          padding: 12px;
          border: none;
          border-radius: var(--border-radius);
          cursor: pointer;
        }
        button:hover {
          background-color: #e69500;
        }
        .message {
          text-align: center;
          color: green;
        }
      `}</style>
    </div>
  );
}
