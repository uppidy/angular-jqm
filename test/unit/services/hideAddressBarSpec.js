"use strict";
describe('$hideAddressBar', function () {
    var $window, eventListeners, $rootElement;
    beforeEach(function () {
        $window = angular.mock.createMockWindow();
        setOrientation("vertical");
        $window.clearTimeout = jasmine.createSpy('clearTimeout');
        eventListeners = {};
        $window.addEventListener = function (eventName, callback) {
            var listeners = eventListeners[eventName] = eventListeners[eventName] || [];
            listeners.push(callback);
        };
        $window.removeEventListener = function (eventName, callback) {
            var listeners = eventListeners[eventName] = eventListeners[eventName] || [];
            var index = listeners.indexOf(callback);
            if (~index) {
                listeners.splice(index, 1);
            }
        };
        $rootElement = angular.element('<div></div>');
        module(function ($provide) {
            $provide.value('$window', $window);
            $provide.value('$rootElement', $rootElement);
        });
    });
    function triggerWindowEvent(eventName) {
        angular.forEach(eventListeners[eventName], function (listener) {
            listener();
        });
    }

    function setOrientation(orientation) {
        if (orientation==='horizontal') {
            $window.innerHeight = 300;
            $window.innerWidth = 400;
        } else {
            $window.innerHeight = 400;
            $window.innerWidth = 300;
        }
    }

    it('does not set a height if the browser is a desktop browser', function () {
        $window.innerHeight = 1000;
        inject(function ($hideAddressBar) {
            $hideAddressBar();
            expect($rootElement.css('height')).toBe('');
        });
    });
    describe('first Call', function () {
        it('sets a high doc height, waits for a timeout and updates the doc height', inject(function ($hideAddressBar) {
            $hideAddressBar();
            expect($rootElement.css('height')).toBe('800px');
            $window.setTimeout.expect(400).process();
            expect($rootElement.css('height')).toBe($window.innerHeight + "px");
            // should clear the scroll listeners and timeouts
            expect(eventListeners.scroll.length).toBe(0);
            expect($window.clearTimeout).toHaveBeenCalled();
        }));
        it('sets a high doc height, waits for a scroll and updates the doc height', inject(function ($hideAddressBar) {
            $hideAddressBar();
            expect($rootElement.css('height')).toBe('800px');
            triggerWindowEvent('scroll');
            expect($rootElement.css('height')).toBe($window.innerHeight + "px");
            // should clear the scroll listeners and timeouts
            expect(eventListeners.scroll.length).toBe(0);
            expect($window.clearTimeout).toHaveBeenCalled();
        }));
        it('first scrolls to 0,1 and then to 0,0 on iOS', inject(function ($hideAddressBar) {
            spyOn($window, 'scrollTo');
            $hideAddressBar();
            expect($window.scrollTo).toHaveBeenCalledWith(0, 1);
            $window.pageYOffset = 1;
            triggerWindowEvent('scroll');
            expect($window.scrollTo.callCount).toBe(2);
            expect($window.scrollTo).toHaveBeenCalledWith(0, 0);
        }));
        it('scrolls to 0,1 only once on Android', inject(function ($hideAddressBar) {
            spyOn($window, 'scrollTo');
            $hideAddressBar();
            expect($window.scrollTo).toHaveBeenCalledWith(0, 1);
            $window.pageYOffset = 0;
            triggerWindowEvent('scroll');
            expect($window.scrollTo.callCount).toBe(1);
        }));
    });
    describe('second call', function() {
        function init(pageYOffsetAfterScroll, changeOrientation) {
            inject(function($hideAddressBar) {
                setOrientation("vertical");
                $hideAddressBar();
                expect($rootElement.css('height')).toBe('800px');
                $window.pageYOffset = pageYOffsetAfterScroll;
                $window.setTimeout.expect(400).process();
                if (changeOrientation) {
                    setOrientation("horizontal");
                }
            });
        }

        describe('same orientation', function() {
            it('sets the cached doc height and does not change it after a timeout', inject(function ($hideAddressBar) {
                init(0, false);
                $hideAddressBar();
                expect($rootElement.css('height')).toBe($window.innerHeight + "px");
                spyOn($rootElement, 'css');
                $window.setTimeout.expect(400).process();
                expect($rootElement.css.callCount).toBe(0);
                // should still clear the scroll listeners and timeouts
                expect(eventListeners.scroll.length).toBe(0);
                expect($window.clearTimeout).toHaveBeenCalled();
            }));
            it('scrolls to 0,0 on iOS only once', inject(function ($hideAddressBar) {
                init(1, false);
                spyOn($window, 'scrollTo');
                $hideAddressBar();
                expect($window.scrollTo).toHaveBeenCalledWith(0, 0);
                expect($window.scrollTo.callCount).toBe(1);
            }));
            it('scrolls to 0,1 only once on Android', inject(function ($hideAddressBar) {
                init(0, false);
                spyOn($window, 'scrollTo');
                $hideAddressBar();
                expect($window.scrollTo).toHaveBeenCalledWith(0, 1);
                expect($window.scrollTo.callCount).toBe(1);
            }));
        });
        describe('other orientation', function() {

            it('sets a high doc height, waits for a timeout and updates the doc height', inject(function ($hideAddressBar) {
                init(0, true);
                $hideAddressBar();
                expect($rootElement.css('height')).toBe('800px');
                $window.setTimeout.expect(400).process();
                expect($rootElement.css('height')).toBe($window.innerHeight + "px");
                // should clear the scroll listeners and timeouts
                expect(eventListeners.scroll.length).toBe(0);
                expect($window.clearTimeout).toHaveBeenCalled();
            }));
            it('scrolls to 0,0 on iOS only once', inject(function ($hideAddressBar) {
                init(1, true);
                spyOn($window, 'scrollTo');
                $hideAddressBar();
                expect($window.scrollTo).toHaveBeenCalledWith(0, 0);
                expect($window.scrollTo.callCount).toBe(1);
            }));
            it('scrolls to 0,1 only once on Android', inject(function ($hideAddressBar) {
                init(0, true);
                spyOn($window, 'scrollTo');
                $hideAddressBar();
                expect($window.scrollTo).toHaveBeenCalledWith(0, 1);
                expect($window.scrollTo.callCount).toBe(1);
            }));

        });
    });


});