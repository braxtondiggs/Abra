angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $ionicSideMenuDelegate) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = {};
    $ionicSideMenuDelegate.canDragContent(false)

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function() {
        $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
        console.log('Doing login', $scope.loginData);

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function() {
            $scope.closeLogin();
        }, 1000);
    };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.rapperCount = 1;
    /*global Parse*/
    var rappers = [];
    var Rappers = Parse.Object.extend("Rappers");
    var query = new Parse.Query(Rappers);
    query.find({
        success: function(results) {
            rappers = results;
            console.log(rappers);
            createQuiz();
        }
    });

    function createQuiz() {
        var count = 4;
        var request = 1;
        var query1, query2, randomQuery, queries = [];
        var AdLibs = Parse.Object.extend("Adlibs");
        for (var i = 0; i < request; i++) {
            query1 = new Parse.Query(AdLibs);
            query2 = new Parse.Query(AdLibs);

            query1.skip(Math.floor(Math.random() * count));
            query1.limit(1);
            query2.matchesKeyInQuery("objectId", "objectId", query1);
            queries.push(query2);
        }
        console.log(query1);
        randomQuery = Parse.Query.or.apply(this, queries);
        randomQuery.include('rapper');
        randomQuery.find().then(function(result) {
            for (var i = 0; i < result.length; i++) {
                result[i].rappers = [result[i].get('rapper')];
                var arr = [result[i].get('rapper').get('name')];
                while (arr.length < 4) {
                    function isInArray(value, array) {
                        return array.indexOf(value) > -1;
                    }
                    var rand = rappers[Math.floor(Math.random() * rappers.length)];
                    if (!isInArray(rand.get('name'), arr)) {
                        result[i].rappers.push(rand);
                        arr.push(rand.get('name'));
                    }
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
                result[i].rappers = shuffleArray(result[i].rappers);
                $scope.rappers = result[i];
                console.log($scope.rappers);
                $scope.playAudio();
                $scope.$apply();
            }
        });
    }

    $scope.playAudio = function() {
      var myAudio = new Audio($scope.rappers.get('adlib')._url);
      myAudio.play();
    }
})

.controller('PlaylistCtrl', function($scope, $stateParams) {})
.filter('removeSpaces', [function() {
    return function(string) {
        if (!angular.isString(string)) {
            return string;
        }
        return string.replace(/[\s]/g, '-').toLowerCase();
    };
}]);
