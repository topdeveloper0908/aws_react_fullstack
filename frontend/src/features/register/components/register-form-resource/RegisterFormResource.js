import React, { useState, useRef } from "react";
import { ResourceInfoForm } from "./subcomponents/ResourceInfoForm.component";
import { AddressInfoForm } from "./subcomponents/AddressInfoForm.component";
import { PasswordForm } from "./subcomponents/PasswordForm.component";

export const RegisterFormResource = ({
  accountExecCode,
  referrer,
  promoCode,
}) => {
  const [page, setPage] = useState("resource-info");

  const formData = useRef({
    type: "resource",
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
    phone: "",
    password: "",
    isDiscoverable: true,
    accountExecCode,
    referrerJoinCode: referrer,
    promoCode,
  });

  switch (page) {
    case "resource-info":
      return (
        <ResourceInfoForm parentFormData={formData} setParentPage={setPage} />
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
