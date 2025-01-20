"use client";
import React, { useState } from "react";
import { ClientData, Country } from "../types/types";
import "../globals.css";

interface RegisterPageProps {
  onContinue: (data: ClientData) => void;
  initialData: ClientData | null;
  countries: Country[];
  onCancel: () => void;
}

function ClientDataPage({
  onContinue,
  initialData,
  countries,
  onCancel,
}: RegisterPageProps) {
  const [formData, setFormData] = useState<ClientData>(
    initialData || {
      name: "",
      surname: "",
      pesel: "",
      address: {
        street: "",
        building_number: "",
        apartment_number: null,
        locality: "",
      },
      phone_number: "",
      email_address: "",
      resides_in: null,
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const validationErrors: Record<string, string> = {};

    // Walidacja imienia
    if (!formData.name) {
      validationErrors.name = "First name is required.";
    } else if (formData.name.length < 2 || formData.name.length > 50) {
      validationErrors.name = "First name must be between 2 and 50 characters.";
    }

    // Walidacja nazwiska
    if (!formData.surname) {
      validationErrors.surname = "Last name is required.";
    } else if (formData.surname.length < 2 || formData.surname.length > 50) {
      validationErrors.surname =
        "Last name must be between 2 and 50 characters.";
    }

    // Walidacja PESEL
    if (!formData.pesel) {
      validationErrors.pesel = "PESEL is required.";
    } else if (
      !/^[0-9]{2}([02468][1-9]|[13579][012])(0[1-9]|1[0-9]|2[0-9]|3[01])[0-9]{5}$/.test(
        formData.pesel
      )
    ) {
      validationErrors.pesel = "Invalid PESEL.";
    }

    // Walidacja adresu
    if (!formData.address.street) {
      validationErrors["address.street"] = "Street is required.";
    }
    if (!formData.address.building_number) {
      validationErrors["address.building_number"] =
        "Building number is required.";
    }
    if (!formData.address.locality) {
      validationErrors["address.locality"] = "Town is required.";
    }

    // Walidacja numeru telefonu
    if (!formData.phone_number) {
      validationErrors.phone_number = "Phone number is required.";
    }

    // Walidacja adresu e-mail
    if (!formData.email_address) {
      validationErrors.email_address = "Email is required.";
    } else if (
      !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email_address)
    ) {
      validationErrors.email_address = "Invalid email.";
    }

    // Walidacja kraju
    if (!formData.resides_in) {
      validationErrors.resides_in = "Country is required.";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
    // return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onContinue(formData); // Przekaż dane do rodzica tylko jeśli walidacja przeszła
    }
  };

  return (
    <div className="container">
      <h1>Register your trip</h1>
      <form onSubmit={handleSubmit}>
        {/* Imię */}
        <div>
          <label htmlFor="name">First Name*:</label>
          <input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>

        {/* Nazwisko */}
        <div>
          <label htmlFor="surname">Last Name*:</label>
          <input
            id="surname"
            value={formData.surname}
            onChange={(e) =>
              setFormData({ ...formData, surname: e.target.value })
            }
          />
          {errors.surname && <span className="error">{errors.surname}</span>}
        </div>

        {/* PESEL */}
        <div>
          <label htmlFor="pesel">PESEL*:</label>
          <input
            type="text"
            id="pesel"
            value={formData.pesel}
            onChange={(e) =>
              setFormData({ ...formData, pesel: e.target.value })
            }
          />
          {errors.pesel && <span className="error">{errors.pesel}</span>}
        </div>

        {/* Kraj */}
        <div>
          <label htmlFor="country">Country*:</label>
          <select
            id="country"
            value={formData.resides_in?.id || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                resides_in:
                  countries.find((c) => c.id === Number(e.target.value)) ||
                  null,
              })
            }
          >
            <option value="" disabled>
              Select a country
            </option>
            {countries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name}
              </option>
            ))}
          </select>

          {errors.resides_in && (
            <span className="error"> {errors.resides_in}</span>
          )}
        </div>

        {/* Adres */}
        <div>
          <label htmlFor="street">Street*:</label>
          <input
            type="text"
            id="street"
            value={formData.address.street}
            onChange={(e) =>
              setFormData({
                ...formData,
                address: { ...formData.address, street: e.target.value },
              })
            }
          />
          {errors["address.street"] && (
            <span className="error">{errors["address.street"]}</span>
          )}
        </div>

        <div>
          <label htmlFor="building_number">Building Number*:</label>
          <input
            type="text"
            id="building_number"
            value={formData.address.building_number}
            onChange={(e) =>
              setFormData({
                ...formData,
                address: {
                  ...formData.address,
                  building_number: e.target.value,
                },
              })
            }
          />
          {errors["address.building_number"] && (
            <span className="error">{errors["address.building_number"]}</span>
          )}
        </div>

        <div>
          <label htmlFor="locality">Locality*:</label>
          <input
            type="text"
            id="locality"
            value={formData.address.locality}
            onChange={(e) =>
              setFormData({
                ...formData,
                address: { ...formData.address, locality: e.target.value },
              })
            }
          />
          {errors["address.locality"] && (
            <span className="error">{errors["address.locality"]}</span>
          )}
        </div>

        <div>
          <label htmlFor="apartment_number">Apartment number:</label>
          <input
            type="text"
            id="apartment_number"
            value={
              formData.address.apartment_number
                ? formData.address.apartment_number
                : ""
            }
            onChange={(e) =>
              setFormData({
                ...formData,
                address: {
                  ...formData.address,
                  apartment_number:
                    e.target.value == null ? null : e.target.value,
                },
              })
            }
          />
        </div>

        {/* Telefon */}
        <div>
          <label htmlFor="phone_number">Phone Number*:</label>
          <input
            type="text"
            id="phone_number"
            value={formData.phone_number}
            onChange={(e) =>
              setFormData({ ...formData, phone_number: e.target.value })
            }
          />
          {errors.phone_number && (
            <span className="error">{errors.phone_number}</span>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email_address">Email*:</label>
          <input
            type="email"
            id="email_address"
            value={formData.email_address}
            onChange={(e) =>
              setFormData({ ...formData, email_address: e.target.value })
            }
          />
          {errors.email_address && (
            <span className="error">{errors.email_address}</span>
          )}
        </div>

        <button type="submit">Continue</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default ClientDataPage;
