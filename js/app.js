var ghNotifier = angular.module('ghNotifier', []);
var gitEvent = [];
var socket = io("https://ghnotifier.herokuapp.com/");

ghNotifier.controller('mainC', function ($scope) {
    $scope.github = [];
    $scope.teste = 'teste';
    socket.on('newuser', function (res) {
        console.log(res.message);
    });

    socket.on('header', function (res) {
        console.log(res.new);
    });

    socket.on('githubevent', function (res) {
        console.log(res);
        // var o = {
        //     title: res.new.issue.title,
        //     state: res.new.issue.state,
        //     image: res.new.issue.user.avatar_url,
        //     login: res.new.issue.user.login,
        //     update: res.new.issue.update_at,
        //     link: res.new.issue.html_url
        // };
        // $scope.github.push(o);
        // console.log($scope.github);
        // $scope.$apply();
    });
});