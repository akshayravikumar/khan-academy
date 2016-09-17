angular.module('codealyzerApp', ["ui.router"])  
.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
	// For any unmatched url, redirect to /
	$urlRouterProvider.otherwise("/");

	$stateProvider
		.state('splash', {
		  url: "/",
		  templateUrl: "/views/splash.html",
		  controller: "splashController"
		})
		.state('user', {
		  url: "/problem/:id",
		  templateUrl: "/views/user.html",
		  controller: "userController"
		})
	
	$locationProvider.html5Mode(true);
});
