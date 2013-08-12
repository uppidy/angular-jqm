jqmModule.directive('jqmPopupOverlay', function() {
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'templates/jqmPopupOverlay.html',
        scope: {},
        link: function(scope, elm, attr) {
            scope.$on('$popupStateChanged', function($e, popup) {
                scope.popup = popup;
            });
        }
    };
});
