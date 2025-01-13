"use client";
import React, { useState, useEffect } from "react";
import axiosInstance from "@/axiosConfig";
import { components, operations } from "../types/api";

// Przykładowe dane w JSON
const messages_example = [
  {
    id: 1,
    countries: ["Poland", "Germany"],
    date: "2024-12-01",
    content: "Message from the Polish and German consulates.",
    author: "John Doe",
  },
  {
    id: 2,
    countries: ["Poland", "Germany"],
    date: "2024-12-01",
    content: "Message from the Polish and German consulates.",
    author: "John Doe",
  },
  {
    id: 3,
    countries: ["Poland", "Germany"],
    date: "2024-12-01",
    content: "Message from the Polish and German consulates.",
    author: "John Doe",
  },
  {
    id: 4,
    countries: ["Poland", "Germany"],
    date: "2024-12-01",
    content: "Message from the Polish and German consulates.",
    author: "John Doe",
  },
  {
    id: 5,
    countries: ["USA"],
    date: "2024-12-05",
    content: "Message from the US consulate.",
    author: "Jane Smith",
  },
  {
    id: 6,
    countries: ["Germany"],
    date: "2024-11-30",
    content: "Message from the German consulate.",
    author: "Max Mustermann",
  },
];

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
  const [filters, setFilters] = useState({
    countries: "",
    startDate: "",
    endDate: "",
  });
  const [filteredMessages, setFilteredMessages] = useState<
    MessageWithCountries[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true); // Indykator ładowania
  const [error, setError] = useState<string | null>(null); // Obsługa błędów

  // Pobierz dane z API podczas ładowania komponentu
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const messagesResponse = await axiosInstance.get<
          MessageWithCountries[]
        >("communication/messages/with_countries");
        setMessages(messagesResponse.data);
        setFilteredMessages(messagesResponse.data);

        const countriesResponse = await axiosInstance.get<Country[]>(
          "common/countries"
        );

        setCountries(countriesResponse.data);
      } catch (err) {
        setError("Failed to load messages.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Obsługa zmiany filtrów
  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Filtruj wiadomości
  const handleSearch = () => {
    const { countries, startDate, endDate } = filters;
    const filtered = messages.filter((message) => {
      const messageDate = new Date(message.date || "");
      const inCountry =
        !countries ||
        message.countries.some((country) =>
          country.toLowerCase().includes(countries.toLowerCase())
        );
      const isInDateRange =
        (!startDate || messageDate >= new Date(startDate)) &&
        (!endDate || messageDate <= new Date(endDate));
      return isInDateRange && inCountry;
    });
    setFilteredMessages(filtered);
  };

  // Resetuj filtry
  const handleCancel = () => {
    setFilters({ countries: "", startDate: "", endDate: "" });
    setFilteredMessages(messages); // Przywróć wszystkie wiadomości
  };

  // Obsługa ładowania lub błędu
  if (loading) return <div>Loading messages...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container">
      <h1>Consulate Messages</h1>

      {/* Filtry */}
      <div className="filters">
        <h2>Filters</h2>
        <div>
          <label className="label">
            Country:
            <select
              name="countries"
              value={filters.countries}
              onChange={handleFilterChange}
              className="input"
            >
              <option value="">All</option>
              {countries.map((country) => (
                <option key={country.id} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>
          </label>
          <label className="label">
            Start Date:
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="input"
            />
          </label>
          <label className="label">
            End Date:
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="input"
            />
          </label>
        </div>
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
      {filteredMessages.length > 0 ? (
        <div className="messages">
          <h2>Messages</h2>
          <ul>
            {filteredMessages.map((message) => (
              <li key={message.id} className="message">
                <strong>Date:</strong> {message.date || "Unknown"} <br />
                <strong>Countries:</strong>{" "}
                {message.countries.map((country) => country).join(", ")}
                <br />
                <strong>Author:</strong> {message.author} <br />
                <strong>Content:</strong> {message.content}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div>No messages found.</div>
      )}
    </div>
  );
};

export default ConsulateMessages;
