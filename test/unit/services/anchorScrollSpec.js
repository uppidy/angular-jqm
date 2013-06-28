"use strict";
describe('$anchorScroll', function() {
    it('calls $hideAddressBar after a timeout', function() {
        var $hideAddressBar = jasmine.createSpy('$hideAddressBar');
        module(function($provide) {
            $provide.value('$hideAddressBar', $hideAddressBar);
        });
        inject(function($anchorScroll) {
            $anchorScroll();
            expect($hideAddressBar).not.toHaveBeenCalled();
            testutils.ng.tick(1000);
            expect($hideAddressBar).toHaveBeenCalled();
        });
    });
});