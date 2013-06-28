/**
 * @ngdoc directive
 * @name jqm.directive:jqmPositionAnchor
 * @restrict A
 *
 * @description
 * For every child element that has an own scope this will set the property $position in the child's scope
 * and keep that value updated whenever elements are added, moved or removed from the element.
 *
 * @example
 <example module="jqm">
 <file name="index.html">
 <div jqm-position-anchor>
     <div ng-controller="angular.noop">First child: {{$position}}</div>
     <div ng-controller="angular.noop">Middle child: {{$position}}</div>
     <div ng-controller="angular.noop">Last child: {{$position}}</div>
 </div>
 </file>
 </example>
 */
jqmModule.directive('jqmPositionAnchor', [ '$rootScope', function ($rootScope) {
    return {
        restrict: 'A',
        link: function (scope, element) {
            var elementNode = element[0];
            afterFn(elementNode, 'appendChild', enqueueUpdate);
            afterFn(elementNode, 'insertBefore', enqueueUpdate);
            afterFn(elementNode, 'removeChild', enqueueUpdate);

            enqueueUpdate();

            function afterFn(context, fnName, afterCb) {
                var fn = context[fnName];
                context[fnName] = function (arg1, arg2) {
                    fn.call(context, arg1, arg2);
                    afterCb(arg1, arg2);
                };
            }

            function enqueueUpdate() {
                if (!enqueueUpdate.started) {
                    enqueueUpdate.started = true;
                    $rootScope.$evalAsync(function () {
                        updateChildren();
                        enqueueUpdate.started = false;
                    });
                }
            }

            function updateChildren() {
                var children = element.children(),
                    length = children.length,
                    i, child, newPos, childScope;
                for (i = 0; i < length; i++) {
                    child = children.eq(i);
                    childScope = child.scope();
                    if (childScope !== scope) {
                        childScope.$position = getPosition(i, length);
                    }
                }
            }

            function getPosition(index, length) {
                return {
                    first: index === 0,
                    last: index === length - 1,
                    middle: index > 0 && index < length - 1
                };
            }

        }
    };
}]);