/**
 * @ngdoc directive
 * @name jqm.directive:jqmOnceClass
 * @restrict A
 *
 * @description
 * Sets the given class string once, with no watching.
 *
 * @example
 <example module="jqm">
 <file name="index.html">
   <div ng-init="someClass='a'" jqm-once-class="{{someClass}}">
       <input type="text" ng-model="someClass">
   </div>
 </file>
 </example>
 */
jqmModule.directive('jqmOnceClass', ['$interpolate', function($interpolate) {
    return {
        compile: function(element, iAttr) {
            //We have to catch the attr value before angular tries to compile it
            var classAttr = $interpolate(iAttr.jqmOnceClass);
            if (classAttr) {
                return function postLink(scope, element, attr) {
                    element.addClass( classAttr(scope) );
                };
            }
        }
    };
}]);
