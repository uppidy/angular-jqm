"use strict";
describe('jqmTheme directive', function () {
    var themeCtrl;
    beforeEach(function () {
        module(function ($compileProvider) {
            $compileProvider.directive("themeConsumer", function () {
                return {
                    require: 'jqmTheme',
                    link: function (scope, iElement, iAttrs, ctrl) {
                        themeCtrl = ctrl;
                    }
                };
            });
        });
    });

    it('has a default theme of "c"', function () {
        testutils.ng.init('<div jqm-theme theme-consumer></div>');
        expect(themeCtrl.theme()).toBe('c');
    });
    it('uses the given theme', function () {
        testutils.ng.init('<div jqm-theme="someTheme" theme-consumer></div>');
        expect(themeCtrl.theme()).toBe('someTheme');
    });
});
