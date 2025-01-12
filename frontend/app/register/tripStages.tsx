import React, { useEffect, useState } from "react";
import {
  TripStage,
  Country,
  StayOrganizerType,
  TripWarning,
} from "../types/types";
import "../globals.css";
import axiosInstance from "@/axiosConfig";
import { ExecException } from "child_process";

interface TripStagesPageProps {
  onGoBack: () => void;
  tripStages: TripStage[];
  setTripStages: (stages: TripStage[]) => void;
  countries: Country[];
  onFinish: () => void;
}

function TripStagesPage({
  onGoBack,
  tripStages,
  setTripStages,
  countries,
  onFinish,
}: TripStagesPageProps) {
  const [warnings, setWarnings] = useState<string[]>([]);

  const loadWarning = async (index: number, country: Country | null) => {
    try {
      const countryID = country?.id;
      if (countryID) {
        const response = await axiosInstance.get<TripWarning>(
          `trip/trip-warning/${countryID.toString()}`
        );
        setWarnings((prevWarnings) => {
          const updatedWarnings = [...prevWarnings];
          updatedWarnings[index] = response.data.content;
          return updatedWarnings;
        });
      } else {
        setWarnings((prevWarnings) => {
          const updatedWarnings = [...prevWarnings];
          updatedWarnings[index] = "";
          return updatedWarnings;
        });
      }
    } catch (e) {
      console.error("Error loading warning:", e);
      setWarnings((prevWarnings) => {
        const updatedWarnings = [...prevWarnings];
        updatedWarnings[index] = "";
        return updatedWarnings;
      });
    }
  };

  const addWarning = () => {
    const newWarning: string = "";
    setWarnings([...warnings, newWarning]);
  };

  const removeWarning = (index: number) => {
    const updatedWarnings = warnings.filter((_, i) => i !== index);
    setWarnings(updatedWarnings);
  };
  const addStage = () => {
    const newStage: TripStage = {
      arrival_date: "",
      departure_date: "",
      address: {
        street: "",
        building_number: "",
        apartment_number: null,
        locality: "",
      },
      country: null,
      stayOrganizer: { name: "", type: 0 },
    };
    setTripStages([...tripStages, newStage]);
    addWarning();
  };

  const updateStage = (index: number, updatedStage: TripStage) => {
    const updatedStages = [...tripStages];
    updatedStages[index] = updatedStage;
    setTripStages(updatedStages);
  };

  const removeStage = (index: number) => {
    const updatedStages = tripStages.filter((_, i) => i !== index);
    setTripStages(updatedStages);
    removeWarning(index);
  };

  return (
    <div className="form-container container">
      <div className="header">
        <button onClick={onGoBack}>Cancel</button>
        <button onClick={onFinish}>Finish</button>
        <button onClick={addStage}>Add Stage</button>
      </div>

      {tripStages.map((stage, index) => (
        <div key={index} className="trip-stage">
          <h3>Stage {index + 1}</h3>
          <button onClick={() => removeStage(index)} className="remove-button">
            Remove
          </button>
          <div>
            <label>Arrival Date:</label>
            <input
              type="date"
              value={stage.arrival_date}
              onChange={(e) =>
                updateStage(index, {
                  ...stage,
                  arrival_date: e.target.value,
                })
              }
            />
          </div>
          <div>
            <label>Departure Date:</label>
            <input
              type="date"
              value={stage.departure_date}
              onChange={(e) =>
                updateStage(index, {
                  ...stage,
                  departure_date: e.target.value,
                })
              }
            />
          </div>
          <div>
            <label>Street:</label>
            <input
              type="text"
              value={stage.address.street}
              onChange={(e) =>
                updateStage(index, {
                  ...stage,
                  address: { ...stage.address, street: e.target.value },
                })
              }
            />
          </div>
          <div>
            <label>Building Number:</label>
            <input
              type="text"
              value={stage.address.building_number}
              onChange={(e) =>
                updateStage(index, {
                  ...stage,
                  address: {
                    ...stage.address,
                    building_number: e.target.value,
                  },
                })
              }
            />
          </div>
          <div>
            <label>Apartment Number:</label>
            <input
              type="text"
              value={stage.address.apartment_number || ""}
              onChange={(e) =>
                updateStage(index, {
                  ...stage,
                  address: {
                    ...stage.address,
                    apartment_number: e.target.value || null,
                  },
                })
              }
            />
          </div>
          <div>
            <label>Locality:</label>
            <input
              type="text"
              value={stage.address.locality}
              onChange={(e) =>
                updateStage(index, {
                  ...stage,
                  address: { ...stage.address, locality: e.target.value },
                })
              }
            />
          </div>
          <div>
            <label>Country:</label>
            <select
              value={stage.country?.id || ""}
              onChange={(e) => {
                updateStage(index, {
                  ...stage,
                  country:
                    countries.find(
                      (country) => country.id === parseInt(e.target.value)
                    ) || null,
                });

                loadWarning(
                  index,
                  countries.find(
                    (country) => country.id === parseInt(e.target.value)
                  ) || null
                );
              }}
            >
              <option value="" disabled>
                -- Select a Country --
              </option>
              {countries.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
          {warnings[index] && (
            <div className="div-warning">
              <label>⚠️Warning</label>
              <p>{warnings[index]}</p>
            </div>
          )}
          <div>
            <label>Stay Organizer Type:</label>
            <select
              value={stage.stayOrganizer.type}
              onChange={(e) =>
                updateStage(index, {
                  ...stage,
                  stayOrganizer: {
                    ...stage.stayOrganizer,
                    type: parseInt(e.target.value),
                  },
                })
              }
            >
              <option value={StayOrganizerType.PERSON}>Person</option>
              <option value={StayOrganizerType.TRAVEL_AGENCY}>
                Travel Agency
              </option>
              <option value={StayOrganizerType.EMPLOYER}>Employer</option>
            </select>
          </div>
          {stage.stayOrganizer.type === StayOrganizerType.TRAVEL_AGENCY && (
            <div>
              <label>Stay Organizer Name:</label>
              <input
                type="text"
                value={stage.stayOrganizer.name}
                onChange={(e) =>
                  updateStage(index, {
                    ...stage,
                    stayOrganizer: {
                      ...stage.stayOrganizer,
                      name: e.target.value,
                    },
                  })
                }
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default TripStagesPage;
