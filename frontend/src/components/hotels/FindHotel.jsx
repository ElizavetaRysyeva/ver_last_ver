import React from "react";
import { Button, Col, Form, Row } from "react-bootstrap";

export const FindHotel = (params) => {
  const { query, setQuery, setSendQuery, fetchData } = params;
  return (
    <Row>
      <Col xs={10} md={10}>
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            placeholder="Введите описание номера"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </Form.Group>
      </Col>
      <Col xs={2} md={2}>
        <Form.Group className="mb-3">
          <Button
            variant="outline-secondary"
            type="submit"
            onClick={() => {
              setSendQuery(query);
              fetchData();
            }}
            style={{ width: "100%" }}
          >
            Найти
          </Button>
        </Form.Group>
      </Col>
    </Row>
  );
};
