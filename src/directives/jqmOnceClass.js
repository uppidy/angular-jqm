/*
 * This is intentionally not documented; internal use only
 */
jqmModule.directive('jqmOnceClass', ['$interpolate', function($interpolate) {
    return {
        link: function(scope, elm, attr) {
            elm.addClass( $interpolate(attr.jqmOnceClass)(scope) );
        }
    };
}]);
