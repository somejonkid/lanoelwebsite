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

function refreshData($scope, $http)
{
	$http({
			method: 'GET',
			url: 'http://lanoel.elasticbeanstalk.com/lanoel/ownership',
			data: { }
		}).success(function (result) {
			
			var games = [];
			for(var i = 0; i < result.length; i++)
			{
				games.push(result[i].game);
			}

			var people = [];
			for(var i = 0; i < result[0].owners.length; i++)
			{
				people.push(result[0].owners[i]);
			}

			for(var i = 0; i < result[0].nonOwners.length; i++)
			{
				people.push(result[0].nonOwners[i]);
			}

			$scope.games = games.sort(compareGames);
			$scope.games.forEach(checkSteamImage);

			$scope.topFiveGames = [];

			for(var i = 0; i < 5; i++)
			{
				$scope.topFiveGames.push($scope.games[i]);
			}

			for(var i = 0; i < $scope.topFiveGames.length; i++)
			{
				var game = $scope.topFiveGames[i]; 
				$scope.topFiveGames[i].currentPrice = (game.free || game.steamInfo == null || game.steamInfo.price_overview == null) ? "Free!!" : "$" + game.steamInfo.price_overview.final / 100;
			}

			$scope.people = people.sort(comparePeople);
			sessionStorage.personCache = JSON.stringify(people);

			$scope.$emit('SetPrices', result);
			$scope.$emit('Refresh', $scope.games);
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

function updatePerson($scope, $http, $routeParams)
{
	$http({
			method: 'GET',
			url: 'http://lanoel.elasticbeanstalk.com/lanoel/person/' + $routeParams.personKey ,
			data: { }
		}).then(function (result) {
		$scope.selectedPerson = result.data;
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
