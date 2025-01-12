import React, { useState } from "react";

interface TripStageData {
  arrivalDate?: Date;
  departureDate?: Date;
  locality: string;
  street: string;
  buildingNumber: string;
  apartmentNumber?: string;
  country: string;
  name?: string;
  type?: StayOrganizerType;
}

enum StayOrganizerType {
  PERSON,
  TRAVELAGENCY,
  EMPLOYER,
}

function TripStages({
  isClicked,
  pressButton,
}: {
  isClicked: boolean;
  pressButton: () => void;
}) {
  const [stages, setStages] = useState<TripStageData[]>([
    {
      arrivalDate: undefined,
      departureDate: undefined,
      street: "",
      locality: "",
      buildingNumber: "",
      apartmentNumber: "",
      name: "",
      country: "",
      type: undefined,
    },
  ]);

  const [validationErrors, setValidationErrors] = useState<
    Record<number, Record<string, string>>
  >({});

  const countries = ["Poland", "Germany", "USA"];

  const addStage = () => {
    setStages([
      ...stages,
      {
        arrivalDate: undefined,
        departureDate: undefined,
        street: "",
        locality: "",
        buildingNumber: "",
        apartmentNumber: "",
        name: "",
        country: "",
        type: undefined,
      },
    ]);
  };

  const updateStage = (index: number, key: keyof TripStageData, value: any) => {
    const updatedStages = [...stages];
    updatedStages[index][key] = value;
    setStages(updatedStages);
    if (validationErrors[index]) {
      const updatedErrors = { ...validationErrors[index] };
      delete updatedErrors[key];
      setValidationErrors({
        ...validationErrors,
        [index]: updatedErrors,
      });
    }
  };

  const validateStages = () => {
    const errors: Record<number, Record<string, string>> = {};
    stages.forEach((stage, index) => {
      const stageErrors: Record<string, string> = {};
      if (!stage.arrivalDate) {
        stageErrors.arrivalDate = "Arrival date is required.";
      }
      if (!stage.departureDate) {
        stageErrors.departureDate = "Departure date is required.";
      } else if (stage.arrivalDate && stage.departureDate < stage.arrivalDate) {
        stageErrors.departureDate =
          "Departure date must be the same as or after arrival date.";
      }
      if (!stage.country) {
        stageErrors.country = "Country is required.";
      }
      if (!stage.street) {
        stageErrors.street = "Street is required.";
      }
      if (!stage.locality) {
        stageErrors.locality = "Town is required.";
      }
      if (!stage.buildingNumber) {
        stageErrors.buildingNumber = "Building number is required.";
      }
      if (!stage.type) stageErrors.type = "Stay organizer is required";
      if (
        stage.type == StayOrganizerType.TRAVELAGENCY &&
        (!stage.name || stage.name.trim() === "")
      ) {
        stageErrors.name = "Travel agency name is required.";
      }
      if (Object.keys(stageErrors).length > 0) {
        errors[index] = stageErrors;
      }
    });
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFinish = () => {
    if (validateStages()) {
      console.log("Stages data:", stages);
      alert("Stages are valid!");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>Trip stages</h2>
      {stages.map((stage, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            marginBottom: "20px",
            padding: "10px",
          }}
        >
          <h4>Stage {index + 1}</h4>
          <div style={{ marginBottom: "10px" }}>
            <label>Arrival date: </label>
            <input
              type="date"
              value={
                stage.arrivalDate
                  ? stage.arrivalDate.toISOString().substring(0, 10)
                  : ""
              }
              onChange={(e) =>
                updateStage(
                  index,
                  "arrivalDate",
                  e.target.value ? new Date(e.target.value) : undefined
                )
              }
            />
            {validationErrors[index]?.arrivalDate && (
              <div style={{ color: "red" }}>
                {validationErrors[index]?.arrivalDate}
              </div>
            )}
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Departure date: </label>
            <input
              type="date"
              value={
                stage.departureDate
                  ? stage.departureDate.toISOString().substring(0, 10)
                  : ""
              }
              onChange={(e) =>
                updateStage(
                  index,
                  "departureDate",
                  e.target.value ? new Date(e.target.value) : undefined
                )
              }
            />
            {validationErrors[index]?.departureDate && (
              <div style={{ color: "red" }}>
                {validationErrors[index]?.departureDate}
              </div>
            )}
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Country: </label>
            <select
              value={stage.country}
              onChange={(e) => updateStage(index, "country", e.target.value)}
            >
              <option value="">Select a country</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
            {validationErrors[index]?.country && (
              <div style={{ color: "red" }}>
                {validationErrors[index]?.country}
              </div>
            )}
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Street: </label>
            <input
              type="text"
              value={stage.street}
              onChange={(e) => updateStage(index, "street", e.target.value)}
            />
            {validationErrors[index]?.street && (
              <div style={{ color: "red" }}>{validationErrors[index]?.street}</div>
            )}
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Town: </label>
            <input
              type="text"
              value={stage.locality}
              onChange={(e) => updateStage(index, "locality", e.target.value)}
            />
            {validationErrors[index]?.locality && (
              <div style={{ color: "red" }}>
                {validationErrors[index]?.locality}
              </div>
            )}
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Building number: </label>
            <input
              type="text"
              value={stage.buildingNumber}
              onChange={(e) =>
                updateStage(index, "buildingNumber", e.target.value)
              }
            />
            {validationErrors[index]?.buildingNumber && (
              <div style={{ color: "red" }}>
                {validationErrors[index]?.buildingNumber}
              </div>
            )}
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Apartment number: </label>
            <input
              type="text"
              value={stage.apartmentNumber}
              onChange={(e) =>
                updateStage(index, "apartmentNumber", e.target.value)
              }
            />
            {validationErrors[index]?.apartmentNumber && (
              <div style={{ color: "red" }}>
                {validationErrors[index]?.apartmentNumber}
              </div>
            )}
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Organizer type: </label>
            <select
              value={stage.type || ""}
              onChange={(e) =>
                updateStage(
                  index,
                  "type",
                  e.target.value
                    ? (e.target.value as unknown as StayOrganizerType)
                    : undefined
                )
              }
            >
              <option value="">Select type</option>
              <option value={StayOrganizerType.PERSON}>Person</option>
              <option value={StayOrganizerType.TRAVELAGENCY}>
                Travel Agency
              </option>
              <option value={StayOrganizerType.EMPLOYER}>Employer</option>
            </select>
            {validationErrors[index]?.type && (
              <div style={{ color: "red" }}>
                {validationErrors[index]?.type}
              </div>
            )}
          </div>
          {stage.type == StayOrganizerType.TRAVELAGENCY && (
            <div style={{ marginBottom: "10px" }}>
              <label>Travel agency name: </label>
              <input
                type="text"
                value={stage.name || ""}
                onChange={(e) => updateStage(index, "name", e.target.value)}
              />
              {validationErrors[index]?.name && (
                <div style={{ color: "red" }}>
                  {validationErrors[index]?.name}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button onClick={pressButton}>Back</button>
        <button onClick={addStage}>Add stage</button>
        <button onClick={handleFinish}>Finish</button>
      </div>
    </div>
  );
}

export default TripStages;
