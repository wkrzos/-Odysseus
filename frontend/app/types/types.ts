export interface ClientData {
    name: string;
    surname: string;
    pesel: string;
    address: Address;
    phone_number: string;
    email_address: string;
    resides_in: Country | null;
  }
  
 export interface Address {
    street: string;
    building_number: string;
    apartment_number: string | null;
    locality: string;
  }
  
  export interface Country {
    code: string;
    id: number;
    name: string;
  }

  export interface Message {
    id: number;
    content: string;
    date: string;
    recipientCountries: Country[];
    author: string;
  }
  
  export interface StayOrganizer {
    name: string;
    type: StayOrganizerType | null;
  }
  
  export enum StayOrganizerType {
    PERSON = 2,
    TRAVEL_AGENCY = 3,
    EMPLOYER = 4,
  }
  
  export interface TripStage {
    arrival_date: string;
    departure_date: string;
    address: Address;
    country: Country | null;
    stayOrganizer: StayOrganizer;
  }

  export interface TripWarning {
    content: string;
    country: Country;
  }