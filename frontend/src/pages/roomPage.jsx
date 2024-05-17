import { RoomList } from "../components/rooms/RoomList";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "axios";

import {
  setRooms,
  setOrderStatuses,
  addOrder,
} from "../components/reducerSlice";
import authHeader from "../services/auth-header";

export const RoomPage = () => {
  let { id } = useParams();

  const apiBase = useSelector((state) => state.toolkit.apiBase);
  const rooms = useSelector((state) => state.toolkit.rooms);
  const user = useSelector((state) => state.toolkit.user);
  const isLoggedIn = useSelector((state) => state.toolkit.isLoggedIn);

  const orderStatuses = useSelector((state) => state.toolkit.orderStatuses);
  const dispatch = useDispatch();

  const [visibleCount, setVisibleCount] = useState(12);
  const roomsToShow = rooms.slice(0, visibleCount);

  useEffect(() => {
    axios
      .get(`${apiBase}/rooms/?hotel_id=${encodeURIComponent(id)}`, {
        headers: authHeader(),
      })
      .then((resp) => {
        dispatch(setRooms(resp.data));
      });

    axios
      .get(`${apiBase}/orders/info/statuses`, { headers: authHeader() })
      .then((resp) => {
        dispatch(setOrderStatuses(resp.data));
      });

    console.log("id", id);
  }, [apiBase, dispatch, id]);

  const addCart = (s) => {
    const status = orderStatuses.find((x) => x.name === "В корзине").val;
    if (!id || !status || !s || !isLoggedIn || !user.id) {
      return;
    }

    axios
      .post(
        `${apiBase}/orders`,
        {
          user_id: +user.id,
          status: +status,
          hotel_id: +id,
          room_id: +s,
          status_name: "order",
        },
        { headers: authHeader() }
      )
      .then((resp) => {
        dispatch(addOrder(resp.data));
      });
  };

  return (
    <div style={{ paddingBottom: 30 }}>
      <RoomList
        rooms={rooms}
        roomsToShow={roomsToShow}
        visibleCount={visibleCount}
        setVisibleCount={setVisibleCount}
        addCart={addCart}
      />
    </div>
  );
};
