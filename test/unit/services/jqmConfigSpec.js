"use strict";
describe('jqmTheme', function() {
    it('allows to read and write the default', function() {
        module(function(jqmConfigProvider) {
            var someTheme = "someTheme";
            expect(jqmConfigProvider.defaultTheme(someTheme)).toBe(someTheme);
            expect(jqmConfigProvider.defaultTheme()).toBe(someTheme);
        });
    });
    it('uses the theme "c" as default', function() {
        module(function(jqmConfigProvider) {
            expect(jqmConfigProvider.defaultTheme()).toBe("c");
        });
    });

    it('returns the defaultTheme as service instance', function() {
        var someTheme = "someTheme";
        module(function(jqmConfigProvider) {
            jqmConfigProvider.defaultTheme(someTheme);
        });
        inject(function(jqmConfig) {
            expect(jqmConfig.defaultTheme).toBe(someTheme);
        });
    });
});