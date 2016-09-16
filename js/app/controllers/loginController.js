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
		$http({
			method: 'POST',
			url: 'https://accounts.omegasixcloud.net/accounts/login',
			headers : {
				'username' : $scope.user.username,
				'password' : $scope.user.password
			}
		}).success(function (data, status, headers, config) {
			setSession(headers("sessionid"), $scope.user.username);
			$scope.$emit('Login', $scope.user);
			$location.path('/');
		})
		.error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
			clearSession();
			document.getElementById("loginErrorAlert").hidden = false;
		 });
	}

	$scope.onAccountCreation = function()
	{
		$location.path('/createAccount');
	}
});

function setSession(sessionid, user)
{
	sessionStorage.sessionid = sessionid;
	sessionStorage.userName = user;
}
