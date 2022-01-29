import React, { useState } from "react";
import Card from "react-bootstrap/Card";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

import BasicCard from "../../shared/components/BasicCard";

import "./FilterCard.css";

const FilterCard = (props) => {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <BasicCard className="filter-card">
      <Card.Title>
        <div className="filter-card_title-arrow-container">
        <FontAwesomeIcon
          icon={faChevronDown}
          className="filter-card_title-arrow"
          onClick={() => setShowOptions(!showOptions)}
        />
        </div>
        Filter
      </Card.Title>
      <Card.Body className="filter-card_options-container">
        <div className="filter-card_options">SampleBody</div>
      </Card.Body>
    </BasicCard>
  );
};

export default FilterCard;
