const mongoose = require("mongoose");
const schema = mongoose.Schema;

const fedSchema = new schema({
  user: String,
  meal: String,
  date: Number

}, {timestamps: true});


const fedModel = mongoose.model("fedModel", fedSchema);

console.log("fed model online");
module.exports = fedModel;
