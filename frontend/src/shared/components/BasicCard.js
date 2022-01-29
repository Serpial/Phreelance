import React from "react";
import Card from "react-bootstrap/Card";

import "./BasicCard.css";

const BasicCard = (props) => {
  return (
    <Card className={`${props.className || ""} page-card`}>
      {props.children}
    </Card>
  );
};

export default BasicCard;