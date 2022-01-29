import React from "react";
import Card from "react-bootstrap/Card";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

import BasicCard from "../../shared/components/BasicCard";

import "./FilterCard.css";

const FilterCard = (props) => {
  return (
    <BasicCard className="filter-card">
      <Card.Title>
        <FontAwesomeIcon icon={faChevronDown}/>Filter
      </Card.Title>
    </BasicCard>
  );
};

export default FilterCard;
