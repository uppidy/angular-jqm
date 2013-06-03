"use strict";
describe('jqmViewport', function () {
    var ng, jqm, somePage;

    function init(transition) {
        ng = testutils.ng;
        jqm = testutils.jqm;
        somePage = '/somePage';

        ng.init({
            '': { template: '<div jqm-page>initPage</div>' },
            '/somePage': {
                transition: transition,
                template: '<div jqm-page>somePage</div>'
            }
        });
        jqm.init({
            '': { template: '<div data-role="page">initPage</div>' },
            '/somePage': {
                transition: transition,
                template: '<div data-role="page">somePage</div>'
            }
        });
    }

    beforeEach(function () {
        // Always ignore the animations during
        // our tests here!
        module("jqm", function ($provide) {
            $provide.decorator("$sniffer", function ($delegate) {
                $delegate.animations = true;
                $delegate.cssTransform3d = true;
                return $delegate;
            });
        });
        var $ = testutils.jqm.$;
        $.support.cssTransitions = true;
        $.support.cssTransform3d = true;
    });

    describe('jqm - ng markup comparison', function () {
        it('generates same markup as jqm for none transition', function () {
            init('none');
            // check state on startup
            expect(ng.activePage().text()).toBe('initPage');
            expect(jqm.activePage().text()).toBe('initPage');
            testutils.compareElementRecursive(ng.viewPort, jqm.viewPort);

            // go to second page
            ng.beginTransitionTo(somePage);
            jqm.beginTransitionTo(somePage);
            testutils.compareElementRecursive(ng.viewPort, jqm.viewPort);
            expect(ng.activePage().text()).toBe('somePage');
            expect(jqm.activePage().text()).toBe('somePage');

            // go back
            jqm.historyGo(-1);
            expect(jqm.activePage().text()).toBe('initPage');
            ng.historyGo(-1);
            expect(ng.activePage().text()).toBe('initPage');
        });

        it('generates same markup as jqm during sequential transitions', function () {
            init('fade');
            // check state on startup
            expect(ng.activePage().text()).toBe('initPage');
            expect(jqm.activePage().text()).toBe('initPage');
            testutils.compareElementRecursive(ng.viewPort, jqm.viewPort);

            // go to second page
            ng.beginTransitionTo(somePage);
            jqm.beginTransitionTo(somePage);
            testutils.compareElementRecursive(ng.viewPort, jqm.viewPort);
            ng.fireAnimationEndEvents();
            jqm.fireAnimationEndEvents();
            testutils.compareElementRecursive(ng.viewPort, jqm.viewPort);
            ng.fireAnimationEndEvents();
            jqm.fireAnimationEndEvents();
            testutils.compareElementRecursive(ng.viewPort, jqm.viewPort);
            expect(ng.activePage().text()).toBe('somePage');
            expect(jqm.activePage().text()).toBe('somePage');

            // go back
            jqm.historyGo(-1);
            ng.historyGo(-1);
            testutils.compareElementRecursive(ng.viewPort, jqm.viewPort);
            ng.fireAnimationEndEvents();
            jqm.fireAnimationEndEvents();
            testutils.compareElementRecursive(ng.viewPort, jqm.viewPort);
            ng.fireAnimationEndEvents();
            jqm.fireAnimationEndEvents();
            testutils.compareElementRecursive(ng.viewPort, jqm.viewPort);
            expect(jqm.activePage().text()).toBe('initPage');
            expect(ng.activePage().text()).toBe('initPage');

        });
        it('generates same markup as jqm during parallel transitions', function () {
            init('slide');
            // check state on startup
            expect(ng.activePage().text()).toBe('initPage');
            expect(jqm.activePage().text()).toBe('initPage');
            testutils.compareElementRecursive(ng.viewPort, jqm.viewPort);

            // go to second page
            ng.beginTransitionTo(somePage);
            jqm.beginTransitionTo(somePage);
            testutils.compareElementRecursive(ng.viewPort, jqm.viewPort);
            ng.fireAnimationEndEvents();
            jqm.fireAnimationEndEvents();
            testutils.compareElementRecursive(ng.viewPort, jqm.viewPort);
            expect(ng.activePage().text()).toBe('somePage');
            expect(jqm.activePage().text()).toBe('somePage');

            // go back
            jqm.historyGo(-1);
            ng.historyGo(-1);
            testutils.compareElementRecursive(ng.viewPort, jqm.viewPort);
            ng.fireAnimationEndEvents();
            jqm.fireAnimationEndEvents();
            testutils.compareElementRecursive(ng.viewPort, jqm.viewPort);
            expect(ng.activePage().text()).toBe('initPage');
            expect(jqm.activePage().text()).toBe('initPage');
        });
    });

    describe('special cases', function() {
        it("should save the current route's transition into the history entry", inject(function($history) {
            var ng = testutils.ng,
                newRoute = { transition: 'newTransition' };
            ng.init('<div jqm-page></div>');

            $history.urlStack = [{},{},{}];
            $history.activeIndex = 1;
            ng.scope.$emit("$routeChangeStart", newRoute);
            expect($history.urlStack[1].transition).toBe(newRoute.transition);
        }));
        it('should use the same transition for entering and leaving a page when going back', inject(function($history) {
            var ng = testutils.ng,
                newRoute = { transition: 'newTransition' };
            ng.init('<div jqm-page></div>');

            $history.urlStack = [{},{
                transition: 'originalTransition'
            }];
            $history.activeIndex = 0;
            $history.previousIndex = 1;
            ng.scope.$emit("$routeChangeStart", newRoute);
            expect(ng.viewPort.attr("ng-animate")).toBe("'jqmPage-originalTransition-reverse'");
        }));
    });
});