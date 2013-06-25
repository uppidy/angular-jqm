"use strict";
describe('ngClick enhanced directive', function() {

    var scope, $compile;
    beforeEach(inject(function($rootScope, _$compile_) {
        scope = $rootScope.$new();
        $compile = _$compile_;
    }));

    function setup(attrs, clickExpr) {
        return $compile('<div '+attrs+' ng-click="'+clickExpr+'"></div>')(scope);
    }

    it('should set ng-click-active class based on mouse events', function() {
        var el = setup('','');
        expect(el).not.toHaveClass('ng-click-active');
        el.triggerHandler('mousedown');
        expect(el).toHaveClass('ng-click-active');
        el.triggerHandler('mouseup');
        expect(el).not.toHaveClass('ng-click-active');
    });

    it('should set ui-btn-up-<theme> and ui-btn-down-<theme> classes for elements with class ui-btn', function() {
        var el = setup('class="ui-btn" jqm-theme="s"','');
        expect(el).toHaveClass('ui-btn-up-s');
        expect(el).not.toHaveClass('ui-btn-down-s');
        el.triggerHandler('mousedown');
        expect(el).not.toHaveClass('ui-btn-up-s');
        expect(el).toHaveClass('ui-btn-down-s');
        el.triggerHandler('mouseup');
        expect(el).toHaveClass('ui-btn-up-s');
        expect(el).not.toHaveClass('ui-btn-down-s');
    });

    it('should evaluate the given expression', function() {
        var el = setup('', 'x=1');
        expect(scope.x).toBeUndefined();
        el.triggerHandler('click');
        expect(scope.x).toBe(1);
    });
});
