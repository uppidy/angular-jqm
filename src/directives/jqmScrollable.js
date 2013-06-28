/**
 * @ngdoc directive
 * @name jqm.directive:jqmScrollable
 * @restrict A
 *
 * @description
 * Adds overflow scrolling to an element.
 *
 * @example
 <example module="jqm">
 <file name="index.html">
 <div jqm-scrollable style="height: 100px;">
     <p>Hello world!</p>
     <p>New Line</p>
     <p>New Line</p>
     <p>New Line</p>
     <p>New Line</p>
     <p>New Line</p>
     <p>New Line</p>
     <p>New Line</p>
     <p>New Line</p>
     <p>New Line</p>
     <p>New Line</p>
 </div>
 </file>
 </example>
 */
jqmModule.directive('jqmScrollable', [function () {
    return {
        restrict: 'A',
        controller: angular.noop,
        require: 'jqmScrollable',
        link: function(scope, element, attrs, ctrl) {
            // TODO add other directives for jqmScrollable with a higher priority than 0
            // who set ctrl.fakeScrolling to true!
            if (!ctrl.fakeScrolling) {
                element.addClass('jqm-native-scrollable');
            }
        }
    };
}]);
