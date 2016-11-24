lanoelApp.controller('UpdateScoresController', function($scope, $http, $routeParams, $location, $timeout, $animate) {
	$scope.tournament = null;
	$scope.scores = [];
	$scope.rounds = [];
	$scope.selected = null;

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
	}

	$scope.onSubmit = function()
	{
		$scope.updateScoreValues();
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
				document.getElementById("scorePanel").className = "panel panel-success lanoeltransition";
				$timeout(function(){
					document.getElementById("scorePanel").className = "panel panel-info lanoeltransition";
				}, 1000);
			}).error(function (data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
				document.getElementById("scorePanel").className = "panel panel-error lanoeltransition";
				$timeout(function(){
					document.getElementById("scorePanel").className = "panel panel-info lanoeltransition";
				}, 1000);
				setSession(headers('sessionid'), $location);
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
