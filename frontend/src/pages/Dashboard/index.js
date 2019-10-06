import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import socketio from "socket.io-client";
import api from "../../services/api";

import "./styles.css";

const Dashboard = () => {
  const [spots, setSpots] = useState([]);
  const [reservations, setReservations] = useState([]);

  const user_id = localStorage.getItem("user");
  const socket = useMemo(
    () =>
      socketio("http://localhost:443", {
        query: { user_id }
      }),
    [user_id]
  );

  useEffect(() => {
    socket.on("booking_request", data => {
      setReservations([...reservations, data]);
    });
  }, [reservations, socket]);

  useEffect(() => {
    const loadSpots = async () => {
      const user_id = localStorage.getItem("user");
      const res = await api.get("/dashboard", {
        headers: { user_id }
      });

      setSpots(res.data);
    };

    loadSpots();
  }, []);

  async function handleAccpet(id) {
    await api.post(`/bookings/${id}/approvals`);

    setReservations(reservations.filter(reservation => reservation.id !== id));
  }

  async function handleReject(id) {
    await api.post(`/bookings/${id}/rejections`);

    setReservations(reservations.filter(reservation => reservation.id !== id));
  }

  return (
    <>
      <ul className="notifications">
        {reservations.map(reservation => (
          <li key={reservation._id}>
            <p>
              <strong>{reservation.user.email}</strong> está solicitando uma
              reserva em <strong>{reservation.spot.company}</strong> para a data
              <strong>{reservation.date}</strong>
            </p>
            <button
              className="accept"
              onClick={() => handleAccpet(reservation._id)}
            >
              ACEITAR
            </button>
            <button
              className="reject"
              onClick={() => handleReject(reservation._id)}
            >
              REJEITAR
            </button>
          </li>
        ))}
      </ul>

      <ul className="spot-list">
        {spots.map(spot => (
          <li key={spot._id}>
            <header style={{ backgroundImage: `url(${spot.thumbnail_url})` }} />
            <strong>{spot.company}</strong>
            <span>{spot.price ? `R$ ${spot.price}/dia` : "GRATUITO"}</span>
          </li>
        ))}
      </ul>

      <Link to="/new">
        <button className="btn">Cadastrar novo spot</button>
      </Link>
    </>
  );
};

export default Dashboard;
