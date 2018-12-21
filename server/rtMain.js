var express = require("express");
var sendRoutes = express.Router();

var controller = require("./controller");

sendRoutes.route("/calendar")
  .get(controller.getCalendar);

sendRoutes.route("/fedStatus")
  .get(controller.getFedStatus)
  .post(controller.postFedStatus);

sendRoutes.route("/fedHistory")
  .get(controller.getFedHistory);

sendRoutes.route("*")
  .get(controller.index);

module.exports = sendRoutes;
