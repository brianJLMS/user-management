const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

const dbService = require("./dbService");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//CREATE USER
app.post("/insert", (req, res) => {
  const { name, lastName, email } = req.body;
  const db = dbService.getDbServiceInstance();

  const result = db.insertNewUser(name, lastName, email);

  result.then((data) => res.json({ data })).catch((err) => console.log(err));
});

//GET USERS
app.get("/getAll", (req, res) => {
  const db = dbService.getDbServiceInstance();

  const result = db.getAllData();

  result.then((data) => res.json({ data })).catch((err) => console.log(err));
});

app.listen(process.env.PORT, () => console.log("App is running"));

//DELETE USER
app.delete("/delete/:id", (req, res) => {
  const { id } = req.params;
  const db = dbService.getDbServiceInstance();
  const result = db.deleteRowById(id);

  result
    .then((data) => res.json({ success: data }))
    .catch((err) => console.log(err));
});

//EDIT USER
app.patch("/update", (req, res) => {
  const { id, name, lastName, email } = req.body;
  const db = dbService.getDbServiceInstance();

  const result = db.updateUserById(id, name, lastName, email);

  result
    .then((data) => res.json({ success: data }))
    .catch((err) => console.log(err));
});

//SEARCH USER
app.get("/search/:name", (req, res) => {
  const { name } = req.params;
  const db = dbService.getDbServiceInstance();

  const result = db.searchByName(name);

  result.then((data) => res.json({ data })).catch((err) => console.log(err));
});
