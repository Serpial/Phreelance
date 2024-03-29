import React from "react";
import Card from "react-bootstrap/Card";

import "./BasicCard.css";

/**
 * A Basic card with consistent styling throughout
 * the application.
 *
 * @param {String} className
 * Name of the card to allow the user to extend
 * the CSS of the basic card.
 *
 * @param {Function} onClick
 * Add a callback function for when the card is
 * clicked.
 *
 * @returns Basic card component.
 */
const BasicCard = ({ className, onClick, children }) => {
  return (
    <div className={`basic-card ${className || ""}`}>
      <Card onClick={onClick}>
        {children}
      </Card>
    </div>
  );
};

export default BasicCard;
