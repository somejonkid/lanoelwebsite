var lanoelApp = angular.module('lanoel', ['ngRoute']);


lanoelApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$routeProvider

		// route for the home page
		.when('/', {
			templateUrl : '/partials/home.html',
			controller  : 'MainController'
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
		.otherwise({redirectTo:'/'});
		
		$locationProvider.html5Mode(
		     {
				enabled: true,
				requireBase: false
			 });
}]);

lanoelApp.controller('HeaderController', function($scope, $http, $route, $routeParams, $location) {
	$scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;
	
	$scope.games = [];
	$scope.topFiveGames = [];
	$scope.people =[];
	$scope.selectedPerson = null;

	updateGames($scope, $http);

	updatePeople($scope, $http);

	$scope.$on('UpdateGames', function(event, value){
		$scope.games = value;
	});

	$scope.$on('UpdateTopFiveGames', function(event, value){
		$scope.topFiveGames = value;
	});

	$scope.$on('UpdatePeople', function(event, value){
		$scope.people = value;
	});

	$scope.addNewGame = function(name)
	{
		addGame($scope, $http, name);
		$scope.newGameName = null;
	};

	$scope.tableNavigateToPerson = function(person)
	{
		$location.path('/person/' + person.personKey);
	};
});

lanoelApp.controller('MainController', function($scope) {
	$scope.message = 'Look! I am an about page.';
});

lanoelApp.controller('GameController', function($scope, $http, $routeParams) {
	$scope.selectedGame = null;

	$scope.$on('UpdateGames', function(event, value){
		$scope.games = value;
	});

	$scope.$on('UpdateTopFiveGames', function(event, value){
		$scope.topFiveGames = value;
	});

	$http({
			method: 'GET',
			url: 'http://lanoel.elasticbeanstalk.com/lanoel/game/' + $routeParams.gameKey ,
			data: { }
		}).success(function (result) {
			console.log("After get game result: " + JSON.stringify(result));
			$scope.selectedGame = result;
			console.log("After get game $scope.selectedGame: " + JSON.stringify($scope.selectedGame));
	});

	$scope.updateGame = function()
	{
		$http({
				method: 'POST',
				url: 'http://lanoel.elasticbeanstalk.com/lanoel/game/',
				data: $scope.selectedGame
			}).success(function (result) {
			$scope.selectedGame = result;
		});
	}
});

