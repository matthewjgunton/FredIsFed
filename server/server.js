//basic app requirements
var express = require("express");
var app = express();
const cors = require("cors");

//required to parse forms
var bodyParser = require("body-parser");
app.use(bodyParser.json());//it now says body works

//dev dependencies
var morgan = require("morgan");
app.use(morgan('dev'));

//db things
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://admin:mjg422@ds018308.mlab.com:18308/fredisfed2", { useNewUrlParser: true }, function(err){
  if(err){
		console.log("failed to connect to DB");

	}else{
		console.log("connection success");
	}
});

app.use(cors());

//required to allow the html files to be served
app.use("/", express.static(__dirname+"/public"));

const rtMain = require("./rtMain.js");
app.use("/",rtMain);


app.listen(process.env.PORT || 5000);

console.log("app is online");
