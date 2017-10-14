lanoelApp.controller('HeaderController', function($scope, $http, $route, $routeParams, $location, $filter, $sce, $interval, $timeout, lanoelService) {
	$scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;

	$scope.games = [];
	$scope.topFiveGames = [];
	$scope.people =[];
	$scope.selectedPerson = null;

	$scope.voteEnding = {
		days : 0,
		hours : 0,
		minutes : 0,
		seconds : 0
	};

	$scope.$on('RefreshGames', function(event, games){
		$scope.games = games;
	});

	$scope.$on('SetPrices', function(event, gameOwnership){
		
		if($scope.topFiveGames.length == 0)
		{
			$timeout(function()
			{
				console.log("waiting for top five games to be populated");
			}, 1000);
		}

		for(var i = 0; i < $scope.people.length; i++)
		{
			$scope.people[i].priceToBuyTopFive = 0;
		}

		for(var i = 0; i < $scope.topFiveGames.length; i++)
		{
			var curgame = $scope.topFiveGames[i];
			var curOwnership = $filter('filter')(gameOwnership, {game : {gameKey : curgame.gameKey}}, true)[0];
			
			for(var j = 0; j < curOwnership.nonOwners.length; j++)
			{
				var nonOwner = curOwnership.nonOwners[j];
				var person = $filter('filter')($scope.people, {personKey : nonOwner.personKey}, true)[0];
				if(!curgame.free)
				{
					if(curgame.steamInfo != null)
					{
						person.priceToBuyTopFive += curgame.steamInfo.price_overview == null ? 0 : curgame.steamInfo.price_overview.final / 100;
					}	
				}
			}
		}

		for(var i = 0; i < $scope.people.length; i++)
		{
			$scope.people[i].priceToBuyTopFive = $scope.people[i].priceToBuyTopFive.toFixed(2);
		}
	});

	$scope.$on('Logout', function(event, value){
		logoutHandler();
		$location.path('/');
	});

	$scope.logoutClick = function()
	{
		clearSession();
		$location.path('/');
	}

	$scope.updateScoresClick = function()
	{
		$location.path('/updatescores');
	}

	$scope.getMyAccount = function()
	{
		$location.path('/person');
	}

	$scope.goToGameDetails = function(gameKey) {
		$location.path('/game').search({game: gameKey});
	}

	$scope.checkUserLogin = function()
	{
		if(sessionStorage.sessionid == '' || sessionStorage.sessionid == null)
		{
			return false;
		}
		return true;
	}

	$scope.gameImageForTable = function(inputGame)
	{
		if(inputGame == null)
		{
			return "http://i.dailymail.co.uk/i/pix/2011/03/21/article-0-0B462D3300000578-837_468x286.jpg";
		}
		var game = $filter('filter')($scope.games, {gameName : inputGame}, true)[0];
		if(game == undefined) return;
		return game.steamInfo.header_image;
	};

	$scope.gameplayTime = function(person, inputGame)
	{
		var text = "Time Played: ";
		if(inputGame == null || person == null)
		{
			return "";
		}

		var game = $filter('filter')($scope.games, {gameName : inputGame}, true)[0];
		if(game == undefined) return "Cannot find game!";
		if(game.steamGame == undefined || game.steamGame == null || !person.steamInfo.steamGameList) return "Nobody knows!"
		var playtime = $filter('filter')(person.steamInfo.steamGameList, {appid : game.steamGame.appid}, true)[0];
		if(playtime == undefined) return text + "0 minutes!";

		var time = playtime.playtime_forever;

		return time < 60 ? text + time + " minutes" : text + Math.round(time / 60) + " hours";
	}

	$scope.onLogin = function()
	{
		lanoelService.login($scope.user.username, $scope.user.password).then(function(){
			sessionStorage.setItem('userName', $scope.user.username);
			document.getElementById("updateScoresLink").hidden = false;
			document.getElementById("logoutLink").hidden = false;
			$scope.selectedPerson = $filter('filter')($scope.people, {userName : $scope.user.username}, true)[0];
			sessionStorage.setItem('userName', $scope.selectedPerson.userName);
			$scope.user.username = null;
			$scope.user.password = null;
			$scope.$emit('Login', $scope.user);
			$location.path('/');
		}, function(){
			// called asynchronously if an error occurs
			// or server returns response with an error status.
			$scope.user.username = null;
			$scope.user.password = null;
			document.getElementById("updateScoresLink").hidden = true;
			document.getElementById("logoutLink").hidden = true;
			clearSession();
			document.getElementById("loginErrorAlert").hidden = false;
		});
	}

	$scope.onPasswordReset = function()
	{
		lanoelService.resetPassword($scope.user.email).then(function (data, status, headers, config) {
			$location.path('/');
		}, function() {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
			clearSession();
			$location.path('/');
		});
	}

	$scope.$on('$destroy', function()
	{
		//$interval.cancel(stopRefresh);
		$interval.cancel(stopTimer);
	});

	function getLanoelTournament() {
		lanoelService.getLanoelTournament().then(function(result){
			$scope.tournament = result;
			$scope.scores = $scope.tournament.scores;
			$scope.rounds = $scope.tournament.rounds;
		});
	}

	var stopTimer = $interval(function()
	{
		var voteEnd = new Date(2017,10,31,00,00,00);
		var diff = voteEnd.getTime() - Date.now();

		var seconds = Math.floor( (diff/1000) % 60 );
		var minutes = Math.floor( (diff/1000/60) % 60 );
		var hours = Math.floor( (diff/(1000*60*60)) % 24 ); 
		var days = Math.floor( diff/(1000*60*60*24) );

		$scope.voteEnding.seconds = Math.max(seconds, 0);
		$scope.voteEnding.minutes = Math.max(minutes, 0);
		$scope.voteEnding.hours = Math.max(hours, 0); 
		$scope.voteEnding.days = Math.max(days, 0);		
	},1000);

	function init() {
		
		lanoelService.getGameList().then(function(result){
			$scope.games = result;
		});

		lanoelService.getPersonlist().then(function(result){
			$scope.people = result;
		});

		lanoelService.getTopFiveGames().then(function(result){
			$scope.topFiveGames = result;
		});

	}

	init();
});

function clearSession()
{
	sessionStorage.clear();
};

function logoutHandler()
{
  document.getElementById("updateScoresLink").hidden = true;
  document.getElementById("logoutLink").hidden = true;
  document.getElementById("loginLink").hidden = false;
}
