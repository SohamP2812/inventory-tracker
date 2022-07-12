const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Handler for POST @ /api/users/register
// Creates user
exports.createUser = (req, res) => {
  const { username, email, password } = req.body;

  if (!(username && email && password)) {
    res.status(400).send("All fields are required.");
  }

  User.findOne({ where: { email: email } })
    .then((user) => {
      if (user == null) {
        User.findOne({ where: { username: username } })
          .then((user) => {
            if (user == null) {
              bcrypt
                .hash(password, 10)
                .then((hashedPassword) => {
                  User.create({
                    email: email.toLowerCase(), // Sanitize email
                    username: username,
                    hashed_password: hashedPassword,
                  })
                    .then((user) => {
                      const token = jwt.sign(
                        {
                          user_id: user.id,
                          email,
                        },
                        "noZNVF&_5xBpr1JgJr+37+n}2f[1@@",
                        {
                          expiresIn: "5h",
                        }
                      );

                      return res.status(201).json({
                        message: "User created successfully.",
                        user: {
                          id: user.id,
                          username: user.username,
                          token: token,
                        },
                      });
                    })
                    .catch((error) => {
                      console.log(error);
                      res.status(400).json({
                        message: "Unable to create user. Please try again.",
                      });
                    });
                })
                .catch((error) => {
                  console.log(error);
                  res.status(400).json({
                    message: "Unable to create user. Please try again.",
                  });
                });
            } else {
              return res.status(409).send("Username already taken.");
            }
          })
          .catch((error) => {
            console.log(error);
            res.status(400).json({
              message: "Unable to create user. Please try again.",
            });
          });
      } else {
        return res.status(409).send("User Already Exist. Please Login.");
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({
        message: "Unable to create user. Please try again.",
      });
    });
};

// Handler for POST @ /api/users/login
// Authenticates user
exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  if (!(email && password)) {
    res.status(400).send("All fields are required.");
  }

  User.findOne({ where: { email: email } })
    .then((user) => {
      if (user == null) {
        return res.status(409).send("User does not exist.");
      } else {
        bcrypt
          .compare(password, user.hashed_password)
          .then((validPassword) => {
            if (validPassword) {
              const token = jwt.sign(
                {
                  user_id: user.id,
                  email,
                },
                "noZNVF&_5xBpr1JgJr+37+n}2f[1@@",
                {
                  expiresIn: "5h",
                }
              );

              return res.status(201).json({
                message: "User logged in successfully.",
                user: {
                  id: user.id,
                  username: user.username,
                  token: token,
                },
              });
            } else {
              return res.status(401).send("Invalid Credentials.");
            }
          })
          .catch((error) => {
            console.log(error);
            res.status(400).json({
              message: "Unable to login. Please try again.",
            });
          });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({
        message: "Unable to login. Please try again.",
      });
    });
};
