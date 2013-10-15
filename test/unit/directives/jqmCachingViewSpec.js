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
            expect(jqmViewCache.get(someTemplateUrl)).not.toBeDefined();
            $httpBackend.when('GET', someTemplateUrl).respond('<div id="somePage"></div>');
            createView('$route');
            scope.$route = someTemplateUrl;
            $rootScope.$apply();
            $httpBackend.flush();

            expect(jqmViewCache.get(someTemplateUrl)).toBeDefined();
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
    it("should reuse the scope each time", function () {
        inject(function ($templateCache, $rootScope) {
            $templateCache.put(someTemplateUrl, '<div id="somePage"></div>');
            createView("$route");
            scope.$route = someTemplateUrl;
            $rootScope.$apply();
            var scope1 = viewEl.children().scope();

            scope.$route = null;
            $rootScope.$apply();
            scope.$route = someTemplateUrl;
            $rootScope.$apply();
            expect(viewEl.children().scope().$id).toEqual(scope1.$id);

            scope.$route = null;
            $rootScope.$apply();
            scope.$route = someTemplateUrl;
            $rootScope.$apply();

            expect(viewEl.children().scope().$id).toEqual(scope1.$id);
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
                contentScope = content.scope();

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
describe('jqmCachingViewController', function() {
  var viewCtrl, scope, el;
  var someUrl = '/someUrl';

  beforeEach(module(function($compileProvider) {
    $compileProvider.directive('viewChild', function() {
      return {
        require: '^jqmCachingView',
        link: function(scope, elm, attr, ctrl) {
          viewCtrl = ctrl;
        }
      };
    });
  }));

  beforeEach(inject(function($httpBackend, $compile, $rootScope) {
    scope = $rootScope.$new();
    el = $compile('<div jqm-caching-view><div view-child></div></div>')(scope);
    $rootScope.$digest();
    $httpBackend.when('GET', someUrl).respond('<div id="stuff"></div>');
  }));


  it('should set viewWatchAttr', function() {
    expect(viewCtrl.viewWatchAttr).toEqual('jqmCachingView');
  });

  it('loadView should fetch the view if not in cache', inject(function($httpBackend) {
    viewCtrl.loadView(someUrl, '').then(function(view) {
      expect(view).toBeDefined();
    });
    $httpBackend.flush();
  }));
  it('loadView should get the view from cache if it exists', inject(function(jqmViewCache, $http, $httpBackend) {
    var myView;
    var done = false;
    spyOn(jqmViewCache, 'put').andCallThrough();
    spyOn(jqmViewCache, 'get').andCallThrough();
    spyOn($http, 'get').andCallThrough();

    viewCtrl.loadView(someUrl, '').then(function(view) {
      expect($http.get.callCount).toBe(1);
      expect(view).toBe(jqmViewCache.get(someUrl));
      viewCtrl.loadView(someUrl, '').then(function(view) {
        expect($http.get.callCount).toBe(1);
        done = true;
      });
    });
    $httpBackend.flush();
    expect(done).toBe(true); //this makes it so that if the promises fail to resolve, the test fails
  }));
  it('loadView should fetch a new view if the cached one is already in play', inject(function($httpBackend, jqmViewCache, $http) {
    var done = false;
    spyOn($http, 'get').andCallThrough();

    viewCtrl.loadView(someUrl, '').then(function(view1) {
      expect($http.get.callCount).toBe(1);
      expect(jqmViewCache.get(someUrl)).toBe(view1);

      viewCtrl.loadView(someUrl, '', view1).then(function(view2) {
        expect(jqmViewCache.get(someUrl)).toBe(view1);
        expect(jqmViewCache.get(someUrl)).not.toBe(view2);
        expect($http.get.callCount).toBe(2);
        expect(view1.scope.$id).not.toBe(view2.scope.$id);
        done = true;
      });
    });
    $httpBackend.flush();
    expect(done).toBe(true); //this makes it so that if the promises fail to resolve, the test fails
  }));
  it('the view should have clear method which removes', inject(function($httpBackend) {
    var done = false;
    viewCtrl.loadView(someUrl).then(function(view) {
      spyOn(view.scope, '$destroy');
      spyOn(view.element, 'remove');
      view.clear();
      expect(view.scope.$destroy).toHaveBeenCalled();
      expect(view.element.remove).toHaveBeenCalled();
      done = true;
    });

    $httpBackend.flush();
    expect(done).toBe(true); //this makes it so that if the promises fail to resolve, the test fails
  }));
  it('the view should decorate $destroy to just cleanup', inject(function($httpBackend) {
    var done = false;
    viewCtrl.loadView(someUrl).then(function(view) {
      view.scope.$$watchers = ['a'];
      view.scope.$$listeners = ['b'];
      view.scope.hello = 1;
      view.scope.$destroy();
      expect(view.scope.$$watchers).toEqual([]);
      expect(view.scope.$$listeners).toEqual([]);
      expect(view.scope.hello).toBeUndefined();
      done = true;
    });
    $httpBackend.flush();
    expect(done).toBe(true);
  }));
});
