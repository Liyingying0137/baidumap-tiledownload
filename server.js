var http = require('http');
var fs = require('fs');
var path = require('path');
var express = require('express');
var request = require("request");
var bodyParser = require('body-parser');
var mkdirp = require('mkdirp');

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'html');
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


app.all('/index', function(req, res) {
  res.sendFile('index.html', {
    root: __dirname + '/public'
  })
});

app.get('/saveTile', function(req, res) {
  var paths = req.query.path.split('/');

  paths.length = paths.length - 1;
  mkdirp(__dirname + '/' + paths.join('/'), function(err) {
    err && console.log(err);
    request(req.query.url).pipe(fs.createWriteStream(__dirname + '/' + req.query.path));
  });

  res.json({
    success: true
  })
});

var server = http.createServer(app);
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});