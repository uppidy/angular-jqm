"use strict";
describe('jqmButtonToggler', function() {

    var el, scope, listener;
    beforeEach(inject(function($rootScope, $compile, jqmButtonToggler) {
        scope = $rootScope.$new();
        el = angular.element('<div><span></span></div>');
        $compile(el)(scope);
        spyOn(el, 'bind');
        listener = jqmButtonToggler(el);
    }));

    it('should bind mouseover and mouseout to element', function() {
        expect(el.bind).toHaveBeenCalledWith('mousedown', listener.$mousedown);
        expect(el.bind).toHaveBeenCalledWith('mouseover', listener.$mouseover);
    });
    it('should do nothing for mousedown on non-buttons', function() {
        listener.$mousedown({ target: el });
        expect(el).not.toHaveClass('ui-btn-up-' + scope.$theme);
        expect(el).not.toHaveClass('ui-btn-down-' + scope.$theme);
    });
    it('should do nothing for mouseover on non-buttons', function() {
        listener.$mouseover({ target: el });
        expect(el).not.toHaveClass('ui-btn-hover-' + scope.$theme);
    });

    describe('mousedown', function() {
        function expectBtnDown(isDown) {
            if (!isDown) {
                expect(el).toHaveClass('ui-btn-up-'+scope.$theme);
                expect(el).not.toHaveClass('ui-btn-down-'+scope.$theme);
            } else {
                expect(el).not.toHaveClass('ui-btn-up-'+scope.$theme);
                expect(el).toHaveClass('ui-btn-down-'+scope.$theme);
            }
        }

        beforeEach(function() {
            el.addClass('ui-btn-up-' + scope.$theme);
        });
        it('should change class on mousedown and mouseup', function() {
            expectBtnDown(false);
            listener.$mousedown({ target: el[0] });
            expectBtnDown(true);
        });
        it('should do nothing on mousedown if already down', function() {
            expectBtnDown(false);
            listener.$mousedown({ target: el[0] });
            expectBtnDown(true);
            listener.$mousedown({ target: el[0] });
            expectBtnDown(true);
        });
        it('should restore btn up class on mousemove', function() {
            listener.$mousedown({ target: el[0] });
            expectBtnDown(true);
            el.triggerHandler('mousemove');
            expectBtnDown(false);
            el.triggerHandler('mousemove');
            expectBtnDown(false);
        });
        it('should restore btn up class on mouseup', function() {
            listener.$mousedown({ target: el[0] });
            expectBtnDown(true);
            el.triggerHandler('mouseup');
            expectBtnDown(false);
            el.triggerHandler('mouseup');
            expectBtnDown(false);
        });

        it('should work if the target is a child of a button', function() {
            var child = el.children();
            listener.$mousedown({ target: child[0] });
            expectBtnDown(true);
            child.triggerHandler('mousemove');
            expectBtnDown(false);
        });
    });

    describe('mouseover', function() {
        function expectBtnHover(isHover) {
            if (isHover) {
                expect(el).toHaveClass('ui-btn-hover-' + scope.$theme);
            } else {
                expect(el).not.toHaveClass('ui-btn-hover-' + scope.$theme);
            }
        }

        beforeEach(function() {
            el.addClass('ui-btn');
        });
        
        it('should add hover class', function() {
            expectBtnHover(false);
            listener.$mouseover({ target: el[0] });
            expectBtnHover(true);
        });
        it('should do nothing if hovered already', function() {
            listener.$mouseover({ target: el[0] });
            expectBtnHover(true);
            listener.$mouseover({ target: el[0] });
            expectBtnHover(true);
        });
        it('should remove hover class on mouseout', function() {
            listener.$mouseover({ target: el[0] });
            expectBtnHover(true);
            el.triggerHandler('mouseout');
            expectBtnHover(false);
        });
        it('should do nothing if up already and mosueout', function() {
            expectBtnHover(false);
            el.triggerHandler('mouseout');
            expectBtnHover(false);
            listener.$mouseover({ target: el[0] });
            expectBtnHover(true);
            el.triggerHandler('mouseout');
            expectBtnHover(false);
        });
        it('should work on children of btn element', function() {
            var child = el.children();
            listener.$mouseover({ target: child[0] });
            expectBtnHover(true);
            child.triggerHandler('mouseout');
            expectBtnHover(false);
        });
    });
});
