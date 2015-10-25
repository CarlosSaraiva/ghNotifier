var socket = io("https://ghnotifier.herokuapp.com/");
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
        redirectTo: 'views/home.html'
    });

    //$locationProvider.html5Mode(true);
});

ghNotifier.controller('MainController', function ($scope, $route, $routeParams, $location) {
    $scope.message = 'MainController screen';
    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;
});

ghNotifier.controller('IssuesController', function ($scope) {
    $scope.message = 'IssuesController screen';
});