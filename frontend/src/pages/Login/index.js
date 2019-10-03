import React, { useState } from "react";
import api from "../../services/api";

const Login = ({ history }) => {
  const [email, setEmail] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();

    const res = await api.post("/sessions", { email });

    const { _id } = res.data;

    localStorage.setItem("user", _id);

    history.push("/dashboard");
  };

  return (
    <>
      <p>
        Ofereça <strong>spots</strong> para programadores e encontre{" "}
        <strong>talentos</strong> para sua empresa
      </p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="email">E-MAIL *</label>
        <input
          type="email"
          id="email"
          placeholder="Seu melhor e-mail"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <button className="btn" type="submit">
          entrar
        </button>
      </form>
    </>
  );
};

export default Login;
