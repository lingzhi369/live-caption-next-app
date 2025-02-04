import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

export default function LiveCaption() {
  const [isListening, setIsListening] = useState(false);
  const [finalTranscript, setFinalTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const transcriptRef = useRef(null);
  const recognitionRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += transcript + ' ';
          } else {
            interim += transcript;
          }
        }

        setFinalTranscript((prev) => prev + final);
        setInterimTranscript(interim);
      };
    } else {
      alert('Speech Recognition is not supported in this browser.');
    }
  }, []);

  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [finalTranscript, interimTranscript]);

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const pauseListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const stopAndSave = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      saveTranscript();
    }
  };

  const saveTranscript = () => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) return;

    const transcripts = JSON.parse(localStorage.getItem('transcripts')) || [];
    const newTranscript = {
      email: userEmail,
      content: finalTranscript,
      date: new Date().toISOString(),
    };

    transcripts.push(newTranscript);
    localStorage.setItem('transcripts', JSON.stringify(transcripts));
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>🎤 Lingzhi's Live Captioning App</h1>

      <div
        ref={transcriptRef}
        style={{
          height: '300px',
          overflowY: 'auto',
          border: '1px solid #ccc',
          padding: '10px',
          marginBottom: '20px',
          backgroundColor: '#f9f9f9',
          borderRadius: '5px',
          textAlign: 'left',
          whiteSpace: 'pre-wrap',
        }}
      >
        {finalTranscript + interimTranscript || 'Transcripts will appear here...'}
      </div>

      <div>
        <button onClick={startListening} disabled={isListening} style={{ padding: '10px 20px', marginRight: '10px' }}>
          ▶️ Start Listening
        </button>
        <button onClick={pauseListening} disabled={!isListening} style={{ padding: '10px 20px', marginRight: '10px' }}>
          ⏸️ Pause
        </button>
        <button onClick={stopAndSave} style={{ padding: '10px 20px', backgroundColor: '#28a745', color: '#fff' }}>
          🛑 Stop & Save
        </button>
      </div>

      <button
        onClick={() => router.push('/dashboard')}
        style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#0070f3', color: '#fff' }}
      >
        🔙 Back to Dashboard
      </button>
    </div>
  );
}
