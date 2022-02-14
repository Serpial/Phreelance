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
 * @param {Function} handleDateTime
 * Callback function to pass back the newly acquired Date object (Not in UTC)
 *
 * @returns {JSX.Element} DateTimeInput
 */
const DateTimeInput = ({ defaultDate, defaultTime, handleDateTime }) => {
  const [time, setTime] = useState(defaultTime || 0);
  const [date, setDate] = useState(defaultDate || "2025-08-12");
  useEffect(() => {
    if (!date) return;

    const [year, month, day] = date.split("-");
    const dateObject = new Date(
      new Date(year, month - 1, day).getTime() + time * 1000
    );
    handleDateTime({ date: dateObject });
  }, [time, date, handleDateTime]);

  const dateRef = useRef();
  return (
    <>
      <Container>
        <Row>
          <Col>
            <Form.Control
              type="date"
              value={date}
              ref={dateRef}
              onChange={() => setDate(dateRef.current.value)}
            />
          </Col>
          <Col>
            <TimePicker value={time} onChange={setTime} />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default DateTimeInput;
