import Col from "react-bootstrap/Col";

import Form from "react-bootstrap/Form";

import { hotelTypes, maxCount, starRatings } from "../../consts/consts";

import Row from "react-bootstrap/esm/Row";
import { useSelector } from "react-redux";
import { useEffect, useRef } from "react";

export const FilterHotel = (props) => {
  const {
    setSelectedHotelTypes,
    selectedStarRatings,
    setSelectedStarRatings,
    setSelectedCountry,
    setSelectedMaxCount,
  } = props;

  const handleStarRatingChange = (number) => {
    if (selectedStarRatings.includes(number)) {
      setSelectedStarRatings(
        selectedStarRatings.filter((item) => item !== number)
      );
    } else {
      setSelectedStarRatings([...selectedStarRatings, number]);
    }
  };

  const handleCountryChange = (event) => {
    setSelectedCountry(
      event.target.value === "Страна" ? "" : event.target.value
    );
  };

  // запись уникальных значений стран из поля country_rus отелей для последующей фильтрации
  const countryRef = useRef(new Set());
  const contr = useSelector((state) => {
    if (countryRef.current.size === 0) {
      state.toolkit.hotels.forEach((hotel) => {
        countryRef.current.add(hotel.country_rus);
      });
    }
    return Array.from(countryRef.current);
  });

  useEffect(() => {
    const currentCountryRef = countryRef.current;
    return () => {
      currentCountryRef.clear(); // Сброс значения при размонтировании компонента
    };
  }, []);

  return (
    <div>
      <Row>
        <Col xs={2} md={2}>
          <h6>Тип </h6>

          <Form.Group>
            {hotelTypes &&
              hotelTypes.map((x) => (
                <Form.Check
                  key={x.english}
                  type="checkbox"
                  label={x.russian}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedHotelTypes((prevTypes) => [
                        ...prevTypes,
                        x.english,
                      ]);
                    } else {
                      setSelectedHotelTypes((prevTypes) =>
                        prevTypes.filter((type) => type !== x.english)
                      );
                    }
                  }}
                />
              ))}
          </Form.Group>
        </Col>

        <Col xs={2} md={2}>
          <h6>Классификация </h6>
          <Form.Group>
            {starRatings &&
              starRatings.map((x) => (
                <Form.Check
                  key={x.number}
                  type="checkbox"
                  label={x.label}
                  checked={selectedStarRatings.includes(x.number)}
                  onChange={() => handleStarRatingChange(x.number)}
                />
              ))}
          </Form.Group>
        </Col>

        <Col xs={2} md={2}>
          <h6>Максимальная вместимость </h6>
          <Form.Group>
            {maxCount &&
              maxCount.map((x) => (
                <Form.Check
                  key={x.number}
                  type="checkbox"
                  label={x.number}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedMaxCount((prevTypes) => [
                        ...prevTypes,
                        x.number,
                      ]);
                    } else {
                      setSelectedMaxCount((prevTypes) =>
                        prevTypes.filter((type) => type !== x.number)
                      );
                    }
                  }}
                />
              ))}
          </Form.Group>
        </Col>

        <Col xs={2} md={2}>
          <h6>Страна</h6>
          <Form.Select aria-label="Страна" onClick={handleCountryChange}>
            <option>Страна</option>
            {contr &&
              contr.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
          </Form.Select>
        </Col>
      </Row>
    </div>
  );
};
