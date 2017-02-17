var express = require('express');
var mongodb = require('mongodb');

var app = express();
var MongoClient = mongodb.MongoClient;

var url = 'mongodb://localhost:27017/lopitadminprep';
MongoClient.connect(url, function (err, db){
	if (err) throw err;

	db.collection ('SearchSalles', function(err, collection){

		app.get('/localpitsymf/orga/newsalle/searchsalles', function(req, res){
			collection.find().toArray(function(err, salles){
                if (err) throw err;
                res.send(salles);
			})
		})
	})
});

var server = app.listen(8080);