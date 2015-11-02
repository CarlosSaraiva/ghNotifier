var ghNotifier = angular.module('ghNotifier', ['ngRoute', ]);

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

ghNotifier.service('db', ['$http', '$rootScope',
    function ($http, $rootScope) {
        "use strict";
        var data,
            counter;

        this.getData = function () {
            return data;
        };

        this.getCounter = function () {
            return counter;
        };

        this.getJson = function () {
            $http.get('https://ghnotifier.herokuapp.com/action/issues')
                .success(function (json) {
                    data = json;
                    $rootScope.$broadcast('dataupdated');
                    console.log('ng - Event \'dataupdated\'  triggered.');
                })
                .error(function (error) {
                    console.log(error);
                });
        };

        this.getCounterJson = function () {
            $http.get('https://ghnotifier.herokuapp.com/action/counter')
                .success(function (json) {
                    counter = JSON.parse(json);
                    $rootScope.$broadcast('counterupdated');
                    console.log('ng - Event \'counterupdated\'  triggered.');
                })
                .error(function (error) {
                    console.log(error);
                });
        };

        this.getCounterJson();
        this.getJson();
    }
]);

ghNotifier.factory('IO', ['db',
    function (db) {
        "use strict";
        var socket = io("https://ghnotifier.herokuapp.com/");

        socket.on('newuser', function (response) {
            console.log(response.message + '\n' +
                'id: ' + response.id + '\n' +
                'ip:' + response.ip + ':' + response.port + '\n' +
                'time: ' + response.timestamp);
        });

        socket.on('ondbgroupby', function () {
            console.log('io - Event \'onnewrequest\' triggered.');
            socket.emit('message ', {
                message: 'onnewrequest received.'
            });
        });

        socket.on('onnewrequest', function () {
            console.log('io - Event \'ondbgroupby\' triggered.');
            db.getCounterJson();
            socket.emit('message ', {
                message: 'ondbgroupby received.'
            });

        });

        return socket;
    }
]);

ghNotifier.controller('MainController', function ($scope, db, $rootScope, IO) {
    "use strict";
    $rootScope.$on('counterupdated', function () {
        $scope.counter = db.getCounter();
    });
    $scope.counter = db.getCounter();
});

ghNotifier.controller('IssuesController', function ($scope, db, $rootScope) {
    "use strict";
    $rootScope.$on('dataupdated', function () {
        $scope.actions = db.getData();
        console.log($scope.actions);
    });
    $scope.actions = db.getData();
});