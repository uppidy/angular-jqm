"use strict";
describe("jqmCheckbox", function () {
    var ng, jqm, ngElement, jqmElement;
    beforeEach(function () {
        ng = testutils.ng;
        jqm = testutils.jqm;
        module('templates/jqmCheckbox.html');
    });

    function triggerNgLabel(event) {
        ng.$(ngElement[0].getElementsByTagName("label")).triggerHandler(event);
    }

    function triggerJqmLabel(event) {
        jqm.$(jqmElement[0].getElementsByTagName("label")).trigger(event);
    }

    describe('markup compared to jqm', function () {
        it("has same markup if unchecked", function () {
            ngElement = ng.init('<div jqm-checkbox>someLabel</div>');
            jqmElement = jqm.init('<label for="someChk">someLabel</label>'+
                '<input id="someChk" type="checkbox">');
            testutils.compareElementRecursive(ngElement, jqmElement);
        });
        it("has same markup if checked", function () {
            ngElement = ng.init('<div jqm-checkbox>someLabel</div>');
            jqmElement = jqm.init('<label>someLabel<input type="checkbox"></label>');
            triggerNgLabel("click");
            triggerJqmLabel("click");
            testutils.compareElementRecursive(ngElement, jqmElement);
        });
        it("has same markup if pressed", function () {
            ngElement = ng.init('<div jqm-checkbox>someLabel</div>');
            jqmElement = jqm.init('<label>someLabel<input type="checkbox"></label>');
            triggerNgLabel("mousedown");
            triggerJqmLabel("mousedown");
            testutils.compareElementRecursive(ngElement, jqmElement);
        });
        it("has same markup when disabled", function() {
            ngElement = ng.init('<div jqm-checkbox disabled="disabled">someLabel</div>');
            jqmElement = jqm.init('<label>someLabel<input type="checkbox" disabled="disabled"></label>');
            testutils.compareElementRecursive(ngElement, jqmElement);
        });
        it("has same markup with custom theme", function () {
            ngElement = ng.init('<div jqm-checkbox jqm-theme="someTheme">someLabel</div>');
            jqmElement = jqm.init('<label for="someChk">someLabel</label>'+
                '<input id="someChk" type="checkbox" data-theme="someTheme">');
            testutils.compareElementRecursive(ngElement, jqmElement);
        });
    });
    describe('details', function() {
        it("allows label interpolation", function() {
            ngElement = ng.init('<div jqm-checkbox>{{someVar}}</div>');
            ng.scope.someVar = 'someLabel';
            ng.scope.$apply();
            expect(ngElement.text().trim()).toBe('someLabel');
        });
        it("allows disabled interpolation", function() {
            ngElement = ng.init('<div jqm-checkbox ng-disabled="disabled">someLabel</div>');
            expect(ngElement.hasClass("ui-disabled")).toBe(false);
            ng.scope.disabled = true;
            ng.scope.$apply();
            expect(ngElement.hasClass("ui-disabled")).toBe(true);
        });
        it("updates the input element when changing", function() {
            var input;
            ngElement = ng.init('<div jqm-checkbox ng-disabled="disabled">someLabel</div>');
            input = ngElement[0].getElementsByTagName("input")[0];
            expect(input.checked).toBe(false);
            triggerNgLabel("click");
            expect(input.checked).toBe(true);
        });
        it("works with ng-model without using $parent", function() {
            var wrapper = ng.init('<div ng-init="someModel=false;"><div jqm-checkbox ng-model="someModel"></div></div>');
            ngElement = wrapper.children();
            triggerNgLabel("click");
            expect(wrapper.scope().someModel).toBe(true);
        });
    });

    describe('tests from angular checkbox widget as we copied code from the angular sources', function() {
        var formElm, inputElm, realInputElm, scope, $compile, $sniffer, $browser, changeInputValueTo;

        function compileInput(inputHtml) {
            inputElm = angular.element(inputHtml);
            formElm = angular.element('<form name="form"></form>');
            formElm.append(inputElm);
            $compile(formElm)(scope);
            scope.$apply();
            inputElm = formElm.children().eq(0);
            realInputElm = angular.element(formElm[0].getElementsByTagName("input"));
        }

        function browserTrigger(el, event) {
            angular.element(el[0].getElementsByTagName("label")).triggerHandler(event);
        }

        beforeEach(inject(function($injector, _$sniffer_, _$browser_) {
            $sniffer = _$sniffer_;
            $browser = _$browser_;
            $compile = $injector.get('$compile');
            scope = $injector.get('$rootScope');

            changeInputValueTo = function(value) {
                inputElm.val(value);
                browserTrigger(inputElm, $sniffer.hasEvent('input') ? 'input' : 'change');
            };
        }));

        afterEach(function() {
            formElm.remove();
        });

        describe('checkbox', function() {

            it('should ignore checkbox without ngModel directive', function() {
                compileInput('<div jqm-checkbox name="whatever" required />');

                changeInputValueTo('');
                expect(inputElm.hasClass('ng-valid')).toBe(false);
                expect(inputElm.hasClass('ng-invalid')).toBe(false);
                expect(inputElm.hasClass('ng-pristine')).toBe(false);
                expect(inputElm.hasClass('ng-dirty')).toBe(false);
            });


            it('should format booleans', function() {
                compileInput('<div jqm-checkbox ng-model="name" ></div>');

                scope.$apply(function() {
                    scope.name = false;
                });
                expect(realInputElm[0].checked).toBe(false);

                scope.$apply(function() {
                    scope.name = true;
                });
                expect(realInputElm[0].checked).toBe(true);
            });

            it('should allow custom enumeration', function() {
                compileInput('<div jqm-checkbox ng-model="name" ng-true-value="y" ' +
                    'ng-false-value="n">');

                scope.$apply(function() {
                    scope.name = 'y';
                });
                expect(realInputElm[0].checked).toBe(true);

                scope.$apply(function() {
                    scope.name = 'n';
                });
                expect(realInputElm[0].checked).toBe(false);

                scope.$apply(function() {
                    scope.name = 'something else';
                });
                expect(realInputElm[0].checked).toBe(false);

                browserTrigger(inputElm, 'click');
                expect(scope.name).toEqual('y');

                browserTrigger(inputElm, 'click');
                expect(scope.name).toEqual('n');
            });


            it('should be required if false', function() {
                compileInput('<div jqm-checkbox ng:model="value" required />');

                browserTrigger(inputElm, 'click');
                expect(realInputElm[0].checked).toBe(true);
                expect(inputElm.hasClass('ng-valid')).toBe(true);
                expect(inputElm.hasClass('ng-invalid')).toBe(false);

                browserTrigger(inputElm, 'click');
                expect(realInputElm[0].checked).toBe(false);
                expect(inputElm.hasClass('ng-valid')).toBe(false);
                expect(inputElm.hasClass('ng-invalid')).toBe(true);
            });
        });
    });
});