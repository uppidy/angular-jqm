"use strict";
describe('jqmFooter', function () {
    var ng, jqm, ngElement, jqmElement;
    beforeEach(function () {
        ng = testutils.ng;
        jqm = testutils.jqm;
    });

    describe('markup compared to jqm', function () {
        function compile(ngAttrs, jqmAttrs, content) {
            ngElement = ng.init('<div jqm-page><div jqm-footer ' + ngAttrs + '>' + content + '</div></div>');
            jqmElement = jqm.init('<div data-role="page"><div data-role="content"></div><div data-role="footer" ' + jqmAttrs + '>' + content + '</div></div>');
        }

        it("has same markup", function () {
            compile('', '', '');
            testutils.compareElementRecursive(ngElement, jqmElement);
        });
        it("has same markup with explicit theme", function () {
            compile('jqm-theme="b"', 'data-theme="b"', '');
            testutils.compareElementRecursive(ngElement, jqmElement);
        });
        it("has same markup with <h1>, ... tags", function () {
            compile('', '', '<h1>test</h1>');
            testutils.compareElementRecursive(ngElement, jqmElement);
        });
    });

});