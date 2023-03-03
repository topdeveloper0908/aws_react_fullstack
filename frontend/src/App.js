import React from "react";
import "./App.css";

import { CSRFProtectionContextProvider } from "./services/csrf-protection/csrf-protection.context";
import { SearchContextProvider } from "./services/search/search.context";
import { AuthenticationContextProvider } from "./services/authentication/authentication.context";
import { OrdersContextProvider } from "./services/orders/orders.context";
import { SubscriptionsContextProvider } from "./services/subscriptions/subscriptions.context";
import { CalendarContextProvider } from "./services/calendar/calendar.context";
import { FilesContextProvider } from "./services/files/files.context";
import { Navigation } from "./infrastructure/navigation/index";
import { MessagingContextProvider } from "./services/messaging/messaging.context";

function App() {
  return (
    <div className="App">
      <CSRFProtectionContextProvider>
        <AuthenticationContextProvider>
          <SearchContextProvider>
            <OrdersContextProvider>
              <SubscriptionsContextProvider>
                <CalendarContextProvider>
                  <FilesContextProvider>
                    <MessagingContextProvider>
                      <Navigation />
                    </MessagingContextProvider>
                  </FilesContextProvider>
                </CalendarContextProvider>
              </SubscriptionsContextProvider>
            </OrdersContextProvider>
          </SearchContextProvider>
        </AuthenticationContextProvider>
      </CSRFProtectionContextProvider>
    </div>
  );
}

export default App;
