const express = require("express");

const path = require("path");

const app = express();

const PORT = 4000;

app.use(express.static(path.join(__dirname, "../website")));

app.get("/hello", (req, res) => {

    res.send("Hello from the server!");

});

app.get("/about", (req, res) => {

    res.send("Welcome to the Buhurt Management System API");

});

app.listen(PORT, () => {

    console.log(`Server running at http://localhost:${PORT}`);

});