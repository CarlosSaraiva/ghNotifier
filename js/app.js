var ghNotifier = angular.module('ghNotifier', ['ngRoute']);

ghNotifier.config(function ($routeProvider, $locationProvider) {
    $routeProvider.
    when('/home', {
        templateUrl: 'views/home.html',
        controller: 'MainController'
    }).
    when('/issues', {
        templateUrl: 'views/issues.html',
        controller: 'IssuesController'
    }).
    otherwise({
        templateUrl: 'views/home.html',
        controller: 'MainController'
    });
});

ghNotifier.factory('IO', function () {
    var socket = io("https://ghnotifier.herokuapp.com/");
    //var socket = io("http:localhost:3001/");
    var service = {};

    service.getSocket = function () {
        return socket;
    }

    socket.on('newuser', function (response) {
        console.log(response.message + '\n' +
            'id: ' + response.id + '\n' +
            'ip:' + response.ip + ':' + response.port + '\n' +
            'time: ' + response.timestamp
        );
    });

    return service;
});

ghNotifier.service('db', ['$http', 'IO', '$rootScope',
    function ($http, IO, $rootScope) {
        var _data;
        var _counter;

        this.getData = function () {
            return _data;
        }

        this.getCounter = function () {
            return _counter;
        }

        function getJson(callback) {
            $http.get('https://ghnotifier.herokuapp.com/action/issues').
            success(function (data) {
                _data = data;
                $rootScope.$broadcast('dataupdated');
                console.log('dataupdated event triggered')
            }).error(function (error) {
                console.log(error);
            });
        };

        IO.getSocket().on('onDbCount', function (groupBy) {
            _counter = groupBy;
            console.log(groupBy);
            $rootScope.$broadcast('counterupdated');
            console.log('onDbCount io event triggered');
        });

        IO.getSocket().on('newItem', function (message) {
            console.log('A ' + message.item + ' action has been arrived!');
            getJson(function (data) {
                this._data = data;
            });
        });
        getJson();
    }
]);

ghNotifier.controller('MainController', function ($scope, IO, db, $rootScope) {
    var socket = IO.getSocket();
    $rootScope.$on('counterupdated', function () {
        $scope.counter = db.getCounter().groupBy;
    });

    if (db.getCounter()) {
        $scope.counter = db.getCounter().groupBy;
    }
});

ghNotifier.controller('IssuesController', function ($scope, IO, db, $rootScope) {
    $rootScope.$on('dataupdated', function () {
        $scope.issues = db.getData();
    });
    $scope.issues = db.getData();
});