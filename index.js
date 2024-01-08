const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const xss = require("xss-clean");

const router = require("./src/router/index");
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan("combined"));
app.use(cors());
app.use(helmet());
app.use(xss());
app.use(router);

app.get("/", (req, res) => {
  res.status(200).json({ status: 200, message: "server running" });
});

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});
