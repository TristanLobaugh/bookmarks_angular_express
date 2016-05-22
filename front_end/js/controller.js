var bookmarksApp = angular.module("bookmarksApp", ["ngRoute"])
					.filter('trustAsResourceUrl', ['$sce', function($sce) {
					    return function(val) {
					        return $sce.trustAsResourceUrl(val);
					    };
					}])
var myUrl = "http://localhost:3090/";

bookmarksApp.config(function($routeProvider){
	$routeProvider.when("/", {
		templateUrl: "pages/main.html",
		controller: "mainController"
	});
	$routeProvider.when("/success", {
		templateUrl: "pages/main.html",
		controller: "mainController"
	});
	$routeProvider.when("/edit", {
		templateUrl: "pages/edit.html",
		controller: "mainController"
	});
	$routeProvider.when("/edit:", {
		templateUrl: "pages/edit.html",
		controller: "mainController"
	});
	$routeProvider.otherwise({
		redirectTo: "/"
	});
});

bookmarksApp.controller("mainController", function($scope, $http, $location){
	$scope.bookmarks;
	$scope.groups = [];
	getBookmarks();
 	$scope.myHeight = (($(window).height()) - 54) + "px";

 	$scope.changeUrl = function(bookmark, event){
 		$scope.iframeUrl = bookmark.address;
 		$scope.gotoBookmark(bookmark, "main");
 		event.currentTarget.nextSibling.lastChild.innerHTML = parseInt(event.currentTarget.nextSibling.lastChild.innerHTML) + 1;
 		// console.dir(document.getElementById("iframe"));
 	}

 	function getGroups(){
 		for(var i = 0; i < $scope.bookmarks.length; i++){
 			if($scope.bookmarks[i].group == "none" || $scope.bookmarks[i].group == ""){

 			}else if($.inArray($scope.bookmarks[i].group, $scope.groups) == -1){
 					$scope.groups.push($scope.bookmarks[i].group);
 				}
 			} 
 		}
 	

//call to backend to get the list of bookmarks
	function getBookmarks(){
		var apiUrl = myUrl + "get_bookmarks";
		$http.get(apiUrl)
		.then(function successCallback(response){
			if(response.data ==  null){

			}else{
				$scope.bookmarks = response.data;
				getGroups();
			}
		}, function errorCallback(response){
			$scope.result = "ERROR!!! "	+ response.status;
		});
	}

//post to backend to add a bookmark
	$scope.addBookmark = function(address){
		if(address){
			$scope.title = prompt("Please enter a title for you page.")
			if($scope.title != null){
				$scope.address = address;
				$scope.group = none;
			}else{
				console.log(failure);
				$location.path("/failure");
				return
			}
		}
		var apiUrl = myUrl + "add_bookmark";
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
				$location.path("/edit/");
			}else{
				console.log("error");
			}
		}, function errorCallback(response){
			$scope.result = "ERROR!!! "	+ response.status;
		});
	}

//post to backend when bookmark is naviagted to to increment view count
	$scope.gotoBookmark = function(bookmark, from){
		var apiUrl = myUrl + "goto_bookmark";
		$http.post(apiUrl, {
			id: bookmark.id
		}).then(function successCallback(response){
			if(response.data ==  "counted"){
				$scope.message = true;
				$scope.success = "Your bookmark view has been counted!"
				if(from !="main"){
					$location.path("/edit/");
				}else{

				}
			}else{
				console.log("error");
			}
		}, function errorCallback(response){
			$scope.result = "ERROR!!! "	+ response.status;
		});
	}

	$scope.editBookmark = function(bookmark){
		console.log(bookmark);
		$scope.id = bookmark.id;
		$scope.title = bookmark.title;
		$scope.address = bookmark.address;
	}

	$scope.updateBookmark = function(){
		$("#modal-close").click();
		setTimeout(function(){
			console.log("updating");
			var apiUrl = myUrl + "update_bookmark";
			$http.post(apiUrl, {
				id: $scope.id,
				title: $scope.title,
				address: $scope.address,
				group: $scope.group
			}).then(function successCallback(response){
				if(response.data ==  "updated"){
					$scope.message = true;
					$scope.success = "Your bookmark has been updated!"
					$location.path("/edit/");
					
				}else{
					console.log("error");
				}
			}, function errorCallback(response){
				$scope.result = "ERROR!!! "	+ response.status;
			});
		},200)
	}





// END CONTROLLER
});