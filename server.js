// import express from "express";

// const app = express();
// const porta = 3000;

// app.get("/", (req, res) => {
//     res.send("<h1>Eu te amo, Nicoleee >3<</h1>");
// });

// app.listen(porta, () => {
//     console.log(`Servidor rodando em http://localhost:${porta}`);
// });

import { carregarAmbiente } from "./config/ambiente.js";

const config = carregarAmbiente(".env");

const { app } = await import("./app.js");

const porta = config.porta || 3000;

app.listen(porta, () => {
    console.log(`Servidor rodando em http://localhost:${porta}`);
});                      