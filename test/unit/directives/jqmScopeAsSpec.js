"use strict";
describe('jqmScopeAs', function() {
    it('saves the value as $$scopeAs in the scope', function() {
        var elm = testutils.ng.init('<div jqm-scope-as="someName"></div>');
        expect(elm.scope().$$scopeAs).toBe('someName');
    });
    it('works with $parse decorator', function() {
        module(function($compileProvider) {
            $compileProvider.directive('someTag', function() {
                return {
                    scope: {},
                    template:
                      '<div jqm-scope-as="someScopeName">' +
                        '<span>{{someProp}}</span>' +
                        '<span>{{$scopeAs.someScopeName.someProp}}</span>' +
                      '</div>',
                    replace: true
                };
            });
        });
        var elm = testutils.ng.init('<div some-tag></div>'),
            scope = elm.isolateScope(),
            parentScope = scope.$parent,
            test1Span = elm.children().eq(0),
            test2Span = elm.children().eq(1);
        parentScope.someProp = 'someVal';
        parentScope.$apply();
        expect(test1Span.text()).toBe('someVal');
        expect(test2Span.text()).toBe('');
        delete parentScope.someProp;
        scope.someProp = 'someVal';
        parentScope.$apply();
        expect(test1Span.text()).toBe('');
        expect(test2Span.text()).toBe('someVal');
    });
});
