var express = require('express')
var mongodb = require('mongodb')

var app = express()
var MongoClient = mongodb.MongoClient

var url = 'mongodb://localhost:27017/lopitadminprep'
MongoClient.connect(url, function (err, db){
	if (err) throw err
	db.collection ()
})