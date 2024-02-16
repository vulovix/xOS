import { useState, useEffect, useRef } from "react";

const useTaskCompletion = (totalTasks, minimalTimeInSeconds) => {
  const [completedTasks, setCompletedTasks] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const startTimeRef = useRef(null);

  // Calculate the time at which the update can be considered complete
  const minimalEndTime = () => {
    return (startTimeRef.current || Date.now()) + minimalTimeInSeconds * 1000;
  };

  const markAsCompleted = () => {
    setCompletedTasks((prevCompletedTasks) => prevCompletedTasks + 1);
  };

  useEffect(() => {
    let interval;

    if (!isUpdating) {
      startTimeRef.current = Date.now(); // Record the start time when the update process starts
      setIsUpdating(true);
    }

    if (completedTasks < totalTasks) {
      const updateInterval = Math.max(
        (minimalTimeInSeconds * 1000) / totalTasks,
        1000
      ); // Ensure a minimal animation time
      interval = setInterval(() => {
        setPercentage((prevPercent) => {
          const increment = 100 / totalTasks;
          const nextCheckpoint = (completedTasks + 1) * increment;
          const newPercent = prevPercent + increment / 20; // Increment to animate between checkpoints
          return newPercent < nextCheckpoint ? newPercent : prevPercent;
        });
      }, updateInterval / 20);
    } else if (completedTasks === totalTasks && isUpdating) {
      const remainingTime = minimalEndTime() - Date.now();
      if (remainingTime > 0) {
        setTimeout(() => {
          interval = setInterval(() => {
            setPercentage((prevPercent) => {
              if (prevPercent < 100) {
                return prevPercent + 1; // Increment slowly to 100
              }
              clearInterval(interval); // Stop the interval when 100% is reached
              setIsUpdating(false); // Update is no longer in progress
              return 100; // Clamp the percentage at 100
            });
          }, 60); // How often to increment towards 100
        }, remainingTime);
      } else {
        setPercentage(100);
        setTimeout(() => {
          setIsUpdating(false);
        }, 1000);
      }
    }

    return () => {
      clearInterval(interval);
    };
  }, [completedTasks, minimalTimeInSeconds, totalTasks, isUpdating]);

  // Derived state to check if updating is complete
  const isComplete = percentage >= 100 && !isUpdating;

  return {
    markAsCompleted,
    completedTasks,
    isComplete,
    percentage: Math.round(percentage),
  };
};

export default useTaskCompletion;
