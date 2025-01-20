"use client";
import React, { useState, useEffect } from "react";
import axiosInstance from "@/axiosConfig";
import { ClientData, TripStage, Country } from "../types/types";
import ClientDataPage from "./clientData";
import TripStagesPage from "./tripStages";
import "../globals.css";

function App() {
  const [currentPage, setCurrentPage] = useState<"register" | "tripStages">(
    "register"
  );
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [tripStages, setTripStages] = useState<TripStage[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>[]>([]);

  const handleContinue = (data: ClientData) => {
    setClientData(data);
    setCurrentPage("tripStages");
  };

  const handleGoBack = () => {
    setCurrentPage("register");
  };

  const handleCancel = () => {};

  const handleFinish = async () => {
    const tripData = {
      clientData,
      tripStages,
    };
    try {
      const response = await axiosInstance.post("trip/create/", tripData);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axiosInstance.get<Country[]>("common/countries");
        setCountries(response.data);
      } catch (err) {
        //   setError("Failed to load countries.");
      }
    };
    fetchCountries();
  }, []);

  return (
    <div>
      {currentPage === "register" && (
        <ClientDataPage
          countries={countries}
          onContinue={handleContinue}
          initialData={clientData}
          onCancel={handleCancel}
        />
      )}
      {currentPage === "tripStages" && (
        <TripStagesPage
          onGoBack={handleGoBack}
          tripStages={tripStages}
          setTripStages={setTripStages}
          countries={countries}
          onFinish={handleFinish}
          warnings={warnings}
          setWarnings={setWarnings}
          errors={errors}
          setErrors={setErrors}
        />
      )}
    </div>
  );
}

export default App;
