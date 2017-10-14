lanoelApp.controller('GameController', ['$scope','$location','$sce','$filter','lanoelService', function($scope, $location, $sce, $filter,lanoelService) {
	var searchParams = $location.search();
	$scope.selectedGameKey = searchParams.game;
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
			$scope.selectedGame = $filter('filter')(result, {gameKey : $scope.selectedGame.gameKey}, true)[0];
		});
	};

	function refreshGameOwnership() {
		lanoelService.getGameList().then(function(result){
			$scope.games = result;
			$scope.selectedGame = $filter('filter')($scope.games, {gameKey : $scope.selectedGameKey}, true)[0];
			lanoelService.getGameOwnership($scope.selectedGame.gameKey).then(function(result){
				$scope.owners = result.owners;
				$scope.nonowners = result.nonOwners;
			});
		});
	}

	function init() {

		refreshGameOwnership();
	}

	init();
}]);
