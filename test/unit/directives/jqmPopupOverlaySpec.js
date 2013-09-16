"use strict";
describe('jqmPopupOverlay', function() {
    var el, scope;
    beforeEach(inject(function($compile, $rootScope) {
        scope = angular.extend($rootScope.$new(), {
            $$scopeAs: 'jqmPopup',
            hide: jasmine.createSpy('popup.hide'),
            opened: false,
            $theme: 'banana',
            overlayTheme: ''
        });
        el = $compile('<div jqm-popup-overlay></div>')(scope);
        scope.$apply();

    }));

    it('should create an overlay', function() {
        expect(el).toHaveClass('ui-popup-screen');
    });

    it('should be hidden by default', function() {
        expect(el).not.toHaveClass('in');
        expect(el).toHaveClass('ui-screen-hidden');
    });

    it('should show when given popup scope opens and have overlayTheme', function() {
        scope.opened = true;
        scope.$apply();
        
        expect(el).toHaveClass('in');
        expect(el).not.toHaveClass('ui-screen-hidden');
        expect(el).toHaveClass('ui-overlay-banana');
    });

    it('should match popup overlayTheme if given', function() {
        scope.opened = true;
        scope.overlayTheme = 'mango';
        scope.$apply();

        expect(el).toHaveClass('ui-overlay-mango');
    });

    it('should hide when scope is not opened', function() {
        scope.opened = true;
        scope.$apply();
        expect(el).toHaveClass('in');
        expect(el).not.toHaveClass('ui-screen-hidden');

        scope.opened = false;
        scope.$apply();
        expect(el).toHaveClass('ui-screen-hidden');
    });

    it('should catch a click event and close the popup when opened', function() {
        scope.opened = true;
        scope.$apply();

        expect(scope.hide).not.toHaveBeenCalled();
        el.triggerHandler('click');
        expect(scope.hide).toHaveBeenCalled();
    });

});
