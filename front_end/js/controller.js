var bookmarksApp = angular.module("bookmarksApp", ["ngRoute"]);
var myUrl = "http://localhost:3090/";


bookmarksApp.config(function($routeProvider){
	$routeProvider.when("/", {
		templateUrl: "pages/main.html",
		controller: "mainController"
	});
	// $routeProvider.when("/edit", {
	// 	templateUrl: "pages/edit.html",
	// 	controller: "mainController"
	// });
	$routeProvider.otherwise({
		redirectTo: "/"
	});
});

bookmarksApp.controller("mainController", function($scope, $http, $location){
	getBookmarks();

//call to backend to get the list of bookmarks
	function getBookmarks(){
		var apiUrl = myUrl + "get_bookmarks";
		$http.get(apiUrl)
		.then(function successCallback(response){
			if(response.data ==  null){

			}else{
				$scope.bookmarks = response.data;
			}
		}, function errorCallback(response){
			$scope.result = "ERROR!!! "	+ response.status;
		});
	}

//post to backend to add a bookmark
	$scope.addBookmark = function(){
		var apiUrl = myUrl + "add_bookmark";
		$http.post(apiUrl, {
			title: $scope.title,
			address: $scope.address	
		}).then(function successCallback(response){
			if(response.data ==  "added"){
				$scope.message = true;
				$scope.success = "Success! Your bookmark has been added!"
				$location.path("/success");
			}else{
				console.log("error");
			}
		}, function errorCallback(response){
			$scope.result = "ERROR!!! "	+ response.status;
		});
	}

//post to backend to remove a bookmark
	$scope.removeBookmark = function(bookmark){
		console.log(bookmark.id);
		var apiUrl = myUrl + "remove_bookmark";
		$http.post(apiUrl, {
			id: bookmark.id
		}).then(function successCallback(response){
			if(response.data ==  "removed"){
				$scope.message = true;
				$scope.success = "Your bookmark has been removed!"
				$location.path("/success");
			}else{
				console.log("error");
			}
		}, function errorCallback(response){
			$scope.result = "ERROR!!! "	+ response.status;
		});
	}

//post to backend when bookmark is naviagted to to increment view count
	$scope.gotoBookmark = function(bookmark){
		var apiUrl = myUrl + "goto_bookmark";
		$http.post(apiUrl, {
			id: bookmark.id
		}).then(function successCallback(response){
			if(response.data ==  "counted"){
				$scope.message = true;
				$scope.success = "Your bookmark view has been counted !"
				$location.path("/success");
			}else{
				console.log("error");
			}
		}, function errorCallback(response){
			$scope.result = "ERROR!!! "	+ response.status;
		});
	}






























// END CONTROLLER
});