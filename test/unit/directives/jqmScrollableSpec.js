"use strict";
describe('jqmScrollable', function() {
    var scope, el;
    function compile(html) {
        inject(function($compile, $rootScope) {
            scope = $rootScope.$new();
            el = $compile(html)(scope);
            $rootScope.$digest();
        });
    }

    it('calls the $scroller service for the content', function() {
        var $scroller = jasmine.createSpy('$scroller');
        module(function($provide) {
            $provide.value('$scroller', $scroller);
        });
        compile('<div jqm-scrollable></div>');
        expect($scroller).toHaveBeenCalled();
        expect($scroller.mostRecentCall.args[0][0]).toBe(el[0]);
    });
});