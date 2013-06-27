jqmModule.directive('jqmCheckbox', [function () {
    return {
        restrict: 'A',
        transclude: true,
        replace: true,
        templateUrl: 'templates/jqmCheckbox.html',
        scope: {
            disabled: '@',
            mini: '@',
            iconpos: '@'
        },
        require: ['?ngModel','^?jqmControlgroup'],
        link: function (scope, element, attr, ctrls) {
            var ngModelCtrl = ctrls[0],
                jqmControlGroupCtrl = ctrls[1];
            scope.toggleChecked = toggleChecked;
            scope.isMini = isMini;
            scope.getIconPos = getIconPos;

            if (ngModelCtrl) {
                enableNgModelCollaboration();
            }

            function isMini() {
                return scope.mini || (jqmControlGroupCtrl && jqmControlGroupCtrl.$scope.mini);
            }

            function getIconPos() {
                return scope.iconpos || (jqmControlGroupCtrl && jqmControlGroupCtrl.$scope.iconpos);
            }

            function toggleChecked() {
                if (scope.disabled) {
                    return;
                }
                scope.checked = !scope.checked;
                if (ngModelCtrl) {
                    ngModelCtrl.$setViewValue(scope.checked);
                }
            }

            function enableNgModelCollaboration() {
                // For the following code, see checkboxInputType in angular's sources
                var trueValue = attr.ngTrueValue,
                    falseValue = attr.ngFalseValue;

                if (!angular.isString(trueValue)) {
                    trueValue = true;
                }
                if (!angular.isString(falseValue)) {
                    falseValue = false;
                }

                ngModelCtrl.$render = function () {
                    scope.checked = ngModelCtrl.$viewValue;
                };

                ngModelCtrl.$formatters.push(function (value) {
                    return value === trueValue;
                });

                ngModelCtrl.$parsers.push(function (value) {
                    return value ? trueValue : falseValue;
                });
            }

        }
    };
}]);
