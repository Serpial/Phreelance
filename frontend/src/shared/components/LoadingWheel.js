import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

import "./LoadingWheel.css";

/**
 * Loading wheel that will fill the screen.
 * @returns LoadingWheel
 */
const LoadingWheel = () => {
  return (
    <div className="loading-wheel">
      <FontAwesomeIcon
        className="loading-wheel_icon"
        icon={faSpinner}
        size="3x"
      />
    </div>
  );
};

export default LoadingWheel;
