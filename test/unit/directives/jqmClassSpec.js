"use strict";

describe('jqmClass directive', function() {
    
    var $compile, scope;
    beforeEach(inject(function(_$compile_, $rootScope) {
        scope = $rootScope.$new();
        $compile = _$compile_;
    }));

    describe('compared to ngClass', function() {
        var el1, el2;
        function compileAndCompare(ngClass) {
            el1 = $compile('<div ng-class="' + ngClass + '"></div>')(scope);
            el2 = $compile('<div jqm-class="' + ngClass + '"></div>')(scope);
            scope.$apply();
            testutils.compareElementRecursive(el1, el2);
        }

        it('should be same for obj notation', function() {
            scope.two = true;
            compileAndCompare('{one: two, three: four}');
            scope.$apply('two = false; four = true');
            testutils.compareElementRecursive(el1, el2);
        });
        it('should be same for expr notation', function() {
            scope.two = true;
            compileAndCompare("two ? 'one' : 'three'");
        });
    });

    describe('with ngClass', function() {
        it('should work with ngClass', function() {
            scope.one = true;
            scope.two = true;
            var el1 = $compile('<div ng-class="{\'one-true\': one}" jqm-class="{\'two-true\': two}"></div>')(scope);
            scope.$apply();
            expect(el1[0].className).toMatch('one-true');
            expect(el1[0].className).toMatch('two-true');
        });
    });

});
