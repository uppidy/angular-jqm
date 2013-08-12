"use strict";
describe('jqmPopupTarget', function() {
    var popup, el, scope, target;
    beforeEach(inject(function($compile, $rootScope) {
        scope = $rootScope.$new();
        popup = {
            show: jasmine.createSpy('popup.show').andCallFake(function() {
                popup.opened = true;
                popup.target = target;
            }),
            hideForElement: jasmine.createSpy('popup.hideForElement').andCallFake(function() {
                popup.opened = false;
                popup.target = null;
            }),
            opened: false,
            target: null
        };
        scope.poppy = popup;
        target = $compile('<div jqm-popup-target="poppy" jqm-popup-model="pop" jqm-popup-placement="right">')(scope);
        scope.$apply();
    }));

    describe('model', function() {
        it('should have model falsy by default', function() {
            expect(scope.pop).toBeFalsy();
        });
        it('should show when pop=true', function() {
            scope.$apply('pop=true');
            expect(popup.show).toHaveBeenCalled();
        });
        it('should hide when pop=false', function() {
            scope.$apply('pop=true');
            scope.$apply('pop=false');
            expect(popup.hideForElement).toHaveBeenCalled();
            
            popup.hideForElement.reset();
            scope.$apply('pop=false');
            expect(popup.hideForElement).not.toHaveBeenCalled();
        });

        it('should pass in attr.jqmPopupPlacement with show', function() {
            scope.$apply('pop=true');
            expect(popup.show.mostRecentCall.args[1]).toBe('right');
        });
    });

    describe('$popupStateChanged', function() {
        it('should do nothing if popupStateChanged is called for different popup', function() {
            scope.$apply('pop=true');
            scope.$root.$broadcast('$popupStateChanged', {different: 'popup'});
            expect(scope.pop).toBe(true);
        });

        it('should show if popupStateChanged is called with shown popup and same target', function() {
            popup.target = target;
            popup.opened = true;
            scope.$root.$broadcast('$popupStateChanged', popup);
            expect(scope.pop).toBe(true);
        });

        it('should hide if popupStateChanged is called with closed popup and same target', function() {
            scope.$apply('pop = true');
            popup.target = target;
            popup.opened = false;
            scope.$root.$broadcast('$popupStateChanged', popup);
            expect(scope.pop).toBe(false);
        });
        it('should hide if popupStateChanged is called with open popup and different target', function() {
            scope.$apply('pop = true');
            popup.target = angular.element('<div>');
            popup.opened = true;
            scope.$root.$broadcast('$popupStateChanged', popup);
            expect(scope.pop).toBe(false);
        });
    });

});
