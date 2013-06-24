"use strict";
describe('jqmThemeClass directive', function() {
    it('should set the class using the current theme on children', function() {
        var elm = testutils.ng.init('<div jqm-theme="abc123"><div jqm-theme-class="super-class-$"></div></div>');

        expect(elm.children().eq(0)).toHaveClass('super-class-abc123');
    });

    it('should set the class using theme on jqmTheme element', function() {
        var elm = testutils.ng.init('<div jqm-theme="fun" jqm-theme-class="uber-$"></div>');
        expect(elm).toHaveClass('uber-fun');
    });

    it('should do nothing for empty string', function() {
        var elm = testutils.ng.init('<div jqm-theme-class></div>');
        expect(elm[0].className).toEqual('');
    });
});
