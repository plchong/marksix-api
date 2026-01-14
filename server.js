const express = require("express");
const bodyParser = require("body-parser");

const logger = require("./src/middleware/logger");

const app = express();
const port = process.env.Port || 3000;
const cors = require("cors");

app.use(cors());

app.use(express.json({ extended: false }));
app.use(bodyParser.json({ limit: "5000mb" }));
app.use(bodyParser.urlencoded({ limit: "5000mb", extended: true }));

// GET / POST / PUT / DELETE data successfully --> res.send({ status: 0 });
// empty data --> res.send({ status: 1 });
// return err --> res.send({ status: 2 });
// access token expiry --> res.send({ status: 3 });
// no Headers [API KEY] --> res.send({ status: 4 });
// no Headers [APP KEY] --> res.send({ status: 5 });
// no Headers [ACCESS TOKEN] --> res.send({ status: 6 });

const ERROR_CODE = {
  // [-10000]: "Can't Update Access Token",
  // [-10001]: "Can't Record Notificaiton",
  // [-10002]: "Can't Store Push Notification",
  // [-10003]: "Can't Get Push Notification Record",
  // [-10004]: "Can't Update Push Notification Record",
};

app.use("/api/marksix", require("./src/api/marksix"));
app.use("/api/prediction", require("./src/api/prediction"));

app.listen(port, () => logger.info("marksix server started " + port));
