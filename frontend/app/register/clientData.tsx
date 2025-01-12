"use client";
import React, { useState, useEffect } from "react";
import axiosInstance from "@/axiosConfig";
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onContinue(formData); // Przekaż dane do rodzica
  };

  return (
    <div className="container">
      <h1>Register your trip</h1>
      <form onSubmit={handleSubmit}>
        {/* Pola formularza */}
        <div>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="surname">Last Name*:</label>
          <input
            id="surname"
            value={formData.surname}
            onChange={(e) =>
              setFormData({ ...formData, surname: e.target.value })
            }
          />
        </div>

        <div>
          <label htmlFor="pesel">PESEL*:</label>
          <input
            type="number"
            id="pesel"
            name="pesel"
            value={formData.pesel}
            onChange={(e) =>
              setFormData({ ...formData, pesel: e.target.value })
            }
          />
        </div>

        <div>
          <label htmlFor="country">Country</label>
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
        </div>

        <div>
          <label htmlFor="street">Street*:</label>
          <input
            type="text"
            id="street"
            name="address.street"
            value={formData.address.street}
            onChange={(e) =>
              setFormData({
                ...formData,
                address: {
                  ...formData.address,
                  street: e.target.value,
                },
              })
            }
          />
        </div>

        <div>
          <label htmlFor="building_number">Building number*:</label>
          <input
            type="text"
            id="building_number"
            name="address.building_number"
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
        </div>

        <div>
          <label htmlFor="apartment_number">Apartment number:</label>
          <input
            type="text"
            id="apartment_number"
            name="address.apartment_number"
            value={formData.address.apartment_number || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                address: {
                  ...formData.address,
                  apartment_number:
                    e.target.value.length == 0 ? null : e.target.value,
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
            name="address.locality"
            value={formData.address.locality}
            onChange={(e) =>
              setFormData({
                ...formData,
                address: {
                  ...formData.address,
                  locality: e.target.value,
                },
              })
            }
          />
        </div>

        <div>
          <label htmlFor="phone_number">Phone number*:</label>
          <input
            type="number"
            id="phone_number"
            name="phone_number"
            value={formData.phone_number}
            onChange={(e) =>
              setFormData({ ...formData, phone_number: e.target.value })
            }
          />
        </div>

        <div>
          <label htmlFor="email_address">Email*:</label>
          <input
            type="email"
            id="email_address"
            name="email_address"
            value={formData.email_address}
            onChange={(e) =>
              setFormData({ ...formData, email_address: e.target.value })
            }
          />
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

// function ClientDataPage() {
//   const [countries, setCountries] = useState<Country[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const [isContinueClicked, setIsContinueClicked] = useState<boolean>(false);
//   const [clientData, setClientData] = useState<ClientData>({
//     name: "",
//     surname: "",
//     pesel: "",
//     address: {
//       street: "",
//       building_number: "",
//       apartment_number: null,
//       locality: "",
//     },
//     phone_number: "",
//     email_address: "",
//     resides_in: null,
//   });

//   // if (!formData.firstName) validationErrors.firstName = "First name is required.";
//   // else if (formData.firstName.length < 2 || formData.firstName.length > 50)
//   //   validationErrors.firstName = "First name must be between 2 and 50 characters";
//   // if (!formData.lastName) validationErrors.lastName = "Last name is required";
//   // else if (formData.lastName.length < 2 || formData.lastName.length > 50)
//   //   validationErrors.lastName = "Last name must be between 2 and 50 characters";
//   // if (!formData.email)
//   //   validationErrors.email = "Email is required";
//   // else if ( !/^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/.test(formData.email))
//   //   validationErrors.email = "Invalid email"
//   // if (!formData.phone) validationErrors.phone = "Phone number is required";
//   // if (!formData.country) validationErrors.country = "Country is required"
//   // if (!formData.pesel) validationErrors.pesel = "PESEL is required";
//   // else if (!/^[0-9]{2}([02468]1|[13579][012])(0[1-9]|1[0-9]|2[0-9]|3[01])[0-9]{5}$/.test(formData.pesel)) validationErrors.pesel = "Invalid PESEL";
//   // if (!formData.buildingNumber) validationErrors.buildingNumber = "Building number is required";
//   // if (!formData.locality) validationErrors.locality = "Town is required";
//   // if (!formData.street) validationErrors.street = "Street is required";

//   useEffect(() => {
//     const fetchCountries = async () => {
//       try {
//         const response = await axiosInstance.get<Country[]>("common/countries");
//         setCountries(response.data);
//       } catch (err) {
//         setError("Failed to load countries.");
//       }
//     };
//     fetchCountries();
//   }, []);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     if (name.startsWith("address.")) {
//       const field = name.split(".")[1];
//       setClientData((prevData) => ({
//         ...prevData,
//         address: {
//           ...prevData.address,
//           [field]: value,
//         },
//       }));
//     } else {
//       setClientData((prevData) => ({ ...prevData, [name]: value }));
//     }
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsContinueClicked(true);
//   };

//   return (
//     <div className="container">
//       <h1>Trip Registration</h1>
//       {error && <p className="error">{error}</p>}
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label htmlFor="name">First Name*:</label>
//           <input
//             type="text"
//             id="name"
//             name="name"
//             value={clientData.name}
//             onChange={handleChange}
//           />
//         </div>

//         <div>
//           <label htmlFor="surname">Last Name*:</label>
//           <input
//             type="text"
//             id="surname"
//             name="surname"
//             value={clientData.surname}
//             onChange={handleChange}
//           />
//         </div>

//         <div>
//           <label htmlFor="pesel">PESEL*:</label>
//           <input
//             type="number"
//             id="pesel"
//             name="pesel"
//             value={clientData.pesel}
//             onChange={handleChange}
//           />
//         </div>

//         <div>
//           <label htmlFor="country">Country*:</label>
//           <select
//             id="country"
//             name="resides_in"
//             value={clientData.resides_in?.id || ""}
//             onChange={(e) =>
//               setClientData((prevData) => ({
//                 ...prevData,
//                 resides_in:
//                   countries.find(
//                     (country) => country.id === parseInt(e.target.value)
//                   ) || null,
//               }))
//             }
//           >
//             <option value="" disabled>
//               -- Select a country --
//             </option>
//             {countries.map((country) => (
//               <option key={country.id} value={country.id}>
//                 {country.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label htmlFor="street">Street*:</label>
//           <input
//             type="text"
//             id="street"
//             name="address.street"
//             value={clientData.address.street}
//             onChange={handleChange}
//           />
//         </div>

//         <div>
//           <label htmlFor="building_number">Building number*:</label>
//           <input
//             type="text"
//             id="building_number"
//             name="address.building_number"
//             value={clientData.address.building_number}
//             onChange={handleChange}
//           />
//         </div>

//         <div>
//           <label htmlFor="apartment_number">Apartment number:</label>
//           <input
//             type="text"
//             id="apartment_number"
//             name="address.apartment_number"
//             value={clientData.address.apartment_number || ""}
//             onChange={handleChange}
//           />
//         </div>

//         <div>
//           <label htmlFor="phone_number">Phone number*:</label>
//           <input
//             type="number"
//             id="phone_number"
//             name="phone_number"
//             value={clientData.phone_number}
//             onChange={handleChange}
//           />
//         </div>

//         <div>
//           <label htmlFor="email_address">Email*:</label>
//           <input
//             type="email"
//             id="email_address"
//             name="email_address"
//             value={clientData.email_address}
//             onChange={handleChange}
//           />
//         </div>

//         <button type="submit">Continue</button>
//       </form>
//     </div>
//   );
// }

// export default ClientDataPage;
