'use strict';
angular.module('abra', ['ionic', 'abra.controllers', 'ngCordova'])

.run(function($ionicPlatform, $cordovaStatusbar, $cordovaGoogleAnalytics) {
	$ionicPlatform.ready(function() {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if (window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			cordova.plugins.Keyboard.disableScroll(true);

		}
		if (window.StatusBar) {
			// org.apache.cordova.statusbar required
			StatusBar.styleDefault();
			$cordovaStatusbar.styleHex('#222831');
		}

		if(window.cordova){
            $cordovaGoogleAnalytics.startTrackerWithId((/(android)/i.test(navigator.userAgent)) ?'UA-55153042-4':'UA-55153042-5');
        }
	});
	/*global Parse*/
	Parse.initialize('uyuHSPMhDSh2GCrPSJSBLxgCS2ZDzHVlcBxBBpcz', 'TxbgkWbowXnAUI9CMdzqPhNvF0u7QcwGhkGennJn');
})

.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider

		.state('app', {
		url: '/app',
		abstract: true,
		templateUrl: 'templates/menu.html',
		controller: 'AppCtrl'
	})

	.state('app.intro', {
			url: '/intro',
			views: {
				'menuContent': {
					templateUrl: 'templates/intro.html',
					controller: 'IntroCtrl'
				}
			}
		})
		.state('app.main', {
			url: '/main',
			views: {
				'menuContent': {
					templateUrl: 'templates/main.html',
					controller: 'MainCtrl'
				}
			}
		})
		.state('app.finished', {
			url: '/finished/:score/:total',
			views: {
				'menuContent': {
					templateUrl: 'templates/finished.html',
					controller: 'FinishedCtrl'
				}
			}
		});
	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/app/intro');
});