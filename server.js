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

  // [-20000]: "Email Existed",
  // [-20001]: "Username Existed",
  // [-20002]: "Can't Register Account",
  // [-20003]: "Email Not Registered",
  // [-20004]: "Invalid Password",
  // [-20005]: "Account Is Not Active",
  // [-20006]: "Can't Edit Profile",
  // [-20007]: "Can't Delete Account",

  // [-30000]: "Can't Upload Event",
  // [-30001]: "Can't Get Event",
  // [-30002]: "Can't Get Organizer",
  // [-30003]: "Can't Update Subscription Event Status",
  // [-30004]: "Can't Subscribe Event",
  // [-30005]: "Can't Unsubscript Event",
  // [-30006]: "Can't Follow Organizer",
  // [-30007]: "Can't Update Following Organizer Status",
  // [-30008]: "Can't Unfollowing Organizer",
  // [-30009]: "Can't Get Join Event Record",
  // [-30010]: "Can't Join Event",
  // [-30011]: "Can't Unjoin Event",
  // [-30012]: "No Join Event Record Existed",
  // [-30013]: "Can't Update Join Event Status",
  // [-30014]: "Can't Get Events Monthly",
  // [-30015]: "Can't Create Survey",
  // [-30016]: "Can't Get Surveys",
  // [-30016]: "Can't Upload Completed  Surveys",
  // [-30017]: "Can't Get Completed Survey",
  // [-30018]: "Can't Get User",
  // [-30019]: "Can't Get Users",
  // [-30020]: "Can't Get User Info That Followed Organizer",
  // [-30021]: "Can't Get Activity",
  // [-30022]: "Can't Get Survey Statistics",
  // [-30023]: "Can't Get All Completed Survey",
  // [-30024]: "Can't Give Rewards",
  // [-30025]: "Can't Get Completed Survey",
  // [-30026]: "Can't Get Notifications",
  // [-30027]: "Can't Get Uploaded Events",
  // [-30027]: "Can't Edit Event",
  // [-30028]: "Can't Get Following List",
  // [-30029]: "Can't Get Subscripted List",
  // [-30030]: "Can't Get Activity Participant",
  // [-30031]: "Can't Get Users Who Is Organizer",
  // [-30032]: "Can't Get Societies",
  // [-30033]: "Can't Edit Society Profile",
  // [-30034]: "Can't Get Scores Records",
  // [-30035]: "Can't Create Scores Records",
  // [-30036]: "Can't Add Scores Id",
  // [-30037]: "Can't Create Coupon",
  // [-30038]: "Can't Get Coupons",
  // [-30039]: "Can't Redeem Coupon",
  // [-30040]: "Not Enough Coupon To Redeem",
  // [-30041]: "Can't Get Score",
  // [-30042]: "Can't Reduce Score",
  // [-30043]: "Not Enough Point",
  // [-30044]: "Can't Get Redeemed Coupons",
  // [-30045]: "Can't Use Redeemed Coupons",
  // [-30046]: "Can't Add Extra Scores",

  // [-40000]: "No Subscription Event Record Existed",
  // [-40001]: "No Following Organizer Record Existed",
  // [-40002]: "No Redeemed Coupon Record Existed",

  // [-50000]: "Can't Search Events",

  // // dashboard
  // [-60000]: "Can't Get Application Information",
  // [-60001]: "Can't Accept Event Application",
  // [-60002]: "Can't Reject Event Application",
  // [-60003]: "Can't Get Event Applications",
  // [-60004]: "Can't Delete Event",

  // // list
  // [-90000]: "Can't Get Organizer List",
  // [-90001]: "Can't Get Bachelor Degrees List",
  // [-90002]: "Can't Search Bachelor Degrees List",
  // [-90003]: "Can't Get All Organizers",
  // [-90004]: "Can't Search Organizers",
};

app.use("/api/marksix", require("./src/api/marksix"));

app.listen(port, () => logger.info("marksix server started " + port));
