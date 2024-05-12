import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import {
  addHotels,
  setHotels,
  setOrderStatuses,
  updateHotels,
} from "../reducerSlice";
import authHeader from "../../services/auth-header";
import { hotelTypes, starRatings } from "../../consts/consts";
import { Modal } from "react-bootstrap";

const Component = () => {
  const defNewObj = {
    name: "",
    address: "",
    stars: null,
    hotel_img: "",
    country_rus: "",
    city: "",
    propertyType: "",
  };

  const [newHotel, setNewHotel] = useState(defNewObj);
  const [visibleCount, setVisibleCount] = useState(12);
  const apiBase = useSelector((state) => state.toolkit.apiBase);
  const hotel = useSelector((state) => state.toolkit.hotels);
  const hotelsToShow = hotel.slice(0, visibleCount);
  const dispatch = useDispatch();

  const [show, setShow] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedPropertyType, setSelectedPropertyType] = useState("");
  const [selectedStars, setSelectedStars] = useState(0);
  const [selectedImage, setSelectedImage] = useState("");

  const handleShowMore = () => {
    setVisibleCount(visibleCount + 5);
  };

  useEffect(() => {
    axios.get(`${apiBase}/hotels`, { headers: authHeader() }).then((resp) => {
      dispatch(setHotels(resp.data));
    });

    axios
      .get(`${apiBase}/orders/info/statuses`, { headers: authHeader() })
      .then((resp) => {
        dispatch(setOrderStatuses(resp.data));
      });
  }, [apiBase, dispatch]);

  const addNew = (e) => {
    e.preventDefault();

    axios
      .post(`${apiBase}/hotels`, newHotel, { headers: authHeader() })
      .then((resp) => {
        dispatch(addHotels(resp.data));
        setNewHotel(defNewObj);
      });
  };

  const handleChange = (e) => {
    const newHotelTmp = { ...newHotel };

    newHotelTmp[e.target.name] = e.target.value;

    setNewHotel(newHotelTmp);
  };

  const handleShow = (id) => {
    const current = hotel.find((x) => x.id === id);

    if (!current) return;

    setSelectedId(current.id);
    setSelectedName(current.name);
    setSelectedImage(current.hotel_img);
    setSelectedAddress(current.address);
    setSelectedCity(current.city);
    setSelectedCountry(current.country_rus);
    setSelectedPropertyType(current.propertyType);
    setSelectedStars(current.stars);

    setShow(true);
  };

  const handleClose = () => setShow(false);

  const handleSave = () => {
    const current = hotel.find((x) => x.id === selectedId);

    if (!current) return;

    const o = { ...current };
    o.id = selectedId;
    o.name = selectedName;
    o.hotel_img = selectedImage;
    o.country_rus = selectedCountry;
    o.city = selectedCity;
    o.address = selectedAddress;
    o.stars = selectedStars;
    o.propertyType = selectedPropertyType;

    axios
      .put(`${apiBase}/hotels/${o.id}`, o, { headers: authHeader() })
      .then((resp) => {
        dispatch(updateHotels(o));
        handleClose();
      });
  };

  return (
    <div className="mb-5 p-2 border border-top-0 rounded-bottom">
      <h3>Список отелей</h3>
      <Row>
        <div className="table-responsive">
          {hotelsToShow && (
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Тип</th>
                  <th>Название</th>
                  <th>Страна</th>
                  <th>Город</th>
                  <th>Адрес</th>
                  <th>Звезд</th>
                  <th>Изображение</th>
                  <th>Изменить</th>
                </tr>
              </thead>
              <tbody>
                {hotelsToShow.length > 0 &&
                  hotelsToShow.map((x) => {
                    return (
                      <tr key={x.id}>
                        <td>{x.id}</td>
                        <td>{x.propertyType}</td>
                        <td>{x.name}</td>
                        <td>{x.country_rus}</td>
                        <td>{x.city}</td>
                        <td>{x.address}</td>
                        <td>{x.stars}</td>
                        <td>{x.hotel_img}</td>
                        <td>
                          <Button
                            variant="light"
                            onClick={() => handleShow(x.id)}
                          >
                            &#9998;
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                {!hotelsToShow.length && (
                  <tr>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </div>
      </Row>

      <Row style={{ justifyContent: "center" }}>
        {visibleCount < hotel.length && (
          <Button
            variant="outline-secondary"
            onClick={handleShowMore}
            style={{ width: "10%" }}
          >
            Показать еще
          </Button>
        )}
      </Row>

      <h3>Добавить новый отель</h3>

      <Form onSubmit={addNew}>
        <Row>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Название</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Название"
                value={newHotel.name}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Страна</Form.Label>
              <Form.Control
                type="text"
                name="country_rus"
                placeholder="Страна"
                value={newHotel.country_rus}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Город</Form.Label>
              <Form.Control
                type="text"
                name="city"
                placeholder="Город"
                value={newHotel.city}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Адрес</Form.Label>
              <Form.Control
                type="text"
                name="address"
                placeholder="Адрес"
                value={newHotel.address}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Тип</Form.Label>
              <Form.Select
                aria-label="Тип"
                name="propertyType"
                value={newHotel.propertyType}
                onChange={handleChange}
              >
                <option>Тип</option>
                {hotelTypes &&
                  hotelTypes.map((x) => (
                    <option key={x.english} value={x.english}>
                      {x.russian}
                    </option>
                  ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Звезд</Form.Label>
              <Form.Control
                type="number"
                name="stars"
                placeholder="Звезд"
                value={newHotel.stars}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Изображение</Form.Label>
              <Form.Control
                type="text"
                name="hotel_img"
                placeholder="Изображение"
                value={newHotel.hotel_img}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Button variant="light" type="submit">
          Добавить
        </Button>
      </Form>

      {/* Модальное окно для редактирования */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Изменить</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Название</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Название"
              value={selectedName}
              onChange={(e) => setSelectedName(e.target.value)}
              onBlur={(e) => setSelectedName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Тип</Form.Label>
            <Form.Select
              aria-label="Тип"
              name="propertyType"
              value={selectedPropertyType}
              onChange={(e) => {
                setSelectedPropertyType(
                  e.target.value === "Тип" ? "" : e.target.value
                );
              }}
            >
              <option>Тип</option>
              {hotelTypes &&
                hotelTypes.map((x) => (
                  <option key={x.english} value={x.english}>
                    {x.russian}
                  </option>
                ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Изображение</Form.Label>
            <Form.Control
              type="text"
              name="hotel_img"
              placeholder="Изображение"
              value={selectedImage}
              onChange={(e) => setSelectedImage(e.target.value)}
              onBlur={(e) => setSelectedImage(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Звездность</Form.Label>
            <Form.Select
              aria-label="Звезд"
              name="stars"
              value={selectedStars}
              onChange={(e) => {
                setSelectedStars(
                  e.target.value === "Звезд" ? null : e.target.value
                );
              }}
            >
              <option>Звезд</option>
              {starRatings &&
                starRatings.map((x) => (
                  <option key={x.number} value={x.number}>
                    {x.number}
                  </option>
                ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Страна</Form.Label>
            <Form.Control
              type="text"
              name="country_rus"
              placeholder="Страна"
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              onBlur={(e) => setSelectedCountry(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Город</Form.Label>
            <Form.Control
              type="text"
              name="city"
              placeholder="Город"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              onBlur={(e) => setSelectedCity(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Адрес</Form.Label>
            <Form.Control
              type="text"
              name="address"
              placeholder="Адрес"
              value={selectedAddress}
              onChange={(e) => setSelectedAddress(e.target.value)}
              onBlur={(e) => setSelectedAddress(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Отмена
          </Button>
          <Button variant="light" onClick={handleSave}>
            Сохранить
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Component;
