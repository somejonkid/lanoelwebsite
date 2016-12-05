lanoelApp.controller('PersonController', function($scope, $http, $routeParams, $filter, $timeout) {

    
)};

function addSuggestion($http, $scope, suggestion)
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