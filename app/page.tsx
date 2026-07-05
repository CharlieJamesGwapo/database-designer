'use client';

import { useState } from 'react';

export default function Home() {
  const [appIdea, setAppIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [erd, setErd] = useState('');
  const [error, setError] = useState('');

  const handleGenerateERD = async () => {
    if (!appIdea.trim()) {
      setError('Please enter an app idea');
      return;
    }

    setLoading(true);
    setError('');
    setErd('');

    try {
      const response = await fetch('/api/generate-erd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appIdea }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to generate ERD');
      }

      const data = await response.json();
      setErd(data.erd);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      <h1>AI Database Designer</h1>

      <div style={{ marginBottom: '20px' }}>
        <textarea
          value={appIdea}
          onChange={(e) => setAppIdea(e.target.value)}
          placeholder="Describe your app idea..."
          style={{
            width: '100%',
            height: '100px',
            padding: '10px',
            fontFamily: 'inherit',
            marginBottom: '10px',
          }}
        />
        <button
          onClick={handleGenerateERD}
          disabled={loading}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? 'Generating...' : 'Generate ERD'}
        </button>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}

      {erd && (
        <pre
          style={{
            backgroundColor: '#f5f5f5',
            padding: '15px',
            borderRadius: '4px',
            overflow: 'auto',
          }}
        >
          {erd}
        </pre>
      )}
    </div>
  );
}
