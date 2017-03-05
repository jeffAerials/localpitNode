var express = require('express');
var mongodb = require('mongodb');
var bodyParser = require("body-parser");
var cors = require('cors');
var urlfonc = require('./Connexion');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var MongoClient = mongodb.MongoClient;

var url = urlfonc();
MongoClient.connect(url, function (err, db){
	if (err) throw err;
    var whitelist = ['http://localhost:8080', 'http://www.localpit.net:8080', 'http://localhost', 'http://www.localpit.net', 'http://localpit.net', 'http://localpit.net:8080']; // ajout http white list
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



		app.get('/localpitsymf/orga/newsalle/searchsalles', cors(corsOptionsDelegate), function(req, res){
            var searchDoc = req.query;
			collection.find({society: {$regex : searchDoc.society.toString(), $options: 'i' }}).toArray(function(err, salle){
                if (err) throw err;
                res.send(salle);
			})
		});

	});
	db.collection('OrgaDocument', function(err, collection) {
        app.get('/localpitsymf/neworga/searchorgas', cors(corsOptionsDelegate), function (req, res) {
            var searchDoc = req.query;
            collection.find({society: {$regex: searchDoc.society.toString(), $options: 'i'}}).toArray(function (err, orga) {
                if (err) throw err;
                res.send(orga);
            })
        });
    });

	db.collection('BandDocument', function(err, collection) {
        app.get('/localpitsymf/newband/searchbands', cors(corsOptionsDelegate), function (req, res) {
            var searchDoc = req.query;
            collection.find({$and: [{society: {$regex: searchDoc.society.toString(), $options: 'i'}}, {emailsociety:{$exists:true}}]}).sort({ "item.society": -1}).toArray(function (err, band) {
            /*collection.find({society: {$regex: searchDoc.society.toString(), $options: 'mi'}}).sort({ "item.society": 1}).toArray(function (err, band) {*/
                if (err) throw err;
                res.send(band);
            })
        });
    });
    db.collection ('SalleDocument', function(err, collection){

        app.get('/localpitsymf/newsalle/searchsalles', cors(corsOptionsDelegate), function(req, res){
            var searchDoc = req.query;
            collection.find({society: {$regex : searchDoc.society.toString(), $options: 'i' }}).toArray(function(err, salle){
                if (err) throw err;
                res.send(salle);
            })
        });

        app.get('/localpitsymf/orga/indexsalle/searchsalledocinsc', cors(corsOptionsDelegate), function(req, res){
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
        app.get('/localpitsymf/orga/newsalle/sallesinscrite/:id', cors(corsOptionsDelegate), function(req, res){
            collection.find({"_id": new mongodb.ObjectID(req.params.id)}).toArray(function(err, sallesins){
                if (err) throw err;
                res.send(sallesins);
            })
        });
    });
	db.collection('Product', function(err, collection){
	    app.options('/localpitsymf/testmongo/creategeoloc/:id', cors(corsOptionsDelegate));
	    app.put('/localpitsymf/testmongo/creategeoloc/:id', cors(corsOptionsDelegate), function(req, res){
	        var updateDoc = req.body;
	        var latn = parseFloat(updateDoc["lat"]);
            var lonn = parseFloat(updateDoc["lon"]);
	        console.log(latn);
	        collection.updateOne({"_id": new mongodb.ObjectID(req.params.id)}, {$set: {loc: { type: "Point", coordinates: [latn, lonn]}}}, function (err, product){
	            if (err) throw err;
	            res.send(product);
            })
        })
    })
});

// modif serveur 3eme modif 457458455445545
var server = app.listen(8080);