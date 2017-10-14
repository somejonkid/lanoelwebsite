(function () {
    'use strict';
 
     angular
         .module('lanoel')
         .factory('lanoelService', lanoelService);
 
         lanoelService.$inject = ['$http', '$q','$sce','$location'];


    function lanoelService($http, $q, $sce, $location) {
        
        var lanoelServiceUrl = "http://lanoel.elasticbeanstalk.com";
        var loginService = "https://test.accounts.omegasixcloud.net";

        var username;
        var password;
        var service = {
            login: login,
            resetPassword: resetPassword,
            getUserDetails: getUserDetails,
            getPersonlist:getPersonlist,
            getGameOwnership: getGameOwnership,
            addGame: addGame,
            vote: vote,
            getSteamGames: getSteamGames,
            getLanoelTournament: getLanoelTournament,
            updateLanoelScore: updateLanoelScore,
            getTopFiveGames: getTopFiveGames,
            getGameList: getGameList
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
            }).then(function (response) {
                sessionStorage.setItem('sessionid', response.headers("sessionid"));
                defer.resolve(true);
            }, function(response) {
                defer.reject(logout());
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
                defer.reject(logout());
            });
            return defer.promise;
        }

        function getUserDetails() {
            
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: loginService + '/accounts/user',
                headers : {
                    'sessionid' : sessionStorage.getItem('sessionid')
                }
            }).then(function(response) {
                defer.resolve(true);
            }, function() {
                defer.reject(logout());
            });
            return defer.promise;
        }

        function getGameOwnership(gameKey) {
            
            var defer = $q.defer();

            var serviceUrl = lanoelServiceUrl + '/lanoel/ownership';

            if(gameKey){
                serviceUrl = lanoelServiceUrl + '/lanoel/game/' + gameKey + '/ownership';
            }

            $http({
                method: 'GET',
                url: serviceUrl,
                data: { }
            }).then(function(res){
                defer.resolve(res.data);
            }, function(){
                defer.reject(logout());
            });
            return defer.promise;
        }

        function getPersonlist() {
            
            var defer = $q.defer();

            var serviceUrl = lanoelServiceUrl + '/lanoel/personlist'
            $http({
                method: 'GET',
                url: serviceUrl,
                data: { }
            }).then(function(res){
                var personList = res.data;
                for(var person in personList)
                {
                    personList[person].priceToBuyTopFive = personList[person].priceToBuyTopFive / 100;
                }
                defer.resolve(getPeopleOrder(personList));
            }, function(){
                defer.reject(logout());
            });
            return defer.promise;
        }

        function addGame(gameData) {
            var defer = $q.defer();
            $http({
				method: 'POST',
				url: lanoelServiceUrl + '/lanoel/game/',
				data: gameData
			}).then(function(res){
                defer.resolve(processGamesResult(res.data));
            }, function(){
                defer.reject(logout());
            });
            return defer.promise;
        }

        function vote(personKey, myVote) {
            var defer = $q.defer();
            $http({
                method: 'POST',
                url: lanoelServiceUrl + '/lanoel/person/' + personKey + '/vote',
                data: myVote,
                headers : {
                    'sessionid' : sessionStorage.getItem('sessionid')
                }
            }).then(function (result) {
                sessionStorage.setItem('sessionid', result.headers("sessionid"));
                defer.resolve(result.data);
            }, function(result){
                defer.reject(logout());
            });
            return defer.promise;
        }

        function getSteamGames() {
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: lanoelServiceUrl + '/lanoel/steamgames',
                data: { }
            }).then(function (result) {
                defer.resolve(result.data);
            }, function(result){
                defer.reject(logout());
            });
            return defer.promise;
        }

        function getLanoelTournament() {
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: lanoelServiceUrl + '/tournament/1',
            }).success(function (result) {
                defer.resolve(result.data);
            }, function(result){
                defer.reject(logout());
            });
            return defer.promise;
        }

        function updateLanoelScore(selectedRound){
            var defer = $q.defer();
            $http({
				method: 'POST',
				url: lanoelServiceUrl + '/tournament/1/' + selectedRound.roundNumber + '/updateScores',
				headers : {
                    'sessionid' : sessionStorage.getItem('sessionid')
                },
				data: selectedRound.places
            }).then(function(result){
                defer.resolve(result.data);
            }, function(result){
                defer.reject(logout());
            });
            return defer.promise;
        }

        function getTopFiveGames() {
            
            var defer = $q.defer();

            var serviceUrl = lanoelServiceUrl + '/lanoel/topfivegames'
            $http({
                method: 'GET',
                url: serviceUrl,
                data: { }
            }).then(function(res){
                defer.resolve(processGamesResult(res.data));
            }, function(){
                defer.reject(logout());
            });
            return defer.promise;
        }

        function getGameList() {
            
            var defer = $q.defer();

            var serviceUrl = lanoelServiceUrl + '/lanoel/gamelist'
            $http({
                method: 'GET',
                url: serviceUrl,
                data: { }
            }).then(function(res){
                defer.resolve(processGamesResult(res.data));
            }, function(){
                defer.reject(logout());
            });
            return defer.promise;
        }

        /************* "private" functions***********************/

        function processGamesResult(games)
        {
            games = games.sort(compareGames);
            games.forEach(checkSteamImage);
            games.forEach(setGameInfo);
            return games;
        }

        function checkSteamImage(game)
        {
            if(game.steamInfo == null)
            {
                game.steamInfo = {};
                game.steamInfo.header_image = 'http://via.placeholder.com/600x400/000000?text=' + game.gameName;
            }
        }

        function setGameInfo(game)
        {
            var info = "<h2>I am only your memory.  I can give you no new information.</h2><br/><h3>This game is not on steam, or you typed the name wrong...</h3>";

            if(game.steamInfo.about_the_game)
            {
                info = game.steamInfo.about_the_game;
            }
            game.steamInfo.about_the_game = $sce.trustAsHtml(info);
            
            if(!game.steamInfo.price_overview)
            {
                game.steamInfo.price_overview = {};
                game.steamInfo.price_overview.final = 0;
                game.steamInfo.price_overview.final = game.steamInfo.price_overview.final.toFixed(2);
            } else{
                game.steamInfo.price_overview.final = game.steamInfo.price_overview.final / 100;
                if(game.free){
                    game.steamInfo.price_overview.final = 0;
                    game.steamInfo.price_overview.final = game.steamInfo.price_overview.final.toFixed(2);
                }
            }
            
            return game;
        };

        function compareGames(game1, game2)
        {
            if(game1.voteTotal > game2.voteTotal)
            {
                return -1;
            }
            if(game1.voteTotal < game2.voteTotal)
            {
                return 1;
            }
            if(game1.numUniquePersonVotes > game2.numUniquePersonVotes)
            {
                return -1;
            }
        
            return 1;
        }
        
        function getPeopleOrder(personList)
        {
            getTeams(personList);
            var groups = groupBy(personList, 'team');
            var persons = [];
            for(var group in groups)
            {
                persons.push(groups[group]["values"][0]);
                persons.push(groups[group]["values"][1]);
            }
            return persons;
        }
        
        function comparePlaces(place1, place2)
        {
            if(place1.place < place2.place)
            {
                return -1;
            }
            if(place1.place > place2.place)
            {
                return 1;
            }
            return 0;
        }

        function getTeams(people)
        {
            for(var person in people)
            {
                people[person].team = getTeamFromPerson(people[person].personName);
            }
        }
        
        function getTeamFromPerson(name)
        {
            switch(name)
            {
                case "Aaron":
                case "Joe":
                    return "Outtatime";
                case "Pat":
                case "Nick":
                    return "Team pYREHEARTS	";
                case "Eric":
                case "Megan":
                    return "The Sleigherz";
                case "Jon":
                case "Mitch":
                    return "Robert Baratheon's Balls";
                case "Bryon":
                case "Tim":
                    return "Team Shatner";
                case "Ryan":
                case "Steve":
                    return "Team RamRod";
                default:
                    return "Unteamed";
            }
        }

        function groupBy(xs, key) {
            return xs.reduce(function(rv, x) {
                let v = key instanceof Function ? key(x) : x[key];
                let el = rv.find((r) => r && r.key === v);
                if (el) {
                    el.values.push(x);
                } else {
                    rv.push({
                        key: v,
                        values: [x]
                    });
                }
                return rv;
            }, []);
        }

        function logout()
        {
            sessionStorage.clear();
            $location.path('/');
        }
    }
})();