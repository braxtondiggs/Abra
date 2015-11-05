'use strict';
/*global Parse, ionic, AdMob*/
angular.module('abra.controllers')
	.controller('IntroCtrl', ['$scope', '$window', '$interval', '$timeout', '$cordovaGoogleAnalytics', function($scope, $window, $interval , $timeout, $cordovaGoogleAnalytics) {
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

		var adPublisherIds = {
			ios : {
				banner: 'ca-app-pub-1710263662438559/9009941781',
				interstitial: 'ca-app-pub-1710263662438559/1486674986'
			},
			android: {
				banner: 'ca-app-pub-1710263662438559/2184678988',
				interstitial: 'ca-app-pub-1710263662438559/3661412189'
			}
		};
		var admobid = (/(android)/i.test(navigator.userAgent)) ? adPublisherIds.android : adPublisherIds.ios;
		ionic.Platform.ready(function() {
			if (typeof AdMob !== 'undefined' && AdMob) {
				AdMob.createBanner({
					adId: admobid.banner,
					overlap: false, 
					offsetTopBar: false, 
					bannerAtTop: false,
					autoShow:true,
					isTesting: false,
					bgColor: '#393E46'
				});
			}
			if (window.cordova) {
				$cordovaGoogleAnalytics.trackView('Introduction Screen');
			}
		});
	}]);