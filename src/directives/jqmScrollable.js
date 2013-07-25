/**
 * @ngdoc directive
 * @name jqm.directive:jqmScrollable
 * @restrict ECA
 *
 * @description
 * # Overview
 * `jqmScrollable` enables fake scrolling for the given element using angular-scrolly.
 * @example
    <example module="jqm">
      <file name="index.html">
         <div style="height:100px;overflow:hidden" jqm-scrollable>
             <p>Hello</p>
             <p>Hello</p>
             <p>Hello</p>
             <p>Hello</p>
             <p>Hello</p>
             <p>Hello</p>
             <p>Hello</p>
             <p>Hello</p>
             <p>Hello</p>
             <p>Hello</p>
             <p>Hello</p>
             <p>Hello</p>
         </div>
      </file>
    </example>
*/
// Don't use scrolly-scroll directive here by purpose,
// as it is swallowing all mousemove events, which prevents
// the address bar to be shown using a scroll on the page header.
jqmModule.directive('jqmScrollable', ['$scroller', function($scroller) {
    return {
        restrict: 'A',
        link: function(scope, element) {
            $scroller(element);
        }
    };
}]);