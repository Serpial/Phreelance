import React from "react";
import ReactDOM from "react-dom";
import Card from "react-bootstrap/Card";

import BasicCard from "./BasicCard";
import Backdrop from "./Backdrop";

import "./ModalCard.css";

/**
 * A Modal to appear above the content and offer the user some options.
 *
 * @param {String} title
 * Header title of the modal.
 *
 * @param {String} infoText
 * Allow you to provide context to the modal.
 *
 * @param {JSX.Element} children
 * Children elements that take action. These could be buttons.
 *
 * @param {Boolean} show
 * Whether or not the modal should currently be shown.
 *
 * @returns Modal
 */
const ModalCardOverlay = ({ title, infoText, children, show, className }) => {
  const content = (
    <BasicCard className={show ? ("modal-card " + className) : "modal-card__hide"}>
      <Card.Title>{title}</Card.Title>
      <Card.Body>
        {infoText}
        {infoText && <hr  />}
        {children}
      </Card.Body>
    </BasicCard>
  );
  return ReactDOM.createPortal(content, document.getElementById("modal-hook"));
};

const ModalCard = (props) => {
  return (
    <>
      {props.show && <Backdrop onClick={() => {}} />}
      <ModalCardOverlay {...props} />
    </>
  );
};

export default ModalCard;
