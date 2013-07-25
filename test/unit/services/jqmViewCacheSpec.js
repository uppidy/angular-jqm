"use strict";
describe('jqmCachingView', function () {
    var someTemplateUrl = '/someTemplateUrl',
        scope;
    beforeEach(function() {
        module(function() {
            return function($rootScope) {
                scope = $rootScope.$new();
            };
        });
    });

    it('creates a cache using cacheFactory', inject(function (jqmViewCache) {
        var someEntry = {};
        jqmViewCache.cache.put('/someUrl', someEntry);
        expect(jqmViewCache.cache.get('/someUrl')).toBe(someEntry);
    }));

    describe('load', function () {
        it('loads the template using $http', function () {
            inject(function (jqmViewCache, $httpBackend) {
                $httpBackend.expect('GET', someTemplateUrl).respond('someContent');
                var cacheEntry;
                jqmViewCache.load(scope, someTemplateUrl).then(function (_cacheEntry) {
                    cacheEntry = _cacheEntry.get();
                });
                $httpBackend.flush();
                expect(cacheEntry.elements.html()).toBe("someContent");
            });
        });
        it('stores the template in the cache', function () {
            inject(function (jqmViewCache, $httpBackend) {
                $httpBackend.expect('GET', someTemplateUrl).respond('someContent');
                var promise = jqmViewCache.load(scope, someTemplateUrl);
                expect(jqmViewCache.cache.get(scope.$id+'@'+someTemplateUrl)).toBe(promise);
            });
        });
        it('loads the template using $templateCache', function () {
            inject(function (jqmViewCache, $templateCache, $rootScope) {
                $templateCache.put(someTemplateUrl, 'someContent');
                var cacheEntry;
                jqmViewCache.load(scope, someTemplateUrl).then(function (_cacheEntry) {
                    cacheEntry = _cacheEntry.get();
                });
                $rootScope.$digest();
                expect(cacheEntry.elements.html()).toBe("someContent");
            });
        });
        it('returns the promise of a pending call', function () {
            inject(function (jqmViewCache, $httpBackend) {
                $httpBackend.when('GET', someTemplateUrl).respond('someContent');
                var promise1 = jqmViewCache.load(scope, someTemplateUrl);
                var promise2 = jqmViewCache.load(scope, someTemplateUrl);
                expect(promise1).toBe(promise2);
            });
        });
        it('caches the promise', function () {
            inject(function (jqmViewCache, $httpBackend) {
                $httpBackend.expect('GET', someTemplateUrl).respond('someContent');
                var promise = jqmViewCache.load(scope, someTemplateUrl);
                $httpBackend.flush();
                expect(jqmViewCache.load(scope, someTemplateUrl)).toBe(promise);
            });
        });
        it("should compile templates with allow-same-view-animation two times", function () {
            inject(function ($templateCache, jqmViewCache, $rootScope) {
                $templateCache.put(someTemplateUrl, '<div allow-same-view-animation>someContent</div>');
                $rootScope.$digest();
                var cacheEntry;
                jqmViewCache.load(scope, someTemplateUrl).then(function (_cacheEntry) {
                    cacheEntry = _cacheEntry;
                });
                $rootScope.$digest();
                var templateInstance1 = cacheEntry.get(0);
                var templateInstance2 = cacheEntry.get(1);
                expect(templateInstance1).toBeDefined();
                expect(templateInstance2).toBeDefined();
                expect(templateInstance1).not.toBe(templateInstance2);
            });
        });
        it("should compile normal templates one time", function () {
            inject(function ($templateCache, jqmViewCache, $rootScope) {
                $templateCache.put(someTemplateUrl, '<div>someContent</div>');
                $rootScope.$digest();
                var cacheEntry;
                jqmViewCache.load(scope, someTemplateUrl).then(function (_cacheEntry) {
                    cacheEntry = _cacheEntry;
                });
                $rootScope.$digest();
                var templateInstance1 = cacheEntry.get(0);
                var templateInstance2 = cacheEntry.get(1);
                expect(templateInstance1).toBeDefined();
                expect(templateInstance2).not.toBeDefined();
            });
        });
        it("creates an extra parent scope and disconnects it", function () {
            inject(function ($templateCache, jqmViewCache, $rootScope) {
                $templateCache.put(someTemplateUrl, '<div>someContent</div>');
                $rootScope.$digest();
                var cacheEntry;
                jqmViewCache.load(scope, someTemplateUrl).then(function (_cacheEntry) {
                    cacheEntry = _cacheEntry.get();
                });
                $rootScope.$digest();
                expect(cacheEntry.scope).toBe(cacheEntry.elements.scope().$parent);
                expect(cacheEntry.scope.$$disconnected).toBe(true);
            });
        });
        it("switches between template instances via cacheEntry.next()", function () {
            inject(function ($templateCache, jqmViewCache, $rootScope) {
                $templateCache.put(someTemplateUrl, '<div allow-same-view-animation>someContent</div>');
                $rootScope.$digest();
                var cacheEntry;
                jqmViewCache.load(scope, someTemplateUrl).then(function (_cacheEntry) {
                    cacheEntry = _cacheEntry;
                });
                $rootScope.$digest();
                expect(cacheEntry.get()).toBe(cacheEntry.get(0));
                cacheEntry.next();
                expect(cacheEntry.get()).toBe(cacheEntry.get(1));
            });
        });
        it('should delete watches, event listeners and properties from the scope when $scope.$destroy is called', function () {
            inject(function ($templateCache, jqmViewCache, $rootScope) {
                var ctrlCounter = 0,
                    watchCounter = 0,
                    eventCounter = 0,
                    viewScope;
                $templateCache.put(someTemplateUrl, '<div>someContent</div>');
                var cacheEntryScope;
                jqmViewCache.load(scope, someTemplateUrl).then(function (_cacheEntry) {
                    cacheEntryScope = _cacheEntry.get().scope;
                });
                $rootScope.$digest();

                cacheEntryScope.$watch(function () {
                    watchCounter++;
                });
                cacheEntryScope.$on('someEvent', function () {
                    eventCounter++;
                });
                cacheEntryScope.ctrl0 = true;

                cacheEntryScope.$destroy();

                expect(cacheEntryScope.$$watchers.length).toBe(0);
                expect(cacheEntryScope.$$listeners.length).toBe(0);
                expect(cacheEntryScope.ctrl0).toBeUndefined();
            });
        });
        it('should not delete watches, event listeners and properties from the directive scope when $scope.$destroy is called', function () {
            var directiveScope;
            module(function($compileProvider) {
                $compileProvider.directive('test', function() {
                    return {
                        link: function(scope) {
                            directiveScope = directiveScope || scope;
                            directiveScope.test = true;
                        }
                    };
                });
            });
            inject(function ($templateCache, $rootScope, jqmViewCache) {
                var viewScope;
                $templateCache.put(someTemplateUrl, '<div test></div>');
                var cacheEntry;
                jqmViewCache.load(scope, someTemplateUrl).then(function (_cacheEntry) {
                    cacheEntry = _cacheEntry.get();
                });
                $rootScope.$digest();
                viewScope = cacheEntry.scope;
                expect(directiveScope.$parent.$id).toBe(viewScope.$id);
                expect(directiveScope.test).toBe(true);

                viewScope.$destroy();
                $rootScope.$apply();
                expect(directiveScope.test).toBe(true);
            });
        });
    });
});