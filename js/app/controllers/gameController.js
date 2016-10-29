lanoelApp.controller('GameController', ['$scope','$http','$routeParams','$sce','$filter', function($scope, $http, $routeParams, $sce, $filter) {
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

	$scope.setGameInfo = function(game)
	{
		$scope.selectedGame = game;
		checkSteamImage($scope.selectedGame);
		if($scope.selectedGame.steamInfo.about_the_game == null)
		{
			$scope.selectedGame.steamInfo.about_the_game = $sce.trustAsHtml("<h2>I am only your memory.  I can give you no new information.</h2><br/><h3>This game is not on steam, or you typed the name wrong...</h3>");
		}
		else
		{
			$scope.selectedGame.steamInfo.about_the_game = $sce.trustAsHtml($scope.selectedGame.steamInfo.about_the_game);
		}
		$scope.selectedGame.steamInfo.price_overview.final = $scope.selectedGame.steamInfo.price_overview.final / 100; 
	};

	$http({
			method: 'GET',
			url: 'http://lanoel.elasticbeanstalk.com/lanoel/game/' + $routeParams.gameKey + '/ownership',
			data: { }
		}).success(function (result) {
			$scope.owners = result.owners;
			$scope.nonowners = result.nonOwners;
			$scope.setGameInfo(result.game);
	});

	$scope.updateGame = function()
	{
		var tempGame = $scope.selectedGame;
		tempGame.steamInfo = null;
		$http({
				method: 'POST',
				url: 'http://lanoel.elasticbeanstalk.com/lanoel/game/',
				data: tempGame
			}).success(function (result) {
			var game = $filter('filter')(result, {gameKey : tempGame.gameKey}, true)[0];
			console.log("selectedGame: " + $scope.selectedGame);
			$scope.setGameInfo(game);
		});
	};
}]);
