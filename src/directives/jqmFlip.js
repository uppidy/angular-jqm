/**
 * @ngdoc directive
 * @name jqm.directive:jqmFlip
 * @restrict A
 *
 * @description
 * Creates a jquery mobile flip switch on the given element.
 *
 * Anything inside the `jqm-flip` tag will be a label.
 *
 * @param {expression=} ngModel Assignable angular expression to data-bind to.
 * @param {string=} disabled Whether this flip switch is disabled.
 * @param {string=} ngOnLabel The label which should be shown when fliped on.
 * @param {string=} ngOnValue The value to which the expression should be set when fliped on.
 * @param {string=} ngOffLabel The label which should be shown when fliped off.
 * @param {string=} ngOffValue The value to which the expression should be set when fliped off.
 *
 * @example
<example module="jqm">
  <file name="index.html">
    <div jqm-flip ng-model="flip" on-label="On" on-value="1" off-label="Off" off-value="0">
      My value is: {{flip}}
    </div>
  </file>
</example>
 */
jqmModule.directive('jqmFlip', [function () {
    return {
        restrict: 'A',
        transclude: true,
        replace: true,
        templateUrl: 'templates/jqmFlip.html',
        scope: {
            onLabel: '@',
            onValue: '@',
            offLabel: '@',
            offValue: '@',
            mini: '@',
            disabled: '@'
        },
        require: ['?ngModel', '^?jqmControlgroup'],
        link: function (scope, element, attr, ctrls) {
            var ngModelCtrl = ctrls[0];
            var jqmControlGroupCtrl = ctrls[1];

            scope.theme = scope.$theme || 'c';
            scope.isMini = isMini;

            initToggleState();
            bindClick();

            function initToggleState () {
                ngModelCtrl.$render = updateToggleStyle;
                ngModelCtrl.$viewChangeListeners.push(updateToggleStyle);
            }

            function updateToggleStyle () {
                var toggled = isToggled();
                scope.toggleLabel = toggled ? scope.onLabel : scope.offLabel;
                scope.onStyle = toggled ? 100 : 0;
                scope.offStyle = toggled ? 0 : 100;
            }

            function bindClick () {
                scope.toggle = function () {
                    ngModelCtrl.$setViewValue(isToggled() ? scope.offValue : scope.onValue);
                };
            }

            function isToggled () {
                return ngModelCtrl.$viewValue === scope.onValue;
            }

            function isMini() {
                return scope.mini || (jqmControlGroupCtrl && jqmControlGroupCtrl.$scope.mini);
            }

        }
    };
}]);
