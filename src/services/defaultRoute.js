/**
 * Adds a default routing to a `templateUrl` that matches the
 * url of `$location`.
 */
jqmModule.provider('defaultRouteProvider', ['$routeProvider', function($routeProvider) {
    var $location, $browser;
    $routeProvider.otherwise({
        templateUrl: function() {
            return makeRelativeToHtmlPage($location.url());
        },
        transition: 'fade'
    });

    function makeRelativeToHtmlPage(absUrl) {
        return absUrl.substring(1);
    }

    return {
        $get: ['$location', function(_$location_) {
            $location = _$location_;
        }]
    };
}]);

jqmModule.run(['defaultRouteProvider', angular.noop]);