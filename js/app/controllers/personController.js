lanoelApp.controller('PersonController', function($scope, $http, $filter, $timeout, lanoelService, $q) {
	$scope.selectedPersonUserName = sessionStorage.getItem('userName');

	$scope.games = [];
	$scope.topFiveGames = [];
	var voteEnd = new Date(2017,10,05,00,00,00);
	$scope.votingDisabled = (voteEnd.getTime() - Date.now() < 0);

	$scope.showVoteSuccessMessage = true;

	$scope.gameVote1Success = false;
	$scope.gameVote2Success = false;
	$scope.gameVote3Success = false;

	$scope.gameVote1Error = false;
	$scope.gameVote2Error = false;
	$scope.gameVote3Error = false;
	$scope.newGameName = null;

	$scope.voteError = "";

	$scope.defaultBgColor = {"background-color" : "white", "transition": "background-color 500ms linear"};
	$scope.successBgColor = {"background-color" : "#9ACD32", "transition": "background-color 500ms linear"};
	$scope.errorBgColor = {"background-color" : "#CC0000", "transition": "background-color 500ms linear"};
	$scope.vote1Background = $scope.defaultBgColor;
	$scope.vote2Background = $scope.defaultBgColor;
	$scope.vote3Background = $scope.defaultBgColor;

	$scope.setVoteFields = function()
	{
		var gameselectionObj1 = $filter('filter')($scope.games, {gameName : $scope.selectedPerson.gameVote3}, true)[0];
		var gameselectionObj2 = $filter('filter')($scope.games, {gameName : $scope.selectedPerson.gameVote2}, true)[0];
		var gameselectionObj3 = $filter('filter')($scope.games, {gameName : $scope.selectedPerson.gameVote1}, true)[0];

		var gameselectionName1 = null;
		var gameselectionName2 = null;
		var gameselectionName3 = null;
		var gameselectionKey1 = null;
		var gameselectionKey2 = null;
		var gameselectionKey3 = null;

		if(gameselectionObj1 != null)
		{
			gameselectionName1 = gameselectionObj1.gameName;
			gameselectionKey1 = gameselectionObj1.gameKey;
		}
		if(gameselectionObj2 != null)
		{
			gameselectionName2 = gameselectionObj2.gameName;
			gameselectionKey2 = gameselectionObj2.gameKey;
		}
		if(gameselectionObj3 != null)
		{
			gameselectionName3 = gameselectionObj3.gameName;
			gameselectionKey3 = gameselectionObj3.gameKey;
		}

		$scope.gameVote1selection = {gameKey : gameselectionKey1, gameName : gameselectionName1};
		$scope.gameVote2selection = {gameKey : gameselectionKey2, gameName : gameselectionName2};
		$scope.gameVote3selection = {gameKey : gameselectionKey3, gameName : gameselectionName3};
	};

	$scope.goVote = function(gameKey, pointValue)
	{
		var myVote = {"gameKey":gameKey, "voteNumber":pointValue}
		return lanoelService.vote($scope.selectedPerson.personKey, myVote).then(function(result){
			var voteNumber = 3;
			if(pointValue === 2)
			{
				voteNumber = 2;
			}
			if(pointValue === 1)
			{
				voteNumber = 3;
			}
			$scope.setVoteColor(voteNumber, false);
		});
	};

	$scope.setVoteColor = function(voteNumber, error, errorText) {
		
		var bgColor = $scope.successBgColor;
		if(error)
		{
			bgColor = $scope.errorBgColor;
		}

		if(voteNumber == 1)
		{
			$scope.gameVote1Success = !error;
			$scope.vote1Background = bgColor;
			if(error)
			{
				$scope.gameVote1Error = true;
				$scope.voteError = errorText;
			}
		}
		if(voteNumber == 2)
		{
			$scope.gameVote2Success = !error;
			$scope.vote2Background = bgColor;
			if(error)
			{
				$scope.gameVote2Error = true;
				$scope.voteError = errorText;
			}
		}
		if(voteNumber == 3)
		{
			$scope.gameVote3Success = !error;
			$scope.vote3Background = bgColor;
			if(error)
			{
				$scope.gameVote3Error = true;
				$scope.voteError = errorText;
			}
		}
		$timeout(function(){
			$scope.gameVote1Success = false;
			$scope.gameVote2Success = false;
			$scope.gameVote3Success = false;
			$scope.gameVote1Error = false;
			$scope.gameVote2Error = false;
			$scope.gameVote3Error = false;
			$scope.vote1Background = $scope.defaultBgColor;
			$scope.vote2Background = $scope.defaultBgColor;
			$scope.vote3Background = $scope.defaultBgColor;
			$scope.voteError = "";
		}, 2000);
		refreshGameOwnership();
	}

	$scope.onGameVote1Change = function()
	{
		var gameselectionObj = $filter('filter')($scope.games, {gameKey : $scope.gameVote1selection}, true)[0];
		if(!$scope.validateGameSelection(gameselectionObj,1))
		{
			$scope.setVoteFields();
			return;
		}
		$scope.goVote(gameselectionObj.gameKey, 3).then(function(result){
			$scope.setVoteResults(result);
			$scope.setVoteFields();
		});
	}

	$scope.onGameVote2Change = function()
	{
		var gameselectionObj = $filter('filter')($scope.games, {gameKey : $scope.gameVote2selection}, true)[0];
		if(!$scope.validateGameSelection(gameselectionObj,2))
		{
			$scope.setVoteFields();
			return;
		}
		$scope.goVote(gameselectionObj.gameKey, 2).then(function(result){
			$scope.setVoteResults(result);
			$scope.setVoteFields();
		});
	}

	$scope.onGameVote3Change = function()
	{
		var gameselectionObj = $filter('filter')($scope.games, {gameKey : $scope.gameVote3selection}, true)[0];
		if(!$scope.validateGameSelection(gameselectionObj,3))
		{
			$scope.setVoteFields();
			return;
		}
		$scope.goVote(gameselectionObj.gameKey, 1).then(function(result){
			$scope.setVoteResults(result);
			$scope.setVoteFields();
		});
	}

	$scope.setVoteResults = function(result){
		for(var vote in result)
		{
			if(result[vote].voteNumber === 1)
			{
				$scope.gameVote1selection = $filter('filter')($scope.games, {gameKey : result[vote].gameKey}, true)[0];
				$scope.selectedPerson.gameVote1 = $scope.gameVote1selection;
			}
			if(result[vote].voteNumber === 2)
			{
				$scope.gameVote2selection = $filter('filter')($scope.games, {gameKey : result[vote].gameKey}, true)[0];
				$scope.selectedPerson.gameVote2 = $scope.gameVote2selection;
			}
			if(result[vote].voteNumber === 3)
			{
				$scope.gameVote3selection = $filter('filter')($scope.games, {gameKey : result[vote].gameKey}, true)[0];
				$scope.selectedPerson.gameVote3 = $scope.gameVote3selection;
			}
		}
	}

	$scope.addNewGame = function(name)
	{
		lanoelService.addGame({"gameName" : name}).then(function(){
			$scope.newGameName = null;
			refreshGameOwnership();
		});
	};

	function refreshSteamGameList() {
		lanoelService.getSteamGames().then(function(result){
			$scope.fullSteamGameList = result;
		})
	}

	function refreshGameOwnership() {
		var promises = [];
		promises.push(lanoelService.getGameList().then(function(result){
			$scope.games = result;
		}));

		promises.push(lanoelService.getPersonlist().then(function(result){
			$scope.people = result;
			$scope.selectedPerson = $filter('filter')($scope.people, {userName : $scope.selectedPersonUserName}, true)[0];
		}));

		promises.push(lanoelService.getTopFiveGames().then(function(result){
			$scope.topFiveGames = result;
		}));

		$q.all(promises).then(function(){
			$scope.setVoteFields();
			$scope.$emit('RefreshGames', $scope.games);
		});
	}

	$scope.validateGameSelection = function(selectedGame, voteNumber)
	{
		if(selectedGame.gameName === $scope.gameVote1selection.gameName ||
			selectedGame.gameName === $scope.gameVote2selection.gameName ||
			selectedGame.gameName === $scope.gameVote3selection.gameName) {
				$scope.setVoteColor(voteNumber, true, "Cannot vote for the same game more than once");
				return false;
		}
		if(selectedGame == null || selectedGame.steamInfo == null || selectedGame.steamInfo.categories == null)
		{
			return true;
		}
		var hasSinglePlayer = false;
		var hasMultiPlayer = false;
		for(var i = 0; i < selectedGame.steamInfo.categories.length; i++)
		{
			var desc = selectedGame.steamInfo.categories[i].description.toUpperCase();
			if(desc.includes("MULTI") && desc.includes("PLAYER"))
			{
				hasMultiPlayer = true;
			}
	
			if(desc.includes("SINGLE") && desc.includes("PLAYER"))
			{
				hasSinglePlayer = true;
			}
		}
	
		if(hasSinglePlayer && !hasMultiPlayer){
			$scope.setVoteColor(voteNumber, true, "Cannot vote for a single player game");
			return false;
		}
		return true;
	}

	function init() {
		lanoelService.getUserDetails().then(function(){
			refreshGameOwnership();
			refreshSteamGameList();
		});
	}

	init();
});
