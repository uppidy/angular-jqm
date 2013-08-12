"use strict";
describe('jqmPopup', function() {
    //We can't really test us versus jqm popups because jqm popups are
    //just too complex to setup
    var el, scope;
    function compile(popupModel, attr) {
        inject(function($rootScope, $compile) {
            scope = $rootScope.$new();
            el = $compile('<div jqm-popup="'+popupModel+'" '+(attr||'')+'></div>')(scope);
            scope.$apply();
        });
    }

    var target;
    beforeEach(function() {
        target = angular.element('<div>');
        compile('poppy', 'animation="banana"');
    });

    it('should create a popup scope with show, hide, opened', function() {
        expect(scope.poppy).toBeDefined();
        expect(scope.poppy.opened).toBe(false);
        expect(typeof scope.poppy.show).toBe('function');
        expect(typeof scope.poppy.hide).toBe('function');
    });

    it('should be hidden by default', function() {
        expect(el).toHaveClass('ui-popup-hidden');
    });

    it('should give animation class', function() {
        expect(el).toHaveClass('banana');
    });

    it('should append a jqmPopupOverlay to $rootElement', inject(function($rootElement) {
        var overlay = angular.element($rootElement[0].querySelector('.ui-popup-screen'));
        expect(overlay.length).toBe(1);
        expect(overlay.parent()[0]).toBe($rootElement[0]);
    }));

    describe('show and hide', function() {

        it('should show', function() {
            scope.poppy.show(target);
            expect(scope.poppy.opened).toBe(true);
            expect(scope.poppy.target[0]).toBe(target[0]);
            expect(el).toHaveClass('in');

            el.triggerHandler('animationend');
            expect(el).toHaveClass('ui-popup-active');
        });
        it('should hide', function() {
            scope.poppy.show(target);
            el.triggerHandler('animationend');
            
            scope.poppy.hide();
            expect(scope.poppy.opened).toBe(false);
            expect(scope.poppy.target).toBeFalsy();
            expect(el).toHaveClass('out');

            el.triggerHandler('animationend');
            expect(el).toHaveClass('ui-popup-hidden');
        });
        it('hideForElement should only hide if given element is current target', function() {
            spyOn(scope.poppy, 'hide').andCallThrough();
            scope.poppy.show(target);

            scope.poppy.hideForElement(null);
            expect(scope.poppy.hide).not.toHaveBeenCalled();

            scope.poppy.hideForElement(angular.element('<div>'));
            expect(scope.poppy.hide).not.toHaveBeenCalled();

            scope.poppy.hideForElement(target);
            expect(scope.poppy.hide).toHaveBeenCalled();
        });
    });

    describe('event broadcast', function() {
        var spy;
        beforeEach(inject(function($rootScope) {
            //Don't make the spy be called with the $event object for
            //easier testing
            spy = jasmine.createSpy('$panelStateChanged');
            $rootScope.$on('$popupStateChanged', function($e, popup) {
                spy(popup);
            });
        }));

        it('should broadcast event on open', function() {
            scope.poppy.show(target);
            expect(spy).toHaveBeenCalledWith(scope.poppy);
        });
        it('should broadcast event on close', function() {
            scope.poppy.hide(target);
            expect(spy).toHaveBeenCalledWith(scope.poppy);

            spy.reset();
            scope.poppy.show(target);
            expect(spy).toHaveBeenCalledWith(scope.poppy);

            spy.reset();
            scope.poppy.hide(target);
            expect(spy).toHaveBeenCalledWith(scope.poppy);
        });
    });

    describe('positioning', function() {
        //TODO test positioning with insane mocking 
    });
});
