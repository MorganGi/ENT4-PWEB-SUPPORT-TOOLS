const express = require("express");
const cors = require("cors");
const app = express();
const fs = require("fs");
const fileUpload = require("express-fileupload");
const pdfParse = require("pdf-parse");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const _ = require("lodash");
const path = require("path");
var corsOptions = {
  origin: "http://localhost:8081",
};
const mariadb = require("mariadb");
const pool = mariadb.createPool({
  host: "localhost",
  user: "user",
  password: "password",
  database: "sq",
});

app.use(cors(corsOptions));
// parse requests of content-type - application/json
// app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
// app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(
  fileUpload({
    createParentPath: true,
  })
); //ATTENTION REND IMPOSSIBLE D UPLOAD DE FILE

// database
const db = require("./app/models");
const Role = db.role;

const dbArbre = require("./app/modelsArbre");
const { json } = require("body-parser");

const Pb = dbArbre.pb;
const S1 = dbArbre.s1;
const S2 = dbArbre.s2;
const Solutions = dbArbre.solutions;

db.sequelize.sync();
dbArbre.sequelize.sync({ force: false });
//FORCE TRUE = CREE UNE NOUVELLE TABLE; FORCE FALSE = TABLE INCHANGÉ ; ALTER = AJOUT DES NOUVELLE CHOSES
// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
const STORAGEPATH = "../react-jwt-auth/react-jwt-auth/public/pdf";

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

// simple route
app.get("/", (req, resu) => {
  // LIRE LES FICHIERS DU DOSSIER
  resu.send("HOME");
});

//************************************* */
app.post("/upload-avatar/:id", async (req, res) => {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: "No file uploaded",
      });
    } else {
      //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
      let avatar = req.files.file;

      //Use the mv() method to place the file in upload directory (i.e. "uploads")
      avatar.mv(STORAGEPATH + "/" + avatar.name);
      Solutions.create({
        text: avatar.name,
        ind_s2: req.params.id,
      });
      //send response
      res.status(200).send({
        status: true,
        message: "File is uploaded",
        data: {
          name: avatar.name,
          mimetype: avatar.mimetype,
          size: avatar.size,
        },
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

//************************************* */

app.get("/pb/", (req, resu) => {
  Pb.findAll()
    .then((pbs) => {
      resu.status(200).send(JSON.stringify(pbs));
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
      resu.status(200).send(JSON.stringify(res));
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
        querie =
          "SELECT COUNT(text) as count FROM solutions WHERE text = '" +
          file.text +
          "';";

        conn
          .query(querie)
          .then((res) => {
            if (res[0].count === 1n) {
              fs.unlink(path, (err) => {
                if (err) {
                  console.error("Erreur de suppression du PDF", err);
                  return;
                }
              });
            }
            conn
              .query("DELETE FROM solutions WHERE ind_s2 = ?", [req.params.id])
              .then((e) => {
                resu.status(200).send();
                conn.end();
              });
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
});

// //AJOUT DUN PDF
// app.post("/solutions/:id&:text", (req, resu) => {
//   Solutions.create({
//     text: req.params.text,
//     ind_s2: req.params.id,
//   });

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
// });

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

// function initial() {
//   Role.create({
//     id: 1,
//     name: "user",
//   });

//   Role.create({
//     id: 2,
//     name: "moderator",
//   });

//   Role.create({
//     id: 3,
//     name: "admin",
//   });
// }

// LIRE LE TEXTE D'UN PDF

app.get("/extract-text/:searched", (req, resu) => {
  console.log("SEARCHED : ", req.params.searched);

  const directoryPath = path.join(__dirname, STORAGEPATH);
  // console.log(directoryPath);

  //passsing directoryPath and callback function
  fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
      return console.log("Unable to scan directory: " + err);
    }
    //listing all files using forEach
    var tab = [];

    files.forEach((file, i) => {
      const logo = fs.readFileSync(STORAGEPATH + "/" + file);
      pdfParse(logo).then((res) => {
        bool = res.text
          .toLocaleLowerCase()
          .includes(req.params.searched.toLocaleLowerCase());
        if (bool) {
          tab.push({ text: res.text.slice(0, 300) + "...", titre: file });
        }
      });
    });
    setTimeout(() => {
      // console.log(JSON.stringify(tab));
      resu.send(JSON.stringify(tab));
    }, 500);
  });
});
