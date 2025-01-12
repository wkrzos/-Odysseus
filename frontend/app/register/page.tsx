"use client";
import React, { useState } from "react";

import "../css/register.css";
import PersonalData from "./personalData";
import TripStages from "./tripStages";

function RegisterPage() {
  const [isClicked, onClick] = useState(false);

  const pressButton = () => onClick(!isClicked);
  if (isClicked) {
    return (
      <TripStages isClicked={isClicked} pressButton={pressButton}></TripStages>
    );
  } else {
    return (
      <PersonalData
        isClicked={isClicked}
        pressButton={pressButton}
      ></PersonalData>
    );
  }
}

export default RegisterPage;
