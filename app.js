require('dotenv').config();
var cloudant = require('cloudant');
var express = require('express');
var bodyParser = require('body-parser');
let secureEnv = require('secure-env');
const fs = require('fs');

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));
app.get('/',function(req,res){
  res.sendFile("views/index.html", {"root": __dirname});
});
var cloudant = cloudant({account:process.env.cloudantusername, password:process.env.cloudantpassword});

feedbackdb = cloudant.db.use(process.env.dbname);

app.post('/feedback', function(req,res){
    var doc={
        time: new Date().toISOString(),
        eventrating: req.body.event_rate,
        informationrating: req.body.info_rate,
        speakerrating: req.body.speaker_rate,
        futureevents: req.body.future_events,
        satisfaction: req.body.satisfaction,
        improvements: req.body.improvement
        };
    
feedbackdb.insert(doc,function(err,body,header){
    if(err){
    res.send("<h3>Oops, an error has been encountered!</h3>");
        console.log('Error:'+err.message);
        return;
    }
    else{
        return res.sendFile(__dirname + "/views/success.html"); }
    });        
});

const port = 3001;
app.listen(port, function () {
    console.log("Server running on port: %d", port);
});
module.exports = app;