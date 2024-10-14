const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require('dotenv').config();

exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créer" }))
        .catch((error) => res.status(500).json({ message: error }));
    })
    .catch((error) => res.status(500).json({ message: error }));
};

exports.login = (req, res, next) => {
  console.log(process.env.TOKEN_SECRET)
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .json({ message: "Identifiant ou mot de passe incorrect" });
      } else {
        bcrypt
          .compare(req.body.password, user.password)
          .then((match) => {
            if (!match) {
              return res
                .status(401)
                .json({ message: "Identifiant ou mot de passe incorrect" });
            } else {
              res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                    { userId: user._id },
                    process.env.TOKEN_SECRET,
                    { expiresIn: '24h' }
                )
            });
            }
          })
          .catch((error) => res.status(500).json({ message: error }));
      }
    })
    .catch((error) => res.status(500).json({ message: error }));
};
