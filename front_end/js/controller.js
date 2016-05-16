var bookmarksApp = angular.module("bookmarksApp", ["ngRoute"]);

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
	var myUrl = "http://localhost:3090/"

//call to backend to get the list of bookmarks
	function getBookmarks(){
		console.log("getting bookmarks")
		var apiUrl = "http://localhost:3090/get_bookmarks";
		$http.get(apiUrl)
		.then(function successCallback(response){
			console.log(response.data);
			if(response.data ==  null){

			}else{
				$scope.bookmarks = response.data;
			}
		}, function errorCallback(response){
			console.log("fail");
			$scope.result = "ERROR!!! "	+ response.status;
			// console.log($scope.result);
		});
	}

//post to backend to add a bookmark
	$scope.addBookmark = function(){

	}

//post to backend to remove a bookmark
	$scope.removeBookmark = function(){

	}

//post to backend when bookmark is naviagted to to increment view count
	$scope.gotoBookmark = function(){

	}



// END CONTROLLER
});