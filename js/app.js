var ghNotifier = angular.module('ghNotifier', ['ngRoute', 'ghNotifier.websocket', 'ghNotifier.database']);

ghNotifier.config(function ($routeProvider) {
    $routeProvider
        .when('/home', {
            templateUrl: 'views/home.html',
            controller: 'MainController'
        })
        .when('/issues', {
            templateUrl: 'views/issues.html',
            controller: 'IssuesController'
        })
        .otherwise({
            templateUrl: 'views/home.html',
            controller: 'MainController'
        });
});

ghNotifier.run(function (IO) {
    "use strict";
    console.log('ghNotifier initialized!');
});


ghNotifier.controller('MainController', function (db, $rootScope, $scope) {
    "use strict";
    var updateCounter = (function () {
        db.getData('counter').then(function (result) {
            $scope.counter = JSON.parse(result.data);
        }, function (error) {
            $scope.counter = error;
        });
    }());

    $rootScope.$on('onnewrequest', updateCounter);
});

ghNotifier.controller('IssuesController', function ($scope, $rootScope, db) {
    "use strict";

    var getIssues = (function () {
        db.getData('issues').then(function (result) {
            $scope.actions = result.data;
        }, function (error) {
            $scope.issues = error;
        });
    }());

    $rootScope.$on('onnewrequest', getIssues);

});