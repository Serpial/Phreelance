import React, { useEffect, useRef, useState } from "react";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import TimePicker from "react-bootstrap-time-picker";

/**
 * This creates a set of components for retreiving a datetime value
 * from a user.
 *
 * @param {String} defaultDate
 * Date in the Format "[Year]-[Month]-[Date]". I.e, "11-04-2022"
 *
 * @param {Function} onChange
 * Callback function to pass back the newly acquired Date object (Not in UTC)
 *
 * @param {Boolean} disabled
 * Default disabled state of item
 *
 * @returns {JSX.Element} DateTimeInput
 */
const DateTimeInput = ({ defaultDate, onChange, disabled }) => {
  const [dateValue, setDateValue] = useState(
    dateToString(defaultDate) || "2025-08-12"
  );
  const [timeValue, setTimeValue] = useState(
    dateToTimeValue(defaultDate) || 43200
  );

  const onChangeMethod = useRef(onChange);
  useEffect(() => {
    if (!dateValue) return;

    const [year, month, day] = dateValue.split("-");
    const dateObject = new Date(
      new Date(year, month - 1, day).getTime() + timeValue * 1000
    );


    if (!onChangeMethod.current) return;
    onChangeMethod.current(dateObject);
  }, [timeValue, dateValue, onChangeMethod]);

  return (
    <Container>
      <Row>
        <Col>
          <Form.Control
            disabled={disabled}
            type="date"
            defaultValue={dateValue}
            onChange={(e) => setDateValue(e.currentTarget.value)}
          />
        </Col>
        <Col>
          <TimePicker
            disabled={disabled}
            initialValue={timeValue}
            onChange={setTimeValue}
          />
        </Col>
      </Row>
    </Container>
  );
};

const dateToTimeValue = (date) => {
  const hours = date.getHours() * 60 * 60;
  const minutes = date.getMinutes() / 30 > 1 ? 30 * 60 : 0;
  return hours + minutes;
};

const dateToString = (date) => {
  let month = date.getMonth() + 1 + "";
  month = month < 10 ? "0" + month : month;

  const dateString = date.getFullYear() + "-" + month + "-" + date.getDate();
  return dateString;
};

export default DateTimeInput;
