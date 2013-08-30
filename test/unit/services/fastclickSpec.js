"use strict";
describe('fastclick', function() {

    var win, root;
    beforeEach(module(function() {
        spyOn(window.FastClick, 'attach');
    }));

    it('should call FastClick.attach on the $rootElement', function() {
        inject(function($rootElement) {
            expect(window.FastClick.attach).toHaveBeenCalledWith($rootElement[0]);
        });
    });


});
