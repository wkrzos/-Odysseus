"use client";

import { useState, useEffect } from "react";
import "../css/tripstages.css";

function TripStagesPage() {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/trip-stages/")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (!data || data.length === 0) return <p>No trip stages found</p>;

  return (
    <div className="trip-stages-container">
      <h1>Trip Stages</h1>
      <ul className="trip-stages-list">
        {data.map((stage: any) => (
          <li key={stage.id} className="trip-stage-card">
            <h2>Trip Stage {stage.id}</h2>
            <p>
              <strong>Arrival Date:</strong> {stage.arrival_date}
            </p>
            <p>
              <strong>Departure Date:</strong> {stage.departure_date}
            </p>
            <p>
              <strong>Address ID:</strong> {stage.address}
            </p>
            <p>
              <strong>Country ID:</strong> {stage.country}
            </p>
            <p>
              <strong>Trip ID:</strong> {stage.trip}
            </p>
            {stage.stay_organizer && (
              <p>
                <strong>Stay Organizer ID:</strong> {stage.stay_organizer}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TripStagesPage;
