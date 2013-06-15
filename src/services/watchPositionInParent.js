/**
 * watchPositionInParent will watch the position of a given set of elements within their common parent node.
 * For example, if three children of a parent element each call `watchPositionInParent(me, callback)`, then
 * whenever the position of any of those children changes relative to the parent, the changed childs' callbacks
 * will be called.
 *
 * The callback is called with parameters `(newPosition, previousPosition)`.  The `position` is a string: either
 * 'first', 'middle', or 'last'.
 *
 */
jqmModule.factory('watchPositionInParent', [ '$rootScope', function ($rootScope) {

    var WATCH_DATA_KEY_CHILD = '$watchPositionChild';
    var WATCH_DATA_KEY_PARENT = '$watchPositionParent';
    function ParentWatcher($parent) {
        $parent.data(WATCH_DATA_KEY_PARENT, this);

        var parent = $parent[0];

        this.watchChild = function($element, callback) {
            var watchData = $element.data(WATCH_DATA_KEY_CHILD);
            if (!watchData) {
                $element.data(WATCH_DATA_KEY_CHILD, (watchData = {
                    callbacks: [],
                    position: undefined
                }));
            }
            watchData.callbacks.push(callback);
            enqueueUpdate();
        };

        afterFn(parent, 'appendChild', enqueueUpdate);
        afterFn(parent, 'insertBefore', enqueueUpdate);
        afterFn(parent, 'removeChild', enqueueUpdate);

        var _updateEnqueued = false;
        function enqueueUpdate() {
            if (!_updateEnqueued) {
                _updateEnqueued = true;
                $rootScope.$evalAsync(function() {
                    updateChildren();
                    _updateEnqueued = false;
                });
            }
        }

        function updateChildren() {
            var children = $parent.children();
            var length = children.length;
            angular.forEach(children, function(child, index) {
                var childData = angular.element(child).data(WATCH_DATA_KEY_CHILD);
                if (childData) {
                    var newPos = getPosition(index, length);
                    if (newPos !== childData.position) {
                        angular.forEach(childData.callbacks, function(cb) {
                            cb(newPos, childData.position);
                        });
                        childData.position = newPos;
                    }
                }
            });
        }
    }

    function getPosition(index, length) {
        if (index === 0) {
            return 'first';
        } else if (index === length - 1) {
            return 'last';
        } else {
            return 'middle';
        }
    }

    function afterFn(context, fnName, afterCb) {
        var fn = context[fnName];
        context[fnName] = function(arg1, arg2) {
            fn.call(context, arg1, arg2);
            afterCb(arg1, arg2);
        };
    }

    return function watchPositionInParent(element, callback) {
        var parent = element.parent();
        var parentWatcher = parent.data(WATCH_DATA_KEY_PARENT) || new ParentWatcher(parent);
        parentWatcher.watchChild(element, callback);
    };
}]);
