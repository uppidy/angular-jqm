"use strict";
describe("jqmTextArea", function () {
    var ng, jqm;

    beforeEach(function () {
        ng = testutils.ng;
        jqm = testutils.jqm;

    });

    describe("Same Markup compared to jqm", function () {
        it("has same Markup", function () {
            var ngElement = ng.init('<div name="text-1" id="text-1" jqm-textarea></div>');
            var jqmElement = jqm.init('<textarea name="text-1" id="text-1"></textarea>');
            testutils.compareElementRecursive(ngElement, jqmElement);
        });

        it("on focus", function() {
            var ngElement = ng.init('<div name="text-1" id="text-1" jqm-textarea></div>');
            var jqmElement = jqm.init('<textarea name="text-1" id="text-1"></textarea>');

            ngElement.triggerHandler('focus');
            jqmElement.triggerHandler('focus');

            testutils.compareElementRecursive(ngElement, jqmElement);


            ngElement.triggerHandler('blur');
            jqmElement.triggerHandler('blur');

            testutils.compareElementRecursive(ngElement, jqmElement);
        });

        it("with theme", function() {
            var ngElement = ng.init('<div name="text-1" id="text-1" data-jqm-theme="a" jqm-textarea></div>');
            var jqmElement = jqm.init('<textarea name="text-1" id="text-1" data-theme="a"></textarea>');

            testutils.compareElementRecursive(ngElement, jqmElement);

        });

        it("with disabled='true'", function() {
            var ngElement = ng.init('<div name="text-1" id="text-1" data-disabled="disabled" jqm-textarea></div>');
            var jqmElement = jqm.init('<textarea name="text-1" id="text-1" disabled="true"></textarea>');

            testutils.compareElementRecursive(ngElement, jqmElement);
        });

    });

});
