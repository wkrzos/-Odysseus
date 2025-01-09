'use client';

import { useState, useEffect } from 'react';
import Select from 'react-select';
import '../globals.css';

interface Country {
  id: number;
  name: string;
}

// Updated: now the backend returns "countryId" and "countryName"
interface ReportData {
  countryId: number;
  countryName: string;
  tripStages: number;
}

export default function GenerateReport() {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedCountries, setSelectedCountries] = useState<number[]>([]);
  const [reportData, setReportData] = useState<ReportData[] | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingCountries, setIsLoadingCountries] = useState<boolean>(false);

  // 1. Fetch country list
  useEffect(() => {
    const fetchCountries = async () => {
      setIsLoadingCountries(true);
      try {
        const response = await fetch('http://localhost:8000/common/countries/');
        if (!response.ok) {
          throw new Error('Failed to load countries');
        }
        const data: Country[] = await response.json();
        setCountries(data);
      } catch (err) {
        console.error(err);
        setError('Could not load country list. Please try again.');
      } finally {
        setIsLoadingCountries(false);
      }
    };

    fetchCountries();
  }, []);

  // 2. Generate the report
  const handleGenerate = async () => {
    if (!startDate || !endDate) {
      setError('Please select both start and end dates.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/trip/trip-stages/report/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          startDate, 
          endDate, 
          countries: selectedCountries 
        }),
      });

      if (response.ok) {
        const data: ReportData[] = await response.json();
        setReportData(data);
        setError(null);
      } else {
        setError('Failed to generate the report. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to generate the report. Please try again.');
    }
  };

  // 3. Generate CSV (using the new countryName)
  const generateCSV = () => {
    if (!reportData) return;

    const csvContent = [
      ['Country', 'Trip Stages'],
      ...reportData.map((row) => [row.countryName, row.tripStages]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 4. Render the page
  return (
    <div style={{ maxWidth: 600, margin: 'auto', fontFamily: 'sans-serif' }}>
      <h1>Generate Trip Stages Report</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <label>
        <strong>Start Date:</strong>
        <input
          type="date"
          value={startDate}
          onChange={(e) => {
            setStartDate(e.target.value);
            setError(null);
          }}
          style={{ marginLeft: '0.5rem' }}
        />
      </label>
      <br />

      <label>
        <strong>End Date:</strong>
        <input
          type="date"
          value={endDate}
          onChange={(e) => {
            setEndDate(e.target.value);
            setError(null);
          }}
          style={{ marginLeft: '0.5rem' }}
        />
      </label>
      <br />

      <h3>Select Countries:</h3>
      {isLoadingCountries ? (
        <p>Loading countries...</p>
      ) : (
        <Select
          options={countries.map((c) => ({
            value: c.id,
            label: `${c.name} (ID: ${c.id})`,
          }))}
          isMulti
          onChange={(selected) =>
            setSelectedCountries(selected.map((s) => s.value as number))
          }
          value={countries
            .filter((c) => selectedCountries.includes(c.id))
            .map((c) => ({
              value: c.id,
              label: `${c.name} (ID: ${c.id})`,
            }))}
        />
      )}
      <br />

      <button 
        onClick={handleGenerate} 
        disabled={isLoadingCountries}
        style={{
          backgroundColor: '#007BFF',
          color: 'white',
          padding: '0.5rem 1rem',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        Generate Report
      </button>

      {reportData && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Report Data</h3>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2' }}>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Country</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Trip Stages</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((row) => (
                <tr key={row.countryId}>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                    {row.countryName}
                  </td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                    {row.tripStages}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button 
            onClick={generateCSV}
            style={{
              marginTop: '1rem',
              backgroundColor: 'green',
              color: 'white',
              padding: '0.5rem 1rem',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Download CSV
          </button>
        </div>
      )}
    </div>
  );
}
