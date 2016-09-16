lanoelApp.controller('PersonController', function($scope, $http, $routeParams, $filter, $timeout) {
	$scope.selectedPerson = $filter('filter')(JSON.parse(sessionStorage.personCache), {userName : sessionStorage.userName}, true)[0];
	$scope.games = [];
	$scope.topFiveGames = [];
	$scope.showVoteSuccessMessage = true;

	$scope.gameVote1Success = false;
	$scope.gameVote2Success = false;
	$scope.gameVote3Success = false;

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
		updateGames($scope, $http);
	};

	$scope.$on('UpdatePeople', function(event, value){
		$scope.selectedPerson = $filter('filter')(JSON.parse(sessionStorage.personCache), {userName : sessionStorage.userName}, true)[0];
		$scope.setVoteFields();
	});

	$scope.$on('UpdateGames', function(event, value){
		$scope.games = value;
	});

	$scope.$on('UpdateTopFiveGames', function(event, value){
		$scope.topFiveGames = value;
	});

	$scope.$on('UpdateVote', function(event, value){
		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		$scope.gameVote1Success = true;
		$timeout(function(){
			$scope.gameVote1Success = false;
		}, 2000);
		updateGames($scope, $http);
	});


	$scope.onGameVote1Change = function()
	{
		var gameselectionObj1 = $filter('filter')($scope.games, {gameKey : $scope.gameVote1selection}, true)[0];
		$scope.gameVote1selection = {gameKey : gameselectionObj1.gameKey, gameName : gameselectionObj1.gameName};
		$scope.goVote($scope.gameVote1selection.gameKey, 3);
	}

	$scope.onGameVote2Change = function()
	{
		var gameselectionObj2 = $filter('filter')($scope.games, {gameKey : $scope.gameVote2selection}, true)[0];
		$scope.gameVote2selection = {gameKey : gameselectionObj2.gameKey, gameName : gameselectionObj2.gameName};
		$scope.goVote($scope.gameVote2selection.gameKey, 2);
	}

	$scope.onGameVote3Change = function()
	{
		var gameselectionObj3 = $filter('filter')($scope.games, {gameKey : $scope.gameVote3selection}, true)[0];
		$scope.gameVote3selection = {gameKey : gameselectionObj3.gameKey, gameName : gameselectionObj3.gameName};
		$scope.goVote($scope.gameVote3selection.gameKey, 1);
	}

	updateGames($scope, $http);
	updatePeople($scope, $http);

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
			$scope.$emit('UpdateVote', $scope);
		});
}

function addGame($scope, $http, gameName, personKey)
{
	$http({
			method: 'POST',
			url: 'http://lanoel.elasticbeanstalk.com/lanoel/game',
			data: {"gameName" : gameName}
		}).then(function (result) {
			updateGames($scope, $http);
	});
}
