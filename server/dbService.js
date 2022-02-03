const mysql = require("mysql");
const dotenv = require("dotenv");
const { response } = require("express");

let instance = null;

dotenv.config();

const connection = mysql.createConnection({
  host: process.env.HOST,
  user: "uj7zmz4hefjvelgm",
  password: "VlQO7z01CnigSkOvuutq",
  database: process.env.DATABASE,
  port: process.env.DB_PORT,
});

connection.connect((err) => {
  if (err) {
    console.log(err.message);
  }
  console.log("db" + " " + connection.state);
});

class DbService {
  static getDbServiceInstance() {
    return instance ? instance : new DbService();
  }

  async getAllData() {
    try {
      const response = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM users;";

        connection.query(query, (err, res) => {
          if (err) {
            reject(new Error(err.message));
          }
          resolve(res);
        });
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async insertNewUser(name, lastName, email) {
    try {
      const dateAdded = new Date();
      const insertId = await new Promise((resolve, reject) => {
        const query =
          "INSERT INTO users(nombre,apellido,email,date_added) VALUES(?,?,?,?);";

        connection.query(
          query,
          [name, lastName, email, dateAdded],
          (err, res) => {
            if (err) {
              reject(new Error(err.message));
            }
            resolve(res.insertId);
          }
        );
      });
      console.log(insertId);
      return {
        id: insertId,
        nombre: name,
        apellido: lastName,
        email: email,
        dateAdded: dateAdded,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async deleteRowById(id) {
    id = parseInt(id, 10);
    try {
      const response = await new Promise((resolve, reject) => {
        const query = "DELETE FROM users WHERE id = ?";

        connection.query(query, [id], (err, res) => {
          if (err) {
            reject(new Error(err.message));
          }
          resolve(res.affectedRows);
        });
      });
      return response === 1 ? true : false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async updateUserById(id, name, lastName, email) {
    id = parseInt(id, 10);
    try {
      const response = await new Promise((resolve, reject) => {
        const query =
          "UPDATE users SET nombre = ?, apellido = ?, email = ? WHERE id = ?";

        connection.query(query, [name, lastName, email, id], (err, res) => {
          if (err) {
            reject(new Error(err.message));
          }
          resolve(res.affectedRows);
        });
      });
      return response === 1 ? true : false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async searchByName(name) {
    try {
      const response = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM users WHERE nombre = ?;";

        connection.query(query, [name], (err, res) => {
          if (err) {
            reject(new Error(err.message));
          }
          resolve(res);
        });
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = DbService;
