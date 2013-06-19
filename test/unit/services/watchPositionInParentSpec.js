
"use strict";
describe('watchPositionInParent', function() {
    var spies, scope;
    beforeEach(function() {
        spies = {};
    });
    beforeEach(module(function($compileProvider) {
        $compileProvider.directive('watchPosition', function(watchPositionInParent) {
            return function(scope, elm, attrs) {
                var spyName = scope.$eval(attrs.watchPosition);
                spies[spyName] = jasmine.createSpy(spyName);
                watchPositionInParent(elm, spies[spyName]);
            };
        });
    }));

    it('should send an update when created with index of child', function() {
        testutils.ng.init('<div><span watch-position="\'one\'"></span></div>');
        expect(spies.one).toHaveBeenCalledWith('first', undefined);
    });

    it('should allow multiple callbacks per element', inject(function($compile, $rootScope, watchPositionInParent) {
        var scope = $rootScope.$new();
        var child = angular.element('<span></span>');
        var parent = angular.element('<div></div>');
        var spyOne = jasmine.createSpy(), spyTwo = jasmine.createSpy();

        parent.append(child);
        watchPositionInParent(child, spyOne);
        watchPositionInParent(child, spyTwo);

        scope.$apply();
        expect(spyOne).toHaveBeenCalledWith('first', undefined);
        expect(spyTwo).toHaveBeenCalledWith('first', undefined);

        parent.prepend('<span></span>');
        scope.$apply();
        expect(spyOne).toHaveBeenCalledWith('last', 'first');
        expect(spyTwo).toHaveBeenCalledWith('last', 'first');
    }));

    it('should not send updates until next digest', inject(function($compile, $rootScope) {
        var scope = $rootScope.$new();
        var el = $compile('<div><span watch-position="\'one\'"></span></div>')(scope);
        scope.$apply();
        expect(spies.one).toHaveBeenCalledWith('first', undefined);

        el.prepend('<span watch-position="\'two\'"></span>');
        $compile(el.children().eq(0))(scope);
        expect(spies.one.callCount).toBe(1);
        expect(spies.two.callCount).toBe(0);

        el.append('<span watch-position="\'three\'"></span>');
        $compile(el.children().eq(2))(scope);
        expect(spies.one.callCount).toBe(1);
        expect(spies.two.callCount).toBe(0);
        expect(spies.three.callCount).toBe(0);

        scope.$apply();
        expect(spies.one).toHaveBeenCalledWith('middle', 'first');
        expect(spies.two).toHaveBeenCalledWith('first', undefined);
        expect(spies.three).toHaveBeenCalledWith('last', undefined);
    }));

    it('should send an update each time a child is added or removed with index', function() {
        testutils.ng.init('<div>' +
          '<span ng-repeat="i in list" watch-position="i"></span>' +
        '</div>');
        var scope = testutils.ng.scope;

        scope.$apply("list = ['a']");
        expect(spies.a).toHaveBeenCalledWith('first', undefined);
        expect(spies.a.callCount).toBe(1);

        scope.$apply("list.push('b')");
        //a,b
        //a's position hasn't changed, shouldn't call again
        expect(spies.a.callCount).toBe(1);
        expect(spies.b).toHaveBeenCalledWith('last', undefined);
        expect(spies.b.callCount).toBe(1);

        scope.$apply("list.unshift('c')");
        //c,a,b
        expect(spies.c).toHaveBeenCalledWith('first', undefined);
        expect(spies.c.callCount).toBe(1);
        expect(spies.a).toHaveBeenCalledWith('middle', 'first');
        expect(spies.a.callCount).toBe(2);
        //b hasn't changed, should still be 1
        expect(spies.b.callCount).toBe(1);

        scope.$apply('list.pop(); list.unshift("b")');
        //b,c,a
        //b moved to first
        expect(spies.b).toHaveBeenCalledWith('first', 'last');
        expect(spies.b.callCount).toBe(2);
        //c is now second
        expect(spies.c).toHaveBeenCalledWith('middle', 'first');
        expect(spies.c.callCount).toBe(2);
        //a is now last
        expect(spies.a).toHaveBeenCalledWith('last', 'middle');
        expect(spies.a.callCount).toBe(3);

        scope.$apply('list.splice(1,0,"d")');
        //b,d,c,a
        //Only d should be called, the rests hould stay same
        expect(spies.d).toHaveBeenCalledWith('middle', undefined);
        expect(spies.b.callCount).toBe(2);
        expect(spies.c.callCount).toBe(2);
        expect(spies.a.callCount).toBe(3);

        scope.$apply('list.pop()');
        //b,d,c
        //only c should be called
        expect(spies.c).toHaveBeenCalledWith('last', 'middle');
        expect(spies.b.callCount).toBe(2);
        expect(spies.d.callCount).toBe(1);
    });

});
