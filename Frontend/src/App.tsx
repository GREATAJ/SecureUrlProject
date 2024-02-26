import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [originalUrl, setOriginalUrl] = useState<string>('');
  const [hashedUrl, setHashedUrl] = useState<string>('');

  const generateHashedUrl = async () => {
    try {
      const response = await axios.post<{ hashedUrl: string }>('http://localhost:5000/api/hash', {
        originalUrl,
      });
      setHashedUrl(response.data.hashedUrl);
    } catch (error) {
      console.error('Error generating hashed URL:', error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={originalUrl}
        onChange={(e) => setOriginalUrl(e.target.value)}
      />
      <button onClick={generateHashedUrl}>Generate Hashed URL</button>
      {hashedUrl && <p>Hashed URL: {hashedUrl}</p>}
    </div>
  );
}

export default App;
