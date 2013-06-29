"use strict";
describe('jqmListview directive', function() {
    var ng, jqm, ngElement, jqmElement;
    beforeEach(function() {
        ng = testutils.ng;
        jqm = testutils.jqm;
        module('templates/jqmListview.html');
    });

    describe('markup compared to jqm', function() {
        function compileAndCompare(opt, opt2) {
            opt2 = opt2 || opt;
            ngElement = ng.init('<ul jqm-listview '+opt+'></ul>');
            jqmElement = jqm.init('<ul data-role="listview" '+opt2+'></ul>');
            testutils.compareElementRecursive(ngElement, jqmElement);
        }
        it('has same markup without options', function() {
            compileAndCompare('');
        });
        it('has same markup with inset', function() {
            compileAndCompare('data-inset="true"');
        });
        it('has same markup with all options', function() {
            compileAndCompare('data-inset="true" data-shadow="false" data-corners="false"');
        });
    });
});
