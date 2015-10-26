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

ghNotifier.factory('IssuesDb', ['$http', 'IO',
    function ($http, IO) {
        var socket = IO.getSocket();
        var service = {};
        var data;

        service.getIssues = function (callback) {
            $http.get('https://ghnotifier.herokuapp.com/action/issues').
            then(function (response) {
                data = response;
                if (callback) {
                    callback(data);
                }
            });
        }

        return service;
    }
]);

ghNotifier.controller('MainController', function ($scope, IO, IssuesDb) {
    var socket = IO.getSocket();
    socket.on('newuser', function (response) {
        console.log(response.message + '\n' +
            'id: ' + response.id + '\n' +
            'ip: ' + response.ip + ':' + response.port + '\n' +
            'time: ' + response.timestamp
        );
    });
});

ghNotifier.controller('IssuesController', function ($scope, IO, IssuesDb) {
    var socket = IO.getSocket();

    function getIssues() {
        IssuesDb.getIssues(function (data) {
            $scope.issues = data;
        });
    }

    socket.on('newItem', function (response) {
        console.log('New ' + response.item + ' has added.');
        getIssues();
    });

    getIssues();
});