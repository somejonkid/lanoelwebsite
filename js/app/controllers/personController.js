lanoelApp.controller('PersonController', function($scope, $http, $routeParams, $filter) {
	$scope.selectedPerson = $filter('filter')(JSON.parse(sessionStorage.personCache), {userName : sessionStorage.userName}, true)[0];
	$scope.games = [];
	$scope.topFiveGames = [];
	$scope.showVoteSuccessMessage = true;

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

	$scope.$on('UpdatePeople', function(event, value){
		$scope.selectedPerson = $filter('filter')(JSON.parse(sessionStorage.personCache), {userName : sessionStorage.userName}, true)[0];
		$scope.setVoteFields();
	});

	$scope.$on('UpdateGames', function(event, value){
		$scope.games = value;
		$scope.setVoteFields();
	});

	$scope.$on('UpdateTopFiveGames', function(event, value){
		$scope.topFiveGames = value;
	});

	$scope.onGameVote1Change = function()
	{
		console.log("on vote change gameVote1selection: " + JSON.stringify($scope.gameVote1selection));
		var gameselectionObj1 = $filter('filter')($scope.games, {gameKey : $scope.gameVote1selection}, true)[0];
		console.log("after filter: " + JSON.stringify(gameselectionObj1));
		$scope.gameVote1selection = {gameKey : gameselectionObj1.gameKey, gameName : gameselectionObj1.gameName};
	}

	$scope.onGameVote2Change = function()
	{
		console.log("on vote change gameVote2selection: " + JSON.stringify($scope.gameVote2selection));
		var gameselectionObj2 = $filter('filter')($scope.games, {gameKey : $scope.gameVote2selection}, true)[0];
		console.log("after filter: " + JSON.stringify(gameselectionObj2));
		$scope.gameVote2selection = {gameKey : gameselectionObj2.gameKey, gameName : gameselectionObj2.gameName};
	}

	$scope.onGameVote3Change = function()
	{
		console.log("on vote change gameVote3selection: " + JSON.stringify($scope.gameVote3selection));
		var gameselectionObj3 = $filter('filter')($scope.games, {gameKey : $scope.gameVote3selection}, true)[0];
		console.log("after filter: " + JSON.stringify(gameselectionObj3));
		$scope.gameVote3selection = {gameKey : gameselectionObj3.gameKey, gameName : gameselectionObj3.gameName};
	}

	updateGames($scope, $http, $scope.updateVotes);

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

	$scope.updateVotes = function(vote1, vote2, vote3)
	{
		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		console.log("vote1: " + vote1);
		console.log("vote2: " + vote2);
		console.log("vote3: " + vote3);

		console.log("games: " + $scope.games);

		var myVote1 = {"gameKey":vote1.gameKey, "voteNumber":3}
		var myVote2 = {"gameKey":vote2.gameKey, "voteNumber":2}
		var myVote3 = {"gameKey":vote3.gameKey, "voteNumber":1}

		console.log("myVote1: " + JSON.stringify(myVote1));
		console.log("myVote2: " + JSON.stringify(myVote2));
		console.log("myVote3: " + JSON.stringify(myVote3));

		if(myVote1.gameKey != null)
		{
			vote($http, $scope.selectedPerson.personKey, myVote1, $scope);
		}
		if(myVote2.gameKey != null)
		{
			vote($http, $scope.selectedPerson.personKey, myVote2, $scope);
		}
		if(myVote3.gameKey != null)
		{
			vote($http, $scope.selectedPerson.personKey, myVote3, $scope);
		}
		updatePeople($scope, $http);
		updateGames($scope, $http);
		alert("Place Holder!");
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
		}).success(function (result) {
			sessionStorage.sessionid = headers("sessionid");
			return true;
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
