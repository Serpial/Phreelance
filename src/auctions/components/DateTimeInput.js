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
 * @param {Number} defaultTime
 * Time in seconds (not miliseconds)
 *
 * @param {Function} onChange
 * Callback function to pass back the newly acquired Date object (Not in UTC)
 *
 * @param {Boolean} disabled
 * Default disabled state of item
 *
 * @returns {JSX.Element} DateTimeInput
 */
const DateTimeInput = ({ defaultDate, defaultTime, onChange, disabled }) => {
  const [timeValue, setTimeValue] = useState(defaultTime || 43200);
  const [dateValue, setDateValue] = useState(defaultDate || "2025-08-12");
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
            onChange={(e) => setDateValue(e.value)}
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

export default DateTimeInput;
