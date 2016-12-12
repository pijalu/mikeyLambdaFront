'use strict';

/**
 * @ngdoc function
 * @name matchesApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the matchesApp
 */
angular.module('matchesApp')
  .controller('MainCtrl', function ($scope, $http) {
		const NB = 12,
					MAXSEL=3,
					// Replace by lambda url
					URL='http://localhost:3000/matches',
		      DEFMSG='Select 1, 2, or 3 matches!';
		
		var getScopeMatch = function(id) {
			return $scope.matches[id];			
		},
				handle = function(reply) {
					var m, sel, i, j, ilen=$scope.matches.length;
					console.log('Got reply', reply);
					$scope.burning = 0;
					$scope.left = reply.left;

					$scope.message = 'Computer turn: Computer took '+reply.taken;

					while(reply.taken > 0) {
						sel=Math.floor(Math.random() * NB);
						for (i=0; i<ilen;++i) {
							j = (sel + i) % ilen;
							m = getScopeMatch(j);
							if (m.status === 'NEW') {
								m.status = 'BURNED';
								m.cpu = true;
								reply.taken --;
								break;
							}
						}
					}

					if (reply.win) {
						$scope.message = 'Computer WIN !';
					} else {
						$scope.message = DEFMSG;
					}
		};
		
		$scope.getMatchClass = function(matchId) {
			const CLASSMAP = {
				'NEW': 'newmatch',
				'BURNING' : 'burningmatch',
				'BURNED' : 'burnedmatch'
			};		
			var m = getScopeMatch(matchId);
			return CLASSMAP[m.status];
		};

		$scope.clickMatch = function(matchId) {
			var m = getScopeMatch(matchId);
			switch(m.status) {
			case 'NEW': if ($scope.burning < MAXSEL) {
				  m.status = 'BURNING';
				  $scope.burning++;
			  }
				break;
			case 'BURNING':
				m.status = 'NEW';
				$scope.burning--;
				break;
			}
		};		

		$scope.submit = function() {
			var m,
					i,
					ilen=$scope.matches.length;
			for (i=0; i<ilen; ++i) {
				m = getScopeMatch(i);
				switch(m.status) {
				case 'BURNING':
					m.status = 'BURNED';
					m.cpu = false;
					break;				
				}
			}
			$scope.message='Computer turn: Calling lambda !';
			$http({
				method: 'GET',
				url: URL + '?taken='+$scope.burning+'&current='+$scope.left
			}).then(function successCallback(response) {
				$scope.message='Computer turn: Parsing lambda reply';
				handle(response.data);
			}, function errorCallback(response) {
				console.log('Lambda error reply', response);
				$scope.message = 'Something very wrong occured :-(';
			});
		};

		
		$scope.init = function() {
				$scope.matches = (function(){
					var m = [];
					for (var i = 0; i < NB; i++) {
						m.push({
							'id': i,
							'status':'NEW'
						});
					}
					return m;
				})();

			$scope.left = NB;
			$scope.burning=0;
			$scope.message = DEFMSG;
		};

		$scope.init();		
  });




