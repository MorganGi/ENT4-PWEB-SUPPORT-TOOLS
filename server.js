const express = require("express");
const cors = require("cors");
const app = express();
const multer = require("multer");
const fs = require("fs");
var corsOptions = {
  origin: "http://localhost:8081",
};

//RAJOUTER MORGAN
const mariadb = require("mariadb");
const pool = mariadb.createPool({
  host: "localhost",
  user: "user",
  password: "password",
  database: "Arbre2",
});

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// database
const db = require("./app/models");
const Role = db.role;

db.sequelize.sync();
// force: true will drop the table if it already exists
// db.sequelize.sync({force: true}).then(() => {
//   console.log('Drop and Resync Database with { force: true }');
//   initial();
// });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to my application." });
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
const STORAGEPATH = "../react-jwt-auth/react-jwt-auth/public/pdf";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, STORAGEPATH);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage }).single("file");
app.post("/upload/pdf/", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).send(req.file);
  });
});

app.get("/pb/", (req, resu) => {
  pool
    .getConnection()
    .then((conn) => {
      conn
        .query("SELECT * FROM pb;")
        .then((res) => {
          resu.send(res);
          conn.end();
        })
        .catch((err) => {
          console.log(err);
          conn.end();
        });
    })
    .catch((err) => {
      console.log("Not connected !");
    });
});

app.get("/s1/:id", (req, resu) => {
  pool
    .getConnection()
    .then((conn) => {
      conn
        .query("SELECT * FROM s1 WHERE ind_pb = ?;", [req.params.id])
        .then((res) => {
          resu.send(res);
          conn.end();
        })
        .catch((err) => {
          console.log(err);
          conn.end();
        });
    })
    .catch((err) => {
      console.log("Not connected !");
    });
});

app.get("/s2/:id", (req, resu) => {
  pool
    .getConnection()
    .then((conn) => {
      conn
        .query("SELECT * FROM s2 WHERE ind_s1 = ?;", [req.params.id])
        .then((res) => {
          resu.send(res);
          conn.end();
        })
        .catch((err) => {
          console.log(err);
          conn.end();
        });
    })
    .catch((err) => {
      console.log("Not connected !");
    });
});

app.get("/solutions/:id", (req, resu) => {
  pool
    .getConnection()
    .then((conn) => {
      conn
        .query(
          "SELECT * FROM s2 JOIN solutions ON id_s2 = solutions.ind_s2 WHERE ind_s2 = ?;",
          [req.params.id]
        )
        .then((res) => {
          resu.send(res);
          conn.end();
        })
        .catch((err) => {
          console.log(err);
          conn.end();
        });
    })
    .catch((err) => {
      console.log("Not connected !");
    });
});
//SUPPRIMER UN FICHIER PDF
app.get("/solutions/del/:id", (req, resu) => {
  pool.getConnection().then((conn) => {
    conn
      .query("SELECT * FROM solutions WHERE ind_s2 = ?;", [req.params.id])
      .then((res) => {
        file = res[0];
        console.log(file.text);
        const path = STORAGEPATH + "/" + file.text;

        fs.unlink(path, (err) => {
          if (err) {
            console.error("Erreur de suppression du PDF", err);
            return;
          }
          conn
            .query("DELETE FROM solutions WHERE text = ?", [file.text])
            .then((e) => {
              console.log(e);
            });
          resu.send(res);
          conn.end();
        }).catch((err) => {
          console.log(err);
          conn.end();
        });
      })
      .catch((err) => {
        console.log("Not connected !");
      });
  });
});

//AJOUT DUN PDF
app.post("/solutions/:id&:text", (req, resu) => {
  pool
    .getConnection()
    .then((conn) => {
      conn
        .query(
          "INSERT INTO solutions (text, ind_s2) VALUES ('" +
            req.params.text +
            "'," +
            req.params.id +
            ");",
          [req.params.id]
        )
        .then((res) => {
          console.log(res);
          conn.end();
        })
        .catch((err) => {
          console.log(err);
          conn.end();
        });
    })
    .catch((err) => {
      console.log("Not connected !", err);
    });
});

app.put("/update/:db&:value&:newVal&:champ", (req, resu) => {
  console.log(req.params);
  re =
    "UPDATE " +
    req.params.db +
    "  SET " +
    req.params.champ +
    " = '" +
    req.params.newVal +
    "' where " +
    req.params.champ +
    " = '" +
    req.params.value +
    "';";
  console.log(re);
  pool
    .getConnection()
    .then((conn) => {
      conn
        .query(re)
        .then((res) => {
          console.log(res);
          conn.end();
        })
        .catch((err) => {
          console.log(err);
          conn.end();
        });
    })
    .catch((err) => {
      console.log("Not connected !");
    });
});

app.put("/create/:db&:id&:newVal&:champ&:champ2", (req, resu) => {
  console.log(req.params);
  re =
    "INSERT INTO " +
    req.params.db +
    " (" +
    req.params.champ +
    ", " +
    req.params.champ2 +
    ") VALUES ('" +
    req.params.newVal +
    "'," +
    req.params.id +
    ");";

  console.log(re);
  pool
    .getConnection()
    .then((conn) => {
      conn
        .query(re)
        .then((res) => {
          console.log(res);
          conn.end();
        })
        .catch((err) => {
          console.log(err);
          conn.end();
        });
    })
    .catch((err) => {
      console.log("Not connected !");
    });
});

app.put("/delete/:id&:db&:champ", (req, resu) => {
  console.log(req.params);
  re =
    "DELETE FROM  " +
    req.params.db +
    " WHERE " +
    req.params.champ +
    " = " +
    req.params.id +
    ";";

  console.log(re);
  pool
    .getConnection()
    .then((conn) => {
      conn
        .query(re)
        .then((res) => {
          console.log(res);
          conn.end();
        })
        .catch((err) => {
          console.log(err);
          conn.end();
        });
    })
    .catch((err) => {
      console.log("Not connected !");
    });
});

function initial() {
  Role.create({
    id: 1,
    name: "user",
  });

  Role.create({
    id: 2,
    name: "moderator",
  });

  Role.create({
    id: 3,
    name: "admin",
  });
}
