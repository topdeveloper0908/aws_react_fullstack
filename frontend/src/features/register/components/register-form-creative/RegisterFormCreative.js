import React, { useState, useRef } from "react";
import { ArtistInfoForm } from "./subcomponents/ArtistInfoForm.component";
import { AddressInfoForm } from "./subcomponents/AddressInfoForm.component";
import { PasswordForm } from "./subcomponents/PasswordForm.component";

export const RegisterFormCreative = ({
  accountExecCode,
  referrer,
  promoCode,
}) => {
  const [page, setPage] = useState("artist-info");

  const formData = useRef({
    type: "creative",
    email: "",
    fname: "",
    lname: "",
    displayName: "",
    category: "",
    tags: [],
    streetAddressLine1: "",
    streetAddressLine2: "",
    city: "",
    stateOrProvince: "",
    postalCode: "",
    country: "United States of America",
    lat: "",
    lng: "",
    cell: "",
    password: "",
    isDiscoverable: true,
    accountExecCode,
    referrerJoinCode: referrer,
    promoCode,
  });

  switch (page) {
    case "artist-info":
      return (
        <ArtistInfoForm parentFormData={formData} setParentPage={setPage} />
      );
    case "address-info":
      return (
        <AddressInfoForm parentFormData={formData} setParentPage={setPage} />
      );
    case "password":
      return <PasswordForm parentFormData={formData} setParentPage={setPage} />;
    default:
      return null;
  }
};
