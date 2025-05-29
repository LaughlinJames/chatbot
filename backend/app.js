const path = require("path");
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { exec } = require("child_process");
const apiManagementLayer = require('./controllers/apiMgmtLayer'); // adjust path if needed


const app = express();
const PORT = 3000;
app.use(express.json());
// app.use(bodyParser.json());
app.use(cors());
app.use("/api", apiManagementLayer); // Use the proxy router for API requests

const routes = require("./routes");
app.use(routes);
app.use(express.static(path.join(__dirname, "..", "frontend")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "..", "frontend", "index.html"));
});

const server = app.listen(PORT, function () {
  console.log(`Server running at http://127.0.0.1:${PORT}/`);
  exec(`open http://127.0.0.1:${PORT}/`);
});
