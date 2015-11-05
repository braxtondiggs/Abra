'use strict';
/*global Parse, ionic, AdMob*/
angular.module('abra.controllers')
	.controller('MainCtrl', ['$scope', '$window', '$timeout', '$ionicLoading', '$cordovaGoogleAnalytics', function($scope, $window, $timeout, $ionicLoading, $cordovaGoogleAnalytics) {
		$ionicLoading.show();
		$scope.rappers = null;
		$scope.imgLoad = false;
		$scope.rapperCount = 0;
		$scope.correct = 0;
		$scope.wrong = 0;
		$scope.request = 20;
		var audioPlayer = null;
		var audioPlayerEnded = true;
		var rappers = [];
		var Rappers = Parse.Object.extend('Rappers');
		var query = new Parse.Query(Rappers);
		query.find({
			success: function(results) {
				rappers = results;
				createQuiz();
			}
		});

		function createQuiz() {
			function isInArray(value, array) {
				return array.indexOf(value) > -1;
			}

			function shuffleArray(array) {
				for (var i = array.length - 1; i > 0; i--) {
					var j = Math.floor(Math.random() * (i + 1));
					var temp = array[i];
					array[i] = array[j];
					array[j] = temp;
				}
				return array;
			}
			var AdLibs = Parse.Object.extend('Adlibs');
			var query = new Parse.Query(AdLibs);
			query.count({
				success: function(count) {
					var arr = [];
					while (arr.length < $scope.request) {
						arr.push(Math.ceil(Math.random() * count));
					}
					query = new Parse.Query(AdLibs);
					query.containedIn('index', arr);
					query.include('rapper');
					query.find({
						success: function(results) {
							for (var i = 0; i < results.length; i++) {
								results[i].rappers = [results[i].get('rapper')];
								var arr = [results[i].get('rapper').get('name')];
								while (arr.length < 4) {
									var rand = rappers[Math.floor(Math.random() * rappers.length)];
									if (!isInArray(rand.get('name'), arr)) {
										results[i].rappers.push(rand);
										arr.push(rand.get('name'));
									}
								}
								results[i].rappers = shuffleArray(results[i].rappers);
								results[i].answer = null;
							}
							$timeout(function() {
								$scope.rappers = results;
								audioPlayer = new Audio($scope.rappers[$scope.rapperCount].get('adlib')._url);
								audioPlayer.onended = function() {
									audioPlayerEnded = true;
								};
								$scope.playAudio($scope.rapperCount);
								$scope.$apply();
							}, 500);
						}
					});
				}
			});
		}

		$scope.playAudio = function() {
			if (audioPlayerEnded === true) {
				audioPlayerEnded = false;
				audioPlayer.play();
			}
		};
		$scope.answer = function(option) {
			function getCorrect() {
				for (var i = 0; i < $scope.rappers[$scope.rapperCount].rappers.length; i++) {
					if ($scope.rappers[$scope.rapperCount].rappers[i].get('name') === $scope.rappers[$scope.rapperCount].get('rapper').get('name')) {
						return i;
					}
				}
			}
			if ($scope.rappers[$scope.rapperCount].answer === null) {
				$scope.playAudio();
				$scope.rappers[$scope.rapperCount].answer = {
					status: null,
					chosen: option,
					correct: getCorrect(),
					options: [0, 0, 0, 0]
				};
				$scope.rappers[$scope.rapperCount].answer.options[$scope.rappers[$scope.rapperCount].answer.correct] = 1;
				if ($scope.rappers[$scope.rapperCount].rappers[option].get('name') === $scope.rappers[$scope.rapperCount].get('rapper').get('name')) {
					$scope.rappers[$scope.rapperCount].answer.status = 'correct';
					$scope.correct++;
				} else {
					$scope.rappers[$scope.rapperCount].answer.status = 'wrong';
					$scope.wrong++;
					$scope.rappers[$scope.rapperCount].answer.options[$scope.rappers[$scope.rapperCount].answer.chosen] = 2;
				}
				if (window.cordova) {
					$cordovaGoogleAnalytics.trackEvent('Quiz', $scope.rappers[$scope.rapperCount].get('rapper').get('name'), $scope.rappers[$scope.rapperCount].answer.status, $scope.rappers[$scope.rapperCount].rappers[option].get('name'));
				}
			}
		};
		$scope.next = function() {
			if (typeof $scope.rappers[$scope.rapperCount + 1] !== 'undefined') {
				$scope.rapperCount++;
				audioPlayer = new Audio($scope.rappers[$scope.rapperCount].get('adlib')._url);
				audioPlayerEnded = true;
				audioPlayer.onended = function() {
					audioPlayerEnded = true;
				};
				$scope.playAudio();
			} else {
				var Score = Parse.Object.extend('Scores');
				var score = new Score();

				score.set('score', $scope.correct);
				score.save();
				$window.location = '#/app/finished/' + $scope.correct + '/' + $scope.request;
			}
		};
		$scope.loaded = function() {
			$ionicLoading.hide();
			$scope.imgLoad = true;
		};

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
		var admobid = (/(android)/i.test(navigator.userAgent)) ? adPublisherIds.android : adPublisherIds.ios;
		ionic.Platform.ready(function() {
			if (typeof AdMob !== 'undefined') {
				AdMob.prepareInterstitial({
					adId: admobid.interstitial,
					autoShow: false
				});
			}
			if (window.cordova) {
				$cordovaGoogleAnalytics.trackView('Quiz Screen');
			}
		});
	}]).directive('imageonload', function() {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				element.bind('load', function() {
					scope.$apply(attrs.imageonload);
				});
			}
		};
	});
