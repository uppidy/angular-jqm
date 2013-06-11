"use strict";
describe('jqmPage', function() {
    it('generates same markup as data-role="page"', function() {
        var ng = testutils.ng,
            jqm = testutils.jqm;
        var ngPage = ng.init('<div jqm-page></div>');
        var jqmPage = jqm.init('<div data-role="page"></div>');
        testutils.compareElementRecursive(ngPage, jqmPage);
    });
    it('generates same markup as data-role="page" when a theme is set', function() {
        var ng = testutils.ng,
            jqm = testutils.jqm;
        var ngPage = ng.init('<div jqm-page jqm-theme="a"></div>');
        var jqmPage = jqm.init('<div data-role="page" data-theme="a"></div>');
        testutils.compareElementRecursive(ngPage, jqmPage);
    });
});