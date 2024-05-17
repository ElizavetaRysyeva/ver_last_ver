import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Table from "react-bootstrap/Table";
import axios from "axios";

import authHeader from "../services/auth-header";

import {
  setOrders,
  setOrderStatuses,
  setHotels,
  setRooms,
} from "./reducerSlice";

const Profile = () => {
  const user = useSelector((state) => state.toolkit.user);

  const apiBase = useSelector((state) => state.toolkit.apiBase);
  const hotels = useSelector((state) => state.toolkit.hotels);
  const rooms = useSelector((state) => state.toolkit.rooms);
  const orders = useSelector((state) => state.toolkit.orders);
  const orderStatuses = useSelector((state) => state.toolkit.orderStatuses);
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.toolkit.isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
    axios.get(`${apiBase}/orders`, { headers: authHeader() }).then((resp) => {
      dispatch(setOrders(resp.data));
    });

    axios
      .get(`${apiBase}/orders/info/statuses`, { headers: authHeader() })
      .then((resp) => {
        dispatch(setOrderStatuses(resp.data));
      });

    axios.get(`${apiBase}/hotels`, { headers: authHeader() }).then((resp) => {
      dispatch(setHotels(resp.data));
    });

    axios.get(`${apiBase}/rooms`, { headers: authHeader() }).then((resp) => {
      dispatch(setRooms(resp.data));
    });
  }, [apiBase, dispatch]);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>
          Имя пользователя: <strong>{user.username}</strong>
        </h3>
      </header>
      <p>
        <strong>Токен:</strong> {user.accessToken.substring(0, 1000)} ...{" "}
        {user.accessToken.substr(user.accessToken.length - 20)}
      </p>
      <p>
        <strong>Id:</strong> {user.id}
      </p>
      <p>
        <strong>Электронная почта:</strong> {user.email}
      </p>
      <strong>Права доступа:</strong>
      <ul>
        {user.roles &&
          user.roles.map((role, index) => <li key={index}>{role}</li>)}
      </ul>

      {orders &&
        orders.length > 0 &&
        hotels &&
        hotels.length > 0 &&
        orderStatuses &&
        orderStatuses.length > 0 &&
        rooms &&
        rooms.length > 0 && (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Статус</th>
                <th>Отель</th>
                <th>Номер</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 &&
                orders.map((x) => {
                  const s = rooms.find((el) => +el.id === x.room_id);

                  return (
                    <tr key={x.id}>
                      <td>{x.id}</td>
                      <td>
                        {orderStatuses &&
                          orderStatuses.find((e) => +e.val === +x.status)?.name}
                      </td>
                      <td>{hotels.find((el) => +el.id === x.hotel_id).name}</td>
                      <td> {s.category}</td>
                    </tr>
                  );
                })}
              {!orders.length && (
                <tr>
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
  );
};

export default Profile;
