import { useState } from "react";
import Nav from "react-bootstrap/Nav";

import Orders from "./admin/orders";
import Hotels from "./admin/hotels";
import Rooms from "./admin/rooms";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const Component = () => {
  const [selectedTab, setSelectedTab] = useState("Hotels");

  const handleChange = (eventKey) => {
    setSelectedTab(eventKey);
  };

  const isLoggedIn = useSelector((state) => state.toolkit.isLoggedIn);
  const user = useSelector((state) => state.toolkit.user);
  const isAdmin = user?.roles?.indexOf("ROLE_ADMIN") > -1;

  if (!isLoggedIn || !isAdmin) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <h2>Интерфейс администратора</h2>
      <Nav variant="tabs" defaultActiveKey="/home" onSelect={handleChange}>
        <Nav.Item>
          <Nav.Link eventKey="Hotels" active={selectedTab === "Hotels"}>
            Отели
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="Rooms" active={selectedTab === "Rooms"}>
            Номера
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="Orders" active={selectedTab === "Orders"}>
            Заказы
          </Nav.Link>
        </Nav.Item>
      </Nav>
      {selectedTab === "Hotels" && <Hotels />}
      {selectedTab === "Rooms" && <Rooms />}
      {selectedTab === "Orders" && <Orders />}
    </>
  );
};

export default Component;
