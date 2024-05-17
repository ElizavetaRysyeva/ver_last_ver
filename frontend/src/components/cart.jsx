import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import authHeader from "../services/auth-header";

import {
  setOrders,
  setOrderStatuses,
  setHotels,
  setRooms,
  deleteOrder,
  updateOrder,
} from "./reducerSlice";
import { Navigate } from "react-router-dom";

const Component = () => {
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

  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  const deleteCart = (id) => {
    if (!isLoggedIn || !id) {
      return;
    }
    axios
      .delete(`${apiBase}/orders/${id}`, { headers: authHeader() })
      .then((resp) => {
        dispatch(deleteOrder(id));
      });
  };
  const payCart = () => {
    if (!isLoggedIn) {
      return;
    }

    const ordersInCart = orders.filter((x) => x.status === 1);

    for (const oic of ordersInCart) {
      const id = oic.id;
      const tmp = { ...oic };
      tmp.status = 2;
      tmp.status_name = "pay";
      axios
        .put(`${apiBase}/orders/${id}`, tmp, { headers: authHeader() })
        .then((resp) => {
          dispatch(updateOrder(tmp));
        });
    }
  };

  return (
    <div className="mb-5">
      <h3>Корзина</h3>

      {orders.length > 0 &&
        hotels.length > 0 &&
        orderStatuses.length > 0 &&
        rooms.length > 0 && (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Статус</th>
                <th>Отель</th>
                <th>Номер</th>
                <th>Стоимость</th>
                <th>Удалить</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 &&
                orders
                  .filter((x) => x.status === 1)
                  .map((x) => {
                    const s = rooms.find((el) => +el.id === x.room_id);

                    return (
                      <tr key={x.id}>
                        <td>{x.id}</td>
                        <td>
                          {orderStatuses &&
                            orderStatuses.find((e) => +e.val === +x.status)
                              ?.name}
                        </td>
                        <td>
                          {hotels.find((el) => +el.id === x.hotel_id).name}
                        </td>
                        <td> {s.category}</td>
                        <td> {s.price}</td>
                        <td>
                          <Button
                            variant="danger"
                            style={{
                              color: "transparent",
                              textShadow: "0 0 0 white",
                            }}
                            onClick={() => deleteCart(x.id)}
                          >
                            &#10006;
                          </Button>
                        </td>
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
                  <td>-</td>
                </tr>
              )}
            </tbody>
          </Table>
        )}

      <Form.Group className="mb-3">
        {orders.length > 0 && (
          <Button variant="outline-primary" onClick={payCart}>
            Оплатить заказ
          </Button>
        )}
      </Form.Group>

      {(!orders || orders.length === 0) && (
        <div style={{ textAlign: `center` }}>
          <h4>Корзина пуста</h4>
        </div>
      )}
    </div>
  );
};

export default Component;
