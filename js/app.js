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
    var service = {};

    service.getSocket = function () {
        return socket;
    }
    return service;
});

ghNotifier.factory('total', function () {
    var issues;
    var total = {};

    total.issues = function (n) {
        this.issues = n;
    }
})

ghNotifier.service('db', ['$http', 'IO', '$rootScope',

    function ($http, IO, $rootScope) {
        var _data;

        this.getData = function () {
            return _data;
        }

        function getJson(callback) {
            $http.get('https://ghnotifier.herokuapp.com/action/issues').
            success(function (data) {
                _data = data;
                $rootScope.$broadcast('dataupdated');
            }).error(function (error) {
                console.log(error);
            });
        };

        IO.getSocket().on('newItem', function (message) {
            console.log('A ' + message.item + ' action has been arrived!');
            getJson(function (data) {
                console.log(data);
                this._data = data;
            });
        });
        getJson();
    }
]);

ghNotifier.controller('MainController', function ($scope, IO, db) {

    var socket = IO.getSocket();
    socket.on('newuser', function (response) {
        console.log(response.message + '\n' +
            'id: ' + response.id + '\n' +
            'ip:' + response.ip + ':' + response.port + '\n' +
            'time: ' + response.timestamp
        );
    });

});

ghNotifier.controller('IssuesController', function ($scope, IO, db, $rootScope) {

    var getIssues = function () {
        $scope.issues = db.getData();
    };

    getIssues();

    $rootScope.$on('dataupdated', function () {
        console.log('disparado');
        getIssues();
    });

});