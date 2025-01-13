import React, { useState } from "react";

interface PersonalData {
  firstName: string;
  lastName: string;
  pesel: string;
  country: string;
  email: string;
  phone: string;
  locality: string;
  street: string;
  buildingNumber: string;
  apartmentNumber?: string;
}

var countries = ["Poland", "Germany"];

function PersonalData({
  isClicked,
  pressButton,
}: {
  isClicked: boolean;
  pressButton: () => void;
}) {
  const [formData, setFormData] = useState<PersonalData>({
    firstName: "",
    lastName: "",
    pesel: "",
    locality: "",
    apartmentNumber: "",
    street: "",
    buildingNumber: "",
    country: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState<Partial<PersonalData>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors: Partial<PersonalData> = {};

    // if (!formData.firstName) validationErrors.firstName = "First name is required.";
    // else if (formData.firstName.length < 2 || formData.firstName.length > 50)
    //   validationErrors.firstName = "First name must be between 2 and 50 characters";
    // if (!formData.lastName) validationErrors.lastName = "Last name is required";
    // else if (formData.lastName.length < 2 || formData.lastName.length > 50)
    //   validationErrors.lastName = "Last name must be between 2 and 50 characters";
    // if (!formData.email)
    //   validationErrors.email = "Email is required";
    // else if ( !/^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/.test(formData.email))
    //   validationErrors.email = "Invalid email"
    // if (!formData.phone) validationErrors.phone = "Phone number is required";
    // if (!formData.country) validationErrors.country = "Country is required"
    // if (!formData.pesel) validationErrors.pesel = "PESEL is required";
    // else if (!/^[0-9]{2}([02468]1|[13579][012])(0[1-9]|1[0-9]|2[0-9]|3[01])[0-9]{5}$/.test(formData.pesel)) validationErrors.pesel = "Invalid PESEL";
    // if (!formData.buildingNumber) validationErrors.buildingNumber = "Building number is required";
    // if (!formData.locality) validationErrors.locality = "Town is required";
    // if (!formData.street) validationErrors.street = "Street is required";

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      console.log("Personal data:", formData);
      pressButton();
    }
  };

  return (
    <div className="register-class">
      <h1>Trip registration</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="firstName">First name:</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
          {errors.firstName && (
            <span className="error">{errors.firstName}</span>
          )}
        </div>

        <div>
          <label htmlFor="lastName">Last name:</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
          {errors.lastName && <span className="error">{errors.lastName}</span>}
        </div>

        <div>
          <label htmlFor="pesel">PESEL</label>
          <input
            type="number"
            id="pesel"
            name="pesel"
            value={formData.pesel}
            onChange={handleChange}
          />
          {errors.pesel && <span className="error">{errors.pesel}</span>}
        </div>

        <div>
          <label htmlFor="country">Country</label>
          <select
            id="country"
            name="country"
            value={formData.country} // Powiązanie z aktualnym stanem
            onChange={
              (e) => setFormData({ ...formData, country: e.target.value }) // Aktualizacja stanu
            }
          >
            <option value="" disabled>
              -- Select a country --
            </option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
          {errors.country && <span className="error">{errors.country}</span>}
        </div>

        <div>
          <label htmlFor="locality">Town</label>
          <input
            type="string"
            id="locality"
            name="locality"
            value={formData.locality}
            onChange={handleChange}
          />
          {errors.locality && <span className="error">{errors.locality}</span>}
        </div>

        <div>
          <label htmlFor="street">Street</label>
          <input
            type="string"
            id="street"
            name="street"
            value={formData.street}
            onChange={handleChange}
          />
          {errors.street && <span className="error">{errors.street}</span>}
        </div>

        <div>
          <label htmlFor="buildingNumber">Building number</label>
          <input
            type="string"
            id="buildingNumber"
            name="buildingNumber"
            value={formData.buildingNumber}
            onChange={handleChange}
          />
          {errors.buildingNumber && (
            <span className="error">{errors.buildingNumber}</span>
          )}
        </div>

        <div>
          <label htmlFor="apartmentNumber">Apartment number</label>
          <input
            type="string"
            id="apartmentNumber"
            name="apartmentNumber"
            value={formData.apartmentNumber}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        <div>
          <label htmlFor="phone">Phone number:</label>
          <input
            type="number"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
          {errors.phone && <span className="error">{errors.phone}</span>}
        </div>

        <button type="submit">Continue</button>
      </form>
    </div>
  );
}

export default PersonalData;
