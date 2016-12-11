'use strict';

/**
 * @ngdoc function
 * @name matchesApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the matchesApp
 */
angular.module('matchesApp')
  .controller('MainCtrl', function ($scope) {
		var getArray = function(count) {
			var m = [];
			for (var i = 0; i < count; i++) {
				m.push(i);
			}
			return m;			
		};
		
		$scope.newMatchesArray = function() {
			return getArray($scope.nbMatches - $scope.nbBurning);
		};

		$scope.burnedMatchesArray = function() {
			return getArray(12 - $scope.nbMatches - $scope.nbBurning);
		};

		$scope.burningMatchesArray = function() {
			return getArray($scope.nbBurning);
		};
		
		$scope.nbMatches = 12;
		$scope.nbBurning = 0;
		
  });




