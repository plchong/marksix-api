const express = require("express");
const route = express.Router();
const debug = require("debug")("app:api:main:deviceInfo");
const crypto = require("crypto");
const uuidv4 = require("uuid").v4;
const moment = require("moment");

const logger = require("../middleware/logger");
const { getRemainder } = require("../middleware/remainder");
const { zodiac } = require("../middleware/list/zodiac");
const { radiateMethood } = require("../middleware/vennDiagram");
const { lineupMethood } = require("../middleware/gannQuareDiagram");
const { getCommonNumbers } = require("../middleware/getCommonNumbers");

route.get("/vennMethodInGannSquareDiagram", async (req, res) => {
  // use venn method in gann diagram
  const { year, month, day } = req.body;

  try {
    let newYear;
    for (let x = 0; x < zodiac.length; x++) {
      if (year === zodiac[x].value) {
        newYear = zodiac[x].index;
      }
    }

    // get core number
    let num = parseInt(newYear) + parseInt(month) + parseInt(day);

    // get remainder
    let remainder = await getRemainder(num, 8);

    console.log("core number ", remainder);

    // get all position numbers in x & y coordinator by radiate method
    let positionsNumbers = await radiateMethood(remainder);
    console.log(positionsNumbers);
    
    return res.send(commonNumbers);
  } catch (err) {
    return logger.error("error " + err);
  }
});

route.get("/gannMethodInGannSquareDiagram", async (req, res) => {
  // use venn method in gann diagram
  const { markNumbers } = req.body;

  try {
    const positionNumbers = await lineupMethood(markNumbers);
    console.log(positionNumbers);
  } catch (err) {
    return logger.error("error " + err);
  }
});

route.get(
  "/commonNumbersInGannAndVennMethodInGannSquareDiagram",
  async (req, res) => {
    // use venn method in gann diagram
    const { year, month, day, markNumbers } = req.body;

    try {
      // Gann Method
      let newYear;
      for (let x = 0; x < zodiac.length; x++) {
        if (year === zodiac[x].value) {
          newYear = zodiac[x].index;
        }
      }

      // get core number
      let num = parseInt(newYear) + parseInt(month) + parseInt(day);

      // get remainder
      let remainder = await getRemainder(num, 8);

      console.log("core number ", remainder);

      // get all position numbers in x & y coordinator by radiate method
      let gannResult = await radiateMethood(remainder);
      console.log("Gann ", gannResult);

      // Venn Method
      const vennResult = await lineupMethood(markNumbers);
      console.log("Venn ", vennResult);

      const commonNumbers = await getCommonNumbers(gannResult, vennResult);
      console.log("commone numbers ", commonNumbers);
      return res.send(commonNumbers);
    } catch (err) {
      return logger.error("error " + err);
    }
  }
);

module.exports = route;
