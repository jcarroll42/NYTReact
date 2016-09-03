// Include Server Dependencies
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

//Require History Schema
var Article = require('./models/Article.js');

// Create Instance of Express
var app = express();
var PORT = process.env.PORT || 3000; // Sets an initial port. We'll use this later in our listener

// Run Morgan for Logging
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({type:'application/vnd.api+json'}));

app.use(express.static('./public'));

// -------------------------------------------------

// MongoDB Configuration configuration (Change this URL to your own DB)
mongoose.connect('mongodb://admin:lollercopter@ds019806.mlab.com:19806/heroku_8bcctlnb');
var db = mongoose.connection;

db.on('error', function (err) {
  console.log('Mongoose Error: ', err);
});

db.once('open', function () {
  console.log('Mongoose connection successful.');
});


// -------------------------------------------------

// Main Route. This route will redirect to our rendered React application
app.get('/', function(req, res){
  res.sendFile('./public/index.html');
})

// This is the route we will send GET requests to retrieve our most recent search data.
// We will call this route the moment our page gets rendered
app.get('/api/', function(req, res) {

//   // We will find all the records, sort it in descending order, then limit the records to 5
  Article.find({}).sort([['date', 'descending']])
    .exec(function(err, doc){

      if(err){
        console.log(err);
      }
      else {
        res.send(doc);
      }
    })
});

// // This is the route we will send POST requests to save each search.
app.post('/api/', function(req, res){
  var newSearch = new Article(req.body);
  console.log("url: " + req.body.url);
  console.log(req.body.main)

//   // Here we'll save the location based on the JSON input. 
//   // We'll use Date.now() to always get the current date time
  Article.create({"title": req.body.main, "date": Date.now(), "url": req.body.url}, function(err){
    if(err){
      console.log(err);
    }
    else {
      res.send("Saved Search");
    }
  })
});

app.put('/api/', function(req, res){
  console.log(req.body);

//   // Here we'll save the location based on the JSON input. 
//   // We'll use Date.now() to always get the current date time
  Article.remove({_id: req.body._id}, function(err){
    if(err){
      console.log(err);
    }
    else {
      res.send("Removed article");
    }
  })
});


// -------------------------------------------------

// Listener
app.listen(PORT, function() {
  console.log("App listening on PORT: " + PORT);
});
