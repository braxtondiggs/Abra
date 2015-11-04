'use strict';
/*global Parse*/
angular.module('abra.controllers')
    .controller('MainCtrl', ['$scope', '$window', '$timeout', '$ionicLoading', function($scope, $window, $timeout, $ionicLoading) {
        $ionicLoading.show();
        $scope.rappers = null;
        $scope.imgLoad = false;
        $scope.rapperCount = 0;
        $scope.correct = 0;
        $scope.wrong = 0;
        $scope.request = 20;
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
            var query1, query2, randomQuery, queries = [];
            var AdLibs = Parse.Object.extend('Adlibs');
            var query = new Parse.Query(AdLibs);
            query.count({
                success: function(count) {
                    for (var i = 0; i < $scope.request; i++) {
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
                            result[i].answer = null;
                        }
                        $timeout(function() {
                            $scope.rappers = result;
                            $scope.playAudio($scope.rapperCount);
                            $scope.$apply();
                        }, 500);
                    });
                }
            });
        }

        $scope.playAudio = function() {
            var myAudio = new Audio($scope.rappers[$scope.rapperCount].get('adlib')._url);
            myAudio.play();
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
            }
        };
        $scope.next = function() {
            $scope.rapperCount++;
            if (typeof $scope.rappers[$scope.rapperCount] !== 'undefined') {
                $scope.playAudio();
            } else {
                $window.location = '#/app/finished/' + $scope.correct + '/' + $scope.request;
            }
        };
        $scope.loaded = function() {
        	$ionicLoading.hide();
        	$scope.imgLoad = true;
        };
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
