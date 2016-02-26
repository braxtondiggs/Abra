'use strict';
angular.module('abra', ['ionic', 'abra.controllers', 'ngCordova', 'ngAnimate', 'firebase', '720kb.fx', 'cfp.loadingBar', 'angular-loading-bar', 'ngStorage'])

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

        if (window.cordova) {
            //$cordovaGoogleAnalytics.startTrackerWithId((/(android)/i.test(navigator.userAgent)) ?'UA-55153042-4':'UA-55153042-5');
        }
    });
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
                url: '/finished',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/finished.html',
                        controller: 'FinishedCtrl'
                    }
                }
            });
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/intro');
    }).factory('RapperService', ['$firebaseArray', 'FIREBASE_URL', function($firebaseArray, FIREBASE_URL) {
        /*global Firebase*/
        var ref = new Firebase(FIREBASE_URL + 'Rappers');
        var rappers = $firebaseArray(ref);

        var service = {
            loadRapper: function() {
                return rappers;
            },
            getRapper: function() {
                return rappers[Math.floor(Math.random() * rappers.length)];
            },
            getRapperAudio: function(rapper) {
                return rapper.adlibs[Math.floor(Math.random() * rapper.adlibs.length)];
            }
        };
        return service;
    }]).factory('UserService', ['$firebaseArray', 'FIREBASE_URL', '$sessionStorage', function($firebaseArray, FIREBASE_URL, $sessionStorage) {
        var score = $sessionStorage.score || 0;
        var service = {
            getScore: function() {
                return score;
            },
            setScore: function() {
                return score++;
            },
            resetScore: function() {
                $sessionStorage.$reset();
                score = 0;
            },
            saveScore: function(s) {
                var refScore = new Firebase(FIREBASE_URL + 'Scores');
                var list = $firebaseArray(refScore);
                list.$add(s).then(function(refScore) {
                    list.$indexFor(refScore.key());
                });
                $sessionStorage.score = s;
            }
        };
        return service;
    }]).config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeSpinner = false;
    }]).constant('FIREBASE_URL', 'https://popping-heat-8539.firebaseio.com/')
    .constant('FIREBASE_HOSTING', 'https://popping-heat-8539.firebaseapp.com')
    .constant('QUIZ_SIZE', 25);
