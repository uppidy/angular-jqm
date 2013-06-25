"use strict";
describe('parse decorator', function () {
    var $parse;
    beforeEach(inject(function (_$parse_) {
        $parse = _$parse_;
    }));
    describe('old functionality', function () {
        var someVal = 'someVal';
        it('allows normal getter', function () {
            expect($parse("someProp")({someProp: someVal})).toBe(someVal);
        });
        it('allows function calls', function () {
            var someSpy = jasmine.createSpy('someSpy').andReturn(someVal);
            expect($parse("someFn()")({someFn: someSpy})).toBe(someVal);
        });
        it('allows getters with locals', function () {
            expect($parse("someProp")({}, {someProp: someVal})).toBe(someVal);
        });
        it('allows setters', function () {
            var obj = {};
            $parse("someProp").assign(obj, someVal);
            expect(obj.someProp).toBe(someVal);
        });
        it('allows implicit setters', function () {
            var obj = {};
            $parse("someProp='" + someVal + "'")(obj);
            expect(obj.someProp).toBe(someVal);
        });
    });
    describe('$$scopeAs', function () {
        var parentScope, childScope, grandChildScope, someVal, childVal, parentVal, grandChildVal;
        beforeEach(function() {
            someVal = 'someVal';
            grandChildVal = 'grandChildVal';
            childVal = 'childVal';
            parentVal = 'parentVal';
            parentScope = {};
            childScope = {
                $parent: parentScope,
                $$scopeAs: 'childScopeName'
            };
            grandChildScope = {
                $parent: childScope,
                $$scopeAs: 'grandChildScopeName'
            };
        });
        describe('getter', function () {
            it('uses the parent scope for non prefixed properties', function () {
                childScope.someProp = childVal;
                parentScope.someProp = parentVal;
                expect($parse('someProp')(childScope)).toBe(parentVal);
            });
            it('uses the parent scope for non prefixed properties transitively', function () {
                childScope.someProp = childVal;
                parentScope.someProp = parentVal;
                expect($parse('someProp')(grandChildScope)).toBe(parentVal);
            });
            it('allows access to the child scope using $scopeAs', function () {
                childScope.someProp = childVal;
                parentScope.someProp = parentVal;
                expect($parse('$scopeAs.childScopeName.someProp')(childScope)).toBe(childVal);
            });
            it('allows access to the child scope using $scopeAs transitively', function () {
                grandChildScope.someProp = grandChildVal;
                childScope.someProp = childVal;
                parentScope.someProp = parentVal;
                expect($parse('$scopeAs.grandChildScopeName.someProp')(grandChildScope)).toBe(grandChildVal);
                expect($parse('$scopeAs.childScopeName.someProp')(grandChildScope)).toBe(childVal);
            });
        });
        describe('setter', function() {
            it('uses the parent scope for non prefixed properties in normal setters', function () {
                $parse('someProp').assign(childScope, someVal);
                expect(childScope.someProp).toBeUndefined();
                expect(parentScope.someProp).toBe(someVal);
            });
            it('uses the parent scope for non prefixed properties in normal setters transitively', function () {
                $parse('someProp').assign(grandChildScope, someVal);
                expect(grandChildScope.someProp).toBeUndefined();
                expect(childScope.someProp).toBeUndefined();
                expect(parentScope.someProp).toBe(someVal);
            });
            it('uses the parent scope for non prefixed properties in implicit setters', function () {
                $parse('someProp="'+someVal+'"')(childScope);
                expect(childScope.someProp).toBeUndefined();
                expect(parentScope.someProp).toBe(someVal);
            });
            it('allows access to the child scope using $scopeAs for normal setters', function () {
                $parse('$scopeAs.childScopeName.someProp').assign(childScope, someVal);
                expect(childScope.someProp).toBe(someVal);
                expect(parentScope.someProp).toBeUndefined();
            });
            it('allows access to the child scope using $scopeAs for normal setters transitively', function () {
                $parse('$scopeAs.grandChildScopeName.someProp').assign(grandChildScope, grandChildVal);
                $parse('$scopeAs.childScopeName.someProp').assign(grandChildScope, childVal);
                expect(grandChildScope.someProp).toBe(grandChildVal);
                expect(childScope.someProp).toBe(childVal);
                expect(parentScope.someProp).toBeUndefined();
            });
            it('allows access to the child scope using $scopeAs for implicit setters', function () {
                $parse('$scopeAs.childScopeName.someProp="'+someVal+'"')(childScope);
                expect(childScope.someProp).toBe(someVal);
                expect(parentScope.someProp).toBeUndefined();
            });

        });
    });
});