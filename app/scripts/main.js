'use strict';
/*global Parse*/
angular.module('abra.controllers')
	.controller('MainCtrl', ['$scope', function($scope) {
		$scope.rapperCount = 1;
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
			var request = 1;
			var query1, query2, randomQuery, queries = [];
			var AdLibs = Parse.Object.extend('Adlibs');
			var query = new Parse.Query(AdLibs);
			query.count({
				success: function(count) {
					for (var i = 0; i < request; i++) {
						query1 = new Parse.Query(AdLibs);
						query2 = new Parse.Query(AdLibs);

						query1.skip(Math.floor(Math.random() * count));
						query1.limit(1);
						query2.matchesKeyInQuery('objectId', 'objectId', query1);
						queries.push(query2);
					}
					randomQuery = Parse.Query.or.apply(this, queries);
					randomQuery.include('rapper');
					randomQuery.find().then(function(result) {
						for (var i = 0; i < result.length; i++) {
							result[i].rappers = [result[i].get('rapper')];
							var arr = [result[i].get('rapper').get('name')];
							while (arr.length < 4) {
								var rand = rappers[Math.floor(Math.random() * rappers.length)];
								if (!isInArray(rand.get('name'), arr)) {
									result[i].rappers.push(rand);
									arr.push(rand.get('name'));
								}
							}
							result[i].rappers = shuffleArray(result[i].rappers);
							$scope.rappers = result[i];
							$scope.playAudio();
							$scope.$apply();
						}
					});
				}
			});
		}

		$scope.playAudio = function() {
			var myAudio = new Audio($scope.rappers.get('adlib')._url);
			myAudio.play();
		};
	}]);