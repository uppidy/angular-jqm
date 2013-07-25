"use strict";
describe("jqmTextInput", function () {
    var ng, jqm;
    beforeEach(function () {
        ng = testutils.ng;
        jqm = testutils.jqm;
        module('templates/jqmTextinput.html');
    });

     describe("Same Markup compared to jqm", function () {
        it("has same Markup", function () {
            var ngElement = ng.init('<div name="text-1" id="text-1" value="" type="text" jqm-textinput>');
            var jqmElement = jqm.init('<input name="text-1" id="text-1" value="" type="text">');
            testutils.compareElementRecursive(ngElement, jqmElement);
        });

        it("with data-clear-btn", function () {
            var ngElement = ng.init('<div data-clear-btn="true" name="text-1" id="text-1" jqm-textinput/>');
            var jqmElement = jqm.init('<input data-clear-btn="true" name="text-1" id="text-1" type="text"/>');
            jqm.tick(1);

            testutils.compareElementRecursive(ngElement, jqmElement);
        });

        it("has same Markup if focused and unfocused", function () {
            var ngElement = ng.init('<div name="text-1" id="text-1" value="" type="text" jqm-textinput>');
            var jqmElement = jqm.init('<input name="text-1" id="text-1" value="" type="text">');

            ngElement.children("input").triggerHandler('focus');
            jqmElement.children("input").triggerHandler('focus');

            testutils.compareElementRecursive(ngElement, jqmElement);

            ngElement.children("input").triggerHandler('blur');
            jqmElement.children("input").triggerHandler('blur');

            testutils.compareElementRecursive(ngElement, jqmElement);
        });

        it("for clear-btn-text", function () {
            var ngElement = ng.init('<div data-clear-btn="true" data-clear-btn-text="someValue" type="text" jqm-textinput/>');
            var jqmElement = jqm.init('<input data-clear-btn="true" data-clear-btn-text="someValue" type="text"/>');
            jqm.tick(1);

            testutils.compareElementRecursive(ngElement, jqmElement);
        });

        it("allows disabled interpolation", function () {
            var ngElement = ng.init('<div name="text-1" id="text-1" type="text" data-disabled="disabled" jqm-textinput>');
            var jqmElement = jqm.init('<input name="text-1" id="text-1" disabled="disabled" type="text">');

            testutils.compareElementRecursive(ngElement, jqmElement);
        });

        it("has same markup with mini option", function () {
            var ngElement = ng.init('<div name="text-1" id="text-1" type="text" data-mini="true" jqm-textinput>');
            var jqmElement = jqm.init('<input name="text-1" id="text-1" data-mini="true" type="text">');

            testutils.compareElementRecursive(ngElement, jqmElement);
        });

        it("has same markup with custom theme", function () {
            var ngElement = ng.init('<div name="text-1" id="text-1" type="text" data-jqm-theme="a" jqm-textinput>');
            var jqmElement = jqm.init('<input name="text-1" id="text-1" data-theme="a" type="text">');

            testutils.compareElementRecursive(ngElement, jqmElement);
        });

        it("has same markup with type='search'", function () {
            var ngElement = ng.init('<div name="text-1" id="text-1" ng-model="someValue" type="search" data-jqm-theme="a" jqm-textinput>');
            var jqmElement = jqm.init('<input name="text-1" id="text-1" data-theme="a" type="search">');
            jqm.tick(1);

            testutils.compareElementRecursive(ngElement, jqmElement);
        });

        it("has same markup with type='search' and clear-btn='true'", function () {
            var ngElement = ng.init('<div data-clear-btn="true" name="text-1" id="text-1" ng-model="someValue" type="search" data-jqm-theme="a" jqm-textinput>');
            var jqmElement = jqm.init('<input data-clear-btn="true" name="text-1" id="text-1" data-theme="a" type="search">');
            jqm.tick(1);

            testutils.compareElementRecursive(ngElement, jqmElement);
        });

        it("has same markup with type='number'", function () {
            var ngElement = ng.init('<div name="text-1" id="text-1" ng-model="someValue" type="number" data-jqm-theme="a" jqm-textinput>');
            var jqmElement = jqm.init('<input name="text-1" id="text-1" data-theme="a" type="number">');
            jqm.tick(1);

            testutils.compareElementRecursive(ngElement, jqmElement);
        });

        it("has same markup with type='number' and clear-btn='true'", function () {
            var ngElement = ng.init('<div data-clear-btn="true" name="text-1" id="text-1" ng-model="someValue" type="number" data-jqm-theme="a" jqm-textinput>');
            var jqmElement = jqm.init('<input data-clear-btn="true" name="text-1" id="text-1" data-theme="a" type="number">');
            jqm.tick(1);

            testutils.compareElementRecursive(ngElement, jqmElement);
        });

        it("has same markup with type='date'", function () {
            var ngElement = ng.init('<div name="text-1" id="text-1" ng-model="someValue" type="date" data-jqm-theme="a" jqm-textinput>');
            var jqmElement = jqm.init('<input name="text-1" id="text-1" data-theme="a" type="date">');
            jqm.tick(1);

            testutils.compareElementRecursive(ngElement, jqmElement);
        });

        it("has same markup with type='date' and clear-btn='true'", function () {
            var ngElement = ng.init('<div data-clear-btn="true" name="text-1" id="text-1" ng-model="someValue" type="date" data-jqm-theme="a" jqm-textinput>');
            var jqmElement = jqm.init('<input data-clear-btn="true" name="text-1" id="text-1" data-theme="a" type="date">');
            jqm.tick(1);

            testutils.compareElementRecursive(ngElement, jqmElement);
        });

        it("has same markup with type='month'", function () {
            var ngElement = ng.init('<div name="text-1" id="text-1" ng-model="someValue" type="month" data-jqm-theme="a" jqm-textinput>');
            var jqmElement = jqm.init('<input name="text-1" id="text-1" data-theme="a" type="month">');
            jqm.tick(1);

            testutils.compareElementRecursive(ngElement, jqmElement);
        });

        it("has same markup with type='month' and clear-btn='true'", function () {
            var ngElement = ng.init('<div data-clear-btn="true" name="text-1" id="text-1" ng-model="someValue" type="month" data-jqm-theme="a" jqm-textinput>');
            var jqmElement = jqm.init('<input data-clear-btn="true" name="text-1" id="text-1" data-theme="a" type="month">');
            jqm.tick(1);

            testutils.compareElementRecursive(ngElement, jqmElement);
        });

        it("has same markup with type='week'", function () {
            var ngElement = ng.init('<div name="text-1" id="text-1" ng-model="someValue" type="week" data-jqm-theme="a" jqm-textinput>');
            var jqmElement = jqm.init('<input name="text-1" id="text-1" data-theme="a" type="week">');
            jqm.tick(1);

            testutils.compareElementRecursive(ngElement, jqmElement);
        });

        it("has same markup with type='week' and clear-btn='true'", function () {
            var ngElement = ng.init('<div data-clear-btn="true" name="text-1" id="text-1" ng-model="someValue" type="week" data-jqm-theme="a" jqm-textinput>');
            var jqmElement = jqm.init('<input data-clear-btn="true" name="text-1" id="text-1" data-theme="a" type="week">');
            jqm.tick(1);

            testutils.compareElementRecursive(ngElement, jqmElement);
        });

        it("has same markup with type='time'", function () {
            var ngElement = ng.init('<div name="text-1" id="text-1" ng-model="someValue" type="time" data-jqm-theme="a" jqm-textinput>');
            var jqmElement = jqm.init('<input name="text-1" id="text-1" data-theme="a" type="time">');
            jqm.tick(1);

            testutils.compareElementRecursive(ngElement, jqmElement);
        });

        it("has same markup with type='time' and clear-btn='true'", function () {
            var ngElement = ng.init('<div data-clear-btn="true" name="text-1" id="text-1" ng-model="someValue" type="time" data-jqm-theme="a" jqm-textinput>');
            var jqmElement = jqm.init('<input data-clear-btn="true" name="text-1" id="text-1" data-theme="a" type="time">');
            jqm.tick(1);

            testutils.compareElementRecursive(ngElement, jqmElement);
        });

        it("has same markup with type='dateTime'", function () {
            var ngElement = ng.init('<div name="text-1" id="text-1" ng-model="someValue" type="dateTime" data-jqm-theme="a" jqm-textinput>');
            var jqmElement = jqm.init('<input name="text-1" id="text-1" data-theme="a" type="dateTime">');
            jqm.tick(1);

            testutils.compareElementRecursive(ngElement, jqmElement);
        });

        it("has same markup with type='dateTime' and clear-btn='true'", function () {
            var ngElement = ng.init('<div data-clear-btn="true" name="text-1" id="text-1" ng-model="someValue" type="dateTime" data-jqm-theme="a" jqm-textinput>');
            var jqmElement = jqm.init('<input data-clear-btn="true" name="text-1" id="text-1" data-theme="a" type="dateTime">');
            jqm.tick(1);

            testutils.compareElementRecursive(ngElement, jqmElement);
        });

        it("has same markup with type='tel'", function () {
            var ngElement = ng.init('<div name="text-1" id="text-1" ng-model="someValue" type="tel" data-jqm-theme="a" jqm-textinput>');
            var jqmElement = jqm.init('<input name="text-1" id="text-1" data-theme="a" type="tel">');
            jqm.tick(1);

            testutils.compareElementRecursive(ngElement, jqmElement);
        });

        it("has same markup with type='tel' and clear-btn='true'", function () {
            var ngElement = ng.init('<div data-clear-btn="true" name="text-1" id="text-1" ng-model="someValue" type="tel" data-jqm-theme="a" jqm-textinput>');
            var jqmElement = jqm.init('<input data-clear-btn="true" name="text-1" id="text-1" data-theme="a" type="tel">');
            jqm.tick(1);

            testutils.compareElementRecursive(ngElement, jqmElement);
        });

        it("has same markup with type='email'", function () {
            var ngElement = ng.init('<div name="text-1" id="text-1" ng-model="someValue" type="email" data-jqm-theme="a" jqm-textinput>');
            var jqmElement = jqm.init('<input name="text-1" id="text-1" data-theme="a" type="email">');
            jqm.tick(1);

            testutils.compareElementRecursive(ngElement, jqmElement);
        });

        it("has same markup with type='email' and clear-btn='true'", function () {
            var ngElement = ng.init('<div data-clear-btn="true" name="text-1" id="text-1" ng-model="someValue" type="email" data-jqm-theme="a" jqm-textinput>');
            var jqmElement = jqm.init('<input data-clear-btn="true" name="text-1" id="text-1" data-theme="a" type="email">');
            jqm.tick(1);

            testutils.compareElementRecursive(ngElement, jqmElement);
        });

        it("has same markup with type='url'", function () {
            var ngElement = ng.init('<div name="text-1" id="text-1" ng-model="someValue" type="url" data-jqm-theme="a" jqm-textinput>');
            var jqmElement = jqm.init('<input name="text-1" id="text-1" data-theme="a" type="url">');
            jqm.tick(1);

            testutils.compareElementRecursive(ngElement, jqmElement);
        });

        it("has same markup with type='url' and clear-btn='true'", function () {
            var ngElement = ng.init('<div data-clear-btn="true" name="text-1" id="text-1" ng-model="someValue" type="url" data-jqm-theme="a" jqm-textinput>');
            var jqmElement = jqm.init('<input data-clear-btn="true" name="text-1" id="text-1" data-theme="a" type="url">');
            jqm.tick(1);

            testutils.compareElementRecursive(ngElement, jqmElement);
        });

        it("has same markup with type='password'", function () {
            var ngElement = ng.init('<div name="text-1" id="text-1" ng-model="someValue" type="password" data-jqm-theme="a" jqm-textinput>');
            var jqmElement = jqm.init('<input name="text-1" id="text-1" data-theme="a" type="password">');
            jqm.tick(1);

            testutils.compareElementRecursive(ngElement, jqmElement);
        });

        it("has same markup with type='password' and clear-btn='true'", function () {
            var ngElement = ng.init('<div data-clear-btn="true" name="text-1" id="text-1" ng-model="someValue" type="password" data-jqm-theme="a" jqm-textinput>');
            var jqmElement = jqm.init('<input data-clear-btn="true" name="text-1" id="text-1" data-theme="a" type="password">');
            jqm.tick(1);

            testutils.compareElementRecursive(ngElement, jqmElement);
        });

        it("has same markup with type='color'", function () {
            var ngElement = ng.init('<div name="text-1" id="text-1" ng-model="someValue" type="color" data-jqm-theme="a" jqm-textinput>');
            var jqmElement = jqm.init('<input name="text-1" id="text-1" data-theme="a" type="color">');
            jqm.tick(1);

            testutils.compareElementRecursive(ngElement, jqmElement);
        });

        /* works only on browsers supporting 'color' input type
        it("has same markup with type='color' and clear-btn='true'", function () {
            var ngElement = ng.init('<div data-clear-btn="true" name="text-1" id="text-1" ng-model="someValue" type="color" data-jqm-theme="a" jqm-textinput>');
            var jqmElement = jqm.init('<input data-clear-btn="true" name="text-1" id="text-1" data-theme="a" type="color">');
            jqm.tick(1);

            testutils.compareElementRecursive(ngElement, jqmElement);
        }); */

        it("has same markup with type='file'", function () {
            var ngElement = ng.init('<div name="text-1" id="text-1" ng-model="someValue" type="color" data-jqm-theme="a" jqm-textinput>');
            var jqmElement = jqm.init('<input name="text-1" id="text-1" data-theme="a" type="color">');
            jqm.tick(1);

            testutils.compareElementRecursive(ngElement, jqmElement);
        });

        it("has same markup with type='file' and clear-btn='true'", function () {
            var ngElement = ng.init('<div data-clear-btn="true" name="text-1" id="text-1" ng-model="someValue" type="file" data-jqm-theme="a" jqm-textinput>');
            var jqmElement = jqm.init('<input data-clear-btn="true" name="text-1" id="text-1" data-theme="a" type="file">');
            jqm.tick(1);

            testutils.compareElementRecursive(ngElement, jqmElement);
        });

        it("allow 'placeholder' interploation", function () {
            var ngElement = ng.init('<div name="text-1" id="text-1" ng-model="someValue" type="text" data-jqm-theme="a" placeholder="42" jqm-textinput>');
            ng.tick(1);

            expect(ngElement.find("input")[0].placeholder).toBe('42');
        });
    });

    describe("Details", function () {
        it("must convert 'search' scope to 'text' to prevent default clear button", function () {
            var ngElement = ng.init('<div name="text-1" id="text-1" ng-model="someValue" type="search" data-jqm-theme="a" jqm-textinput>');

            expect(ngElement.find('input')[0].type).toBe("text");
        });
    });

    describe("Behavior compared to jqm", function () {
        var scope, changeInputValueTo, inputElm, $sniffer;

        beforeEach(inject(function ($injector) {
            scope = $injector.get('$rootScope');
        }));

        it("must reset value if clear-btn-clicked", function () {
            scope.someValue = 'someValue2';

            var ngElement = ng.init('<div data-clear-btn="true" ng-model="someValue" type="text" jqm-textinput/>');
            testutils.fireEvent(ngElement.find('a'), 'click');

            expect(ngElement.find('input').val()).toBe("");
        });

        it("must reset value if clear-btn-clicked for type='search'", function () {
            scope.someValue = 'someValue2';

            var ngElement = ng.init('<div ng-model="someValue" type="search" jqm-textinput/>');
            testutils.fireEvent(ngElement.find('a'), 'click');

            expect(ngElement.find('input').val()).toBe("");
        });
    });

});