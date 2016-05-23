# Bookmarks

### Bookmarks app build using AngularJS with Routes for the front-end, Express for back-end and Mongodb as the database. 

## Summary

#### App makes use of Angular to create the view and bind features like viewcounts and list to the view. The Angular controller makes API calls to an express server that in turns makes calls to a Mongo Database to access/update/delete data for each bookmark. Bootstrap was used for styling features and a modal. Jquery was used in a few much of the front end javascript functions for ease of access to elements and sorting arrays.

### Author: Tristan Lobaugh 
+ Github - https://github.com/TristanLobaugh
+ Homepage - http://tristanlobaugh.com

## Demo

[Live Demo](http://tristanlobaugh.com/bookmark_manager/front_end/)

## Screenshots

### Main page:
![alt text](https://raw.githubusercontent.com/TristanLobaugh/bookmarks_angular_express/master/img/screen_shot.png)

### edit page:
![alt text](https://raw.githubusercontent.com/TristanLobaugh/bookmarks_angular_express/master/img/screen_shot2.png)


##Code Examples

### Post to server from the angular controller to add a bookmark. Post includes all relevant information needed sent in JSON format.
```
$http.post(apiUrl, {
			title: $scope.title,
			address: $scope.address,
			group: $scope.group
		}).then(function successCallback(response){
			if(response.data ==  "added"){
				$scope.message = true;
				$scope.success = "Success! Your bookmark has been added!"
				$location.path("/edit/");
			}else{
				console.log("error");
			}
		}, function errorCallback(response){
			$scope.result = "ERROR!!! "	+ response.status;
		});
```

### Express server code to use the above post and adds the bookmark to the database using the insertOne method.
```
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
```

## To Do