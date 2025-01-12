"use client";
import React, { useState } from "react";
import "../css/messages.css";

// Przykładowe dane w JSON
const messages = [
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

const ConsulateMessages = () => {
  const [filters, setFilters] = useState({
    countries: "",
    startDate: "",
    endDate: "",
  });
  const [filteredMessages, setFilteredMessages] = useState<any[]>([]);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    const { countries, startDate, endDate } = filters;
    const filtered = messages.filter((message) => {
      const messageDate = new Date(message.date);
      const isInCountry = countries
        ? message.countries.includes(countries)
        : true;
      const isInDateRange =
        (!startDate || messageDate >= new Date(startDate)) &&
        (!endDate || messageDate <= new Date(endDate));
      return isInCountry && isInDateRange;
    });
    setFilteredMessages(filtered);
  };

  const handleCancel = () => {
    setFilters({ countries: "", startDate: "", endDate: "" });
    setFilteredMessages([]);
  };

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
              <option value="Poland">Poland</option>
              <option value="USA">USA</option>
              <option value="Germany">Germany</option>
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
      {filteredMessages.length > 0 && (
        <div className="messages">
          <h2>Messages</h2>
          <ul>
            {filteredMessages.map((message) => (
              <li key={message.id} className="message">
                <strong>Date:</strong> {message.date} <br />
                <strong>Countries:</strong> {message.countries.join(", ")}{" "}
                <br />
                <strong>Author:</strong> {message.author} <br />
                <strong>Content:</strong> {message.content}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ConsulateMessages;
