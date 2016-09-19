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
