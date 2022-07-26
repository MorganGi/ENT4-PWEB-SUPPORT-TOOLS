const express = require("express");
const cors = require("cors");
const app = express();
const multer = require("multer");
const fs = require("fs");
var corsOptions = {
  origin: "http://192.168.18.141:8081",
};

//RAJOUTER MORGAN
const mariadb = require("mariadb");
const pool = mariadb.createPool({
  host: "localhost",
  user: "user",
  password: "password",
  database: "sq",
});

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// database
const db = require("./app/models");
const Role = db.role;

const dbArbre = require("./app/modelsArbre");
const { table } = require("console");
const { equal } = require("assert");
const Pb = dbArbre.pb;
const S1 = dbArbre.s1;
const S2 = dbArbre.s2;
const Solutions = dbArbre.solutions;

db.sequelize.sync();
dbArbre.sequelize.sync({ force: false });
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
  Pb.findAll()
    .then((pbs) => {
      resu.send(JSON.stringify(pbs));
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
  // pool
  //   .getConnection()
  //   .then((conn) => {
  //     conn
  //       .query("SELECT * FROM pb;")
  //       .then((res) => {
  //         resu.send(res);
  //         conn.end();
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //         conn.end();
  //       });
  //   })
  //   .catch((err) => {
  //     console.log("Not connected !");
  //   });
});

app.get("/s1/:id", (req, resu) => {
  S1.findAll({ where: { ind_pb: req.params.id } }).then((res) => {
    if (res === null) {
      console.log("Not found!");
    } else {
      resu.send(JSON.stringify(res));
    }
  });

  // pool
  //   .getConnection()
  //   .then((conn) => {
  //     conn
  //       .query("SELECT * FROM s1 WHERE ind_pb = ?;", [req.params.id])
  //       .then((res) => {
  //         resu.send(res);
  //         conn.end();
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //         conn.end();
  //       });
  //   })
  //   .catch((err) => {
  //     console.log("Not connected !");
  //   });
});

app.get("/s2/:id", (req, resu) => {
  S2.findAll({ where: { ind_s1: req.params.id } }).then((res) => {
    if (res === null) {
      console.log("Not found!");
    } else {
      resu.send(JSON.stringify(res));
    }
  });

  // pool
  //   .getConnection()
  //   .then((conn) => {
  //     conn
  //       .query("SELECT * FROM s2 WHERE ind_s1 = ?;", [req.params.id])
  //       .then((res) => {
  //         resu.send(res);
  //         conn.end();
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //         conn.end();
  //       });
  //   })
  //   .catch((err) => {
  //     console.log("Not connected !");
  //   });
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
  Solutions.create({
    text: req.params.text,
    ind_s2: req.params.id,
  });

  // pool
  //   .getConnection()
  //   .then((conn) => {
  //     conn
  //       .query(
  //         "INSERT INTO solutions (text, ind_s2) VALUES ('" +
  //           req.params.text +
  //           "'," +
  //           req.params.id +
  //           ");",
  //         [req.params.id]
  //       )
  //       .then((res) => {
  //         console.log(res);
  //         conn.end();
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //         conn.end();
  //       });
  //   })
  //   .catch((err) => {
  //     console.log("Not connected !", err);
  //   });
});

app.put("/update/:db&:value&:newVal&:id&:champ", (req, resu) => {
  if (req.params.db === "pb") {
    id_db = "id";
  } else if (req.params.db === "s1") {
    id_db = "id_s1";
  } else if (req.params.db === "s2") {
    id_db = "id_s2";
  }

  re =
    "UPDATE " +
    req.params.db +
    "  SET " +
    req.params.champ +
    " = '" +
    req.params.newVal +
    "' WHERE " +
    id_db +
    " = '" +
    req.params.id +
    "';";

  console.log("\n", re);
  pool
    .getConnection()
    .then((conn) => {
      conn
        .query(re)
        .then((res) => {
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
  if (req.params.db === "pb") {
    re =
      "INSERT INTO " +
      req.params.db +
      " (" +
      req.params.champ +
      ") VALUES ('" +
      req.params.newVal +
      "');";
  } else {
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
  }

  console.log(re);
  pool
    .getConnection()
    .then((conn) => {
      conn
        .query(re)
        .then((res) => {
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
  re =
    "DELETE FROM  " +
    req.params.db +
    " WHERE " +
    req.params.champ +
    " = " +
    req.params.id +
    ";";
  //Comparer les fichiers pdf avant et après. En cas de delete onCascade supression des fichier correspondants
  re2 = "SELECT text FROM solutions;";
  global.tab;
  global.tab2;
  pool
    .getConnection()
    .then((conn) => {
      conn.query(re2).then((tab) => {
        conn
          .query(re)
          .then((res) => {
            conn.end();
            conn.query(re2).then((tab2) => {
              for (let i = 0; i < tab.length; i++) {
                const equal = tab2.includes(tab[i].text);
                if (!equal) {
                  const path = STORAGEPATH + "/" + tab[i].text;
                  fs.unlink(path, (err) => {
                    if (err) {
                      console.error("Erreur de suppression du PDF", err);
                      return;
                    }
                  });
                }
              }
            });
          })
          .catch((err) => {
            console.log(err);
            conn.end();
          });
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
