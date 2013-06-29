
jqmModule.directive('jqmListview', [function() {
    var isdef = angular.isDefined;
    return {
        restrict: 'A',
        replace: true,
        transclude: true,
        templateUrl: 'templates/jqmListview.html',
        scope: {
            inset: '@'
        },
        link: function(scope, element, attr) {
            //We do this instead of '@' binding because "false" is actually truthy
            //And these default to true
            scope.shadow = isdef(attr.shadow) ? (attr.shadow==='true') : true;
            scope.corners = isdef(attr.corners) ? (attr.corners==='true') : true;
        }
    };
}]);
