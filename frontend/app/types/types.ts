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
    id: number;
    code: string;
    name: string;
  }
  
  export interface StayOrganizer {
    name: string;
    type: StayOrganizerType;
  }
  
  export enum StayOrganizerType {
    PERSON,
    TRAVEL_AGENCY,
    EMPLOYER,
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