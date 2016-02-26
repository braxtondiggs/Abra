'use strict';
/*global ionic, AdMob*/
angular.module('abra.controllers')
    .controller('FinishedCtrl', ['$scope', '$rootScope', '$window', '$timeout', 'RapperService', 'UserService', 'FIREBASE_HOSTING', 'QUIZ_SIZE', '$cordovaDialogs', '$cordovaSocialSharing', '$cordovaAppAvailability', '$cordovaGoogleAnalytics', function($scope, $rootScope, $window, $timeout, RapperService, UserService, FIREBASE_HOSTING, QUIZ_SIZE, $cordovaDialogs, $cordovaSocialSharing, $cordovaAppAvailability, $cordovaGoogleAnalytics) {
        $scope.score = UserService.getScore();
        $scope.total = QUIZ_SIZE;
        $scope.average = null;
        $scope.message = 'Can you identify rapper based only on their ad libs? I scored ' + $scope.score + ' out of ' + $scope.total + '.';
        $scope.submessage = 'Can you identify rappers based only on their ad-libs';
        $scope.link = null;
        var image = null;
        $scope.adShown = false;
        UserService.resetScore();
        $rootScope.$ionicGoBack = function() {
            $window.location = '#/app/intro';
        };
        $timeout(function() {
            if (!$scope.adShown) {
                $scope.createInterstitialAd();
            }
        }, 25000);

        $scope.share = function() {
            $cordovaSocialSharing.share($scope.submessage, $scope.message, image, $scope.link).then(function(results) {
                //$cordovaGoogleAnalytics.trackEvent('Share', 'General');
                $scope.startOver(results);
            });
        };
        $scope.shareFacebook = function() {
            var appName = (ionic.Platform.isIOS()) ? 'fb://' : 'com.facebook.katana';
            $cordovaAppAvailability.check(appName).then(function() {
                $cordovaSocialSharing.shareViaFacebook($scope.message, image, $scope.link).then(function(result) {
                    if (window.cordova) {
                        //$cordovaGoogleAnalytics.trackEvent('Share', 'Facebook');
                    }
                    $scope.startOver(result);
                });
            }, function() {
                $scope.missingApp('Facebook');
            });
        };
        $scope.shareTwitter = function() {
            var appName = (ionic.Platform.isIOS()) ? 'twitter://' : 'com.twitter.android';
            $cordovaAppAvailability.check(appName).then(function() {
                $cordovaSocialSharing.shareViaTwitter($scope.message, image, $scope.link).then(function(result) {
                    if (window.cordova) {
                        //$cordovaGoogleAnalytics.trackEvent('Share', 'Twitter');
                    }
                    $scope.startOver(result);
                });
            }, function() {
                $scope.missingApp('Twitter');
            });
        };


        $scope.createInterstitialAd = function() {
            $scope.adShown = true;
            if (typeof AdMob !== 'undefined') {
                AdMob.showInterstitial();
            }
        };

        $scope.missingApp = function(app) {
            $cordovaDialogs.alert('It seems you do not have ' + app + ' installed, please install ' + app + ' first!', 'Rapper Ad-libs - Error');
        };

        $scope.startOver = function() {
            function confirmAlert() {
                $cordovaDialogs.confirm('Would you like to return back to the main screen to try again!', 'Rapper Ad-libs', ['Ok', 'Cancel']).then(function(buttonIndex) {
                    if (buttonIndex === 1) {
                        $scope.adShown = false;
                        $window.location = '#/app/intro';
                    }
                });
            }
            if (!$scope.adShown) {
                $scope.createInterstitialAd();
                $timeout(function() {
                    confirmAlert();
                }, 10000);
            } else {
                confirmAlert();
            }
        }

        var adPublisherIds = {
            ios: {
                banner: 'ca-app-pub-1710263662438559/9009941781',
                interstitial: 'ca-app-pub-1710263662438559/1486674986'
            },
            android: {
                banner: 'ca-app-pub-1710263662438559/2184678988',
                interstitial: 'ca-app-pub-1710263662438559/3661412189'
            }
        };
        /*var admobid = (/(android)/i.test(navigator.userAgent)) ? adPublisherIds.android : adPublisherIds.ios;
        ionic.Platform.ready(function() {
        	if (typeof AdMob !== 'undefined' && AdMob) {
        		AdMob.createBanner({
        			adId: admobid.banner,
        			overlap: false,
        			offsetTopBar: false,
        			bannerAtTop: false,
        			autoShow: true,
        			isTesting: false,
        			bgColor: '#393E46'
        		});
        	}
        	if (window.cordova) {
        		$cordovaGoogleAnalytics.trackView('Results Screen');
        	}
        });*/
    }]);
