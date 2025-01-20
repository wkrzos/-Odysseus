"use client";
import { useState, useEffect } from "react";
import axiosInstance from "@/axiosConfig";
import Select from "react-select";
import "../globals.css";

interface MessageWithCountries {
  id: number;
  content: string;
  date: string;
  author: string;
  countries: string[];
}

interface Country {
  id: number;
  code: string;
  name: string;
}

const ConsulateMessages = () => {
  const [messages, setMessages] = useState<MessageWithCountries[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState<boolean>(false);
  const [selectedCountries, setSelectedCountries] = useState<number[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Pobierz listę krajów podczas ładowania komponentu
  useEffect(() => {
    const fetchCountries = async () => {
      setIsLoadingCountries(true);
      try {
        const response = await axiosInstance.get<Country[]>("common/countries");
        setCountries(response.data);
      } catch (err) {
        setError("Failed to load countries.");
      } finally {
        setIsLoadingCountries(false);
      }
    };
    fetchCountries();
  }, []);

  // Pobierz wiadomości na podstawie filtrów
  const handleSearch = async () => {
    if (validateSearch()) {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        selectedCountries.forEach((country) =>
          params.append("countries", country.toString())
        );
        if (startDate.length != 0) params.append("start_date", startDate);
        if (startDate.length != 0) params.append("end_date", endDate);

        const response = await axiosInstance.get<MessageWithCountries[]>(
          `communication/messages/with_countries?${params.toString()}`
        );
        setMessages(response.data);
      } catch (err) {
        setError("Failed to load messages.");
      } finally {
        setLoading(false);
      }
    }
  };

  const validateSearch = () => {
    const validationErrors: Record<string, string> = {};

    if (endDate != "" && startDate != "" && startDate > endDate) {
      validationErrors.end_date =
        "End date must be greater or equal to start date";
    }
    setValidationErrors(validationErrors);
    return validationErrors.end_date == undefined;
  };

  // Resetuj filtry
  const handleCancel = () => {
    setMessages([]);
  };

  return (
    <div className="container">
      <h1>Consulate Messages</h1>

      {/* Filtry */}
      <div className="filters">
        <h2>Filters</h2>
        <label>
          <strong>Start Date:</strong>
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
          <strong>End Date:</strong>
          <input
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setError(null);
            }}
          />
          {validationErrors.end_date && (
            <span className="error">{validationErrors.end_date}</span>
          )}
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
        <div className="buttons">
          <button onClick={handleSearch} className="btn search-btn">
            Search
          </button>
          <button onClick={handleCancel} className="btn cancel-btn">
            Cancel
          </button>
        </div>
      </div>

      {/* Wyświetlanie wiadomości */}
      {loading ? (
        <div>Loading messages...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : messages.length > 0 ? (
        <div className="messages">
          <h2>Messages</h2>
          <ul>
            {messages.map((message) => (
              <li key={message.id} className="message">
                <strong>Date:</strong> {message.date || "Unknown"} <br />
                <strong>Countries:</strong> {message.countries.join(", ")}{" "}
                <br />
                <strong>Author:</strong> {message.author} <br />
                <strong>Content:</strong> {message.content}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default ConsulateMessages;
