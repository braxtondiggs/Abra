'use strict';
angular.module('abra.controllers', [])

.controller('AppCtrl', ['$window', '$state', '$ionicPlatform', function($window, $state, $ionicPlatform) {
	$ionicPlatform.registerBackButtonAction(function() {
		if ($state.current.name === 'app.intro') {
			navigator.app.exitApp();
		} else {
			$window.location = '#/app/intro/';
		}
	}, 100);
}]);