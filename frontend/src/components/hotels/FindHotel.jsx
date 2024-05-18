import React from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import axios from "axios"; // Не забудьте импортировать axios

export const FindHotel = (params) => {
  const { query, setQuery, setSendQuery, fetchData, apiBase } = params;

  const handleFindHotel = async () => {
    try {
      // Сделайте POST-запрос к вашему FastAPI серверу
      const response = await axios.post(`http://localhost:8000/recommendations/`, {
        country: "Italy", // Укажите нужные параметры
        number: 1, // Укажите нужные параметры
        features: query,
      });
      console.log(response.data); // Выводим результат в консоль
      setSendQuery(query);
      fetchData();
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };

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
            onClick={handleFindHotel}
            style={{ width: "100%" }}
          >
            Найти
          </Button>
        </Form.Group>
      </Col>
    </Row>
  );
};
