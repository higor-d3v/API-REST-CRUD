require("dotenv").config();
const express = require("express");
const rotas = require("./rotas");
const app = express();
const swaggerUi = require("swagger-ui-express");


app.use(express.json());
app.use("/v1", rotas);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(require("../swagger_output.json")));

module.exports = app;
