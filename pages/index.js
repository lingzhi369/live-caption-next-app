import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to Lingzhi Live Caption App!</h1>
      <p>Please sign up or log in to continue.</p>

      <div style={{ marginTop: '20px' }}>
        <Link href="/signup">
          <button style={{ marginRight: '10px' }}>Sign Up</button>
        </Link>
        <Link href="/login">
          <button>Login</button>
        </Link>
      </div>
    </div>
  );
}
