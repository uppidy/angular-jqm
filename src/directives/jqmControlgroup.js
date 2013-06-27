jqmModule.directive('jqmControlgroup', function() {
    return {
        restrict: 'A',
        replace: true,
        transclude: true,
        templateUrl: 'templates/jqmControlgroup.html',
        scope: {
            mini: '@',
            iconpos: '@',
            type: '@',
            shadow: '@',
            corners: '@',
            legend: '@'
        },
        controller: ['$scope', JqmControlGroupCtrl]
    };

    function JqmControlGroupCtrl($scope) {
        this.$scope = $scope;
    }
});