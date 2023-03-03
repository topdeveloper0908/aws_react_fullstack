import React, { createContext, useState } from "react";

export const MessagingContext = createContext();

export const MessagingContextProvider = ({ children }) => {
  const [participantID, setParticipantID] = useState("");
  const [participantName, setParticipantName] = useState("");
  const [participantProfilePicUrl, setParticipantProfilePicUrl] = useState("");
  const [participantProfileUrl, setParticipantProfileUrl] = useState("");

  return (
    <MessagingContext.Provider
      value={{
        participantID,
        participantName,
        participantProfilePicUrl,
        participantProfileUrl,
        setParticipantID,
        setParticipantName,
        setParticipantProfilePicUrl,
        setParticipantProfileUrl,
      }}
    >
      {children}
    </MessagingContext.Provider>
  );
};
