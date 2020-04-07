const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const PORT = 4000;
const cors = require("cors");
const mongoose = require("mongoose");

const config = require("./connect.js");

const userRoutes = require("./routes/user-routes.js");
const eventRoutes = require("./routes/event-routes");
const companyDetailRoutes = require("./routes/companyDetail-routes");
const registerRoutes = require("./routes/register-routes");

const serveIndex = require("serve-index");

mongoose.Promise = global.Promise;
mongoose.connect(config.DB, { useNewUrlParser: true }).then(
  () => {
    console.log("Database is connected");
  },
  err => {
    console.log("Can not connect to the database" + err);
  }
);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  "/ftp",
  express.static("./uploads"),
  serveIndex("./uploads", { icons: true })
);

app.use("/user", userRoutes);
app.use("/event", eventRoutes);
app.use("/companyDetail", companyDetailRoutes);
app.use("/register", registerRoutes);

app.listen(process.env.PORT || PORT, function() {
  console.log("Server is running on Port:", PORT);
});
