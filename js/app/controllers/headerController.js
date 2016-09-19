lanoelApp.controller('HeaderController', function($scope, $http, $route, $routeParams, $location, $filter, $sce) {
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

	$scope.logoutClick = function()
	{
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
		if(sessionStorage.personCache === undefined)
		{
			updatePeople($scope, $http);
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

	$scope.gameImageForTable = function(inputGame)
	{
		if(inputGame == null)
		{
			return "http://dummyimage.com/150x50/000/fff&text=Circle%20Jerk";
		}
		var game = $filter('filter')($scope.games, {gameName : inputGame}, true)[0];
		if(game == undefined) return;
		return game.steamInfo.header_image;
	};

	$scope.onLogin = function()
	{
		$http({
			method: 'POST',
			url: 'https://accounts.omegasixcloud.net/accounts/login',
			headers : {
				'username' : $scope.user.username,
				'password' : $scope.user.password
			}
		}).success(function (data, status, headers, config) {
			$scope.user.username = null;
			$scope.user.password = null;
			setSession(headers("sessionid"), $scope.user.username);
			$scope.$emit('Login', $scope.user);
			$location.path('/');
		})
		.error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
			$scope.user.username = null;
			$scope.user.password = null;
			clearSession();
			document.getElementById("loginErrorAlert").hidden = false;
		 });
	}

	$scope.onPasswordReset = function()
	{
		$http({
			method: 'POST',
			url: 'https://accounts.omegasixcloud.net/accounts/resetpassword',
			headers : {
				'email' : $scope.user.email
			}
		}).success(function (data, status, headers, config) {
			$location.path('/');
		})
		.error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
			clearSession();
			$location.path('/');
		 });
	}
});

function isSessionValid($scope, $http)
{
		$http({
			method: 'GET',
			url: 'https://accounts.omegasixcloud.net/accounts/user',
			headers : {
				'sessionid' : sessionStorage.sessionid
			}
		}).success(function (data, status, headers, config) {
			sessionStorage.sessionid = headers("sessionid");
			return true;
		})
		.error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
			clearSession();
			$scope.$emit('Logout', $scope.user);
			return false;
		 });
};

function clearSession()
{
	var tempCache = sessionStorage.personCache;
	sessionStorage.clear();
	sessionStorage.personCache = tempCache;
};

function logoutHandler()
{
  document.getElementById("updateScoresLink").hidden = true;
  document.getElementById("logoutLink").hidden = true;
  document.getElementById("loginLink").hidden = false;
}
