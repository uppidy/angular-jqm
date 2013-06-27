"use strict";
describe('jqmPositionClass directive', function() {
    var FIRST = {first: true, last: false, middle:false},
        FIRST_AND_LAST = {first: true, last: true, middle:false},
        MIDDLE = {first: false, last: false, middle:true},
        LAST = {first: false, last: true, middle:false};

    var $compile, scope;
    beforeEach(function() {
        module(function($compileProvider) {
            $compileProvider.directive('testScope', function() {
                return {
                    scope: true
                };
            });
        });
        inject(function(_$compile_, $rootScope) {
            $compile = _$compile_;
            scope = $rootScope.$new();
        });
    });

    var elements, parent;

    function setup(childNames) {
        elements = {};
        parent = angular.element('<div jqm-position-anchor></div>');
        angular.forEach(childNames, function(name) {
            elements[name] = angular.element('<div test-scope></div>');
            parent.append(elements[name]);
        });
        $compile(parent)(scope);
        scope.$apply();
    }

    function addWithoutApply(name) {
        elements[name] = angular.element('<div test-scope></div>');
        parent.append(elements[name]);
        $compile(elements[name])(scope);
    }

    function addWithApply(name) {
        addWithoutApply(name);
        scope.$apply();
    }

    it('should not set $position if a child does not have an own scope', function() {
        var parent = $compile('<div jqm-position-anchor><div></div></div>')(scope);
        scope.$apply();
        expect(parent.children().scope().$position).toBeUndefined();
    });

    it('should set $position for a single child', function() {
        setup(['a']);
        expect(elements.a.scope().$position).toEqual(FIRST_AND_LAST);
    });

    it('should set $position for two children', function() {
        setup(['a','b']);
        expect(elements.a.scope().$position).toEqual(FIRST);
        expect(elements.b.scope().$position).toEqual(LAST);
    });

    it('should set $position for three children', function() {
        setup(['a','b', 'c']);
        expect(elements.a.scope().$position).toEqual(FIRST);
        expect(elements.b.scope().$position).toEqual(MIDDLE);
        expect(elements.c.scope().$position).toEqual(LAST);
    });

    it('should not update $position until next digest', function() {
        setup(['a']);
        addWithoutApply('b');
        expect(elements.a.scope().$position).toEqual(FIRST_AND_LAST);
        expect(elements.b.scope().$position).toBeUndefined();
        scope.$apply();
        expect(elements.a.scope().$position).toEqual(FIRST);
        expect(elements.b.scope().$position).toEqual(LAST);
    });

    it('should update $position every time a child is added, moved or removed', function() {
        setup(['a', 'b', 'c']);
        expect(elements.a.scope().$position).toEqual(FIRST);
        expect(elements.b.scope().$position).toEqual(MIDDLE);
        expect(elements.c.scope().$position).toEqual(LAST);
        // appendChild
        // a,c,b
        parent.append(elements.b);
        scope.$apply();
        expect(elements.a.scope().$position).toEqual(FIRST);
        expect(elements.b.scope().$position).toEqual(LAST);
        expect(elements.c.scope().$position).toEqual(MIDDLE);

        // insertBefore
        // c,a,b
        elements.c.after(elements.a);
        scope.$apply();
        expect(elements.a.scope().$position).toEqual(MIDDLE);
        expect(elements.b.scope().$position).toEqual(LAST);
        expect(elements.c.scope().$position).toEqual(FIRST);

        // removeChild
        // c,a,b
        elements.a.remove();
        scope.$apply();
        expect(elements.b.scope().$position).toEqual(LAST);
        expect(elements.c.scope().$position).toEqual(FIRST);
    });
});
