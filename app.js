
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var tape = require('./routes/tape');
var http = require('http');
var path = require('path');

// Database
var mongo = require('mongoskin');
var db = mongo.db("mongodb://localhost:27017/mfn");
var moment = require('moment');
var mom = moment().format();

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

app.locals.last_10 = true;

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