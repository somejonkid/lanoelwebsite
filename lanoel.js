var lanoelApp = angular.module('lanoel', ['ngRoute', 'ngAnimate', 'ngDragDrop']);


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

lanoelApp.controller('HeaderController', function($scope, $http, $route, $routeParams, $location) {
	$scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;
	
	$scope.games = [];
	$scope.people =[];
	$scope.selectedPerson = null;

	updateGames($scope, $http);

	updatePeople($scope, $http);

	isUserLoggedIn($scope, $http);

	$scope.$on('UpdateGames', function(event, value){
		$scope.games = value;
	});

	$scope.$on('UpdatePeople', function(event, value){
		$scope.people = value;
	});

	$scope.$on('Login', function(event, value){
		console.log("entering login event handler");
		document.getElementById("updateScoresLink").hidden = false;
		document.getElementById("logoutLink").hidden = false;
	});

	$scope.$on('Logout', function(event, value){
		console.log("entering logout event handler");
		document.getElementById("updateScoresLink").hidden = true;
		document.getElementById("logoutLink").hidden = true;
		document.getElementById("loginLink").hidden = false;
		$location.path('/' + person.personKey);
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

	$scope.loginClick = function()
	{
		console.log("sessionstorage sessionid: " + sessionStorage.sessionid);
		if(sessionStorage.sessionid == null)
		{
			$location.path('/login');
		}
	}

	$scope.logoutClick = function()
	{
		console.log("logging out");
		clearSession();
		$location.path('/');
	}

	$scope.updateScoresClick = function()
	{
		$location.path('/updatescores');
	}

	$scope.isUserLoggedIn = function()
	{
		if(sessionStorage.sessionid == null || sessionStorage.sessionid == '')
		{
			return false;
		}
		return true;
	}
});

lanoelApp.controller('MainController', function($scope) {
	$scope.message = 'Look! I am an about page.';
});

lanoelApp.controller('GameController', function($scope, $http, $routeParams) {
	$scope.selectedGame = null;

	$scope.$on('UpdateGames', function(event, value){
		$scope.games = value;
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

lanoelApp.controller('TournamentController', function($scope, $http, $routeParams, $filter) {
	$scope.tournament = null;
	$scope.scores = [];
	$scope.rounds = [];
	$scope.selectedRound = null;

	$scope.refresh = function()
	{
		$http({
				method: 'GET',
				url: 'http://lanoel.elasticbeanstalk.com/tournament/1',
			}).success(function (result) {
				$scope.tournament = result;
				$scope.scores = $scope.tournament.scores;
				

				for (var i = 0; i < $scope.tournament.rounds.length ; i++)
				{
					var tempPlaces = [];
					for(var j = 0; j < $scope.tournament.rounds[i].places.length; j++)
					{
						if($scope.tournament.rounds[i].places[j].place != 99)
						{
							tempPlaces.push($scope.tournament.rounds[i].places[j]);
						}
					}
					$scope.tournament.rounds[i].places = tempPlaces;
				}

				$scope.rounds = $scope.tournament.rounds;
				$scope.selectedRound = $scope.rounds[0];
		});
	}

	$scope.refresh();

    $scope.onTabClick = function(round)
	{
		$scope.selectedRound = round;
		console.log("On click, current round: " + $scope.selectedRound.game.gameName);
	}
});

lanoelApp.controller('LoginController', function($scope, $http, $routeParams, $location) {
	$scope.user = null;
	$scope.alerts = {};

	$http({
			method: 'GET',
			url: 'http://lanoel.elasticbeanstalk.com/tournament/1',
		}).success(function (result) {
			$scope.tournament = result;
			$scope.scores = $scope.tournament.scores;
			$scope.rounds = $scope.tournament.rounds;
	});

	$scope.onLogin = function()
	{
		console.log("username: " + $scope.user.username + " password: " + $scope.user.password);
		$http({
			method: 'POST',
			url: 'http://users.omegasixcloud.net/accounts/login',
			headers : {
				'username' : $scope.user.username,
				'password' : $scope.user.password
			}
		}).success(function (data, status, headers, config) {
			console.log("sessionid: " + headers("sessionid"));
			setSession(headers("sessionid"), $location);
			$scope.$emit('Login', $scope.user);
			$location.path('/');
			console.log("session id from storage: " + sessionStorage.sessionid);
		})
		.error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
			console.log("login status: " + status);
			clearSession();
			console.log("session id from storage: " + sessionStorage.sessionid);
			document.getElementById("loginErrorAlert").hidden = false;
		 });
	}

	$scope.onAccountCreation = function()
	{
		console.log("create Account clicked!");
		$location.path('/createAccount');
	}
});

lanoelApp.controller('CreateAccountController', function($scope, $http, $routeParams, $location) {
	$scope.user = null;


	

	$scope.onLogin = function()
	{
		console.log("username: " + $scope.user.username + " password: " + $scope.user.password);
		$http({
			method: 'POST',
			url: 'http://users.omegasixcloud.net/accounts/login',
			headers : {
				'username' : $scope.user.username,
				'password' : $scope.user.password
			}
		}).success(function (data, status, headers, config) {
			console.log("sessionid: " + headers);
		})
		.error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
			console.log("login status: " + status);
		 });
	}

	$scope.onAccountCreation = function()
	{
		console.log("create Account clicked!");
		$location.path('/createAccount');
	}

});

lanoelApp.controller('UpdateScoresController', function($scope, $http, $routeParams, $location, $timeout) {
	$scope.tournament = null;
	$scope.scores = [];
	$scope.rounds = [];

	$scope.selectedRound = null;

	$http({
			method: 'GET',
			url: 'http://lanoel.elasticbeanstalk.com/tournament/1',
		}).success(function (result) {
			$scope.tournament = result;
			for(var i = 0; i < $scope.tournament.rounds.length; i++)
			{
				$scope.tournament.rounds[i].places = $scope.tournament.rounds[i].places.sort(comparePlaces);
			}
			$scope.scores = $scope.tournament.scores;
			$scope.rounds = $scope.tournament.rounds;
			$scope.selectedRound = $scope.rounds[0];
	});

    $scope.onTabClick = function(round)
	{
		$scope.selectedRound = round;
		console.log("On click, current round: " + $scope.selectedRound.game.gameName);
	}

	$scope.onSubmit = function()
	{
		$scope.updateScoreValues();
		console.log("selected round places: " + $scope.selectedRound.places);
		$scope.postUpdateScore();		
	}

	$scope.postUpdateScore = function()
	{
		$http({
				method: 'POST',
				url: 'http://lanoel.elasticbeanstalk.com/tournament/1/' + $scope.selectedRound.roundNumber + '/updateScores',
				headers: {"sessionid" : sessionStorage.sessionid},
				data: $scope.selectedRound.places
			}).success(function (data, status, headers, config) {
				setSession(headers('sessionid'), $location);
				console.log("session id from storage: " + sessionStorage.sessionid);
				document.getElementById("successUpdateMessage").hidden = false;
				$timeout(function(){document.getElementById("successUpdateMessage").hidden = true}, 3000);  
			}).error(function (data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
				console.log("update scores status: " + status);
				setSession(headers('sessionid'), $location);
				console.log("session id from storage: " + sessionStorage.sessionid);
				clearSession();
				$scope.$emit('Logout', $scope.user);
				$location.path('/login');
		});
	}

	$scope.updateScoreValues = function()
	{
		for(var i = 0; i < $scope.selectedRound.places.length; i++)
		{
			$scope.selectedRound.places[i].place = i + 1;
		}
	}

	//$scope.dataDropped = function(event, ui)
	//{
	//	updatePlacesInScoring($scope);
	//}

	//$scope.deactivate = function(event, ui)
	//{
	//	updatePlacesInScoring($scope);
	//}
});

function updatePlacesInScoring($scope)
{
	
}

function setSession(sessionid, $location)
{
	sessionStorage.sessionid = sessionid;
	console.log("Session set successful!!");
}

function clearSession()
{
	sessionStorage.clear();
}

function isUserLoggedIn($scope, $http)
{
	console.log("checking sessionid: " + sessionStorage.sessionid);
		$http({
			method: 'GET',
			url: 'http://users.omegasixcloud.net/accounts/user',
			headers : {
				'sessionid' : sessionStorage.sessionid
			}
		}).success(function (data, status, headers, config) {
			console.log("get user successful");
			sessionStorage.sessionid = headers("sessionid");
		})
		.error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
			console.log("user not logged in!");
			clearSession();
			$scope.$emit('Logout', $scope.user);
		 });
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
			$scope.$emit('UpdateGames', $scope.games);
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
