var express = require('express');

var app = express();
app.use(express.static(__dirname));

app.listen(8080, function() {
  console.log('Express production server running at localhost:8080');
});