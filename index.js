const http = require("http")
const express = require("express")
const path = require("path")
const session = require("express-session");
const flash = require("express-flash");

const app = express();
const hbs = require("hbs");

app.use(express.urlencoded({ extended: false }));

const dbConnection = require("./connection/db");

const authRoute = require("./routes/auth");
const homeRoute = require("./routes/home");
const taskRoute = require("./routes/task");


app.set("views", path.join(__dirname, "views"))

app.set("view engine", "hbs")

hbs.registerPartials(path.join(__dirname, "views/partials"));


// user session
app.use(
  session({
    cookie: {
      maxAge: 5 * 60 * 60 * 1000,
      secure: false,
      httpOnly: true,
    },
    store: new session.MemoryStore(),
    saveUninitialized: true,
    resave: false,
    secret: "secretValue",
  })
);

// use flash for sending message
app.use(flash());

// setup flash message
app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});



// Routes
app.use("/", authRoute);
app.use("/", homeRoute);
app.use("/", taskRoute);



const server = http.createServer(app)
const port = 3450

server.listen(port, () => {
    console.log(`listening at http://localhost:${port}`)
})