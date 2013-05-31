"use strict";
describe('jqmPage', function() {
    var $compile, $rootScope;
    beforeEach(function() {
        module("jqm");
        inject(function(_$compile_, _$rootScope_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
        });
    });
    it('generates same markup as data-role="page"', function() {
        var v = markupValidator({
            ng: '<div jqm-page></div>', 
            jqm:'<div data-role="page"></div>'
        });
        v.check();
    });
});