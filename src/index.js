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

server.post("/api/frases", async (req, res) => {
  const conn = await getConection();

  const [results] = await conn.execute(
    "INSERT INTO frases (texto,marca_tiempo, descripción) VALUES (?,?,?)",
    [req.body.texto, req.body.marca_tiempo, req.body.descripción]
  );

  await conn.end();
  res.json({
    success: true,
    frase: { id: results.insertId, ...req.body },
  });
});
server.put("/api/frases/:id", async (req, res) => {
  const conn = await getConection();
  const [result] = await conn.execute(
    "UPDATE frases SET texto = ?, marca_tiempo = ?, descripción = ? WHERE id = ?;",
    [req.body.texto, req.body.marca_tiempo, req.body.descripción, req.params.id]
  );
  await conn.end();
  res.json({
    success: true,
    frase: { id: req.params.id, ...req.body },
  });
});
server.delete("/api/frases/:id", async (req, res) => {
  const conn = await getConection();
  const [results] = await conn.execute("DELETE FROM frases WHERE id = ?", [
    req.params.id,
  ]);
  await conn.end();
  res.json({
    success: true,
  });
});

server.get("/api/frases/:id", async (req, res) => {
  const conn = await getConection();
  const [results] = await conn.query(
    `SELECT p.id, p.nombre, p.apellido, p.ocupacion, p.descripcion, f.texto 
     FROM personajes p 
     JOIN frases f ON p.fk_frases = f.id 
     WHERE f.id = ?`,
    [req.params.id]
  );
  await conn.end();

  res.json({
    success: true,
    frase: results[0],
  });
});
