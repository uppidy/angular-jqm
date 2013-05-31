jqmModule.directive('jqmPage', function() {
    return {
        restrict: 'A',
        compile: function(cElement) {
            // TODO: ui-body-c: Theming should be customizable!
            cElement.addClass("ui-page ui-body-c");
        }
    };
});