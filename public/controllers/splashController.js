angular.module('codealyzerApp')
.controller("splashController", function($scope, $location, $stateParams, $http) {
	
	$http.get('/api/all_problems/')
	    .then(
	       function(response){
	         // success callback
	         console.log(response);
	         if (response.data.error) {
	            alert(response.data.error);
	            return;
	         }
	         $scope.problems = response.data.problems;
	       }, 
	       function(response){
	         // failure callback
	       }
	    ); 

	return true;
});