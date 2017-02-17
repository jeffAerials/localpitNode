var MongoClient = require ('mongodb').MongoClient,
    assert = require('assert');

var url = 'mongodb://localhost:27017/tutoriel'

MongoClient.connect(url, function (err, db){
    assert.equal(null, err);
    console.log("Connected successfully to server");
	db.collection('Product', function(err, collection){
		collection.insert({
			nom:'livreJS2',
			description: 'livre JS pour commencer-2',
		prix: 12}, function (err, livre){
				if (!err) console.log('ok !')
		})
		collection.findOne({prix:{$lt:11}}, function (err, livre){
			if (!err) console.log(livre.nom)
		})
	})

    db.close();
})
