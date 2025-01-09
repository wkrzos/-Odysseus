'use client';

import { useState, useEffect } from 'react';
import Select from 'react-select';
import '../globals.css';

interface Country {
  id: number;
  name: string;
}

interface ReportData {
  country: number;
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

  const handleGenerate = async () => {
    if (!startDate || !endDate) {
      setError('Please select both start and end dates.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/trip/trip-stages/report/', {
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
    } catch (err) {
      console.error(err);
      setError('Failed to generate the report. Please try again.');
    }
  };

  const generateCSV = () => {
    if (!reportData) return;

    const csvContent = [
      ['Country (ID)', 'Trip Stages'],
      ...reportData.map((row) => [row.country, row.tripStages]),
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

  return (
    <div style={{ maxWidth: 600 }}>
      <h1>Generate Report</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <label>
        Start Date:
        <input
          type="date"
          value={startDate}
          onChange={(e) => {
            setStartDate(e.target.value);
            setError(null);
          }}
        />
      </label>
      <br />

      <label>
        End Date:
        <input
          type="date"
          value={endDate}
          onChange={(e) => {
            setEndDate(e.target.value);
            setError(null);
          }}
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

      <button onClick={handleGenerate} disabled={isLoadingCountries}>
        Generate Report
      </button>

      {reportData && (
        <div>
          <h3>Report Data</h3>
          <pre>{JSON.stringify(reportData, null, 2)}</pre>
          <button onClick={generateCSV}>Download CSV</button>
        </div>
      )}
    </div>
  );
}
