// import React from "react";
import React, { useState } from "react";

import { Button, Card, Col, Form, Row } from "react-bootstrap";

import axios from "axios"; // Не забудьте импортировать axios
import five from "./actives/5stars.png";
import four from "./actives/4stars.png";
import three from "./actives/3stars.png";
import two from "./actives/2stars.png";
import one from "./actives/1stars.png";



export const FindHotel = (params) => {
  const { query, setQuery, setSendQuery, fetchData, apiBase } = params;
  const [hotel, setHotels] = useState([]);
  const {

    setSelectedCountry,
    setSelectedMaxCount,
  } = params

  const handleFindHotel = async () => {
    try {
      // Сделайте POST-запрос к вашему FastAPI серверу
      // const response = await axios.post(`http://localhost:8000/recommendations/`, {
      //   country: "Italy", // Укажите нужные параметры
      //   number: 1, // Укажите нужные параметры
      //   features: query,
      // });
      // const country = document.getElementById("countryInput").value; // Получаем значение страны из поля ввода
      // const number = parseInt(document.getElementById("numberInput").value); // Получаем значение числа из поля ввода

      const response = await axios.post('http://localhost:8000/recommendations/', {
        country: setSelectedCountry,
        number: setSelectedMaxCount,
  
        features: query,
      });

      console.log(response.data); // Выводим результат в консоль
      setSendQuery(query);
      setHotels(response.data); 
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
  {hotel.map((hotel) => (
    <Col key={hotel.id}>
      <Card style={{ height: "100%" }} key={hotel.id}>
        <Card.Img
          style={{
            height: "100%",
            objectFit: "cover",
            minHeight: 250,
            maxHeight: 250,
          }}
          variant="top"
          src={hotel.hotel_img}
        />
        <Card.Body>
          <Card.Text style={{ textAlign: 'center' }}>
            {hotel.stars === 5 && (
              <img
                src={five}
                style={{ height: 30 }}
                className="me-3"
                alt="five"
              />
            )}
            {hotel.stars === 4 && (
              <img
                src={four}
                style={{ height: 30 }}
                className="me-3"
                alt="four"
              />
            )}
            {hotel.stars === 3 && (
              <img
                src={three}
                style={{ height: 30 }}
                className="me-3"
                alt="three"
              />
            )}
            {hotel.stars === 2 && (
              <img
                src={two}
                style={{ height: 30 }}
                className="me-3"
                alt="two"
              />
            )}
            {hotel.stars === 1 && (
              <img
                src={one}
                style={{ height: 30 }}
                className="me-3"
                alt="one"
              />
            )}
          </Card.Text>
          <Card.Title style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 25 }}>{hotel.name}</p>
          </Card.Title>
          <Card.Img
            style={{
              height: "100%",
              objectFit: "cover",
              minHeight: 250,
              maxHeight: 250,
            }}
            variant="top"
            src={hotel.room_img}
          />
          <Card.Title style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 20 }}>{hotel.category}</p>
          </Card.Title>
          <Card.Text style={{ textAlign: 'center' }}>
            Описание номера: {hotel.description}
            <p>Стоимость: {hotel.price} руб/сутки</p>
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  ))}
</Row>


  );
};


