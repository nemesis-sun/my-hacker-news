var express = require('express');
var path = require('path');

var port =  process.env.PORT || 8080;

var app = express();
app.use(express.static(path.join(__dirname, 'public')));

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
});

app.listen(port, function() {
  console.log('Express production server running at port 8080');
});