lanoelApp.controller('GameController', ['$scope','$routeParams','$sce','$filter','lanoelService', function($scope, $routeParams, $sce, $filter,lanoelService) {
	$scope.selectedGame = null;
	$scope.renderHtml = function(html_code)
	{
	    return $sce.trustAsHtml(html_code);
	};

	

	$scope.updateGame = function()
	{
		var tempGame = $scope.selectedGame;
		tempGame.steamInfo = null;
		lanoelService.addGame(tempGame).then(function(result){
			var game = $filter('filter')(result, {gameKey : tempGame.gameKey}, true)[0];
			console.log("selectedGame: " + $scope.selectedGame);
		});
	};

	function init() {

		lanoelService.getGameOwnership($routeParams.gameKey).then(function(result){
			$scope.owners = result.owners;
			$scope.nonowners = result.nonOwners;
			$scope.games = result.games;
			$scope.topFiveGames = result.topFiveGames;
			$scope.people = result.people;
			sessionStorage.personCache = JSON.stringify(people);
		});
	}

	init();
}]);
