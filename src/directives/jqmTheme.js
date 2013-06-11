jqmModule.directive('jqmTheme', function () {
    return {
        restrict: 'A',
        controller: ['$attrs', ThemeController]
    };

    function ThemeController($attrs) {
        //Default Theme
        var currentTheme = $attrs.jqmTheme || 'c';
        this.theme = function () {
            return currentTheme;
        };
    }
});
