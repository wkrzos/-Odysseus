'use client'

import { useState } from 'react';
import '../globals.css';

interface Country {
  id: number;
  name: string;
}

interface ReportData {
  country: string;
  tripStages: number;
}

export default function GenerateReport() {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [reportData, setReportData] = useState<ReportData[] | null>(null);
  const [countries] = useState<Country[]>([
    { id: 1, name: 'Poland' },
    { id: 2, name: 'Germany' },
    { id: 3, name: 'France' },
  ]); // Mocked countries
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!startDate || !endDate) {
      setError('Please select both start and end dates.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/trip-stages/report/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startDate, endDate, countries: selectedCountries }),
      });
      if (response.ok) {
        const data: ReportData[] = await response.json();
        setReportData(data);
        setError(null);
      } else {
        setError('Failed to generate the report. Please try again.');
      }
    } catch {
      setError('Failed to generate the report. Please try again.');
    }
  };

  const handleCountryChange = (country: string) => {
    setSelectedCountries((prev) =>
      prev.includes(country)
        ? prev.filter((c) => c !== country)
        : [...prev, country]
    );
  };

  return (
    <div>
      <h1>Generate Report</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <label>
        Start Date:
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </label>
      <br />
      <label>
        End Date:
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </label>
      <br />
      <h3>Select Countries:</h3>
      {countries.map((country) => (
        <label key={country.id}>
          <input
            type="checkbox"
            value={country.name}
            checked={selectedCountries.includes(country.name)}
            onChange={() => handleCountryChange(country.name)}
          />
          {country.name}
        </label>
      ))}
      <br />
      <button onClick={handleGenerate}>Generate Report</button>
      {reportData && (
        <div>
          <h3>Report Data</h3>
          <pre>{JSON.stringify(reportData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
