"use strict";
describe('jqmPageAnimation markup comparison with jqm', function () {
    var ng, jqm, somePage;

    function init(animation) {
        somePage = '/somePage';

        ng.init({
            '': { template: '<div jqm-page>initPage</div>' },
            '/somePage': {
                animation: 'page-'+animation,
                template: '<div jqm-page>somePage</div>'
            }
        });
        jqm.init({
            '': { template: '<div data-role="page"><div data-role="content">initPage</div></div>' },
            '/somePage': {
                animation: animation,
                template: '<div data-role="page"><div data-role="content">somePage</div></div>'
            }
        });
    }

    beforeEach(function () {
        ng = testutils.ng;
        jqm = testutils.jqm;
    });

    function compareViewports() {
        testutils.compareElementRecursive(ng.viewPort, jqm.viewPort, /^page-.*/);
    }

    describe('with animations', function () {
        beforeEach(function () {
            ng.enableAnimations(true);
            jqm.enableAnimations(true);
        });

        describe('markup', function () {
            it('generates same markup as jqm for none transition', function () {
                init('none');
                // check state on startup
                expect(ng.activePage().text()).toBe('initPage');
                expect(jqm.activePage().text()).toBe('initPage');
                testutils.compareElementRecursive(ng.viewPort, jqm.viewPort, '^page-*');

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
                compareViewports();

                // go to second page
                ng.beginTransitionTo(somePage);
                jqm.beginTransitionTo(somePage);
                compareViewports();
                ng.fireAnimationEndEvents();
                jqm.fireAnimationEndEvents();
                compareViewports();
                ng.fireAnimationEndEvents();
                jqm.fireAnimationEndEvents();
                compareViewports();
                expect(ng.activePage().text()).toBe('somePage');
                expect(jqm.activePage().text()).toBe('somePage');

                // go back
                jqm.historyGo(-1);
                ng.historyGo(-1);
                compareViewports();
                ng.fireAnimationEndEvents();
                jqm.fireAnimationEndEvents();
                compareViewports();
                ng.fireAnimationEndEvents();
                jqm.fireAnimationEndEvents();
                compareViewports();
                expect(jqm.activePage().text()).toBe('initPage');
                expect(ng.activePage().text()).toBe('initPage');

            });
            it('generates same markup as jqm during parallel transitions', function () {
                init('slide');
                // check state on startup
                expect(ng.activePage().text()).toBe('initPage');
                expect(jqm.activePage().text()).toBe('initPage');
                compareViewports();

                // go to second page
                ng.beginTransitionTo(somePage);
                jqm.beginTransitionTo(somePage);
                compareViewports();
                ng.fireAnimationEndEvents();
                jqm.fireAnimationEndEvents();
                compareViewports();
                expect(ng.activePage().text()).toBe('somePage');
                expect(jqm.activePage().text()).toBe('somePage');

                // go back
                jqm.historyGo(-1);
                ng.historyGo(-1);
                compareViewports();
                ng.fireAnimationEndEvents();
                jqm.fireAnimationEndEvents();
                compareViewports();
                expect(ng.activePage().text()).toBe('initPage');
                expect(jqm.activePage().text()).toBe('initPage');
            });
        });

    });

    describe('without animations', function() {
        beforeEach(function () {
            ng.enableAnimations(false);
            jqm.enableAnimations(false);
        });
        it('generates same markup as jqm', function () {
            init('fade');
            // check state on startup
            expect(ng.activePage().text()).toBe('initPage');
            expect(jqm.activePage().text()).toBe('initPage');
            compareViewports();

            // go to second page
            ng.beginTransitionTo(somePage);
            jqm.beginTransitionTo(somePage);
            compareViewports();
            expect(ng.activePage().text()).toBe('somePage');
            expect(jqm.activePage().text()).toBe('somePage');

            // go back
            jqm.historyGo(-1);
            expect(jqm.activePage().text()).toBe('initPage');
            ng.historyGo(-1);
            expect(ng.activePage().text()).toBe('initPage');
        });

    });
});