import { useState } from "react";
import CommunicationProviderContext from "./context";

// This need to be updated to handle all iframes

// also apps need to have that part of code for communication

export default function CommunicationProvider(props) {
  const [isLoaded, setIsLoaded] = useState(false);
  const getIFrameSelector = (collection) =>
    `iframe[src="https://${collection}.xos.dev"]`;

  const retrieve = (collection, key) => {
    try {
      document
        .querySelector(getIFrameSelector(collection))
        .contentWindow.postMessage(
          {
            key,
            method: "RETRIEVE",
          },
          "*"
        );
    } catch (e) {
      console.log(`Unavailable to access ${collection} app.`);
    }
  };

  const store = (collection, key, value) => {
    try {
      document
        .querySelector(getIFrameSelector(collection))
        .contentWindow.postMessage(
          {
            key,
            value,
            method: "STORE",
          },
          "*"
        );
    } catch (e) {
      console.log(`Unavailable to access ${collection} app.`);
    }
  };

  const onIFrameLoad = () => {
    setIsLoaded(true);
  };

  return (
    <CommunicationProviderContext.Provider
      value={{
        isLoaded,
        store,
        retrieve,
        onLoad: onIFrameLoad,
      }}
    >
      {props.children}
    </CommunicationProviderContext.Provider>
  );
}
