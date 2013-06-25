"use strict";
describe('jqmTheme directive', function () {
    it('sets the given theme in the scope', function () {
        var div = testutils.ng.init('<div jqm-theme="someTheme"></div>');
        expect(div.scope().$theme).toBe('someTheme');
    });
    it('sets the given theme in the child scope', function () {
        var div = testutils.ng.init('<div jqm-theme="parentTheme"><div jqm-theme="childTheme"></div></div>');
        expect(div.scope().$theme).toBe('parentTheme');
        expect(div.children().scope().$theme).toBe('childTheme');
    });
    it('does not set a theme if no value is given', function () {
        var div = testutils.ng.init('<div jqm-theme="parentTheme"><div jqm-theme=""></div></div>');
        expect(div.children().scope().$theme).toBe('parentTheme');
    });
});
