"use strict";
describe('jqmPage', function() {
    var ng, jqm;
    beforeEach(function() {
        ng = testutils.ng;
        jqm = testutils.jqm;
    });

    describe('markup compared to jqm', function () {
        it('generates same markup as data-role="page", including dynamic classes for the viewport', function() {
            ng.init('<div jqm-page></div>');
            jqm.init('<div data-role="page"><div data-role="content"></div></div>');
            testutils.compareElementRecursive(ng.viewPort, jqm.viewPort);
        });
        it('generates same markup as data-role="page" when a theme is set, including dynamic classes for the viewport', function() {
            ng.init('<div jqm-page jqm-theme="a"></div>');
            jqm.init('<div data-role="page" data-theme="a"><div data-role="content"></div></div>');
            testutils.compareElementRecursive(ng.viewPort, jqm.viewPort);
        });
    });
    describe('details', function() {
        var jqmContent, ngElement;
        function compile(otherElements) {
            ngElement = ng.init('<div jqm-page>'+otherElements+'</div>');
            jqmContent = jqm.$(ngElement).children(".ui-content");
        }

        it('wraps content into a separate div', function() {
            compile('test');
            expect(jqmContent.text()).toBe('test');
        });
        it('adds a header class to the content if the page contains a header', function() {
            compile('<div jqm-header></div>');
            expect(jqmContent).toHaveClass('jqm-content-with-header');
        });
        it('keeps the header directly under the jqm-page', function() {
            compile('<div jqm-header>someHeader</div>');
            expect(jqm.$(ngElement).children(".ui-header").text()).toBe('someHeader');
        });
        it('adds a footer class to the content if the page contains a footer', function() {
            compile('<div jqm-footer></div>');
            expect(jqmContent).toHaveClass('jqm-content-with-footer');
        });
        it('keeps the footer directly under the jqm-page', function() {
            compile('<div jqm-footer>someFooter</div>');
            expect(jqm.$(ngElement).children(".ui-footer").text()).toBe('someFooter');
        });
        it('adds the jqm-scrollable directive', function() {
            var testClass = 'test-scrollable';
            module(function($compileProvider) {
                $compileProvider.directive('jqmScrollable', function() {
                    return {
                        restrict: 'A',
                        compile: function (element) {
                            element.addClass(testClass);
                        }
                    };
                });
            });
            compile('');
            expect(jqmContent).toHaveClass(testClass);
        });
    });
});