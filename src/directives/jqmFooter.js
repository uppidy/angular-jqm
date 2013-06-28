/**
 * @ngdoc directive
 * @name jqm.directive:jqmFooter
 * @restrict A
 *
 * @description
 * Defines the footer of a `jqm-page`.
 *
 * @example
 <example module="jqm">
 <file name="index.html">
 <div jqm-page class="jqm-standalone-page" style="height: 100px;">
   Hello world!
   <div jqm-footer>
     <h1>Footer of Page1</h1>
   </div>
 </div>
 </file>
 </example>
 */
jqmModule.directive('jqmFooter', function () {
    return {
        restrict: 'A',
        // Own scope as we have a different default theme
        // than the page.
        scope: true,
        require: '^jqmPage',
        controller: angular.noop,
        link: function (scope, element, attr, jqmPageCtrl) {
            jqmPageCtrl.footer = element;
            var hasExplicitTheme = scope.hasOwnProperty('$theme');
            if (!hasExplicitTheme) {
                scope.$theme = 'a';
            }
            element.addClass("ui-footer ui-bar-"+scope.$theme);
        }
    };
});