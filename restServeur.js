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
		});

	});
	db.collection('Contacts', function(err, collection){
        app.put('/localpitsymf/orga/newsalle/testreqid/:id', function(req, res){
            var updateDoc = req.body;
            collection.updateOne({"_id": new mongodb.ObjectID(req.params.id)}, { $set: {salles: {nom: "Jeff", prenom: "Jean2"} } }, function (err, contact){
                if (err) throw err;
                console.log(updateDoc);
                res.send(contact);
            })
        });
    });
});


var server = app.listen(8080);