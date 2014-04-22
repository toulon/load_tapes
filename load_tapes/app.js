
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var tape = require('./routes/tape');
var http = require('http');
var path = require('path');
var helpers = require('express-helpers')();

// Database
var mongo = require('mongoskin');
var db = mongo.db("mongodb://localhost:27017/mfn");
var moment = require('moment');
var mom = moment().format();
var log_display = require('./log_display')

console.log('moment =  ' + mom )
var app = express();

// all environments
app.set('port', process.env.PORT || 3001);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.locals.date_tag = helpers.date_tag;
app.locals.last_10 = true;

// define our function with the callback argument
function some_function(arg1, arg2, callback) {
  // this generates a random number between
  // arg1 and arg2
  var my_number = Math.ceil(Math.random() *
    (arg1 - arg2) + arg2);
  // then we're done, so we'll call the callback and
  // pass our result
  callback(my_number);
}
// call the function
some_function(5, 15, function(num) {
  // this anonymous function will run when the
  // callback is called
  console.log("callback called! " + num);
});

function celebrityName (firstName) {
  var nameIntro = "This celebrity is ";
  // this inner function has access to the outer function's variables, including the parameter
  function lastName (theLastName) {
    return nameIntro + firstName + " " + theLastName;
  }
  return lastName;
}

var mjName = celebrityName ("Michael"); // At this juncture, the celebrityName outer function has returned.

// The closure (lastName) is called here after the outer function has returned above
// Yet, the closure still has access to the outer function's variables and parameter
console.log(mjName ("Jackson")); // This celebrity is Michael Jackson
var friends = ["Mike", "Stacy", "Andy", "Rick"];
log_display.logger(friends)
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/tapelist', tape.tapelist(db));
app.post('/addtape', tape.addtape(db));
app.delete('/deletetape/:id', tape.deletetape(db));
app.put('/updatetape/:id', tape.updatetape(db));

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});