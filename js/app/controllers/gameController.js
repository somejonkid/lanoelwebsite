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
