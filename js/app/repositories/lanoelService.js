(function () {
    'use strict';
 
     angular
         .module('lanoel')
         .factory('lanoelService', lanoelService);
 
         lanoelService.$inject = ['$http', '$q', '$window'];


    function lanoelService($http, $q, $window) {
        
        var lanoelServiceUrl = "http://lanoel.elasticbeanstalk.com";
        var loginService = "https://test.accounts.omegasixcloud.net";

        var username;
        var password;
        var service = {
            login: login,
            resetPassword: resetPassword,
            getGameOwnership: getGameOwnership,
            addGame: addGame,
            vote: vote,
            getSteamGames: getSteamGames,
            getLanoelTournament: getLanoelTournament,
            updateLanoelScore: updateLanoelScore
        };

        return service;

        function login(username, password) {
            var defer = $q.defer();
            
            $http({
                method: 'POST',
                url: loginService + '/accounts/login',
                headers : {
                    'username' : username,
                    'password' : password
                }
            }).then(function (data, status, headers, config) {
                sessionStorage.setItem('sessionid', headers("sessionid"));
                defer.resolve(true);
            }, function(data, status, headers, config) {
                defer.reject("coult not log in");
            });

             return defer.promise;
        }

        function resetPassword(email) {

            var defer = $q.defer();
            $http({
                method: 'POST',
                url: loginService + '/accounts/resetpassword',
                headers : {
                    'email' : email
                }
            }).then(function(response) {
                defer.resolve(true);
            }, function() {
                defer.reject("password reset failed");
            });
            return defer.promise;
        }

        function getGameOwnership(gameKey) {
            
            var defer = $q.defer();

            $http({
                method: 'GET',
                url: lanoelServiceUrl + '/lanoel/game/' + gameKey + '/ownership',
                data: { }
            }).then(function(res){
                defer.resolve(res.data);
            }, function(){
                defer.reject("get game ownership failed");
            });
            return defer.promise;
        }

        function addGame(gameData) {
            var defer = $q.defer();
            $http({
				method: 'POST',
				url: 'http://lanoel.elasticbeanstalk.com/lanoel/game/',
				data: gameData
			}).then(function(res){
                defer.resolve(res.data);
            }, function(){
                defer.reject("could not add new game");
            });
            return defer.promise;
        }

        function vote(personKey, myVote) {
            var defer = $q.defer();
            $http({
                method: 'POST',
                url: 'http://lanoel.elasticbeanstalk.com/lanoel/person/' + personKey + '/vote',
                data: myVote,
                headers : {
                    'sessionid' : sessionStorage.getItem('sessionid')
                }
            }).then(function (result) {
                sessionStorage.setItem('sessionid', headers("sessionid"));
                defer.resolve(myVote);
            }, function(result){
                defer.reject("could not vote:" + JSON.stringify(result));
            });
            return defer.promise;
        }

        function getSteamGames() {
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: 'http://lanoel.elasticbeanstalk.com/lanoel/steamgames',
                data: { }
            }).then(function (result) {
                defer.resolve(result.data);
            }, function(result){
                defer.reject("could not get steam data: " + JSON.stringify(result.data));
            });
            return defer.promise;
        }

        function getLanoelTournament() {
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: 'http://lanoel.elasticbeanstalk.com/tournament/1',
            }).success(function (result) {
                defer.resolve(result.data);
            }, function(result){
                defer.reject("could not get tournament " + JSON.stringify(result));
            });
            return defer.promise;
        }

        function updateLanoelScore(selectedRound){
            var defer = $q.defer();
            $http({
				method: 'POST',
				url: 'http://lanoel.elasticbeanstalk.com/tournament/1/' + selectedRound.roundNumber + '/updateScores',
				headers : {
                    'sessionid' : sessionStorage.getItem('sessionid')
                },
				data: selectedRound.places
            }).then(function(result){
                defer.resolve(result.data);
            }, function(result){
                defer.reject("failed to update round: " + JSON.stringify(result.data));
            });
            return defer.promise;
            
            
            success(function (data, status, headers, config) {
				setSession(headers('sessionid'), $location);
				document.getElementById("scorePanel").className = "panel panel-success lanoeltransition";
				$timeout(function(){
					document.getElementById("scorePanel").className = "panel panel-info lanoeltransition";
				}, 1000);
			}).error(function (data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
				document.getElementById("scorePanel").className = "panel panel-error lanoeltransition";
				$timeout(function(){
					document.getElementById("scorePanel").className = "panel panel-info lanoeltransition";
				}, 1000);
				setSession(headers('sessionid'), $location);
				clearSession();
				$scope.$emit('Logout', $scope.user);
				$location.path('/login');
		});
        }

        /*************private functions***********************/

        function setPrices(lanoelObj)
        {
            if(lanoelObj.topFiveGames.length == 0)
            {
                $timeout(function()
                {
                    console.log("waiting for top five games to be populated");
                }, 1000);
            }
    
            for(var i = 0; i < lanoelObj.people.length; i++)
            {
                lanoelObj.people[i].priceToBuyTopFive = 0;
            }
    
            for(var i = 0; i < lanoelObj.topFiveGames.length; i++)
            {
                var curgame = lanoelObj.topFiveGames[i];
                var curOwnership = $filter('filter')(gameOwnership, {game : {gameKey : curgame.gameKey}}, true)[0];
                
                for(var j = 0; j < curOwnership.nonOwners.length; j++)
                {
                    var nonOwner = curOwnership.nonOwners[j];
                    var person = $filter('filter')(lanoelObj.people, {personKey : nonOwner.personKey}, true)[0];
                    if(!curgame.free)
                    {
                        if(curgame.steamInfo != null)
                        {
                            person.priceToBuyTopFive += curgame.steamInfo.price_overview == null ? 0 : curgame.steamInfo.price_overview.final / 100;
                        }	
                    }
                }
            }
    
            for(var i = 0; i < lanoelObj.people.length; i++)
            {
                lanoelObj.people[i].priceToBuyTopFive = lanoelObj.people[i].priceToBuyTopFive.toFixed(2);
            }

            return lanoelObj;
        }

        function processOwnershipResult(lanoelObj)
        {
            var games = [];
			for(var i = 0; i < result.length; i++)
			{
				games.push(result[i].game);
			}

			var people = [];
			for(var i = 0; i < result[0].owners.length; i++)
			{
				people.push(result[0].owners[i]);
			}

			for(var i = 0; i < result[0].nonOwners.length; i++)
			{
				people.push(result[0].nonOwners[i]);
			}

			lanoelObj.games = games.sort(compareGames);
            lanoelObj.games.forEach(checkSteamImage);
            lanoelObj.games.forEach(setGameInfo);

			lanoelObj.topFiveGames = [];

			for(var i = 0; i < 5; i++)
			{
				lanoelObj.topFiveGames.push(lanoelObj.games[i]);
			}

			for(var i = 0; i < lanoelObj.topFiveGames.length; i++)
			{
				var game = lanoelObj.topFiveGames[i]; 
				lanoelObj.topFiveGames[i].currentPrice = (game.free || game.steamInfo == null || game.steamInfo.price_overview == null) ? "Free!!" : "$" + game.steamInfo.price_overview.final / 100;
			}

            lanoelObj.people = people.sort(comparePeople);
            return setPrices(lanoelObj);
        }

        function checkSteamImage(game)
        {
            if(game.steamInfo == null)
            {
                game.steamInfo = {};
                game.steamInfo.header_image = 'http://dummyimage.com/600x400/000/fff&text=' + game.gameName;
            }
        }

        function setGameInfo(game)
        {
            checkSteamImage(game);
            if(game.steamInfo.about_the_game == null)
            {
                game.steamInfo.about_the_game = $sce.trustAsHtml("<h2>I am only your memory.  I can give you no new information.</h2><br/><h3>This game is not on steam, or you typed the name wrong...</h3>");
            }
            else
            {
                game.steamInfo.about_the_game = $sce.trustAsHtml(game.steamInfo.about_the_game);
            }
            game.steamInfo.price_overview.final = game.steamInfo.price_overview.final / 100;
            return game;
        };

    }
})();