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

	isUserLoggedIn($scope, $http);

	$scope.$on('UpdateGames', function(event, value){
		$scope.games = value;
	});

	$scope.$on('UpdateTopFiveGames', function(event, value){
		$scope.topFiveGames = value;
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
