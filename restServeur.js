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
    var whitelist = ['http://localhost:8080', 'http://localpit.net:8080', 'http://localhost', 'http://localpit.net'];
    var corsOptionsDelegate = function (req, callback) {
        var corsOptions;
        if (whitelist.indexOf(req.header('Origin')) !== -1) {
            corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
        }else{
            corsOptions = { origin: false }; // disable CORS for this request
        }
        callback(null, corsOptions); // callback expects two parameters: error and options
    };

	db.collection ('SearchSalles', function(err, collection){

        collection.createIndex(
            { nom : "text" }, function(err, result) {

            });

		app.get('/localpitsymf/orga/newsalle/searchsalles', cors(corsOptionsDelegate), function(req, res){
            var searchDoc = req.query;
			collection.find({$text: {"$search" : searchDoc.nom.toString() }}).toArray(function(err, salle){
                if (err) throw err;
                res.send(salle);
			})
		});

	});
	db.collection('Contacts', function(err, collection){
        app.options('/localpitsymf/orga/newsalle/ajoutsalle/:id', cors(corsOptionsDelegate));
        app.put('/localpitsymf/orga/newsalle/ajoutsalle/:id',  cors(corsOptionsDelegate), function(req, res){
            var updateDoc = req.body;
            collection.updateOne({"_id": new mongodb.ObjectID(req.params.id)}, { $push: { salles: updateDoc } }, function (err, contact){
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