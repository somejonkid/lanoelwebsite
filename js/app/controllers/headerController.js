lanoelApp.controller('HeaderController', function($scope, $http, $route, $routeParams, $location, $filter, $sce, $interval, $timeout) {
	$scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;

	$scope.games = [];
	$scope.topFiveGames = [];
	$scope.people =[];
	$scope.selectedPerson = null;

	refreshData($scope, $http);
	isSessionValid($scope, $http);

	$scope.voteEnding = {
		days : 0,
		hours : 0,
		minutes : 0,
		seconds : 0
	};

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

	$scope.$on('Login', function(event, value){
		document.getElementById("updateScoresLink").hidden = false;
		document.getElementById("logoutLink").hidden = false;
		$scope.selectedPerson = $filter('filter')(JSON.parse(sessionStorage.personCache), {userName : sessionStorage.userName}, true)[0];
	});

	$scope.$on('Logout', function(event, value){
		logoutHandler();
		$location.path('/');
	});

	$scope.tableNavigateToPerson = function(person)
	{
		$location.path('/person/' + person.personKey);
	};

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
		if(!isSessionValid($scope, $http))
		{
			$scope.$emit('Logout', $scope.user);
		}
		if(sessionStorage.personCache === undefined)
		{
			refreshData($scope, $http);
		}
		$location.path('person/' + $filter('filter')(JSON.parse(sessionStorage.personCache), {userName : sessionStorage.userName}, true)[0].personKey);
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
			return "http://dummyimage.com/150x50/000/fff&text=Circle%20Jerk";
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
			return "Probably a lot...";
		}

		var game = $filter('filter')($scope.games, {gameName : inputGame}, true)[0];
		if(game == undefined) return "Cannot find game!";
		if(game.steamGame == undefined || game.steamGame == null) return "Nobody knows!"
		var playtime = $filter('filter')(person.steamInfo.steamGameList, {appid : game.steamGame.appid}, true)[0];
		if(playtime == undefined) return text + "0 minutes!";

		var time = playtime.playtime_forever;

		return time < 60 ? text + time + " minutes" : text + Math.round(time / 60) + " hours";
	}

	$scope.onLogin = function()
	{
		$http({
			method: 'POST',
			url: 'https://accounts.omegasixcloud.net/accounts/login',
			headers : {
				'username' : $scope.user.username,
				'password' : $scope.user.password
			}
		}).success(function (data, status, headers, config) {
			setSession(headers("sessionid"), $scope.user.username);
			$scope.user.username = null;
			$scope.user.password = null;
			$scope.$emit('Login', $scope.user);
			$location.path('/');
		})
		.error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
			$scope.user.username = null;
			$scope.user.password = null;
			clearSession();
			document.getElementById("loginErrorAlert").hidden = false;
		 });
	}

	$scope.onPasswordReset = function()
	{
		$http({
			method: 'POST',
			url: 'https://accounts.omegasixcloud.net/accounts/resetpassword',
			headers : {
				'email' : $scope.user.email
			}
		}).success(function (data, status, headers, config) {
			$location.path('/');
		})
		.error(function(data, status, headers, config) {
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

	/*var stopRefresh = $interval(function()
	{
		refreshData($scope, $http);
	},15000);
	*/

	var stopTimer = $interval(function()
	{
		var voteEnd = new Date(2016,10,19,00,00,00);
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
});

function isSessionValid($scope, $http)
{
		$http({
			method: 'GET',
			url: 'https://accounts.omegasixcloud.net/accounts/user',
			headers : {
				'sessionid' : sessionStorage.sessionid
			}
		}).success(function (data, status, headers, config) {
			sessionStorage.sessionid = headers("sessionid");
			return true;
		})
		.error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
			clearSession();
			$scope.$emit('Logout', $scope.user);
			return false;
		 });
};

function clearSession()
{
	var tempCache = sessionStorage.personCache;
	sessionStorage.clear();
	sessionStorage.personCache = tempCache;
};

function logoutHandler()
{
  document.getElementById("updateScoresLink").hidden = true;
  document.getElementById("logoutLink").hidden = true;
  document.getElementById("loginLink").hidden = false;
}
