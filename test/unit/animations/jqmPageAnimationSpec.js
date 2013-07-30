"use strict";
describe('jqmPageAnimation', function () {
    /*global PAGE_ANIMATION_DEFS */

    var animationCompleteHandlers;

    function fireNextAnimationEvent() {
        angular.forEach(animationCompleteHandlers, function(entry) {
            entry.cb();
        });
    }

    function animationHandlerCount() {
        var count = 0;
        angular.forEach(animationCompleteHandlers, function(entry) {
            count++;
        });
        return count;
    }

    beforeEach(function () {
        var nextId = 0;
        animationCompleteHandlers = {};
        module(function ($provide) {
            $provide.factory('$animationComplete', function () {
                return function (element, callback) {
                    var id = nextId++;
                    animationCompleteHandlers[id] = {
                        el: element,
                        cb: callback
                    };
                    return function() {
                        delete animationCompleteHandlers[id];
                    };
                };
            });
        });
    });

    describe('parallel animations', function () {
        var enter, leave, enterEl, leaveEl, parentEl;
        beforeEach(function () {
            testutils.ng.enableAnimations(true);
            inject(function (pageSlideEnterAnimation, pageSlideLeaveAnimation) {
                enter = pageSlideEnterAnimation;
                leave = pageSlideLeaveAnimation;
                enterEl = angular.element('<div></div>');
                leaveEl = angular.element('<div class="ui-page-active"></div>');
                parentEl = angular.element('<div></div>').append(enterEl).append(leaveEl);
            });
        });
        describe('setup', function () {
            it('adds the correct classes when enter is called before leave', function () {
                enter.setup(enterEl);
                testutils.ng.tick(1);
                expect(enterEl.prop("className")).toBe('ui-page-active slide in');
                expect(parentEl.prop("className")).toBe('ui-mobile-viewport-transitioning viewport-slide');

                leave.setup(leaveEl);
                expect(leaveEl.prop("className")).toBe('ui-page-active slide out');
            });
            it('adds the correct classes when leave is called before enter', function () {
                leave.setup(leaveEl);
                testutils.ng.tick(1);
                expect(leaveEl.prop("className")).toBe('ui-page-active slide out');
                expect(parentEl.prop("className")).toBe('ui-mobile-viewport-transitioning viewport-slide');

                enter.setup(enterEl);
                expect(enterEl.prop("className")).toBe('ui-page-active slide in');
            });
            it('removes the classes after animationComplete', function () {
                enter.setup(enterEl);
                testutils.ng.tick(1);

                leave.setup(leaveEl);
                fireNextAnimationEvent();
                fireNextAnimationEvent();
                expect(enterEl.prop("className")).toBe('ui-page-active');

                expect(leaveEl.prop("className")).toBe('');
                expect(parentEl.prop("className")).toBe('');
            });
        });
        describe('start', function () {
            var enterFinished, leaveFinished;
            beforeEach(function () {
                enterFinished = jasmine.createSpy('enterFinished');
                leaveFinished = jasmine.createSpy('leaveFinished');
            });
            it('calls the given callback if both animations are already complete', function () {
                var enterMemento = enter.setup(enterEl);
                var leaveMemento = leave.setup(leaveEl);
                testutils.ng.tick(1);
                fireNextAnimationEvent();
                fireNextAnimationEvent();
                enter.start(enterEl, enterFinished, enterMemento);
                expect(enterFinished).toHaveBeenCalled();
                leave.start(leaveEl, leaveFinished, leaveMemento);
                expect(leaveFinished).toHaveBeenCalled();
            });
            it('calls the given callback after both animations are complete', function () {
                var enterMemento = enter.setup(enterEl);
                var leaveMemento = leave.setup(leaveEl);
                testutils.ng.tick(1);
                enter.start(enterEl, enterFinished, enterMemento);
                leave.start(leaveEl, leaveFinished, leaveMemento);
                expect(enterFinished).not.toHaveBeenCalled();
                expect(leaveFinished).not.toHaveBeenCalled();

                fireNextAnimationEvent();
                expect(enterFinished).not.toHaveBeenCalled();
                expect(leaveFinished).not.toHaveBeenCalled();

                fireNextAnimationEvent();
                expect(enterFinished).toHaveBeenCalled();
                expect(leaveFinished).toHaveBeenCalled();
            });
        });
    });
    describe('sequential animations', function () {
        var enter, leave, enterEl, leaveEl, parentEl;
        beforeEach(function () {
            testutils.ng.enableAnimations(true);
            inject(function (pageFadeEnterAnimation, pageFadeLeaveAnimation) {
                enter = pageFadeEnterAnimation;
                leave = pageFadeLeaveAnimation;
                enterEl = angular.element('<div></div>');
                leaveEl = angular.element('<div class="ui-page-active"></div>');
                parentEl = angular.element('<div></div>').append(enterEl).append(leaveEl);
            });
        });
        describe('enter', function () {
            it('adds the correct classes when enter is called before leave', function () {
                enter.setup(enterEl);
                expect(enterEl.prop("className")).toBe('');
                expect(parentEl.prop("className")).toBe('ui-mobile-viewport-transitioning viewport-fade');

                leave.setup(leaveEl);
                expect(leaveEl.prop("className")).toBe('ui-page-active fade out');

                fireNextAnimationEvent();
                expect(enterEl.prop("className")).toBe('ui-page-active fade in');
            });
            it('adds the correct classes when leave is called before enter', function () {
                leave.setup(leaveEl);
                testutils.ng.tick(1);
                expect(leaveEl.prop("className")).toBe('ui-page-active fade out');
                expect(parentEl.prop("className")).toBe('ui-mobile-viewport-transitioning viewport-fade');

                enter.setup(enterEl);
                expect(enterEl.prop("className")).toBe('');

                fireNextAnimationEvent();
                expect(enterEl.prop("className")).toBe('ui-page-active fade in');
            });
            it('removes the classes after animationComplete', function () {
                enter.setup(enterEl);
                leave.setup(leaveEl);
                testutils.ng.tick(1);

                fireNextAnimationEvent();
                expect(leaveEl.prop("className")).toBe('');

                fireNextAnimationEvent();
                expect(enterEl.prop("className")).toBe('ui-page-active');
                expect(parentEl.prop("className")).toBe('');
            });

            it('detects if there is not leave animation and start the enter animation alone', function() {
                enter.setup(enterEl);
                testutils.ng.tick(1);
                expect(enterEl.prop("className")).toBe('ui-page-active fade in');
            });
        });
        describe('start', function () {
            var enterFinished, leaveFinished;
            beforeEach(function () {
                enterFinished = jasmine.createSpy('enterFinished');
                leaveFinished = jasmine.createSpy('leaveFinished');
            });
            it('calls the given callback if both animations are already complete', function () {
                var enterMemento = enter.setup(enterEl);
                var leaveMemento = leave.setup(leaveEl);
                fireNextAnimationEvent();
                fireNextAnimationEvent();
                enter.start(enterEl, enterFinished, enterMemento);
                expect(enterFinished).toHaveBeenCalled();
                leave.start(leaveEl, leaveFinished, leaveMemento);
                expect(leaveFinished).toHaveBeenCalled();
            });
            it('calls the given callback after both animations are complete', function () {
                var enterMemento = enter.setup(enterEl);
                var leaveMemento = leave.setup(leaveEl);
                enter.start(enterEl, enterFinished, enterMemento);
                leave.start(leaveEl, leaveFinished, leaveMemento);
                expect(enterFinished).not.toHaveBeenCalled();
                expect(leaveFinished).not.toHaveBeenCalled();

                fireNextAnimationEvent();
                expect(enterFinished).not.toHaveBeenCalled();
                expect(leaveFinished).not.toHaveBeenCalled();

                fireNextAnimationEvent();
                expect(enterFinished).toHaveBeenCalled();
                expect(leaveFinished).toHaveBeenCalled();
            });
        });
    });
    describe('none animation', function() {
        var enter, leave, enterEl, leaveEl, parentEl;
        beforeEach(function () {
            testutils.ng.enableAnimations(true);
            inject(function (pageNoneEnterAnimation, pageNoneLeaveAnimation) {
                enter = pageNoneEnterAnimation;
                leave = pageNoneLeaveAnimation;
                enterEl = angular.element('<div></div>');
                leaveEl = angular.element('<div class="ui-page-active"></div>');
                parentEl = angular.element('<div></div>').append(enterEl).append(leaveEl);
            });
        });
        describe('enter', function () {
            it('adds the correct classes', function () {
                enter.setup(enterEl);
                expect(enterEl.prop("className")).toBe('ui-page-active');
                expect(parentEl.prop("className")).toBe('');
            });

            it('removes the correct classes', function () {
                leave.setup(leaveEl);
                expect(leaveEl.prop("className")).toBe('');
            });
        });
        describe('start', function () {
            var enterFinished, leaveFinished;
            beforeEach(function () {
                enterFinished = jasmine.createSpy('enterFinished');
                leaveFinished = jasmine.createSpy('leaveFinished');
            });
            it('calls the given callback immediately', function () {
                enter.start(enterEl, enterFinished, null);
                expect(enterFinished).toHaveBeenCalled();
                leave.start(leaveEl, leaveFinished, null);
                expect(leaveFinished).toHaveBeenCalled();
            });
        });
    });
    describe('disabled animations', function () {
        var animation, parentEl, scope;
        beforeEach(function () {
            testutils.ng.enableAnimations(false);
            inject(function ($rootScope, $animator) {
                scope = $rootScope.$new();
                animation = $animator(scope, {ngAnimate: "'slide'"});
                parentEl = angular.element('<div></div>');
            });
        });
        it('adds the correct classes even for mixed elements', function () {
            var elements = angular.element('<div>a<div class="ui-page"></div>b</div>').contents();
            animation.enter(elements, parentEl);
            expect(elements.eq(1).prop("className")).toBe('ui-page ui-page-active');
        });

        it('removes the correct classes', function () {
            var elements = angular.element('<div>a<div class="ui-page ui-page-active"></div>b</div>').contents();
            animation.leave(elements, parentEl);
            expect(elements.eq(1).prop("className")).toBe('ui-page');
        });

    });
    describe('no animations', function () {
        var animation, parentEl, scope;
        beforeEach(function () {
            testutils.ng.enableAnimations(false);
            inject(function ($rootScope, $animator) {
                scope = $rootScope.$new();
                animation = $animator(scope, {ngAnimate: "''"});
                parentEl = angular.element('<div></div>');
            });
        });
        it('adds the correct classes even for mixed elements', function () {
            var elements = angular.element('<div>a<div class="ui-page"></div>b</div>').contents();
            animation.enter(elements, parentEl);
            expect(elements.eq(1).prop("className")).toBe('ui-page ui-page-active');
        });

        it('removes the correct classes', function () {
            var elements = angular.element('<div>a<div class="ui-page ui-page-active"></div>b</div>').contents();
            animation.leave(elements, parentEl);
            expect(elements.eq(1).prop("className")).toBe('ui-page');
        });

    });
    describe('animation degradation', function() {
        describe('no 3d animations', function() {
            var enter, leave, enterEl, leaveEl, parentEl;
            beforeEach(function () {
                testutils.ng.enableAnimations("basic");
                inject(function (pageSlideEnterAnimation, pageSlideLeaveAnimation) {
                    enter = pageSlideEnterAnimation;
                    leave = pageSlideLeaveAnimation;
                    enterEl = angular.element('<div></div>');
                    leaveEl = angular.element('<div class="ui-page-active"></div>');
                    parentEl = angular.element('<div></div>').append(enterEl).append(leaveEl);
                });
            });
            it('uses the animation fallback', function() {
                expect(PAGE_ANIMATION_DEFS.slide.fallback).toBe('fade');
                enter.setup(enterEl);
                leave.setup(leaveEl);

                expect(parentEl.prop("className")).toBe('ui-mobile-viewport-transitioning viewport-fade');
                expect(enterEl.prop("className")).toBe('');
                expect(leaveEl.prop("className")).toBe('ui-page-active fade out');
            });
        });
        describe('no animations', function() {
            var enter, leave, enterEl, leaveEl, parentEl;
            beforeEach(function () {
                testutils.ng.enableAnimations(false);
                inject(function (pageSlideEnterAnimation, pageSlideLeaveAnimation) {
                    enter = pageSlideEnterAnimation;
                    leave = pageSlideLeaveAnimation;
                    enterEl = angular.element('<div></div>');
                    leaveEl = angular.element('<div class="ui-page-active"></div>');
                    parentEl = angular.element('<div></div>').append(enterEl).append(leaveEl);
                });
            });
            it('uses the none transition', function() {
                enter.setup(enterEl);
                leave.setup(leaveEl);

                expect(parentEl.prop("className")).toBe('');
                expect(enterEl.prop("className")).toBe('ui-page-active');
                expect(leaveEl.prop("className")).toBe('');
            });
        });
    });

    describe('animation abort', function() {
        it('should abort a running animation if a new one is started', function() {
            testutils.ng.enableAnimations(true);
            inject(function($rootScope, $compile, $templateCache, $animator) {
                $animator.enabled(true);
                $templateCache.put('/page1', '<div jqm-page>1</div>');
                $templateCache.put('/page2', '<div jqm-page>2</div>');
                $templateCache.put('/page3', '<div jqm-page>3</div>');
                var scope = $rootScope.$new();
                var viewEl = $compile('<div jqm-view="route"></div>')(scope);
                scope.route = { templateUrl: '/page1'};
                $rootScope.$apply();
                scope.route = { templateUrl: '/page2', animation: 'page-slide'};
                $rootScope.$apply();
                testutils.ng.tick(10);
                var page1El = viewEl.children().eq(0);
                expect(page1El.text()).toBe('1');
                var page2El = viewEl.children().eq(1);
                expect(page2El.text()).toBe('2');

                expect(viewEl).toHaveClass('viewport-slide');
                expect(page1El).toHaveClass('slide out ui-page-active');
                expect(page2El).toHaveClass('slide in ui-page-active');

                expect(animationHandlerCount()).toBe(1);
                scope.route = { templateUrl: '/page3', animation: 'page-fade'};
                $rootScope.$apply();
                testutils.ng.tick(10);
                var page3El = viewEl.children().eq(1);
                expect(viewEl.text()).toBe('23');
                expect(page3El.text()).toBe('3');
                expect(viewEl).toHaveClass('viewport-fade');
                expect(viewEl).not.toHaveClass('viewport-slide');
                expect(page2El).toHaveClass('fade out ui-page-active');
                expect(page2El).not.toHaveClass('slide in');
                fireNextAnimationEvent();
                expect(page3El).toHaveClass('fade in ui-page-active');
                expect(page3El).not.toHaveClass('slide out');
                fireNextAnimationEvent();
                expect(page1El).not.toHaveClass('slide fade in out ui-page-active');
                expect(page2El).not.toHaveClass('slide fade in out ui-page-active');
                expect(page3El).not.toHaveClass('slide in out');
                expect(page3El).toHaveClass('ui-page-active');
                expect(animationHandlerCount()).toBe(0);
            });
        });
    });
});