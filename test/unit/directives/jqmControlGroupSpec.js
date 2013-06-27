"use strict";
describe('jqmControlgroup', function() {
    var ng, jqm, ngElement, jqmElement;
    beforeEach(function () {
        ng = testutils.ng;
        jqm = testutils.jqm;
        module('templates/jqmCheckbox.html');
    });

    describe('markup compared to jqm', function () {
        function compileAndCompareWithOption(option, legend) {
            var jqmMarkup;
            ngElement = ng.init('<fieldset jqm-controlgroup '+option+' legend="'+legend+'">'+'<div jqm-checkbox>chk1</div><div jqm-checkbox>chk2</div></fieldset>');
            jqmMarkup = '<fieldset data-role="controlgroup" '+option+'>';
            if (legend) {
                jqmMarkup += '<legend>'+legend+'</legend>';
            }
            jqmMarkup += '<label>chk1<input type="checkbox"></label><label>chk2<input type="checkbox"></label></fieldset>';
            jqmElement = jqm.init(jqmMarkup);
            testutils.compareElementRecursive(ngElement, jqmElement);
        }

        it('has same markup with multiple children', function() {
            compileAndCompareWithOption('','');
        });
        it('has same markup with type option', function() {
            compileAndCompareWithOption('data-type="horizontal"','');
        });
        it('has same markup with shadow option', function() {
            compileAndCompareWithOption('data-shadow="true"','');
        });
        it('has same markup with corners option', function() {
            compileAndCompareWithOption('data-corners="false"','');
        });
        it('has same markup with legend', function() {
            compileAndCompareWithOption('','someLegend');
        });
        it('has same markup with mini option', function() {
            compileAndCompareWithOption('data-mini="true"','');
        });
    });
});