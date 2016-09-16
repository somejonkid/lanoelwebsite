lanoelApp.controller('GameController', ['$scope','$http','$routeParams','$sce', function($scope, $http, $routeParams, $sce) {
	$scope.selectedGame = null;

	$scope.$on('UpdateGames', function(event, value){
		$scope.games = value;
	});

	$scope.$on('UpdateTopFiveGames', function(event, value){
		$scope.topFiveGames = value;
	});

	$scope.renderHtml = function(html_code)
	{
	    return $sce.trustAsHtml(html_code);
	};

	$http({
			method: 'GET',
			url: 'http://lanoel.elasticbeanstalk.com/lanoel/game/' + $routeParams.gameKey + '/ownership',
			data: { }
		}).success(function (result) {

			$scope.selectedGame = result.game;
			checkSteamImage($scope.selectedGame);
			if($scope.selectedGame.steamInfo.about_the_game == null)
			{
				$scope.selectedGame.steamInfo.about_the_game = $sce.trustAsHtml("<h2>I am only your memory.  I can give you no new information.</h2><br/><h3>This game is not on steam, or you typed the name wrong...</h3>");
			}
			else
			{
				$scope.selectedGame.steamInfo.about_the_game = $sce.trustAsHtml($scope.selectedGame.steamInfo.about_the_game);
			}

			$scope.owners = result.owners;
			$scope.nonowners = result.nonOwners;
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
	};
}]);
