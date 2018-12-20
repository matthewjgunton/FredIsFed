var path = require('path');

//for google calendar api
var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

//models
var FedModel = require("./models/FedModel.js");
var RideInfoModel = require("./models/rideInfoModel.js");


exports.index = (req, res) => {
  res.sendFile(path.resolve("index.html"));
}

exports.getFedStatus = async (req, res) =>{

  //might need to look back into this
  var whole = new Date();
  var hour = whole.getHours();

  if(hour > 12){
    var waitingFor = "dinner";
  }
  else{
    var waitingFor = "breakfast";
  }

  console.log(waitingFor);

  try{
    return res.status(200).json({error: false, waitingFor: waitingFor, data: await FedModel.findOne().sort({createdAt: -1})});
  }catch(e){
    return res.status(400).json({error: true, msg: 'error fetching the fed data'})
  }

}

exports.getFedHistory = async (req, res) => {
  try{
    //make sure the data is small
    var rawData = await FedModel.find().sort('-date');
    if(rawData.length > 14){
      rawData = rawData[0,1,2,3,4,5,6,7,8,9,10,11,12,13];
    }
    return res.status(200).json({error: false, data: rawData})
  }catch(e){
    console.log(e);
    return res.status(400).json({error: true, msg: 'error fetching fed history'})
  }
}

exports.postFedStatus = async (req, res) => {

  console.log("post reached", req.body);

  const {
    user
  } = req.body;

  if(user.length == 0 || typeof user != 'string'){
    console.log('error, user is not properly formatted');
    return res.status(400).json({error: true, msg: "user is not properly formatted"});
  }

  var whole = new Date();
  var hour = whole.getHours();

  if(hour >= 12 || hour < 12){

    if(hour >=12){
      var meal = "dinner";
    }else{
      var meal = 'breakfast';
    }
  }else{
      console.log('error, internal server error with time');
    return res.status(400).json({error: true, msg: 'internal server error with time'});
  }

  const newEntry = new FedModel({
    user: user,
    meal: meal
  })

  console.log(newEntry, 'works?');

  try{
    return res.status(201).json({error: false, fedStatus: await newEntry.save()});
  }catch(e){
    console.log(e, "error");
    return res.status(400).json({error: true, msg: "error with saving fed status"});
  }
}


//BELOW IS THE API FOR GOOGLE CALENDAR

//definitions for api
var SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'calendar-nodejs-quickstart.json';

exports.getCalendar = (req, res) => {
  fs.readFile('./client_secret.json', function processClientSecrets(err, content) {
    if (err) {
      console.log('Error loading client secret file: ' + err);
      return;
    }
    // Authorize a client with the loaded credentials, then call the
    // Google Calendar API.
    authorize(JSON.parse(content), listEvents, req, res);
      });
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback, req, res) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken(oauth2Client, callback, req, res);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client, req, res);
    }
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback, req, res) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client, req, res);
    });
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}

/**
 * Lists the next 10 events on the user's primary calendar.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listEvents(auth, req, res) {

  //create an end date function
  var whole = new Date();
  var year = whole.getFullYear();
  var hour = whole.getHours();
  var month = whole.getMonth()+1;
  var date = whole.getDate();

  var toBegin =  new Date(year+'-'+month+'-'+date+' 00:01 EST');
  var startDate = toBegin.toISOString();
  var toChange = new Date(year+'-'+month+'-'+date+' 23:59 EST');
  var endDate = toChange.toISOString();

  var calendar = google.calendar('v3');
  calendar.events.list(
    {
    auth: auth,
    calendarId: 'jtgunton@gmail.com',
  },
  {
    qs:  {
      timeMin: startDate,
      timeMax: endDate,
      singleEvents: true,
      orderBy: 'startTime',
      }
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var send = [];
    var events = response.items;
    if (events.length == 0) {
      Model.find({}).then(function(data){
      console.log("events is none");
      console.log("***********"+data);
        res.render("fridgeHome", {data: "Day is Free", todo: data});
        })
    } else {
      for(var i = 0; i < events.length; i++){
        var event = events[i];
        var start = event.start.dateTime || event.start.date;
        var end = event.end.dateTime || event.end.date;
        console.log(start);
        var check = year+"-"+month+"-"+date;
        if(start.match(/T/)){
          var reverse = start.split("T");
          var move = reverse[1].split("-");

          //to standard time

          var eventHours = move[0].substring(0, 2);
          console.log("lalal "+eventHours);
          var test = parseInt(eventHours);

          if(test > 12){
            test = test - 12;
          }

          var toGo = test+move[0].substring(2,5);

          console.log(toGo);

          send.push(toGo);
        }else{
          send.push("all day");
        }

        if(end.match(/T/)){
          var reverse = end.split("T");
          var move = reverse[1].split("-");

          //get rid of military time
          var eventHours = move[0].substring(0, 2);
          var test = parseInt(eventHours);

          if(test > 12){
            test = test - 12;
          }

          var toGo = test+move[0].substring(2,5);

          console.log(toGo);

          send.push(toGo);

        }else{
          send.push("all day");
        }

        send.push(event.summary);

        // console.log(send);

        // console.log('%s - %s', start, event.summary);
      }

      var whole = new Date();
      var year = whole.getFullYear();
      var month = whole.getMonth()+1;
      var day = whole.getDate();
      var wordMonth;

      switch(month){
        case 1:
          wordMonth = "January";
          break;
          case 2:
            wordMonth = "February";
            break;
            case 3:
              wordMonth = "March";
              break;
              case 4:
                wordMonth = "April";
                break;
                case 5:
                  wordMonth = "May";
                  break;
                  case 6:
                    wordMonth = "June";
                    break;
                    case 7:
                      wordMonth = "July";
                      break;
                      case 8:
                        wordMonth = "August";
                        break;
                        case 9:
                          wordMonth = "September";
                          break;
                          case 10:
                            wordMonth = "October";
                            break;
                            case 11:
                              wordMonth = "November";
                              break;
                              case 12:
                                wordMonth = "December";
                                break;
      }


      //updated for the new MEAN framework

      res.status(200).json({error: false, data: send, date: {day: day, month: month, year: year, wordMonth: wordMonth}});

      // Model.find({}).then(function(data){
      // console.log("events is none");
      // console.log("***********"+data);
      //   res.render("fridgeHome", {data: send, todo: data});
      //   })
    }
  });
}
