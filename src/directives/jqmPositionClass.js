
/**
 * Sets the classes ui-first-child and ui-last-child depending on the position in parent (first, middle, or last)
 * @example
   <div jqm-position-class></div>
 */
jqmModule.directive('jqmPositionClass', ['watchPositionInParent', function(watchPositionInParent) {
    var JQM_POSITION_CLASSES = {
        first: 'ui-first-child',
        last: 'ui-last-child'
    };
    return {
        compile: function(element, iAttr) {
            return function postLink(scope, element) {
                watchPositionInParent(element, function(newPos, oldPos) {
                    if (oldPos) {
                        element.removeClass(JQM_POSITION_CLASSES[oldPos]);
                    }
                    element.addClass(JQM_POSITION_CLASSES[newPos]);
                });
            };
        }
    };
}]);
