"use strict";
describe('jqmFieldcontain', function() {
    var ng, jqm, ngElement, jqmElement;
    beforeEach(function () {
        ng = testutils.ng;
        jqm = testutils.jqm;
    });

    describe('markup compared to jqm', function () {
        it('has same markup with any content', function() {
            ngElement = ng.init('<div jqm-fieldcontain></div>');
            jqmElement = jqm.init('<div data-role="fieldcontain"></div>');
            testutils.compareElementRecursive(ngElement, jqmElement);
        });
        it('has same markup with label and textinput', function() {
            ngElement = ng.init('<div jqm-fieldcontain><label for="name">Your Name:</label><div jqm-textinput ng-model="name" /></div>');
            jqmElement = jqm.init('<div data-role="fieldcontain"><label for="name">Your Name:</label><input type="text" name="name" /></div>');
            testutils.compareElementRecursive(ngElement, jqmElement);
        });
    });
});