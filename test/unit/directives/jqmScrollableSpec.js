"use strict";
describe('jqmScrollable', function () {
    var ng, ngElement;
    beforeEach(function () {
        ng = testutils.ng;
    });
    function compile() {
        ngElement = ng.init('<div jqm-scrollable></div>');
    }

    it('adds a css class', function () {
        compile();
        expect(ngElement).toHaveClass('jqm-native-scrollable');
    });

});