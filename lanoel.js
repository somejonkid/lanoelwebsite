var lanoelApp = angular.module('lanoel', ['ngRoute', 'ngAnimate', 'ngDragDrop','ui.bootstrap','dndLists']);

lanoelApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$routeProvider

		// route for the home page
		.when('/', {
			templateUrl : '/partials/home.html',
			controller  : 'HeaderController'
		})

		// route for the about page
		.when('/game', {
			templateUrl : '/partials/gameDetails.html',
			controller  : 'GameController'
		})

		// route for the contact page
		.when('/person', {
			templateUrl : '/partials/personDetails.html',
			controller  : 'PersonController'
		})

		.when('/tournaments', {
			templateUrl : '/partials/tournament.html',
			controller  : 'TournamentController'
		})

		.when('/login', {
			templateUrl : '/partials/login.html',
			controller  : 'HeaderController'
		})

		.when('/createAccount', {
			templateUrl : '/partials/createAccount.html',
			controller  : 'CreateAccountController'
		})

		.when('/updatescores', {
			templateUrl : '/partials/updateScores.html',
			controller  : 'UpdateScoresController'
		})


		.otherwise({redirectTo:'/'});

		$locationProvider.html5Mode(
		     {
				enabled: true,
				requireBase: false
			 });
}]);
