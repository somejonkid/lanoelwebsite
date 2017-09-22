var lanoelApp = angular.module('lanoel', ['ngRoute', 'ngAnimate', 'ngDragDrop','ui.bootstrap','dndLists']);

lanoelApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$routeProvider

		// route for the home page
		.when('/', {
			templateUrl : '/partials/home.html',
			controller  : 'HeaderController'
		})

		// route for the about page
		.when('/game/:gameKey', {
			templateUrl : '/partials/gameDetails.html',
			controller  : 'GameController'
		})

		// route for the contact page
		.when('/person/:personKey', {
			templateUrl : '/partials/personDetails.html',
			controller  : 'PersonController'
		})

		.when('/tournament', {
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

lanoelApp.controller('MainController', function($scope) {
	$scope.message = 'Look! I am an about page.';
});

function compareGames(game1, game2)
{
	if(game1.voteTotal > game2.voteTotal)
	{
		return -1;
	}
	if(game1.voteTotal < game2.voteTotal)
	{
		return 1;
	}
	if(game1.numUniquePersonVotes > game2.numUniquePersonVotes)
	{
		return -1;
	}

	return 1;
}

function comparePeople(person1, person2)
{
	if(person1.personName < person2.personName)
	{
		return -1;
	}
	if(person1.personName > person2.personName)
	{
		return 1;
	}
	return 0;
}

function comparePlaces(place1, place2)
{
	if(place1.place < place2.place)
	{
		return -1;
	}
	if(place1.place > place2.place)
	{
		return 1;
	}
	return 0;
}
