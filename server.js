const express = require("express");
var shortid = require("shortid");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://linhkeo:linhkeo@users-brgtm.mongodb.net/25-mongoose",
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
);

var userRoute = require("./routes/user.route.js");
var bookRoute = require("./routes/book.route.js");
var transactionRoute = require("./routes/transaction.route.js");
var authRoute = require("./routes/auth.route.js");
var apiLoginRoute = require('./api/routes/login.route.js');
var apiTransactionRoute = require('./api/routes/transaction.route.js');

var cookieMiddleware = require("./middleware/cookie.middleware.js");
var authMiddleware = require("./middleware/auth.middleware.js");
var sessionMiddleware = require("./middleware/session.middleware.js");

const app = express();

app.set("views", "./views");
app.set("view engine", "pug");

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser("hauoeiwnwh7618y989"));
app.use(sessionMiddleware);

app.use("/users", authMiddleware.authLogin, cookieMiddleware.cookie, userRoute);
app.use("/books", cookieMiddleware.cookie, bookRoute);
app.use(
  "/transactions",
  authMiddleware.authLogin,
  cookieMiddleware.cookie,
  transactionRoute
);
app.use("/auth", authRoute);
app.use("/api", apiLoginRoute);
app.use("/api", apiTransactionRoute);

app.get("/", function(req, res) {
  res.cookie("cookie", shortid.generate());
  res.send("Hello everyone!");
});

// listen for requests :)
app.listen(process.env.PORT, () => {
  console.log("Server listening on port " + process.env.PORT);
});
