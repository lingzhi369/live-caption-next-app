import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [transcripts, setTranscripts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const loggedInUser = localStorage.getItem('userEmail');
    if (!loggedInUser) {
      router.push('/login');
    } else {
      setUser(loggedInUser);
      fetchTranscripts(loggedInUser);
    }
  }, [router]);

  const fetchTranscripts = (email) => {
    const data = JSON.parse(localStorage.getItem('transcripts')) || [];
    const userTranscripts = data
      .filter((t) => t.email === email)
      .sort((a, b) => new Date(b.date) - new Date(a.date)); // Most recent first
    setTranscripts(userTranscripts);
  };

  const downloadTranscript = (content, index) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `transcript_${index + 1}.txt`;
    link.click();
  };

  const startNewSession = () => {
    router.push('/live-caption');
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '40px' }}>
      <h2>Welcome, {user}!</h2>

      {/* ✅ Start New Session Button at the Top Center */}
      <button
        onClick={startNewSession}
        style={{
          backgroundColor: 'var(--sunflower-orange)',
          color: 'white',
          padding: '12px 20px',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold',
          marginTop: '20px',
          marginBottom: '20px',
        }}
      >
        ➕ Start New Session
      </button>

      <h3>📜 History Transcripts</h3>
      {transcripts.length > 0 ? (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {transcripts.map((transcript, index) => (
            <li
              key={index}
              style={{
                margin: '20px auto',
                backgroundColor: '#f2f2f2',
                padding: '15px',
                borderRadius: '8px',
                maxWidth: '800px',
                textAlign: 'left',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div>{transcript.content}</div>
              <small>{new Date(transcript.date).toLocaleString()}</small>
              <br />
              <button
                onClick={() => downloadTranscript(transcript.content, index)}
                style={{
                  marginTop: '8px',
                  padding: '8px 16px',
                  backgroundColor: '#0070f3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                ⬇️ Download
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No transcripts found.</p>
      )}
    </div>
  );
}
