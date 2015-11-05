'use strict';
/*global Parse*/
angular.module('abra.controllers')
	.controller('IntroCtrl', ['$scope', '$window', '$interval', '$timeout', function($scope, $window, $interval , $timeout) {
		$scope.count = null;
		$scope.isChanged = false;
		var Rappers = Parse.Object.extend('Rappers');
		function findImage() {
			var query = new Parse.Query(Rappers);
			query.limit(1);
			query.skip(Math.floor(Math.random() * $scope.count));
			query.find({
				success: function(results) {
					$scope.introImg = results[0].get('image')._url;
					$timeout(function() {
						$scope.isChanged = true;
						$scope.$apply();
					}, 500);
				}
			});
		}
		var query = new Parse.Query(Rappers);
		query.count({
			success: function(count) {
				$scope.count = count;
				findImage();
			}
		});
		var interval = $interval(function() {
			$scope.isChanged = false;
			findImage();
		}, 5000);

		$scope.go = function() {
			if (angular.isDefined(interval)) {
				$interval.cancel(interval);
				interval = undefined;
			}
			$window.location = '#/app/main';
		};
	}]);