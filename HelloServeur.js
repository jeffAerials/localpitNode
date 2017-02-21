var express = require ('express');
var app = express();

app.use('/', function (req, res, next){
    res.send('HELLO Jeff !!')
});

var server = app.listen(8080);
