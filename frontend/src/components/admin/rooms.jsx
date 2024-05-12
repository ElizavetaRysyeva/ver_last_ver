import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";

import { addRooms, setRooms, updateRooms, setHotels } from "../reducerSlice";
import authHeader from "../../services/auth-header";

const Component = () => {
  const [Category, setCategory] = useState("");
  const [Description, setDescription] = useState("");
  const [Max_count, setMax_count] = useState("");
  const [Price, setPrice] = useState("");
  const [Image, setImage] = useState("");
  const [HotelId, setHotelId] = useState("");

  const apiBase = useSelector((state) => state.toolkit.apiBase);
  const room = useSelector((state) => state.toolkit.rooms);
  const hotel = useSelector((state) => state.toolkit.hotels);
  const dispatch = useDispatch();

  const [show, setShow] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedDescription, setSelectedDescription] = useState("");
  const [selectedMax_count, setSelectedMax_count] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [selectedHotelId, setSelectedHotelId] = useState("");

  const [visibleCount, setVisibleCount] = useState(12);
  const roomsToShow = room.slice(0, visibleCount);

  const handleShowMore = () => {
    setVisibleCount(visibleCount + 5);
  };

  useEffect(() => {
    axios
      .get(`${apiBase}/rooms?all=1`, { headers: authHeader() })
      .then((resp) => {
        dispatch(setRooms(resp.data));
      });

    axios.get(`${apiBase}/rooms`, { headers: authHeader() }).then((resp) => {
      dispatch(setRooms(resp.data));
    });
    axios.get(`${apiBase}/hotels`, { headers: authHeader() }).then((resp) => {
      dispatch(setHotels(resp.data));
    });
  }, [apiBase, dispatch]);

  const addNew = (e) => {
    e.preventDefault();

    axios
      .post(
        `${apiBase}/rooms`,
        {
          category_rus: Category,
          description: Description,
          max_count: +Max_count,
          price: +Price,
          room_img: Image,
          hotel_id: +HotelId,
        },
        { headers: authHeader() }
      )
      .then((resp) => {
        dispatch(addRooms(resp.data));

        setCategory("");
        setDescription("");
        setHotelId("");
        setImage("");
        setMax_count("");
        setPrice("");
      });
  };

  const handleClose = () => setShow(false);
  const handleShow = (id) => {
    const rooms = room.find((x) => x.id === id);

    if (!rooms) return;

    setSelectedId(rooms.id);
    setSelectedCategory(rooms.category_rus);
    setSelectedImage(rooms.room_img);
    setSelectedDescription(rooms.description);
    setSelectedMax_count(rooms.max_count);
    setSelectedPrice(rooms.price);
    setSelectedHotelId(rooms.hotel_id);

    setShow(true);
  };

  const handleSave = () => {
    const rooms = room.find((x) => x.id === selectedId);

    if (!rooms) return;

    const o = { ...rooms };
    o.id = selectedId;
    o.category_rus = selectedCategory;
    o.room_img = selectedImage;
    o.description = selectedDescription;
    o.max_count = selectedMax_count;
    o.price = selectedPrice;
    o.hotel_id = selectedHotelId;

    axios
      .put(`${apiBase}/rooms/${o.id}`, o, { headers: authHeader() })
      .then((resp) => {
        dispatch(updateRooms(o));
        handleClose();
      });
  };

  return (
    <div className="mb-5 p-2 border border-top-0 rounded-bottom">
      <h3>Список номеров</h3>

      {room && (
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>Категория</th>
              <th>Изображение</th>
              <th>Описание</th>
              <th>Вместительность</th>
              <th>Цена</th>
              <th>Отель</th>
              <th>Изменить</th>
            </tr>
          </thead>
          <tbody>
            {roomsToShow.length > 0 &&
              roomsToShow.map((x) => {
                return (
                  <tr key={x.id}>
                    <td>{x.id}</td>
                    <td>{x.category_rus}</td>
                    <td>{x.room_img}</td>
                    <td>{x.description}</td>
                    <td>{x.max_count}</td>
                    <td>{x.price}</td>
                    <td>{x.hotel_id}</td>
                    <td>
                      <Button variant="light" onClick={() => handleShow(x.id)}>
                        &#9998;
                      </Button>
                    </td>
                  </tr>
                );
              })}
            {!room.length && (
              <tr>
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

      <Row style={{ justifyContent: "center" }}>
        {visibleCount < room.length && (
          <Button
            variant="outline-secondary"
            onClick={handleShowMore}
            style={{ width: "10%" }}
          >
            Показать еще
          </Button>
        )}
      </Row>

      <h3>Добавить новый номер</h3>

      <Form onSubmit={addNew}>
        <Row>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Категория</Form.Label>
              <Form.Control
                type="text"
                name="category_rus"
                placeholder="Категория"
                value={Category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Изображение (ссылка)</Form.Label>
              <Form.Control
                type="text"
                name="room_img"
                placeholder="Изображение"
                value={Image}
                onChange={(e) => setImage(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Описание</Form.Label>
              <Form.Control
                type="text"
                name="description"
                placeholder="Описание"
                value={Description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
          </Col>

          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Вместительность</Form.Label>
              <Form.Control
                type="number"
                name="max_count"
                placeholder="Вместительность"
                value={Max_count}
                onChange={(e) => setMax_count(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Стоимость</Form.Label>
              <Form.Control
                type="number"
                name="price"
                placeholder="Стоимость"
                value={Price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Отель</Form.Label>
              <Form.Select
                name="hotel_id"
                placeholder="Отель"
                value={HotelId}
                onChange={(e) => setHotelId(e.target.value)}
                onBlur={(e) => setHotelId(e.target.value)}
              >
                <option disabled value="">
                  Выберите отель
                </option>
                {hotel &&
                  hotel.map((x) => (
                    <option key={x.id} value={x.id}>
                      {x.name}
                    </option>
                  ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Button variant="light" type="submit">
          Добавить
        </Button>
      </Form>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Изменить</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Категория</Form.Label>
            <Form.Control
              type="text"
              name="category_rus"
              placeholder="Категория"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              onBlur={(e) => setSelectedCategory(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Изображение</Form.Label>
            <Form.Control
              type="text"
              name="room_img"
              placeholder="Изображение"
              value={selectedImage}
              onChange={(e) => setSelectedImage(e.target.value)}
              onBlur={(e) => setSelectedImage(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Описание</Form.Label>
            <Form.Control
              type="text"
              name="description"
              placeholder="Описание"
              value={selectedDescription}
              onChange={(e) => setSelectedDescription(e.target.value)}
              onBlur={(e) => setSelectedDescription(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Вместительность</Form.Label>
            <Form.Control
              type="number"
              name="max_count"
              placeholder="Вместительность"
              value={selectedMax_count}
              onChange={(e) => setSelectedMax_count(e.target.value)}
              onBlur={(e) => setSelectedMax_count(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Стоимость</Form.Label>
            <Form.Control
              type="number"
              name="price"
              placeholder="Стоимость"
              value={selectedPrice}
              onChange={(e) => setSelectedPrice(e.target.value)}
              onBlur={(e) => setSelectedPrice(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Отель</Form.Label>
            <Form.Select
              name="hotel_id"
              placeholder="Отель"
              value={selectedHotelId}
              onChange={(e) => setSelectedHotelId(e.target.value)}
              onBlur={(e) => setSelectedHotelId(e.target.value)}
            >
              <option disabled value="">
                Выберите отель
              </option>
              {hotel &&
                hotel.map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.id} - {x.name}
                  </option>
                ))}
            </Form.Select>
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