lanoelApp.controller('PersonController', function($scope, $http, $routeParams, $filter) {
	$scope.selectedPerson = null;
	$scope.games = [];
	$scope.topFiveGames = [];

	updatePerson($scope, $http, $routeParams);
	updateGames($scope, $http);
	updatePeople($scope, $http);

	$scope.onGameVote1Change = function()
	{
		console.log("on vote change gameVote1selection: " + JSON.stringify($scope.gameVote1selection));
		var gameselectionObj1 = $filter('filter')($scope.games, {gameKey : $scope.gameVote1selection}, true)[0];
		console.log("after filter: " + JSON.stringify(gameselectionObj1));
		$scope.gameVote1selection = {gameKey : gameselectionObj1.gameKey, gameName : gameselectionObj1.gameName};
	}

	$scope.onGameVote2Change = function()
	{
		console.log("on vote change gameVote2selection: " + JSON.stringify($scope.gameVote2selection));
		var gameselectionObj2 = $filter('filter')($scope.games, {gameKey : $scope.gameVote2selection}, true)[0];
		console.log("after filter: " + JSON.stringify(gameselectionObj2));
		$scope.gameVote2selection = {gameKey : gameselectionObj2.gameKey, gameName : gameselectionObj2.gameName};
	}

	$scope.onGameVote3Change = function()
	{
		console.log("on vote change gameVote3selection: " + JSON.stringify($scope.gameVote3selection));
		var gameselectionObj3 = $filter('filter')($scope.games, {gameKey : $scope.gameVote3selection}, true)[0];
		console.log("after filter: " + JSON.stringify(gameselectionObj3));
		$scope.gameVote3selection = {gameKey : gameselectionObj3.gameKey, gameName : gameselectionObj3.gameName};
	}
	

	$scope.$on('UpdatePerson', function(event, value){
		$scope.selectedPerson = value;
		console.log("after update person, gameVote3: " + $scope.selectedPerson.gameVote3);
		console.log("after update person, gameVote2: " + $scope.selectedPerson.gameVote2);
		console.log("after update person, gameVote1: " + $scope.selectedPerson.gameVote1);

		var gameselectionObj1 = $filter('filter')($scope.games, {gameName : $scope.selectedPerson.gameVote3}, true)[0];
		var gameselectionObj2 = $filter('filter')($scope.games, {gameName : $scope.selectedPerson.gameVote2}, true)[0];
		var gameselectionObj3 = $filter('filter')($scope.games, {gameName : $scope.selectedPerson.gameVote1}, true)[0];

		var gameselectionName1 = null;
		var gameselectionName2 = null;
		var gameselectionName3 = null;
		var gameselectionKey1 = null;
		var gameselectionKey2 = null;
		var gameselectionKey3 = null;

		if(gameselectionObj1 != null)
		{
			gameselectionName1 = gameselectionObj1.gameName;
			gameselectionKey1 = gameselectionObj1.gameKey;
		}
		if(gameselectionObj2 != null)
		{
			gameselectionName2 = gameselectionObj2.gameName;
			gameselectionKey2 = gameselectionObj2.gameKey;
		}
		if(gameselectionObj3 != null)
		{
			gameselectionName3 = gameselectionObj3.gameName;
			gameselectionKey3 = gameselectionObj3.gameKey;
		}

		$scope.gameVote1selection = {gameKey : gameselectionKey1, gameName : gameselectionName1};
		$scope.gameVote2selection = {gameKey : gameselectionKey2, gameName : gameselectionName2};
		$scope.gameVote3selection = {gameKey : gameselectionKey3, gameName : gameselectionName3};

		console.log("after updatePerson gameVote1selection: " + JSON.stringify($scope.gameVote1selection));
		console.log("after updatePerson gameVote2selection: " + JSON.stringify($scope.gameVote2selection));
		console.log("after updatePerson gameVote3selection: " + JSON.stringify($scope.gameVote3selection));
	});

	$scope.$on('UpdateGames', function(event, value){
		$scope.games = value;
	});

	$scope.$on('UpdateTopFiveGames', function(event, value){
		$scope.topFiveGames = value;
	});

	$http({
			method: 'GET',
			url: 'http://lanoel.elasticbeanstalk.com/lanoel/person/' + $routeParams.personKey ,
			data: { }
		}).success(function (result) {
		$scope.selectedPerson = result;
	});

	$scope.updateVotes = function(vote1, vote2, vote3)
	{
		console.log("vote1: " + vote1);
		console.log("vote2: " + vote2);
		console.log("vote3: " + vote3);

		console.log("games: " + $scope.games);

		var myVote1 = {"gameKey":vote1.gameKey, "voteNumber":3}
		var myVote2 = {"gameKey":vote2.gameKey, "voteNumber":2}
		var myVote3 = {"gameKey":vote3.gameKey, "voteNumber":1}

		console.log("myVote1: " + JSON.stringify(myVote1));
		console.log("myVote2: " + JSON.stringify(myVote2));
		console.log("myVote3: " + JSON.stringify(myVote3));

		if(myVote1.gameKey != null)
		{
			vote($http, $scope.selectedPerson.personKey, myVote1);
		}
		if(myVote2.gameKey != null)
		{
			vote($http, $scope.selectedPerson.personKey, myVote2);
		}
		if(myVote3.gameKey != null)
		{
			vote($http, $scope.selectedPerson.personKey, myVote3);
		}

		$http({
				method: 'POST',
				url: 'http://lanoel.elasticbeanstalk.com/lanoel/person',
				data: $scope.selectedPerson
			}).then(function (result) {
				updateGames($scope, $http);
				updatePeople($scope, $http);
				updatePerson($scope, $http, $routeParams);
		});
	};
});

function updateGames($scope, $http)
{
	$http({
			method: 'GET',
			url: 'http://lanoel.elasticbeanstalk.com/lanoel/gamelist',
			data: { }
		}).success(function (result) {
			console.log("After updateGames, result: " + JSON.stringify(result));
			$scope.games = result.sort(compareGames);
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

function updatePeople($scope, $http)
{
	$http({
			method: 'GET',
			url: 'http://lanoel.elasticbeanstalk.com/lanoel/personlist',
			data: { }
		}).success(function (result) {
			console.log("After updatePeople, result: " + JSON.stringify(result));
			$scope.people = result.sort(comparePeople);
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

function vote($http, personKey, myVote)
{
	$http({
			method: 'POST',
			url: 'http://lanoel.elasticbeanstalk.com/lanoel/person/' + personKey + '/vote',
			data: myVote
		}).success(function (result) {
		return true;
	});
}

function addGame($scope, $http, gameName)
{
	$http({
			method: 'POST',
			url: 'http://lanoel.elasticbeanstalk.com/lanoel/game',
			data: {"gameName" : gameName}
		}).then(function (result) {
			updateGames($scope, $http);
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
