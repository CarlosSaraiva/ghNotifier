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

ghNotifier.service('db', ['$http', '$rootScope', '$q',

    function ($http, $q) {
        "use strict";

        this.getData = function (action) {
            return $http.get('https://ghnotifier.herokuapp.com/action/' + action)
                .then(function (result) {
                    return result;
                }, function (error) {
                    console.log(error);
                    return $q.reject('Não foi possivel acessar o servidor.');
                });
        };

    }]);

ghNotifier.factory('IO', ['db', 'rootScope',
    function (db, $rootScope) {
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
            $rootScope.broadcast('oncounterupdated');
            socket.emit('message ', {
                message: 'onnewrequest received.'
            });
        });

        socket.on('onnewrequest', function () {
            console.log('io - Event \'ondbgroupby\' triggered.');
            $rootScope.broadcast('onnewarrivedaction');
            socket.emit('message ', {
                message: 'ondbgroupby received.'
            });

        });

        return socket;
    }]);

ghNotifier.controller('MainController', function ($scope, db, $rootScope) {
    "use strict";

    $rootScope.emit(db.getData('counter').then(function (result) {
        $scope.counter = JSON.parse(result.data);
    }, function (error) {
        $scope.counter = error;
    });

});

ghNotifier.controller('IssuesController', function ($scope, db) {
    "use strict";

    db.getData('issues').then(function (result) {
        $scope.counter = JSON.parse(result.data);
    }, function (error) {
        $scope.counter = error;
    });

});