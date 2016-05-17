var express = require('express');
var router = express.Router();
var MongoClient = require("mongodb").MongoClient;
var mongoUrl = "mongodb://localhost:27017/bookmarks";
var db;

MongoClient.connect(mongoUrl, function(error, database){
	db=database;
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/get_bookmarks", function(req, res, next){
	db.collection("bookmark").find().toArray(function(error, bookmarks){
		if(bookmarks.length === 0){
			console.log("***NO BOOKMARKS***");
		}else{
			res.json(bookmarks);
		}
	});
});

router.post("/add_bookmark", function(req, res, next){
	db.collection("bookmark").insertOne({
		title: req.body.title,
		address: req.body.address,
		viewCount: 0
	});
	var success = "success";
	res.json(success);
});

module.exports = router;
