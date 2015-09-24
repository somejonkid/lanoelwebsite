	var scotchApp = angular.module('lanoel', ['ngRoute']);

	// configure our routes
	scotchApp.config(function($routeProvider) {
		$routeProvider

			// route for the home page
			.when('/', {
				templateUrl : 'index.html',
				controller  : 'mainController'
			})

			// route for the about page
			.when('/game', {
				templateUrl : 'gameDetails.html',
				controller  : 'gameController'
			})

			// route for the contact page
			.when('/person', {
				templateUrl : 'personDetails.html',
				controller  : 'personController'
			});
	});

	// create the controller and inject Angular's $scope
	scotchApp.controller('mainController', function($scope) {
		$scope.selectedGame = null;
		$scope.games = [];

		$scope.people =[];

		$http({
				method: 'GET',
				url: 'http://lanoel.elasticbeanstalk.com/lanoel/gamelist',
				data: { }
			}).success(function (result) {
			$scope.games = result.sort(compareGames);
		});

		$http({
				method: 'GET',
				url: 'http://lanoel.elasticbeanstalk.com/lanoel/personlist',
				data: { }
			}).success(function (result) {
			$scope.people = result;
		});
	});

	scotchApp.controller('gameController', function($scope) {
		$scope.message = 'Look! I am an about page.';
	});

	scotchApp.controller('personController', function($scope) {
		$scope.message = 'Contact us! JK. This is just a demo.';
	});