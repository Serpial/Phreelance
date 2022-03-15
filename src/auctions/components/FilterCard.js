import React, { useRef, useState } from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

import BasicCard from "../../shared/components/BasicCard";

import "./FilterCard.css";
import { Button } from "react-bootstrap";

/**
 * Filter menu that contains options for the user to
 * refine their criteria.
 *
 * @param {Object} filterValues
 * List of values currently being used by the components.
 *
 * @param {Function} onSubmit
 * Callback functions that will take the new list of search terms.
 *
 * @returns Filter card component
 */
const FilterCard = ({ filterValues, onSubmit }) => {
  const [showOptions, setShowOptions] = useState(false);
  
  const searchString = useRef({ value: filterValues?.searchString });
  const showPending = useRef({ checked: filterValues?.showPending });
  const showStarted = useRef({ checked: filterValues?.showStarted });
  const showClosed = useRef({ checked: filterValues?.showClosed });
  const sortNewest = useRef({ checked: filterValues?.sortNewest });
  const sortOldest = useRef({ checked: filterValues?.sortOldest });

  const submitHandler = (event) => {
    event.preventDefault();
    if (!onSubmit) {
      console.log("updateResults function not defined.");
      return;
    }

    const filterTerms = {
      searchString: searchString.current.value,
      showPending: showPending.current.checked,
      showStarted: showStarted.current.checked,
      showClosed: showClosed.current.checked,
      sortNewest: sortNewest.current.checked,
      sortOldest: sortOldest.current.checked,
    };
    onSubmit(filterTerms);
  };

  return (
    <BasicCard className="filter-card">
      <Card.Title>
        <div
          className={`filter-card_title-arrow-container ${
            showOptions ? "" : "filter-card_title-arrow-container--closed"
          }`}
        >
          <FontAwesomeIcon
            icon={faChevronDown}
            className="filter-card_title-arrow"
            onClick={() => setShowOptions(!showOptions)}
          />
        </div>
        Filter
      </Card.Title>
      <Card.Body
        className={`filter-card_options-container ${
          showOptions ? "" : "filter-card_options-container--hidden"
        }`}
      >
        <Form className="filter-card_options" onSubmit={submitHandler}>
          <hr className="filter-card_divider" />
          <div className="filter-card_options-control filter-card_options-key-word-search">
            <Form.Control
              type="text"
              placeholder="Search"
              defaultValue={searchString.current?.value ?? ""}
              ref={searchString}
            />
          </div>
          <hr className="filter-card_divider" />
          <div className="filter-card_options-control filter-card_options-availability">
            <Form.Check
              className="filter-card_control"
              type="switch"
              defaultChecked={showPending.current?.checked ?? false}
              ref={showPending}
              label="Show pending auctions"
            />
            <Form.Check
              className="filter-card_control"
              type="switch"
              defaultChecked={showStarted.current?.checked ?? false}
              ref={showStarted}
              label="Show started auctions"
            />
            <Form.Check
              className="filter-card_control"
              type="switch"
              defaultChecked={showClosed.current?.checked ?? false}
              ref={showClosed}
              label="Show closed auctions"
            />
          </div>
          <hr className="filter-card_divider" />
          <div className="filter-card_options-control filter-card_options-sort">
            <Form.Check
              className="filter-card_control"
              type="radio"
              name="sort"
              defaultChecked={sortNewest.current?.checked ?? false}
              ref={sortNewest}
              label="Sort by upcoming auctions"
            />
            <Form.Check
              className="filter-card_control"
              type="radio"
              name="sort"
              defaultChecked={sortOldest.current?.checked ?? false}
              ref={sortOldest}
              label="Sort by oldest auctions"
            />
          </div>
          <Button
            className="filter_card-submit"
            as="input"
            type="submit"
            varient="primary"
            value="Update"
          />
        </Form>
      </Card.Body>
    </BasicCard>
  );
};

export default FilterCard;
