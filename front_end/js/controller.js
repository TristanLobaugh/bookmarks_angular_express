var bookmarksApp = angular.module("bookmarksApp", ["ngRoute"])
// .filter is used to allow angular and the iframe to work together. Becuase 
// of security features you need to call the filter feature when binding the 
// url to the iframe with ng-src.
					.filter('trustAsResourceUrl', ['$sce', function($sce) {
					    return function(val) {
					        return $sce.trustAsResourceUrl(val);
					    };
					}])
var myUrl = "http://tristanlobaugh.com:3090/";

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

// Function that changes the iframe url that is sent from the main page bookmark-bar. Also calls
// function that updates the viewcount in the database and then increments the
// viewcounter manually without making an additional api call.
 	$scope.changeUrl = function(bookmark, event){
 		$scope.iframeUrl = bookmark.address;
 		$scope.gotoBookmark(bookmark, "main");
 		event.currentTarget.nextSibling.lastChild.innerHTML = parseInt(event.currentTarget.nextSibling.lastChild.innerHTML) + 1;
 	}

// On controller creation this function is called to get the current groups that are included in the bookmark collection and
// adds each group to an array the can be used with ng-repeat for features such as drop down lists and the ng-select options
// for editing the bookmarks.
 	function getGroups(){
 		for(var i = 0; i < $scope.bookmarks.length; i++){
 			if($scope.bookmarks[i].group == "none" || $scope.bookmarks[i].group == ""){
 			}else if($.inArray($scope.bookmarks[i].group, $scope.groups) == -1){
 					$scope.groups.push($scope.bookmarks[i].group);
 				}
 			} 
 		}
 	
// get call to express server to get the list of bookmarks
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

//post call to server to add a bookmark, includes ability to add from main page or the edit page.
	$scope.addBookmark = function(address){
		// address only exits if the bookmark is being added from the main page
		if(address){
			$scope.title = prompt("Please enter a title for you page.")
			if($scope.title != null){
				$scope.address = address;
				$scope.group = "none";
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

//post to server to remove a bookmark
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

//post to server to increment the view count
	$scope.gotoBookmark = function(bookmark, from){
		var apiUrl = myUrl + "goto_bookmark";
		$http.post(apiUrl, {
			id: bookmark.id
		}).then(function successCallback(response){
			if(response.data ==  "counted"){
				$scope.message = true;
				$scope.success = "Your bookmark view has been counted!"
// redirects user based on where they viewed the page from edit or main page
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

// populates the edit modal with the bookmark the user selected
	$scope.editBookmark = function(bookmark){
		console.log(bookmark);
		$scope.id = bookmark.id;
		$scope.title = bookmark.title;
		$scope.address = bookmark.address;
		$scope.group = bookmark.group;
	}

//post to server to update the bookmark when being editied with the edit modal
// had to use setTimout to delay the call bacause the closing of the modal was 
// interrupting the routing process
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