import React, { useState } from "react";
import Card from "react-bootstrap/Card";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

import BasicCard from "../../shared/components/BasicCard";

import "./FilterCard.css";
import { Form } from "react-bootstrap";

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
        <Form className="filter-card_options">
          <hr className="filter-card_divider" />
          <div className="filter-card_options-control filter-card_options-key-word-search">
            <Form.Control type="text" placeholder="Search" />
          </div>
          <hr className="filter-card_divider" />
          <div className="filter-card_options-control filter-card_options-availability">
            <Form.Check
              type="switch"
              id="show-pending"
              checked={true}
              label="Show pending"
            />
            <Form.Check type="switch" id="show-started" label="Show started" />
            <Form.Check type="switch" id="show-closed" label="Show closed" />
          </div>
          <hr className="filter-card_divider" />
          <div className="filter-card_options-control filter-card_options-sort">
          <Form.Check type="radio" id="sort-ascending" label="Sort by ascending price" />
          <Form.Check type="radio" id="show-closed" label="Sort by descending price" />
          </div>
          <Form.Control as="input" type="submit" varient="primary" value="Update"/>
        </Form>
      </Card.Body>
    </BasicCard>
  );
};

export default FilterCard;
