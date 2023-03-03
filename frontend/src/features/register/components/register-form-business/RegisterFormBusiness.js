import React, { useState, useRef } from "react";
import { BusinessInfoForm } from "./subcomponents/BusinessInfoForm.component";
import { AddressInfoForm } from "./subcomponents/AddressInfoForm.component";
import { PasswordForm } from "./subcomponents/PasswordForm.component";

export const RegisterFormBusiness = ({
  accountExecCode,
  referrer,
  promoCode,
}) => {
  const [page, setPage] = useState("business-info");

  const formData = useRef({
    type: "business",
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
    promoCode: promoCode,
  });

  switch (page) {
    case "business-info":
      return (
        <BusinessInfoForm parentFormData={formData} setParentPage={setPage} />
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
