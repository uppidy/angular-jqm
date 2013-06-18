// Note: No theme dependency in the css classes of checkboxes!
jqmModule.directive('jqmCheckbox', [function () {
    return {
        restrict: 'A',
        template: '<div class="ui-checkbox">' +
            '<label class="ui-btn ui-btn-up-c ui-btn-corner-all ui-fullsize ui-btn-icon-left">' +
            '<span class="ui-btn-inner">' +
            '<span class="ui-btn-text"></span>' +
            '<span class="ui-icon ui-icon-shadow"></span>' +
            '</span>' +
            '</label>' +
            '<input type="checkbox"></div>',
        require: '?ngModel',
        replace: true,
        link: function (scope, element, attr, ctrl) {
            var checked = false,
                disabled = false,
                label = angular.element(element[0].children[0]),
                input = angular.element(element[0].children[1]),
                innerSpan = label[0].children[0],
                textSpan = angular.element(innerSpan.children[0]),
                iconSpan = angular.element(innerSpan.children[1]);

            observeLabel();
            observeDisabled();
            renderChecked();

            bindClick();
            if (ctrl) {
                enableNgModelCollaboration();
            }

            function observeDisabled() {
                attr.$observe('disabled', function (value) {
                    disabled = value;
                    renderDisabled();
                });
            }

            function observeLabel() {
                attr.$observe('label', function (value) {
                    textSpan.text(value);
                });
            }

            function bindClick() {
                element.bind('click', function () {
                    scope.$apply(function () {
                        checked = !checked;
                        renderChecked();
                        if (ctrl) {
                            ctrl.$setViewValue(checked);
                        }
                    });
                });
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

                ctrl.$render = function () {
                    checked = ctrl.$viewValue;
                    renderChecked();
                };

                ctrl.$formatters.push(function (value) {
                    return value === trueValue;
                });

                ctrl.$parsers.push(function (value) {
                    return value ? trueValue : falseValue;
                });
            }

            // Note: Can't use interpolation in the template, as this would require an isolate scope.
            // However, an isolate scope does not work with ngModelController!
            function renderChecked() {
                label.removeClass("ui-checkbox-off ui-checkbox-on");
                iconSpan.removeClass("ui-icon-checkbox-on ui-icon-checkbox-off");
                if (checked) {
                    label.addClass("ui-checkbox-on");
                    iconSpan.addClass("ui-icon-checkbox-on");
                } else {
                    label.addClass("ui-checkbox-off");
                    iconSpan.addClass("ui-icon-checkbox-off");
                }
                input[0].checked = checked;
            }

            function renderDisabled() {
                element.removeClass("ui-disabled");
                if (disabled) {
                    element.addClass("ui-disabled");
                }
            }
        }
    };
}]);