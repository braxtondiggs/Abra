'use strict';
/*global Parse*/
angular.module('abra.controllers')
	.controller('FinishedCtrl', ['$scope', '$rootScope', '$window', '$stateParams', function($scope, $rootScope, $window, $stateParams) {
		$scope.score = $stateParams.score;
		$scope.total = $stateParams.total;
		$scope.message = 'Can you identify rapper based only on their ad libs? I scored ' + $scope.score + ' out of ' + $scope.total + '.';
		$scope.submessage = 'Can you identify rappers based only on their ad-libs';
		$scope.link = '';
		var image = '';
		$rootScope.$ionicGoBack = function() {
            $window.location = '#/app/intro';
  		};

  		$scope.share = function() {
            $cordovaSocialSharing.share($scope.submessage, $scope.message, image, $scope.link).then(function(results) {
                //$cordovaGoogleAnalytics.trackEvent('Share', 'General', '', $scope.$storage.general);
                $scope.startOver(results);
            });
        };
        $scope.shareFacebook = function() {
            var appName = (ionic.Platform.isIOS())?'fb://':'com.facebook.katana';
            $cordovaAppAvailability.check(appName).then(function() {
                $cordovaSocialSharing.shareViaFacebook($scope.message, image, $scope.link).then(function(result) {
                    if (window.cordova) {
                        //$cordovaGoogleAnalytics.trackEvent('Share', 'Facebook', '', $scope.$storage.facebook);
                    }
                    $scope.startOver(result);
                });
            }, function () {
                $scope.missingApp('Facebook');
            });
        };
        $scope.shareTwitter = function() {
            var appName = (ionic.Platform.isIOS())?'twitter://':'com.twitter.android';
            $cordovaAppAvailability.check(appName).then(function() {
                $cordovaSocialSharing.shareViaTwitter($scope.message, image, $scope.link).then(function(result) {
                    if (window.cordova) {
                        //$cordovaGoogleAnalytics.trackEvent('Share', 'Twitter', '', $scope.$storage.twitter);
                    }
                    $scope.startOver(result);
                });
            }, function () {
                $scope.missingApp('Twitter');
            });
        };
	}]);