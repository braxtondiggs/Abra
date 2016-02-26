'use strict';
/*global ionic, AdMob*/
angular.module('abra.controllers')
	.controller('IntroCtrl', ['$scope', 'RapperService', 'FIREBASE_HOSTING', '$interval', '$timeout', '$location', 'cfpLoadingBar', '$cordovaGoogleAnalytics', function($scope, RapperService, FIREBASE_HOSTING , $interval, $timeout, $location, cfpLoadingBar, $cordovaGoogleAnalytics) {
		cfpLoadingBar.start();
        $scope.change = false;

        $scope.getStarted = function() {
        	$location.url('app/main');
        };
        RapperService.loadRapper().$loaded().then(function() {
            function getRapper() {
                $timeout(function() {
                	$scope.image = FIREBASE_HOSTING + RapperService.getRapper().image;
                    $scope.change = true;
                }, 500);
            }
            cfpLoadingBar.complete();
            getRapper();
            $interval(function() {
                getRapper();
                $scope.change = false;
            }, 5000);
        });
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
		/*ionic.Platform.ready(function() {
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
		});*/
	}]);