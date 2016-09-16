var lanoelApp = angular.module('lanoel', ['ngRoute', 'ngAnimate', 'ngDragDrop','ui.bootstrap']);

lanoelApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$routeProvider

		// route for the home page
		.when('/', {
			templateUrl : '/partials/home.html',
			controller  : 'HeaderController'
		})

		// route for the about page
		.when('/game/:gameKey', {
			templateUrl : '/game/gameDetails.html',
			controller  : 'GameController'
		})

		// route for the contact page
		.when('/person/:personKey', {
			templateUrl : '/person/personDetails.html',
			controller  : 'PersonController'
		})

		.when('/tournament', {
			templateUrl : '/tournament/tournament.html',
			controller  : 'TournamentController'
		})

		.when('/login', {
			templateUrl : '/login/login.html',
			controller  : 'LoginController'
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

function updatePlacesInScoring($scope)
{

}

function updateGames($scope, $http)
{
	$http({
			method: 'GET',
			url: 'http://lanoel.elasticbeanstalk.com/lanoel/gamelist',
			data: { }
		}).success(function (result) {
			console.log("After updateGames, result: " + JSON.stringify(result));
			$scope.games = result.sort(compareGames);
			$scope.games.forEach(checkSteamImage);
			$scope.$emit('UpdateGames', $scope.games);
	});

	$http({
			method: 'GET',
			url: 'http://lanoel.elasticbeanstalk.com/lanoel/topfivegames',
			data: { }
		}).success(function (result) {
			console.log("After Top Five Games, result: " + JSON.stringify(result));
			$scope.topFiveGames = result;
			$scope.$emit('UpdateTopFiveGames', $scope.topFiveGames);
	});
}

function checkSteamImage(game)
{
	if(game.steamInfo == null)
	{
		game.steamInfo = {};
		game.steamInfo.header_image = 'http://dummyimage.com/600x400/000/fff&text=' + game.gameName;
	}
}

function updatePeople($scope, $http)
{
	$http({
			method: 'GET',
			url: 'http://lanoel.elasticbeanstalk.com/lanoel/personlist',
			data: { }
		}).success(function (result) {
			console.log("After updatePeople, result: " + JSON.stringify(result));
			$scope.people = result.sort(comparePeople);
			sessionStorage.personCache = JSON.stringify(result);
			$scope.$emit('UpdatePeople', result);
	});
}

function updatePerson($scope, $http, $routeParams)
{
	$http({
			method: 'GET',
			url: 'http://lanoel.elasticbeanstalk.com/lanoel/person/' + $routeParams.personKey ,
			data: { }
		}).then(function (result) {
		$scope.selectedPerson = result.data;
		console.log("After get person, result: " + JSON.stringify(result));
		console.log("After get person, selectedPerson.gameVote1: " + $scope.selectedPerson.gameVote1);
		console.log("After get person, result.gameVote1: " + result.gameVote1);
		$scope.$emit('UpdatePerson', $scope.selectedPerson);
	});
}

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
	return 0;
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
