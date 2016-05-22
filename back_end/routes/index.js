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

// get request that is made on view loads. Makes query to db to find all bookmarks
// and send them back to the angular controller.
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

// post to add bookmark to db. Uses insertOne to add one bookmark to the db.
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

// post to remove bookmark with the matching id from the db
router.post("/remove_bookmark", function(req, res, next){
	db.collection("bookmark").remove({id: req.body.id},
		function (err, result){ 
			if(err){
				console.log("Error "+ err);
			}
         });
	var success = "removed";
	res.json(success);
});

// increments the viewcount in the db using the $inc feature
router.post("/goto_bookmark", function(req, res, next){
	console.log(req.body.id);
	db.collection("bookmark").update(
		{id: req.body.id},
		{$inc: {viewCount: 1}},
		function (err, result){ 
			if(err){
				console.log("Error "+ err);
			}
         });
	var success = "counted";
	res.json(success);
});

// updates the bookmark in the db with the matching id using the $set feature
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
			}
         });
	var success = "updated";
	res.json(success);
});

module.exports = router;
