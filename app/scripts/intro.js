'use strict';
/*global Parse*/
angular.module('abra.controllers')
	.controller('IntroCtrl', ['$scope', '$window', '$interval', function($scope, $window, $interval) {
        $scope.count = null;
        var Rappers = Parse.Object.extend('Rappers');
        function findImage() {
            var query = new Parse.Query(Rappers);
            query.limit(1);
            query.skip(Math.floor(Math.random() * $scope.count));
            query.find({
                success: function(results) {
                    $scope.introImg = results[0].get('image')._url;
                    $scope.$apply();
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
        $interval(function() {
            findImage();
        }, 5000);

        $scope.go = function() {
            $window.location = '#/app/main';
        };
	}]);