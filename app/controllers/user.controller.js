exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

exports.XivoBoard = (req, res) => {
  res.status(200).send("Xivo Content.");
};

exports.CeboxBoard = (req, res) => {
  res.status(200).send("Cebox Content.");
};
