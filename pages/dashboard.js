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
  }, []);

  const fetchTranscripts = (email) => {
    const data = JSON.parse(localStorage.getItem('transcripts')) || [];
    const userTranscripts = data
      .filter((t) => t.email === email)
      .sort((a, b) => new Date(b.date) - new Date(a.date)); // ✅ Sort by date (most recent first)
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
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px' }}>
        <h2>Welcome, {user}!</h2>
        <div style={{ fontSize: '30px', cursor: 'pointer' }}>👤</div>
      </div>

      <h3>📜 History Transcripts</h3>
      {transcripts.length > 0 ? (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {transcripts.map((transcript, index) => (
            <li key={index} style={{ margin: '10px 0', backgroundColor: '#f2f2f2', padding: '10px', borderRadius: '5px' }}>
              <div>{transcript.content}</div>
              <small>{new Date(transcript.date).toLocaleString()}</small>
              <br />
              <button onClick={() => downloadTranscript(transcript.content, index)} style={{ marginTop: '5px' }}>
                ⬇️ Download
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No transcripts found.</p>
      )}

      <button
        onClick={startNewSession}
        style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px' }}
      >
        ➕ Start New Session
      </button>
    </div>
  );
}
