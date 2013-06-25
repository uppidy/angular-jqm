jqmModule.directive('jqmPage', [function () {
    return {
        restrict: 'A',
        link: function (scope, iElement) {
            iElement.addClass('ui-page ui-body-' + scope.$theme);
            scope.$root.$on('$viewContentLoaded', function () {
                // Modify the parent when this page is shown.
                iElement.parent().addClass("ui-overlay-" + scope.$theme);
            });
        }
    };
}]);
