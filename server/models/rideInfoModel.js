const mongoose = require("mongoose");
const schema = mongoose.Schema;

const rideInfo = new schema({
  event: String,
  whatIsIt: String,
  whoIsIt: String

}, {timestamps: true});


const rideInfoModel = mongoose.model("rideInfoModel", rideInfo);

console.log("ride info model online");
module.exports = rideInfoModel;
