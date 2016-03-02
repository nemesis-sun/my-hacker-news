var express = require('express');
var path = require('path');

var app = express();
app.use(express.static(path.join(__dirname, 'public')));

app.listen(8080, function() {
  console.log('Express production server running at localhost:8080');
});