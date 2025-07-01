const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
require("dotenv").config();

const server = express();
server.use(cors());
server.use(express.json());

const port = 4000;
server.listen(port, () => {
  console.log(`Servidor iniciado <http://localhost:${port}>`);
});

async function getConection() {
  const connData = {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  };

  const conn = await mysql.createConnection(connData);
  await conn.connect();
  return conn;
}

server.get("/api/frases", async (req, res) => {
  const conn = await getConection();

  const [results] = await conn.query(
    "SELECT p.id, p.nombre, apellido, ocupacion, descripcion,f.texto FROM personajes p JOIN frases f ON (p.fk_frases = f.id);"
  );

  await conn.end();
  res.json(results);
});

server.post("api/frases", async (req, res) => {});
server.get("api/frases/:id", (req, res) => {});
server.put("api/frases/:id", (req, res) => {});
server.delete("api/frases/:id", (req, res) => {});
