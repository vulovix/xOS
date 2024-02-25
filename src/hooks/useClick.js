import { useState, useCallback, useRef, useEffect } from "react";

const useOnClick = (singleClick, doubleClick, delay = 250) => {
  const [clickCount, setClickCount] = useState(0);
  const timerId = useRef(null);

  // Clear the timer if the component is unmounting
  useEffect(() => {
    return () => {
      if (timerId.current) {
        clearTimeout(timerId.current);
      }
    };
  }, []);

  const handler = useCallback(
    (e) => {
      // Cancel any ongoing event handling
      if (timerId.current) {
        clearTimeout(timerId.current);
        timerId.current = null;
      }

      if (clickCount === 0) {
        // Start the timer for detecting double click
        timerId.current = setTimeout(() => {
          singleClick(e); // Single click action
          setClickCount(0); // Reset click count
        }, delay);
        setClickCount(1);
      } else if (clickCount === 1) {
        // Double click detected
        doubleClick(e);
        setClickCount(0);
      }
    },
    [clickCount, singleClick, doubleClick, delay]
  );

  return handler;
};

export default useOnClick;
