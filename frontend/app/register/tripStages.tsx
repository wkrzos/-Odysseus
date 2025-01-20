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
  warnings: string[];
  setWarnings: (warnings: string[]) => void;
  errors: Record<string, string>[];
  setErrors: (errors: Record<string, string>[]) => void;
}

function TripStagesPage({
  onGoBack,
  tripStages,
  setTripStages,
  countries,
  onFinish,
  warnings,
  setWarnings,
  errors,
  setErrors,
}: TripStagesPageProps) {
  const validateTripStages = (): boolean => {
    const validationErrors: Record<string, string>[] = tripStages.map(
      () => ({})
    );

    tripStages.forEach((tripStage, index) => {
      // date validation
      if (!tripStage.arrival_date) {
        validationErrors[index].arrival_date = "Arrival date is required.";
      }
      if (!tripStage.departure_date) {
        validationErrors[index].departure_date = "Departure date is required.";
      } else if (tripStage.arrival_date > tripStage.departure_date) {
        validationErrors[index].departure_date =
          "Departure date must be the same as or after arrival date.";
      }
      // address validation
      if (!tripStage.address.street) {
        validationErrors[index].street = "Street is required.";
      }
      if (!tripStage.address.building_number) {
        validationErrors[index].building_number =
          "Building number is required.";
      }
      if (!tripStage.address.locality) {
        validationErrors[index].locality = "Locality is required.";
      }
      // country validation
      if (!tripStage.country) {
        validationErrors[index].country = "Country is required";
      }

      // stay organizer validation
      if (!tripStage.stayOrganizer.type) {
        validationErrors[index].stay_organizer_type = "Organizer is required";
      }
      if (
        tripStage.stayOrganizer.type == StayOrganizerType.TRAVEL_AGENCY &&
        !tripStage.stayOrganizer.name
      ) {
        validationErrors[index].stay_organizer_name =
          "Organizer name is required";
      }
    });
    setErrors(validationErrors);
    return validationErrors.every((error) => Object.keys(error).length === 0);
  };

  const loadWarning = async (index: number, country: Country | null) => {
    try {
      const countryID = country?.id;
      if (countryID) {
        const response = await axiosInstance.get<TripWarning>(
          `trip/trip-warning/${countryID.toString()}`
        );
        const updatedWarnings = [...warnings];
        updatedWarnings[index] = response.data.content;
        setWarnings(updatedWarnings);
      } else {
        const updatedWarnings = [...warnings];
        updatedWarnings[index] = "";
        setWarnings(updatedWarnings);
      }
    } catch (e) {
      console.error("Error loading warning:", e);
      const updatedWarnings = [...warnings];
      updatedWarnings[index] = "";
      setWarnings(updatedWarnings);
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
      stayOrganizer: { name: "", type: null },
    };
    setTripStages([...tripStages, newStage]);
    setErrors([...errors, {}]);
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
    const updatedErrors = errors.filter((_, i) => i !== index);
    setErrors(updatedErrors);
    removeWarning(index);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateTripStages()) {
      onFinish();
    }
  };

  return (
    <div className="form-container container">
      <h1>Enter details about your trip</h1>
      <div className="header">
        <button onClick={onGoBack}>Cancel</button>
      </div>
      <form>
        {tripStages.map((stage, index) => (
          <div key={index} className="trip-stage">
            <h3>Stage {index + 1}</h3>
            {index != 0 && (
              <button
                onClick={() => removeStage(index)}
                className="remove-button"
              >
                Remove
              </button>
            )}

            <div>
              <label htmlFor="arrival_date">Arrival Date:</label>
              <input
                type="date"
                id="arrival_date"
                value={stage.arrival_date}
                onChange={(e) =>
                  updateStage(index, {
                    ...stage,
                    arrival_date: e.target.value,
                  })
                }
              />
              {errors[index].arrival_date && (
                <span className="error">{errors[index].arrival_date}</span>
              )}
            </div>
            <div>
              <label htmlFor="departure_date">Departure Date:</label>
              <input
                type="date"
                id="departure_date"
                value={stage.departure_date}
                onChange={(e) =>
                  updateStage(index, {
                    ...stage,
                    departure_date: e.target.value,
                  })
                }
              />
              {errors[index].departure_date && (
                <span className="error">{errors[index].departure_date}</span>
              )}
            </div>
            <div>
              <label htmlFor="street">Street:</label>
              <input
                type="text"
                id="street"
                value={stage.address.street}
                onChange={(e) =>
                  updateStage(index, {
                    ...stage,
                    address: { ...stage.address, street: e.target.value },
                  })
                }
              />
              {errors[index].street && (
                <span className="error">{errors[index].street}</span>
              )}
            </div>
            <div>
              <label htmlFor="building_number">Building Number:</label>
              <input
                type="text"
                id="building_number"
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
              {errors[index].building_number && (
                <span className="error">{errors[index].building_number}</span>
              )}
            </div>
            <div>
              <label htmlFor="apartment_number">Apartment Number:</label>
              <input
                type="text"
                id="apartment_number"
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
              <label htmlFor="locality">Locality:</label>
              <input
                type="text"
                id="locality"
                value={stage.address.locality}
                onChange={(e) =>
                  updateStage(index, {
                    ...stage,
                    address: { ...stage.address, locality: e.target.value },
                  })
                }
              />
              {errors[index].locality && (
                <span className="error">{errors[index].locality}</span>
              )}
            </div>
            <div>
              <label htmlFor="country">Country:</label>
              <select
                id="country"
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
              {errors[index].country && (
                <span className="error">{errors[index].country}</span>
              )}
            </div>
            {warnings[index] && (
              <div className="div-warning">
                <label>⚠️Warning</label>
                <p>{warnings[index]}</p>
              </div>
            )}
            <div>
              <label htmlFor="stay_organizer_type">Stay Organizer Type:</label>
              <select
                id="stay_organizer_type"
                value={
                  stage.stayOrganizer.type != null
                    ? stage.stayOrganizer.type
                    : 0
                }
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
                <option value="0" disabled>
                  Select organizer
                </option>
                <option value={StayOrganizerType.PERSON}>Person</option>
                <option value={StayOrganizerType.TRAVEL_AGENCY}>
                  Travel Agency
                </option>
                <option value={StayOrganizerType.EMPLOYER}>Employer</option>
              </select>
              {errors[index].stay_organizer_type && (
                <span className="error">
                  {errors[index].stay_organizer_type}
                </span>
              )}
            </div>
            {stage.stayOrganizer.type === StayOrganizerType.TRAVEL_AGENCY && (
              <div>
                <label htmlFor="stay_organizer_name">
                  Stay Organizer Name:
                </label>
                <input
                  id="stay_organizer_name"
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
                {errors[index].stay_organizer_name && (
                  <span className="error">
                    {errors[index].stay_organizer_name}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
        <button type="button" onClick={addStage}>
          Add stage
        </button>
        <button
          type="submit"
          onClick={handleSubmit}
          // disabled={tripStages.length === 0}
        >
          Finish
        </button>
      </form>
    </div>
  );
}

export default TripStagesPage;
