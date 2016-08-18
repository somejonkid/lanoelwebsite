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
