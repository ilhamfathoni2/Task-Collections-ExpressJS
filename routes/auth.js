const dbConnection = require("../connection/db");
const router = require("express").Router();
// import bcrypt for password hashing
const bcrypt = require("bcrypt");

// render login page
router.get("/login", function (req, res) {
  res.render("auth/login", { 
      title: "Login",
      isLogin: req.session.isLogin,
    });
});

// render register page
router.get("/register", function (req, res) {
  res.render("auth/register", { 
      title: "Register", 
      isLogin: req.session.isLogin 
    });
});

// logout
router.get("/logout", function (req, res) {
  req.session.destroy();
  res.redirect("/login");
});

// login handler
router.post("/login", function (req, res) {
  const { email, password } = req.body;
  const query = "SELECT * FROM `users_tb` WHERE email = ?";

  if (email == "" || password == "") {
    req.session.message = {
      type: "danger",
      message: "Please fulfill input",
    };
    return res.redirect("/login");
  }

  dbConnection.getConnection((err, conn) => {
    if (err) throw err;

    conn.query(query, [email], (err, results) => {
      if (err) throw err;

      const isMatch = bcrypt.compareSync(password, results[0].password);
      if (!isMatch) {
        req.session.message = {
          type: "danger",
          message: "email or password is incorrect",
        };
        res.redirect("/login");
        return 
      } else {
        req.session.message = {
          type: "success",
          message: "login successfull",
        };

        req.session.isLogin = true;
        req.session.user = results[0].id;

        res.redirect("/");
        
      }
    });

    conn.release();
  });
});

// handle register from client
router.post("/register", function (req, res) {

  const { email , username, password } = req.body;

  const query = "INSERT INTO `users_tb` (`email`, `username`, `password`) VALUES (?,?,?)";

  if (email == "" || username == "" || password == "") {
    req.session.message = {
      type: "danger",
      message: "Please fulfill input",
    };
    return res.redirect("/register");
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  dbConnection.getConnection((err, conn) => {
    if (err) throw err;

    // execute query
    conn.query(query, [email, username, hashedPassword], (err, results) => {
      if (err) throw err;

      req.session.message = {
        type: "success",
        message: "register successfull",
      };
      res.redirect("/login");
    });
    
    conn.release();
  });
});

module.exports = router;