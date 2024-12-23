'use client'

import { useState } from 'react';
import '../globals.css';

interface Country {
  id: number;
  name: string;
}

export default function SendSMS() {
  const [message, setMessage] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [countries] = useState<Country[]>([
    { id: 1, name: 'Poland' },
    { id: 2, name: 'Germany' },
    { id: 3, name: 'France' },
  ]); // Mocked countries
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const validateMessage = (msg: string): boolean => {
    return msg.length > 0 && msg.length <= 160; // Basic validation: non-empty and max 160 chars
  };

  const handleSend = async () => {
    if (!validateMessage(message)) {
      setError('Message must be between 1 and 160 characters.');
      return;
    }
    if (!country) {
      setError('Please select a country.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/send-sms/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, country }),
      });
      if (response.ok) {
        setSuccess(true);
        setError(null);
      } else {
        setError('Failed to send the message. Please try again.');
      }
    } catch {
      setError('Failed to send the message. Please try again.');
    }
  };

  return (
    <div>
      <h1>Send SMS</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>Message sent successfully!</p>}
      <textarea
        placeholder="Write your message here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <br />
      <select value={country} onChange={(e) => setCountry(e.target.value)}>
        <option value="">Select a country</option>
        {countries.map((c) => (
          <option key={c.id} value={c.name}>
            {c.name}
          </option>
        ))}
      </select>
      <br />
      <button onClick={handleSend}>Send Message</button>
    </div>
  );
}
