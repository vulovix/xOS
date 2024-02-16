import { useState } from "react";
import CommunicationProviderContext from "./context";

export default function CommunicationProvider(props) {
  const [isLoaded, setIsLoaded] = useState(false);
  const iFrameSelector = 'iframe[src="https://files.xos.dev"]';

  const retrieve = (key) => {
    document.querySelector(iFrameSelector).contentWindow.postMessage(
      {
        key,
        method: "RETRIEVE",
      },
      "*"
    );
  };

  const store = (key, value) => {
    document.querySelector(iFrameSelector).contentWindow.postMessage(
      {
        key,
        value,
        method: "STORE",
      },
      "*"
    );
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
