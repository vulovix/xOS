import { useEffect, useState } from "react";
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

  const onMessage = (e) => {
    if (e.origin.endsWith(".xos.dev")) {
      let { key, response, method } = e.data;
      if (method === "RESPONSE") {
        console.log({ key, value: JSON.parse(response) });
      }
    }
  };

  useEffect(() => {
    window.addEventListener("message", onMessage, false);

    return () => {
      window.removeEventListener("message", onMessage, false);
    };
  }, [isLoaded]);

  const onIFrameLoad = () => {
    setIsLoaded(true);
  };

  return (
    <CommunicationProviderContext.Provider
      value={{
        isLoaded,
        onLoad: onIFrameLoad,
      }}
    >
      {props.children}
    </CommunicationProviderContext.Provider>
  );
}
