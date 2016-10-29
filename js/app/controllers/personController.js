lanoelApp.controller('PersonController', function($scope, $http, $routeParams, $filter, $timeout) {
	$scope.selectedPerson = $filter('filter')(JSON.parse(sessionStorage.personCache), {userName : sessionStorage.userName}, true)[0];
	$scope.games = [];
	$scope.topFiveGames = [];

	refreshData($scope, $http);
	$scope.showVoteSuccessMessage = true;

	$scope.gameVote1Success = false;
	$scope.gameVote2Success = false;
	$scope.gameVote3Success = false;

	$scope.gameVote1Error = false;
	$scope.gameVote2Error = false;
	$scope.gameVote3Error = false;

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

	$scope.goVote = function(gameKey, voteNumber)
	{
		var myVote = {"gameKey":gameKey, "voteNumber":voteNumber}
		vote($http, $scope.selectedPerson.personKey, myVote, $scope);
		refreshData($scope, $http);
	};

	$scope.$on('Refresh', function(event, value){
		$scope.selectedPerson = $filter('filter')(JSON.parse(sessionStorage.personCache), {userName : sessionStorage.userName}, true)[0];
		$scope.setVoteFields();
	});

	$scope.$on('UpdateVote', function(event, value){
		
		var successBgColor = {}
		if(value == 3)
		{
			$scope.gameVote1Success = true;
			$scope.vote1Background = $scope.successBgColor;
		}
		if(value == 2)
		{
			$scope.gameVote2Success = true;
			$scope.vote2Background = $scope.successBgColor;
		}
		if(value == 1)
		{
			$scope.gameVote3Success = true;
			$scope.vote3Background = $scope.successBgColor;
		}
		$timeout(function(){
			$scope.gameVote1Success = false;
			$scope.gameVote2Success = false;
			$scope.gameVote3Success = false;
			$scope.vote1Background = $scope.defaultBgColor;
			$scope.vote2Background = $scope.defaultBgColor;
			$scope.vote3Background = $scope.defaultBgColor;
		}, 1000);
		refreshData($scope, $http);
	});


	$scope.onGameVote1Change = function()
	{
		var gameselectionObj1 = $filter('filter')($scope.games, {gameKey : $scope.gameVote1selection}, true)[0];
		if(!validGameSelection(gameselectionObj1))
		{
			$scope.vote1Background = $scope.errorBgColor;
			$scope.gameVote1Error = true;
			$timeout(function(){
				$scope.vote1Background = $scope.defaultBgColor;
				$scope.gameVote1Error = false;
				$scope.setVoteFields();
			}, 1000);
			return;
		}
		
		$scope.gameVote1selection = {gameKey : gameselectionObj1.gameKey, gameName : gameselectionObj1.gameName};
		$scope.selectedPerson.gameVote3 = gameselectionObj1.gameName;
		$scope.goVote($scope.gameVote1selection.gameKey, 3);
	}

	$scope.onGameVote2Change = function()
	{
		var gameselectionObj2 = $filter('filter')($scope.games, {gameKey : $scope.gameVote2selection}, true)[0];
		if(!validGameSelection(gameselectionObj2))
		{
			$scope.gameVote2Error = true;
			$scope.vote2Background = $scope.errorBgColor;
			$timeout(function(){
				$scope.vote2Background = $scope.defaultBgColor;
				$scope.gameVote2Error = false;
				$scope.setVoteFields();
			}, 1000);
			return;
		}

		$scope.gameVote2selection = {gameKey : gameselectionObj2.gameKey, gameName : gameselectionObj2.gameName};
		$scope.selectedPerson.gameVote2 = gameselectionObj2.gameName;
		$scope.goVote($scope.gameVote2selection.gameKey, 2);
	}

	$scope.onGameVote3Change = function()
	{
		var gameselectionObj3 = $filter('filter')($scope.games, {gameKey : $scope.gameVote3selection}, true)[0];
		if(!validGameSelection(gameselectionObj3))
		{
			$scope.gameVote3Error = true;
			$scope.vote3Background = $scope.errorBgColor;
			$timeout(function(){
				$scope.vote3Background = $scope.defaultBgColor;
				$scope.gameVote3Error = false;
				$scope.setVoteFields();
			}, 1000);
			return;
		}
		
		$scope.gameVote3selection = {gameKey : gameselectionObj3.gameKey, gameName : gameselectionObj3.gameName};
		$scope.selectedPerson.gameVote1 = gameselectionObj3.gameName;
		$scope.goVote($scope.gameVote3selection.gameKey, 1);
	}

	$http({
			method: 'GET',
			url: 'http://lanoel.elasticbeanstalk.com/lanoel/steamgames',
			data: { }
		}).success(function (result) {
		$scope.fullSteamGameList = result;
	});

	$scope.addNewGame = function(name)
	{
		addGame($scope, $http, name, $routeParams.personKey);
		$scope.newGameName = null;
	};
});

function validGameSelection(selectedGame)
{
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

	return (hasSinglePlayer && !hasMultiPlayer) ? false : true;
}

function vote($http, personKey, myVote, $scope)
{
	$http({
			method: 'POST',
			url: 'http://lanoel.elasticbeanstalk.com/lanoel/person/' + personKey + '/vote',
			data: myVote,
			headers : {
				'sessionid' : sessionStorage.sessionid
			}
		}).then(function (result) {
			sessionStorage.sessionid = result.headers("sessionid");
			$scope.$emit('UpdateVote', myVote.voteNumber);
		});
}

function addGame($scope, $http, gameName, personKey)
{
	$http({
			method: 'POST',
			url: 'http://lanoel.elasticbeanstalk.com/lanoel/game',
			data: {"gameName" : gameName}
		}).then(function (result) {
			refreshData($scope, $http);
	});
}
