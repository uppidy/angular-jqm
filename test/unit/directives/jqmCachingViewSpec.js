'use strict';

describe('jqmCachingView', function () {
    var someTemplateUrl = '/someTemplateUrl',
        viewEl, scope;

    function createView(routeExpr, content) {
        inject(function ($compile, $rootScope) {
            scope = $rootScope.$new();
            viewEl = $compile('<div jqm-caching-view="' + (routeExpr || '') + '">'+(content||'')+'</div>')(scope);
        });
    }


    it('should compile templates into jqmViewCache when used', function () {
        inject(function (jqmViewCache, $httpBackend, $rootScope) {
            expect(jqmViewCache.cache.get(someTemplateUrl)).not.toBeDefined();
            $httpBackend.when('GET', someTemplateUrl).respond('<div id="somePage"></div>');
            createView('$route');
            scope.$route = someTemplateUrl;
            $rootScope.$apply();
            $httpBackend.flush();

            expect(jqmViewCache.cache.get(scope.$id+'@'+someTemplateUrl)).toBeDefined();
        });
    });

    it('should allow other content within jqm-caching-view', function() {
        inject(function ($templateCache) {
            $templateCache.put(someTemplateUrl, '<div ng-repeat="l in viewList">{{l}}</div>');
            createView("'/someTemplateUrl'", '<div ng-repeat="l in contentList">{{l}}</div>');
            scope.contentList = [1,2];
            scope.viewList = [3,4];
            scope.$digest();
            expect(viewEl.text()).toBe('1234');
        });
    });
    it("should switch templates with allow-same-view-animation when used", function () {
        inject(function ($templateCache, $rootScope) {
            $templateCache.put(someTemplateUrl, '<div id="somePage" allow-same-view-animation></div>');
            createView("$route");
            scope.$route = someTemplateUrl;
            $rootScope.$apply();
            var scope1 = viewEl.children().scope();

            scope.$route = null;
            $rootScope.$apply();
            scope.$route = someTemplateUrl;
            $rootScope.$apply();
            expect(viewEl.children().scope()).not.toBe(scope1);

            scope.$route = null;
            $rootScope.$apply();
            scope.$route = someTemplateUrl;
            $rootScope.$apply();

            expect(viewEl.children().scope()).toBe(scope1);
        });
    });

    it('should create a new controller every time a route is visited', function () {
        inject(function ($templateCache, $rootScope) {
            var ctrlCounter = 0;
            var someCtrl = function ($scope) {
                $scope.ctrlCounter = ctrlCounter++;
            };
            $templateCache.put(someTemplateUrl, '<div id="somePage"></div>');
            createView("$route");
            scope.$route = {
                templateUrl: someTemplateUrl,
                controller: someCtrl
            };
            $rootScope.$apply();
            expect(ctrlCounter).toBe(1);

            scope.$route = {
                templateUrl: someTemplateUrl
            };
            $rootScope.$apply();
            expect(ctrlCounter).toBe(1);

            scope.$route = {
                templateUrl: someTemplateUrl,
                controller: someCtrl
            };
            $rootScope.$apply();
            expect(ctrlCounter).toBe(2);
        });
    });

    it('should disconnect the scope when the entry is not used and reconnect it when used', function () {
        inject(function ($rootScope, $templateCache) {
            var templateInstance;
            $templateCache.put(someTemplateUrl, '<div>{{counter}}</div>');
            createView('$route');

            $rootScope.counter = 1;
            scope.$route = {
                templateUrl: someTemplateUrl
            };
            $rootScope.$apply();
            var content = viewEl.children(),
                contentScope = content.scope().$parent;
            expect(contentScope.$$disconnected).toBe(false);
            expect(content.text()).toBe('1');

            scope.$route = null;
            $rootScope.$apply();
            expect(contentScope.$$disconnected).toBe(true);

            $rootScope.counter = 2;
            $rootScope.$apply();
            expect(content.text()).toBe('1');
        });
    });

    it("should not destroy the template's data", inject(function ($templateCache, $rootScope) {
        $templateCache.put(someTemplateUrl, '<div>{{counter}}</div>');
        createView('$route');
        scope.$route = someTemplateUrl;
        $rootScope.$apply();

        var content = viewEl.children();
        content.data('someKey', 'someValue');

        scope.$route = '';
        $rootScope.$apply();

        expect(viewEl.children().length).toBe(0);
        expect(content.data('someKey')).toBe('someValue');
    }));
});
