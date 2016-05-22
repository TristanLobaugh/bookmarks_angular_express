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
			res.json();
		}else{
			res.json(bookmarks);
		}
	});
});

router.post("/add_bookmark", function(req, res, next){
	db.collection("bookmark").insertOne({
		id: Date.now(),
		title: req.body.title,
		address: req.body.address,
		group: req.body.group,
		viewCount: 0
	});
	var success = "added";
	res.json(success);
});

router.post("/remove_bookmark", function(req, res, next){
	db.collection("bookmark").remove({id: req.body.id},
		function (err, result){ 
			if(err){
				console.log("Error "+ err);
               //check result to see how many document are deleted
			}
         });
	var success = "removed";
	res.json(success);
});

router.post("/goto_bookmark", function(req, res, next){
	console.log(req.body.id);
	db.collection("bookmark").update(
		{id: req.body.id},
		{$inc: {viewCount: 1}},
		function (err, result){ 
			if(err){
				console.log("Error "+ err);
               //check result to see how many document are deleted
			}
         });
	var success = "counted";
	res.json(success);
});

router.post("/update_bookmark", function(req, res, next){
	console.log(req.body.id);
	db.collection("bookmark").update(
		{id: req.body.id},
		{
			$set: 	{
						title: req.body.title,
						address: req.body.address,
						group: req.body.group
					}
		},
		function (err, result){ 
			if(err){
				console.log("Error "+ err);
               //check result to see how many document are deleted
			}
         });
	var success = "updated";
	res.json(success);
});



module.exports = router;
