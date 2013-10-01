"use strict";
describe('jqmPage', function () {
    var ng, jqm;
    beforeEach(function () {
        ng = testutils.ng;
        jqm = testutils.jqm;
    });

    describe('markup compared to jqm', function () {
        it('generates same markup as data-role="page", including dynamic classes for the viewport', function () {
            ng.init('<div jqm-page></div>');
            jqm.init('<div data-role="page"><div data-role="content"></div></div>');
            testutils.compareElementRecursive(ng.viewPort, jqm.viewPort);
        });
        it('generates same markup as data-role="page" when a theme is set, including dynamic classes for the viewport', function () {
            ng.init('<div jqm-page jqm-theme="a"></div>');
            jqm.init('<div data-role="page" data-theme="a"><div data-role="content"></div></div>');
            testutils.compareElementRecursive(ng.viewPort, jqm.viewPort);
        });
    });
    describe('details', function () {
        var jqmContent, ngElement;

        function compile(otherElements) {
            ngElement = ng.init('<div jqm-page>' + otherElements + '</div>');
            jqmContent = jqm.$(ngElement).children(".ui-content");
        }

        it('wraps content into a separate div', function () {
            compile('test');
            expect(jqmContent.text()).toBe('test');
        });
        it('adds a header class to the content if the page contains a header', function () {
            compile('<div jqm-header></div>');
            expect(jqmContent).toHaveClass('jqm-content-with-header');
        });
        it('keeps the header directly under the jqm-page', function () {
            compile('<div jqm-header>someHeader</div>');
            expect(jqm.$(ngElement).children(".ui-header").text()).toBe('someHeader');
        });
        it('adds a footer class to the content if the page contains a footer', function () {
            compile('<div jqm-footer></div>');
            expect(jqmContent).toHaveClass('jqm-content-with-footer');
        });
        it('keeps the footer directly under the jqm-page', function () {
            compile('<div jqm-footer>someFooter</div>');
            expect(jqm.$(ngElement).children(".ui-footer").text()).toBe('someFooter');
        });
        it('calls the $scroller service for the content', function () {
            var $scroller = jasmine.createSpy('$scroller');
            module(function ($provide) {
                $provide.value('$scroller', $scroller);
            });
            compile('');
            expect($scroller).toHaveBeenCalled();
            expect($scroller.mostRecentCall.args[0][0]).toBe(jqmContent[0]);
        });
    });
    describe('persistent footer/header', function () {
        var scope, jqmContent, viewEl;

        function compile(otherElements) {
            inject(function($compile, $rootScope, $templateCache) {
                $templateCache.put('/someTemplateUrl', '<div jqm-page></div>');
                scope = $rootScope.$new();
                viewEl = $compile('<div jqm-view="\'/someTemplateUrl\'">'+otherElements+'</div>')(scope);
                scope.$digest();
                jqmContent = viewEl.children().eq(1).children().eq(0);
                expect(jqmContent).toHaveClass("ui-content");
            });
        }

        it('adds a header class to the content if the page contains a header as sibling', function () {
            compile('<div jqm-header></div>');
            expect(jqmContent).toHaveClass('jqm-content-with-header');
        });
        it('adds a footer class to the content if the page contains a footer', function () {
            compile('<div jqm-footer></div>');
            expect(jqmContent).toHaveClass('jqm-content-with-footer');
        });
    });
});
describe('jqmPage controller', function() {
    var el, scope, pageCtrl, transformer;

    function compile(html) {
        inject(function($compile, $rootScope) {
            scope = $rootScope.$new();
            el = $compile(html)(scope);
            $rootScope.$digest();
        });
    }
    beforeEach(module(function($compileProvider) {
        $compileProvider.directive('pageChild', function() {
            return {
                require: '^jqmPage',
                link: function(scope, elm, attr, ctrl) {
                    pageCtrl = ctrl;
                }
            };
        });
    }));

    beforeEach(inject(function($transformer, $nextFrame) {
        compile('<div jqm-page><div page-child></div></div>');
        transformer = $transformer(angular.element(el[0].querySelector('.ui-content')));
    }));

    it('page method gives $transformer.pos with args',  function() {
        expect(pageCtrl.scroll()).toEqual(transformer.pos);
        transformer.setTo({x:0,y:-50});
        expect(pageCtrl.scroll()).toEqual({x:0,y:-50});
    });

    it('page method calls setTo with one arg', function() {
        pageCtrl.scroll(-50);
        expect(transformer.pos.y).toBe(-50);
    });

    it('page method with two args calls easeTo', function() {
        spyOn(transformer, 'easeTo').andCallThrough();
        pageCtrl.scroll({x:0,y:-50}, 50);
        expect(transformer.easeTo).toHaveBeenCalledWith({x:0,y:-50}, 50);
    });
});
