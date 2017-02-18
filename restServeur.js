var express = require('express');
var mongodb = require('mongodb');
var bodyParser = require("body-parser");
var cors = require('cors');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
		});

	});
	db.collection('Contacts', function(err, collection){
        app.options('/localpitsymf/orga/newsalle/ajoutsalle/:id', cors());
        app.put('/localpitsymf/orga/newsalle/ajoutsalle/:id',  cors(), function(req, res){
            var updateDoc = req.body;
            console.log(updateDoc);
            collection.updateOne({"_id": new mongodb.ObjectID(req.params.id)}, { $push: { salles: {nom: "Jeff7", prenom: "Jean3"} } }, function (err, contact){
                if (err) throw err;

                res.send(contact);
            })
        });
        app.get('/localpitsymf/orga/newsalle/sallesinscrite/:id', function(req, res){
            collection.find({"_id": new mongodb.ObjectID(req.params.id)}).toArray(function(err, sallesins){
                if (err) throw err;
                res.send(sallesins);
            })
        });
    });
});


var server = app.listen(8080);