jqmModule.config(['$provide', function($provide) {
    $provide.decorator('$route', ['$delegate', '$rootScope', '$history', function($route, $rootScope, $history) {
        $rootScope.$on('$routeChangeStart', function(event, newRoute) {
            if (newRoute) {
                newRoute.back = $history.activeIndex < $history.previousIndex;
            }
        });
        return $route;
    }]);
}]);