"use strict";
describe("jqmCheckbox", function () {
    var ng, jqm, ngElement, jqmElement;
    beforeEach(function () {
        ng = testutils.ng;
        jqm = testutils.jqm;
        module('templates/jqmCheckbox.html');
    });

    function triggerNgLabel(event) {
        ngElement.find("label").triggerHandler(event);
    }

    function triggerJqmLabel(event) {
        jqmElement.find("label").trigger(event);
    }

    describe('markup compared to jqm', function () {
        function compile(ngAttrs, jqmAttrs) {
            ngElement = ng.init('<div jqm-checkbox '+ngAttrs+'>someLabel</div>');
            jqmElement = jqm.init('<label for="someChk">someLabel</label>'+
                '<input id="someChk" type="checkbox" '+jqmAttrs+'>');
        }


        it("has same markup if unchecked", function () {
            compile('','');
            testutils.compareElementRecursive(ngElement, jqmElement);
        });
        it("has same markup if checked", function () {
            compile('','');
            triggerNgLabel("click");
            triggerJqmLabel("click");
            testutils.compareElementRecursive(ngElement, jqmElement);
        });
        it("has same markup if pressed", function () {
            compile('','');
            triggerNgLabel("mousedown");
            triggerJqmLabel("mousedown");
            testutils.compareElementRecursive(ngElement, jqmElement);
        });
        it("has same markup when disabled", function() {
            compile('disabled="disabled"','disabled="disabled"');
            testutils.compareElementRecursive(ngElement, jqmElement);
        });
        it("has same markup with custom theme", function () {
            compile('jqm-theme="someTheme"','data-theme="someTheme"');
            testutils.compareElementRecursive(ngElement, jqmElement);
        });
        it("has same markup with mini option", function () {
            compile('data-mini="true"','data-mini="true"');
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
            input = ngElement.find("input")[0];
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
        it("uses the mini option of a parent controlgroup", function() {
            var wrapper = ng.init('<div jqm-controlgroup data-mini="true"><div jqm-checkbox></div></div>');
            var label = wrapper.find("label");
            expect(label).toHaveClass("ui-mini");
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
            realInputElm = formElm.find("input");
        }

        function browserTrigger(el, event) {
            el.find("label").triggerHandler(event);
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