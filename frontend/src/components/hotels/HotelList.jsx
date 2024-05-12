import { Button, Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

import five from "./actives/5stars.png";
import four from "./actives/4stars.png";
import three from "./actives/3stars.png";
import two from "./actives/2stars.png";
import one from "./actives/1stars.png";

export const HotelList = (props) => {
  const { allHotels, hotelsToShow, visibleCount, setVisibleCount } = props;

  const handleShowMore = () => {
    setVisibleCount(visibleCount + 12);
  };
  return (
    <div>
      <Row xs={3} md={3} className="g-4" style={{ paddingBottom: 20 }}>
        {allHotels &&
          hotelsToShow &&
          hotelsToShow.map((x) => (
            <Col key={x.id}>
              <Card style={{ height: "100%" }} key={x.id}>
                <Card.Img
                  style={{
                    height: "100%",
                    objectFit: "cover",
                    minHeight: 250,
                    maxHeight: 250,
                  }}
                  variant="top"
                  src={x.hotel_img}
                />
                <Card.Body>
                  <Card.Text style={{ textAlign: `center` }}>
                    {x.stars === 5 && (
                      <img
                        src={five}
                        style={{ height: `30px` }}
                        className="me-3"
                        alt="five"
                      />
                    )}
                    {x.stars === 4 && (
                      <img
                        src={four}
                        style={{ height: `30px` }}
                        className="me-3"
                        alt="five"
                      />
                    )}
                    {x.stars === 3 && (
                      <img
                        src={three}
                        style={{ height: `30px` }}
                        className="me-3"
                        alt="five"
                      />
                    )}
                    {x.stars === 2 && (
                      <img
                        src={two}
                        style={{ height: `30px` }}
                        className="me-3"
                        alt="five"
                      />
                    )}
                    {x.stars === 1 && (
                      <img
                        src={one}
                        style={{ height: `30px` }}
                        className="me-3"
                        alt="five"
                      />
                    )}
                  </Card.Text>
                  <Card.Title style={{ textAlign: `center` }}>
                    <p style={{ fontSize: 25 }}>{x.name}</p>
                  </Card.Title>

                  <Card.Text style={{ textAlign: `center` }}>
                    {x.country_rus}
                  </Card.Text>
                  <Card.Text style={{ textAlign: `center` }}>
                    <Button
                      variant="outline-primary"
                      as={Link}
                      to={`hotel/${x.id}`}
                    >
                      Посмотреть номера
                    </Button>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
      </Row>
      <Row style={{ justifyContent: "center" }}>
        {visibleCount < allHotels.length && (
          <Button
            variant="outline-primary"
            onClick={handleShowMore}
            style={{ width: "10%" }}
          >
            Показать еще
          </Button>
        )}
      </Row>
      {!allHotels.length && <h3>Отели не найдены</h3>}
    </div>
  );
};
