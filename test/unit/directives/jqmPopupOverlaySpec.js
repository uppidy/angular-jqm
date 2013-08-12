"use strict";
describe('jqmPopupOverlay', function() {
    var el, scope, popup;
    beforeEach(inject(function($compile, $rootScope) {
        scope = $rootScope.$new();
        el = $compile('<div jqm-popup-overlay></div>')(scope);
        scope.$apply();

        popup = {
            hide: jasmine.createSpy('popup.hide'),
            opened: false,
            $theme: 'banana',
            overlayTheme: ''
        };
    }));

    it('should create an overlay', function() {
        expect(el).toHaveClass('ui-popup-screen');
    });

    it('should be hidden by default', function() {
        expect(el).not.toHaveClass('in');
        expect(el).toHaveClass('ui-screen-hidden');
    });

    it('should show when given $popupStateChanged and match popup theme', function() {
        popup.opened = true;
        scope.$root.$broadcast('$popupStateChanged', popup);
        scope.$apply();
        
        expect(el).toHaveClass('in');
        expect(el).not.toHaveClass('ui-screen-hidden');
        expect(el).toHaveClass('ui-overlay-banana');
    });

    it('should match popup overlayTheme if given', function() {
        popup.opened = true;
        popup.overlayTheme = 'mango';
        scope.$root.$broadcast('$popupStateChanged', popup);
        scope.$apply();

        expect(el).toHaveClass('ui-overlay-mango');
    });

    it('should hide if not-opened popup is given', function() {
        popup.opened = true;
        scope.$root.$broadcast('$popupStateChanged', popup);
        scope.$apply();
        expect(el).toHaveClass('in');
        expect(el).not.toHaveClass('ui-screen-hidden');

        popup.opened = false;
        scope.$root.$broadcast('$popupStateChanged', popup);
        scope.$apply();
        expect(el).toHaveClass('ui-screen-hidden');
    });

    it('should catch a click event and close the popup when opened', function() {
        popup.opened = true;
        scope.$root.$broadcast('$popupStateChanged', popup);
        scope.$apply();

        expect(popup.hide).not.toHaveBeenCalled();
        el.triggerHandler('click');
        expect(popup.hide).toHaveBeenCalled();
    });

});
