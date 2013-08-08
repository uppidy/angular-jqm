"use strict";
describe("jqmButton", function () {
    var ng, jqm, ngElement, jqmElement;
    beforeEach(function () {
        ng = testutils.ng;
        jqm = testutils.jqm;
        module('templates/jqmButton.html');
    });

    describe('markup compared to jqm', function () {
        function compile(ngAttrs, jqmAttrs) {
            ngElement = ng.init('<a jqm-button '+ngAttrs+'>someContent</div>');
            jqmElement = jqm.init('<a data-role="button" '+jqmAttrs+'>someContent</div>');
        }

        function compileGroupHorizontal(ngAttrs, jqmAttrs) {
            ngElement = ng.init('<div jqm-controlgroup type="horizontal">'+
                         '<a jqm-button '+ngAttrs+'>One</a>'+
                         '<a jqm-button '+ngAttrs+'>Two</a>'+
                         '<a jqm-button '+ngAttrs+'>Three</a>'+
                         '</div>');
            jqmElement = jqm.init('<fieldset data-role="controlgroup" data-type="horizontal">'+
                         '<a data-role="button" '+jqmAttrs+'>One</a>'+
                         '<a data-role="button" '+jqmAttrs+'>Two</a>'+
                         '<a data-role="button" '+jqmAttrs+'>Three</a>'+
                         '</fieldset>');
        }

        function compileGroupVertical(ngAttrs, jqmAttrs) {
            ngElement = ng.init('<div jqm-controlgroup>'+
                         '<a jqm-button '+ngAttrs+'>One</a>'+
                         '<a jqm-button '+ngAttrs+'>Two</a>'+
                         '<a jqm-button '+ngAttrs+'>Three</a>'+
                         '</div>');
            jqmElement = jqm.init('<fieldset data-role="controlgroup">'+
                         '<a data-role="button" '+jqmAttrs+'>One</a>'+
                         '<a data-role="button" '+jqmAttrs+'>Two</a>'+
                         '<a data-role="button" '+jqmAttrs+'>Three</a>'+
                         '</fieldset>');
        }
        function compare() {
            return testutils.compareElementRecursive(ngElement, jqmElement, /ui-btn-(up|down)/);
        }

        it("has same markup with nothing", function () {
            compile('','');
            compare();
        });
        it("has same markup with custom theme", function () {
            compile('jqm-theme="someTheme"','data-theme="someTheme"');
            compare();
        });
        it("has same markup with mini option", function () {
            compile('data-mini="true"','data-mini="true"');
            compare();
        });
        it("has same markup with iconpos option", function () {
            compile('data-iconpos="right"','data-iconpos="right"');
            compare();
        });
        it("has same markup with controlgroup horizontal", function () {
            compileGroupHorizontal('','');
            compare();
        });
        it("has same markup with custom theme with controlgroup horizontal", function () {
            compileGroupHorizontal('jqm-theme="someTheme"','data-theme="someTheme"');
            compare();
        });
        it("has same markup with mini option with controlgroup horizontal", function () {
            compileGroupHorizontal('data-mini="true"','data-mini="true"');
            compare();
        });
        it("has same markup with iconpos option with controlgroup horizontal", function () {
            compileGroupHorizontal('data-iconpos="right"','data-iconpos="right"');
            compare();
        });
        it("has same markup with controlgroup vertical", function () {
            compileGroupVertical('','');
            compare();
        });
        it("has same markup with custom theme with controlgroup vertical", function () {
            compileGroupVertical('jqm-theme="someTheme"','data-theme="someTheme"');
            compare();
        });
        it("has same markup with mini option with controlgroup vertical", function () {
            compileGroupVertical('data-mini="true"','data-mini="true"');
            compare();
        });
        it("has same markup with iconpos option with controlgroup vertical", function () {
            compileGroupVertical('data-iconpos="right"','data-iconpos="right"');
            compare();
        });

        it('has same markup with button', function() {
            ngElement = ng.init('<div jqm-button="submit">Hello</div>');
            jqmElement = jqm.init('<button type="submit" value="Hello">');
            compare();
        });
        it('has same markup with button', function() {
            ngElement = ng.init('<div jqm-button="reset">Hello</div>');
            jqmElement = jqm.init('<button type="reset" value="Hello">');
            compare();
        });
    });
});

