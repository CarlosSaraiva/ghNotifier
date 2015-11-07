angular.module('ghNotifier.database', []).service('db', ['$http', '$rootScope', '$q',

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

angular.module('ghNotifier.websocket', []).factory('IO', ['$rootScope',
    function ($rootScope) {
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
            $rootScope.$broadcast('oncounterupdated');
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