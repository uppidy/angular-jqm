
jqmModule.directive({
    jqmLiEntry: jqmLiEntryDirective(false),
    jqmLiDivider: jqmLiEntryDirective(true)
});
function jqmLiEntryDirective(isDivider) {
    return function() {
        return {
            restrict: 'A',
            replace: true,
            transclude: true,
            scope: {},
            templateUrl: 'templates/jqmLiEntry.html',
            link: function(scope) {
                if (isDivider) {
                    scope.divider = true;
                }
            }
        };
    };
}
