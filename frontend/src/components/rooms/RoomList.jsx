import { Link } from "react-router-dom";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import Card from "react-bootstrap/Card";
import { useSelector } from "react-redux";

export const RoomList = (props) => {
  const { rooms, addCart, roomsToShow, visibleCount, setVisibleCount } = props;
  const isLoggedIn = useSelector((state) => state.toolkit.isLoggedIn);
  const user = useSelector((state) => state.toolkit.user);
  const isAdmin = user?.roles?.indexOf("ROLE_ADMIN") > -1;

  const handleShowMore = () => {
    setVisibleCount(visibleCount + 12);
  };

  return (
    <>
      <h1>
        Номера
        <Button variant="outline-secondary" as={Link} to={`/`}>
          На предыдущую страницу
        </Button>
      </h1>

      <hr />
      <div className="Row">
        <Row xs={3} md={3} className="g-4" style={{ paddingBottom: 20 }}>
          {roomsToShow &&
            roomsToShow.map((x) => (
              <Col>
                <Card style={{ height: "100%", padding: 10 }} key={x.id}>
                  <Card.Img
                    style={{ height: 300 }}
                    variant="top"
                    src={x.room_img}
                  />
                  <Card.Body>
                    <Card.Title style={{ textAlign: `center` }}>
                      <p style={{ fontSize: 25 }}>{x.category_rus}</p>
                    </Card.Title>

                    <Card.Text style={{ textAlign: `center` }}>
                      Вместительность: {x.max_count} чел.
                      <p>Стоимость: {x.price} руб/сутки</p>
                    </Card.Text>
                    <Card.Text style={{ textAlign: `justify` }}>
                      {x.description}
                    </Card.Text>
                    <Card.Text style={{ textAlign: `center` }}>
                      {isLoggedIn && !isAdmin && (
                        <Button
                          key={x.id}
                          variant="outline-primary"
                          className="m-1"
                          onClick={() => {
                            addCart(x.id);
                          }}
                        >
                          Забронировать номер
                        </Button>
                      )}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
        </Row>

        <Row style={{ justifyContent: "center" }}>
          {visibleCount < rooms.length && (
            <Button
              variant="outline-primary"
              onClick={handleShowMore}
              style={{ width: "10%" }}
            >
              Показать еще
            </Button>
          )}
        </Row>

        {!rooms.length && (
          <>
            <Card style={{ height: "100%", padding: 10 }}>
              <Card.Body>
                <Card.Text style={{ textAlign: `center` }}>
                  <h4>Свободных номеров нет :</h4>
                </Card.Text>
              </Card.Body>
            </Card>
          </>
        )}
      </div>
    </>
  );
};
