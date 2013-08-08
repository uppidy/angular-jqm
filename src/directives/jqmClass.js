jqmModule.directive('jqmClass', [function() {
    return {
        link: function(scope, element, attr) {
            var oldVal;

            scope.$watch(attr.jqmClass, jqmClassWatchAction, true);

            attr.$observe('class', function(value) {
                var jqmClass = scope.$eval(attr.jqmClass);
                jqmClassWatchAction(jqmClass);
            });

            function jqmClassWatchAction(newVal) {
                if (oldVal && !angular.equals(newVal,oldVal)) {
                    changeClass('removeClass', oldVal);
                }
                changeClass('addClass', newVal);
                oldVal = angular.copy(newVal);
            }

            function changeClass(fn, classVal) {
                if (angular.isObject(classVal) && !angular.isArray(classVal)) {
                    var classes = [];
                    angular.forEach(classVal, function(v, k) {
                        if (v) { classes.push(k); }
                    });
                    classVal = classes;
                }
                element[fn](angular.isArray(classVal) ? classVal.join(' ') : classVal);
            }
        }
    };
}]);
