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
