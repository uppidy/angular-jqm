"use strict";
describe('jqmPositionClass directive', function() {

    var $compile, scope;
    beforeEach(inject(function(_$compile_, $rootScope) {
        $compile = _$compile_;
        scope = $rootScope.$new();
    }));

    var elements, parent;
    function setup() {
        elements = {};
        parent = angular.element('<div jqm-theme="super"></div>');
        angular.forEach(['a','b','c'], function(name) {
            elements[name] = angular.element('<div jqm-position-class></div>');
            parent.append(elements[name]);
        });
        $compile(parent)(scope);
        scope.$apply();
    }

    it('should set class names based on position after digest', function() {
        setup();
        expect(elements.a).toHaveClass('ui-first-child');
        expect(elements.a).not.toHaveClass('ui-last-child');
        expect(elements.b).not.toHaveClass('ui-first-child');
        expect(elements.b).not.toHaveClass('ui-last-child');
        expect(elements.c).not.toHaveClass('ui-first-child');
        expect(elements.c).toHaveClass('ui-last-child');
        parent.append(elements.a);
        scope.$apply();
        expect(elements.b).toHaveClass('ui-first-child');
        expect(elements.b).not.toHaveClass('ui-last-child');
        expect(elements.c).not.toHaveClass('ui-first-child');
        expect(elements.c).not.toHaveClass('ui-last-child');
        expect(elements.a).not.toHaveClass('ui-first-child');
        expect(elements.a).toHaveClass('ui-last-child');
    });
});
