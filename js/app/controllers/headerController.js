lanoelApp.controller('HeaderController', function($scope, $http, $route, $routeParams, $location, $filter) {
	$scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;

	$scope.games = [];
	$scope.topFiveGames = [];
	$scope.people =[];
	$scope.selectedPerson = null;

	updateGames($scope, $http);

	updatePeople($scope, $http);

	isSessionValid($scope, $http);

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
		logoutHandler();
		$location.path('/');
	});

	$scope.tableNavigateToPerson = function(person)
	{
		$location.path('/person/' + person.personKey);
	};

	$scope.loginClick = function()
	{
		console.log("sessionstorage sessionid: " + sessionStorage.sessionid);
		$location.path('/login');
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

	$scope.getMyAccount = function()
	{
		if(!isSessionValid($scope, $http))
		{
			$scope.$emit('Logout', $scope.user);
		}
		$location.path('person/' + $filter('filter')(JSON.parse(sessionStorage.personCache), {userName : sessionStorage.userName}, true)[0].personKey);
	}

	$scope.checkUserLogin = function()
	{
		if(sessionStorage.sessionid == '' || sessionStorage.sessionid == null)
		{
			return false;
		}
		return true;
	}
});

function isSessionValid($scope, $http)
{
	console.log("checking sessionid: " + sessionStorage.sessionid);
		$http({
			method: 'GET',
			url: 'https://accounts.omegasixcloud.net/accounts/user',
			headers : {
				'sessionid' : sessionStorage.sessionid
			}
		}).success(function (data, status, headers, config) {
			console.log("get user successful");
			sessionStorage.sessionid = headers("sessionid");
			return true;
		})
		.error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
			console.log("user not logged in!");
			if(sessionStorage.sessionId != null)
			{
				clearSession();
				$scope.$emit('Logout', $scope.user);
			}

			return false;
		 });
};

function clearSession()
{
	sessionStorage.clear();
};

function logoutHandler()
{
	console.log("entering logout event handler");
  document.getElementById("updateScoresLink").hidden = true;
  document.getElementById("logoutLink").hidden = true;
  document.getElementById("loginLink").hidden = false;
}
