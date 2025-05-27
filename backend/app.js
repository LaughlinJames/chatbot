const path = require("path");
require('dotenv').config();
console.log('ENV CHECK:', process.env.OPENAI_API_KEY);

console.log('ENV DEBUG -- __dirname:', __dirname);
console.log('ENV DEBUG -- .env path:', path.resolve(__dirname, '.env'));
console.log('ENV DEBUG -- OPENAI_API_KEY:', process.env.OPENAI_API_KEY);

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { exec } = require("child_process");
const apiProxy = require('./controllers/apiMgmtLayer'); // adjust path if needed



const app = express();
const PORT = 3000;


app.use(bodyParser.json());
app.use(cors());

const routes = require("./routes");
app.use(routes);

app.use(express.static(path.join(__dirname, "..", "frontend")));

app.use("/api", apiProxy); // Use the proxy router for API requests

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "..", "frontend", "index.html"));
});

const server = app.listen(PORT, function () {
  console.log(`Server running at http://127.0.0.1:${PORT}/`);
  exec(`open http://127.0.0.1:${PORT}/`);
});
