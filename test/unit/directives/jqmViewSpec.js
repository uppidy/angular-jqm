'use strict';

describe('jqmView', function () {
    var someTemplateUrl = '/someTemplateUrl',
        viewEl, scope;

    function createView(routeExpr, extrAttrs, content) {
        inject(function ($compile, $rootScope) {
            scope = $rootScope.$new();
            viewEl = $compile('<div jqm-view="' + (routeExpr || '') + '" '+(extrAttrs||'')+'>'+(content||'')+'</div>')(scope);
        });
    }

    describe('other', function () {
        it('should fire $viewContentLoaded with the new element', function () {
            module(function ($compileProvider, $routeProvider) {
                $routeProvider.when('/foo', {template: '<div class="page"></div>'});
            });

            inject(function ($templateCache, $rootScope, $location, $compile) {
                var element;
                $templateCache.put('test.html', 'template-url-content');
                $rootScope.$on('$viewContentLoaded', function (event, element) {
                    expect(element).toHaveClass('page');
                });
                element = $compile('<div jqm-view></div>')($rootScope);
                $location.path('/foo');
                $rootScope.$digest();
            });
        });
        it('should allow other content within jqm-view', function() {
            inject(function ($templateCache) {
                $templateCache.put(someTemplateUrl, '<div ng-repeat="l in viewList">{{l}}</div>');
                createView("'/someTemplateUrl'", null, '<div ng-repeat="l in contentList">{{l}}</div>');
                scope.contentList = [1,2];
                scope.viewList = [];
                scope.$digest();
                expect(viewEl.text()).toBe('12');

                scope.contentList = [1,2];
                scope.viewList = [3,4];
                scope.$digest();
                expect(viewEl.text()).toBe('1234');

                scope.contentList = [1,2];
                scope.viewList = [];
                scope.$digest();
                expect(viewEl.text()).toBe('12');

                scope.contentList = [];
                scope.viewList = [3,4];
                scope.$digest();
                expect(viewEl.text()).toBe('34');

                scope.contentList = [];
                scope.viewList = [];
                scope.$digest();
                expect(viewEl.text()).toBe('');
            });
        });
    });

    describe('animations', function() {
        beforeEach(function() {
            testutils.ng.enableAnimations(true);
        });
        it("allows ng-animate", function () {
            var savedService,
                savedScope;
            module(function($routeProvider) {
                $routeProvider.when('/page1', {
                    template: '<div>page1</div>'
                });
            });
            inject(function($route, $location, $rootScope) {
                createView('', 'ng-animate="\'someAnimation\'"');
                $location.url('/page1');
                $rootScope.$digest();

                expect(viewEl.children()).toHaveClass("someAnimation-enter");
            });
        });
        it("allows a property as animation on routes", function () {
            var savedService,
                savedScope;
            module(function($routeProvider) {
                $routeProvider.when('/page1', {
                    template: '<div>page1</div>',
                    animation: 'someAnimation'
                });
            });
            inject(function($route, $location, $rootScope) {
                createView();
                $location.url('/page1');
                $rootScope.$digest();

                expect(viewEl.children()).toHaveClass("someAnimation-enter");
            });
        });
        it("looks for the view-animation attribute on the root elements in the templates", function () {
            var savedService,
                savedScope;
            module(function($routeProvider) {
                $routeProvider.when('/page1', {
                    template: 'a<span></span><div view-animation="someAnimation">page1</div>b'
                });
            });
            inject(function($route, $location, $rootScope) {
                createView();
                $location.url('/page1');
                $rootScope.$digest();

                expect(viewEl.children()).toHaveClass("someAnimation-enter");
            });
        });
        it("looks for the data-view-animation on the root elements in the templates", function () {
            var savedService,
                savedScope;
            module(function($routeProvider) {
                $routeProvider.when('/page1', {
                    template: 'a<div data-view-animation="someAnimation">page1</div>b'
                });
            });
            inject(function($route, $location, $rootScope) {
                createView();
                $location.url('/page1');
                $rootScope.$digest();

                expect(viewEl.children()).toHaveClass("someAnimation-enter");
            });
        });
        it("allows a function as animation on routes and injects it with locals $routeParams, $scope and services", function () {
            var savedService,
                savedScope;
            module(function($routeProvider) {
                $routeProvider.when('/page1/:someParam', {
                    template: '<div>page1</div>',
                    animation: function ($routeParams, $scope, $route) {
                        savedService = $route;
                        savedScope = $scope;
                        return $routeParams.someParam + $scope.someValue;
                    }
                });
            });
            inject(function($route, $location, $rootScope) {
                createView();
                scope.$apply('someValue="Thing"');
                $location.url('/page1/someTransition');
                $rootScope.$digest();

                expect(viewEl.children()).toHaveClass("someTransitionThing-enter");
                expect(savedService).toBe($route);
                expect(savedScope).toBe(scope);
            });
        });
        it("adds reverse suffix and uses last animation on going back", function () {
            var savedService,
                savedScope;
            module(function($routeProvider) {
                $routeProvider.when('/page1', {
                    template: '<div>page1</div>',
                    animation: 'page1Animation'
                });
                $routeProvider.when('/page2', {
                    template: '<div>page2</div>',
                    animation: 'page2Animation'
                });
            });
            inject(function($route, $location, $rootScope) {
                var back = false;
                $rootScope.$on('$routeChangeStart', function(event, newRoute) {
                    newRoute.back = back;
                });
                createView();
                $location.url('/page1');
                $rootScope.$digest();
                testutils.ng.tick(10);

                $location.url('/page2');
                $rootScope.$digest();
                testutils.ng.tick(10);

                back = true;
                $location.url('/page1');
                $rootScope.$digest();

                expect(viewEl.children().eq(0)).toHaveClass("page2Animation-reverse-leave");
                expect(viewEl.children().eq(1)).toHaveClass("page2Animation-reverse-enter");
            });
        });
    });

    describe('watch the jqmView expression', function () {
        it('loads the template via $http', function () {
            inject(function ($templateCache, $httpBackend, $rootScope) {
                $httpBackend.when('GET', someTemplateUrl).respond('<div id="somePage"></div>');
                createView('$route');

                scope.$route = someTemplateUrl;
                $rootScope.$apply();
                $httpBackend.flush();
                expect(viewEl.children().eq(0).attr("id")).toBe('somePage');
            });
        });
        it('loads the template via $templateCache', function () {
            inject(function ($templateCache, $rootScope) {
                $templateCache.put(someTemplateUrl, '<div id="somePage"></div>');
                createView('$route');

                scope.$route = someTemplateUrl;
                $rootScope.$apply();
                expect(viewEl.children().eq(0).attr("id")).toBe('somePage');
            });
        });
        it('clears the content when the expression is empty', function () {
            inject(function ($templateCache, $rootScope) {
                $templateCache.put(someTemplateUrl, '<div id="somePage"></div>');
                createView('$route');

                scope.$route = someTemplateUrl;
                $rootScope.$apply();
                expect(viewEl.children().length).toBe(1);

                scope.$route = null;
                $rootScope.$apply();
                expect(viewEl.children().length).toBe(0);
            });
        });
        it('does not change if only the locals change', function() {
            inject(function ($templateCache, $rootScope) {
                $templateCache.put(someTemplateUrl, '<div id="somePage"></div>');
                createView('$route');

                scope.$route = {
                    templateUrl: someTemplateUrl,
                    locals: {}
                };
                $rootScope.$apply();
                var viewScope = viewEl.children().scope();

                scope.$route.locals.a = 1;
                $rootScope.$apply();
                expect(viewEl.children().scope()).toBe(viewScope);
            });

        });
        it('calls the controller with the locals on route change', function () {
            var someKey = 'someKey',
                someValue = 'someValue';
            module(function ($provide) {
                $provide.value(someKey, someValue);
            });
            inject(function ($templateCache, $rootScope) {
                var someController = jasmine.createSpy('someController');
                $templateCache.put(someTemplateUrl, '<div id="somePage"></div>');
                createView('$route');

                scope.$route = {
                    templateUrl: someTemplateUrl,
                    controller: ['a', 'someKey', '$scope', someController],
                    locals: {
                        a: 1
                    }
                };
                $rootScope.$apply();
                expect(scope.$route.locals.$scope).toBeDefined();
                expect(someController).toHaveBeenCalledWith(1, someValue, scope.$route.locals.$scope);
            });
        });

        // This test is adapted from ngInclude
        it('should discard pending xhr callbacks if a new template is requested before the current ' +
            'finished loading', function() {
            var $http = {
                get: jasmine.createSpy('get').andCallFake(function(url) {
                    var defer;
                    inject(function($q) {
                        defer = $q.defer();
                        $httpResults[url] = defer;
                    });
                    return defer.promise;
                })
            }, $httpResults = {};
            module(function($provide) {
                $provide.value('$http', $http);
            });
            inject(function ($rootScope, $compile) {
                createView('$route');
                expect($httpResults).toEqual({});

                scope.$route = 'myUrl1';
                $rootScope.$digest();
                expect($httpResults.myUrl1).toBeDefined();

                scope.$route = 'myUrl2';
                $rootScope.$digest();
                expect($httpResults.myUrl2).toBeDefined();

                expect(viewEl.text()).toBe('');
                $httpResults.myUrl2.resolve({
                    data: 'url2'
                });
                $rootScope.$digest();
                expect(viewEl.text()).toBe('url2');

                $httpResults.myUrl1.resolve({
                    data: 'url1'
                });
                $rootScope.$digest();
                expect(viewEl.text()).toBe('url2');
            });
        });
    });

    /**
     * Note: We copied the tests from angular's ngView over to here,
     * as we also copied parts of ngView into ngCachingView!
     */
    describe('original ngView specs', function () {
        var element;

        var jqLite = angular.element,
            noop = angular.noop,
            forEach = angular.forEach,
            nodeName_ = function (element) {
                return element.nodeName ? element.nodeName : element[0].nodeName;
            },
            dealoc = function (element) {
                element.remove();
            };

        beforeEach(module(function ($provide) {
            $provide.value('$window', angular.mock.createMockWindow());
            return function ($rootScope, $compile, $animator) {
                element = $compile('<div jqm-view onload="load()"></div>')($rootScope);
                $animator.enabled(true);
            };
        }));


        afterEach(function () {
            dealoc(element);
        });


        it('should do nothing when no routes are defined',
            inject(function ($rootScope, $compile, $location) {
                $location.path('/unknown');
                $rootScope.$digest();
                expect(element.text()).toEqual('');
            }));


        it('should instantiate controller after compiling the content', function () {
            var log = [], controllerScope,
                Ctrl = function ($scope) {
                    controllerScope = $scope;
                    log.push('ctrl-init');
                };

            module(function ($compileProvider, $routeProvider) {
                $compileProvider.directive('compileLog', function () {
                    return {
                        compile: function () {
                            log.push('compile');
                        }
                    };
                });

                $routeProvider.when('/some', {templateUrl: '/tpl.html', controller: Ctrl});
            });

            inject(function ($route, $rootScope, $templateCache, $location) {
                $templateCache.put('/tpl.html', [200, '<div compile-log>partial</div>', {}]);
                $location.path('/some');
                $rootScope.$digest();

                expect(controllerScope.$parent).toBe($rootScope);
                expect(controllerScope).toBe($route.current.scope);
                expect(log).toEqual(['compile', 'ctrl-init']);
            });
        });


        it('should instantiate controller with an alias', function () {
            var log = [], controllerScope,
                Ctrl = function ($scope) {
                    this.name = 'alias';
                    controllerScope = $scope;
                };

            module(function ($compileProvider, $routeProvider) {
                $routeProvider.when('/some', {templateUrl: '/tpl.html', controller: Ctrl, controllerAs: 'ctrl'});
            });

            inject(function ($route, $rootScope, $templateCache, $location) {
                $templateCache.put('/tpl.html', [200, '<div></div>', {}]);
                $location.path('/some');
                $rootScope.$digest();

                expect(controllerScope.ctrl.name).toBe('alias');
            });
        });


        it('should support string controller declaration', function () {
            var MyCtrl = jasmine.createSpy('MyCtrl');

            module(function ($controllerProvider, $routeProvider) {
                $controllerProvider.register('MyCtrl', ['$scope', MyCtrl]);
                $routeProvider.when('/foo', {controller: 'MyCtrl', templateUrl: '/tpl.html'});
            });

            inject(function ($route, $location, $rootScope, $templateCache) {
                $templateCache.put('/tpl.html', [200, '<div></div>', {}]);
                $location.path('/foo');
                $rootScope.$digest();

                expect($route.current.controller).toBe('MyCtrl');
                expect(MyCtrl).toHaveBeenCalledWith(element.contents().scope());
            });
        });


        it('should load content via xhr when route changes', function () {
            module(function ($routeProvider) {
                $routeProvider.when('/foo', {templateUrl: 'myUrl1'});
                $routeProvider.when('/bar', {templateUrl: 'myUrl2'});
            });

            inject(function ($rootScope, $compile, $httpBackend, $location, $route) {
                expect(element.text()).toEqual('');

                $location.path('/foo');
                $httpBackend.expect('GET', 'myUrl1').respond('<div>{{1+3}}</div>');
                $rootScope.$digest();
                $httpBackend.flush();
                expect(element.text()).toEqual('4');

                $location.path('/bar');
                $httpBackend.expect('GET', 'myUrl2').respond('angular is da best');
                $rootScope.$digest();
                $httpBackend.flush();
                expect(element.text()).toEqual('angular is da best');
            });
        });


        it('should use inline content route changes', function () {
            module(function ($routeProvider) {
                $routeProvider.when('/foo', {template: '<div>{{1+3}}</div>'});
                $routeProvider.when('/bar', {template: 'angular is da best'});
                $routeProvider.when('/blank', {template: ''});
            });

            inject(function ($rootScope, $compile, $location, $route) {
                expect(element.text()).toEqual('');

                $location.path('/foo');
                $rootScope.$digest();
                expect(element.text()).toEqual('4');

                $location.path('/bar');
                $rootScope.$digest();
                expect(element.text()).toEqual('angular is da best');

                $location.path('/blank');
                $rootScope.$digest();
                expect(element.text()).toEqual('');
            });
        });


        it('should remove all content when location changes to an unknown route', function () {
            module(function ($routeProvider) {
                $routeProvider.when('/foo', {templateUrl: 'myUrl1'});
            });

            inject(function ($rootScope, $compile, $location, $httpBackend, $route) {
                $location.path('/foo');
                $httpBackend.expect('GET', 'myUrl1').respond('<div>{{1+3}}</div>');
                $rootScope.$digest();
                $httpBackend.flush();
                expect(element.text()).toEqual('4');

                $location.path('/unknown');
                $rootScope.$digest();
                expect(element.text()).toEqual('');
            });
        });


        it('should chain scopes and propagate evals to the child scope', function () {
            module(function ($routeProvider) {
                $routeProvider.when('/foo', {templateUrl: 'myUrl1'});
            });

            inject(function ($rootScope, $compile, $location, $httpBackend, $route) {
                $rootScope.parentVar = 'parent';

                $location.path('/foo');
                $httpBackend.expect('GET', 'myUrl1').respond('<div>{{parentVar}}</div>');
                $rootScope.$digest();
                $httpBackend.flush();
                expect(element.text()).toEqual('parent');

                $rootScope.parentVar = 'new parent';
                $rootScope.$digest();
                expect(element.text()).toEqual('new parent');
            });
        });


        it('should be possible to nest ngView in ngInclude', function () {

            module(function ($routeProvider) {
                $routeProvider.when('/foo', {templateUrl: 'viewPartial.html'});
            });

            inject(function ($httpBackend, $location, $route, $compile, $rootScope) {
                $httpBackend.whenGET('includePartial.html').respond('view: <div jqm-view></div>');
                $httpBackend.whenGET('viewPartial.html').respond('content');
                $location.path('/foo');

                var elm = $compile(
                    '<div>' +
                        'include: <ng:include src="\'includePartial.html\'"> </ng:include>' +
                        '</div>')($rootScope);
                $rootScope.$digest();
                $httpBackend.flush();

                expect(elm.text()).toEqual('include: view: content');
                expect($route.current.templateUrl).toEqual('viewPartial.html');
                dealoc(elm);
            });
        });


        it('should discard pending xhr callbacks if a new route is requested before the current ' +
            'finished loading', function () {
            // this is a test for a bad race condition that affected feedback

            module(function ($routeProvider) {
                $routeProvider.when('/foo', {templateUrl: 'myUrl1'});
                $routeProvider.when('/bar', {templateUrl: 'myUrl2'});
            });

            inject(function ($route, $rootScope, $location, $httpBackend) {
                expect(element.text()).toEqual('');

                $location.path('/foo');
                $httpBackend.expect('GET', 'myUrl1').respond('<div>{{1+3}}</div>');
                $rootScope.$digest();
                $location.path('/bar');
                $httpBackend.expect('GET', 'myUrl2').respond('<div>{{1+1}}</div>');
                $rootScope.$digest();
                $httpBackend.flush(); // now that we have two requests pending, flush!

                expect(element.text()).toEqual('2');
            });
        });


        it('should be async even if served from cache', function () {
            module(function ($routeProvider) {
                $routeProvider.when('/foo', {controller: noop, templateUrl: 'myUrl1'});
            });

            inject(function ($route, $rootScope, $location, $templateCache) {
                $templateCache.put('myUrl1', [200, 'my partial', {}]);
                $location.path('/foo');

                var called = 0;
                // we want to assert only during first watch
                $rootScope.$watch(function () {
                    called++;
                    if (!called) {
                        expect(element.text()).toBe('');
                    }
                });

                $rootScope.$digest();
                expect(element.text()).toBe('my partial');
            });
        });

        it('should fire $contentLoaded event when content compiled and linked', function () {
            var log = [];
            var logger = function (name) {
                return function () {
                    log.push(name);
                };
            };
            var Ctrl = function ($scope) {
                $scope.value = 'bound-value';
                log.push('init-ctrl');
            };

            module(function ($routeProvider) {
                $routeProvider.when('/foo', {templateUrl: 'tpl.html', controller: Ctrl});
            });

            inject(function ($templateCache, $rootScope, $location) {
                $rootScope.$on('$routeChangeStart', logger('$routeChangeStart'));
                $rootScope.$on('$routeChangeSuccess', logger('$routeChangeSuccess'));
                $rootScope.$on('$viewContentLoaded', logger('$viewContentLoaded'));

                $templateCache.put('tpl.html', [200, '{{value}}', {}]);
                $location.path('/foo');
                $rootScope.$digest();

                expect(element.text()).toBe('bound-value');
                expect(log).toEqual([
                    '$routeChangeStart', '$routeChangeSuccess', 'init-ctrl', '$viewContentLoaded' ]);
            });
        });

        it('should destroy previous scope', function () {
            module(function ($routeProvider) {
                $routeProvider.when('/foo', {templateUrl: 'tpl.html'});
            });

            inject(function ($templateCache, $rootScope, $location) {
                $templateCache.put('tpl.html', [200, 'partial', {}]);

                expect($rootScope.$$childHead).toBeNull();
                expect($rootScope.$$childTail).toBeNull();

                $location.path('/foo');
                $rootScope.$digest();

                expect(element.text()).toBe('partial');
                expect($rootScope.$$childHead).not.toBeNull();
                expect($rootScope.$$childTail).not.toBeNull();

                $location.path('/non/existing/route');
                $rootScope.$digest();

                expect(element.text()).toBe('');
                expect($rootScope.$$childHead).toBeNull();
                expect($rootScope.$$childTail).toBeNull();
            });
        });


        it('should evaluate onload expression after linking the content', function () {
            module(function ($routeProvider) {
                $routeProvider.when('/foo', {templateUrl: 'tpl.html'});
            });

            inject(function ($templateCache, $location, $rootScope) {
                $templateCache.put('tpl.html', [200, '{{1+1}}', {}]);
                $rootScope.load = jasmine.createSpy('onload');

                $location.url('/foo');
                $rootScope.$digest();
                expect($rootScope.load).toHaveBeenCalled();
            });
        });


        it('should set $scope and $controllerController on the view', function () {
            function MyCtrl($scope) {
                $scope.state = 'WORKS';
                $scope.ctrl = this;
            }

            module(function ($routeProvider) {
                $routeProvider.when('/foo', {templateUrl: 'tpl.html', controller: MyCtrl});
            });

            inject(function ($templateCache, $location, $rootScope, $route) {
                $templateCache.put('tpl.html', [200, '<div>{{state}}</div>', {}]);

                $location.url('/foo');
                $rootScope.$digest();
                expect(element.text()).toEqual('WORKS');

                var div = element.find('div');
                expect(nodeName_(div.parent())).toEqual('DIV');

                expect(div.scope()).toBe($route.current.scope);
                expect(div.scope().hasOwnProperty('state')).toBe(true);
                expect(div.scope().state).toEqual('WORKS');

                expect(div.controller()).toBe($route.current.scope.ctrl);
            });
        });

        it('should not set $scope or $controllerController on top level text elements in the view', function () {
            function MyCtrl($scope) {
            }

            module(function ($routeProvider) {
                $routeProvider.when('/foo', {templateUrl: 'tpl.html', controller: MyCtrl});
            });

            inject(function ($templateCache, $location, $rootScope, $route) {
                $templateCache.put('tpl.html', '<div></div>  ');
                $location.url('/foo');
                $rootScope.$digest();

                forEach(element.contents(), function (node) {
                    if (node.nodeType === 3 /* text node */) {
                        expect(jqLite(node).scope()).not.toBe($route.current.scope);
                        expect(jqLite(node).controller()).not.toBeDefined();
                    } else {
                        expect(jqLite(node).scope()).toBe($route.current.scope);
                        expect(jqLite(node).controller()).toBeDefined();
                    }
                });
            });
        });

        describe('ngAnimate ', function () {
            var window, vendorPrefix;
            var body, element;

            function appendHtml(html) {
                var childs;
                body.append(html);
                childs = body.children();
                element = childs.eq(childs.length - 1);
                return element;
            }

            function applyCSS(element, cssProp, cssValue) {
                element.css(cssProp, cssValue);
                element.css(vendorPrefix + cssProp, cssValue);
            }

            beforeEach(function () {
                // we need to run animation on attached elements;
                body = jqLite(document.body);
            });

            afterEach(function () {
                dealoc(element);
            });

            beforeEach(module(function ($provide, $routeProvider) {
                $provide.value('$window', window = angular.mock.createMockWindow());
                $routeProvider.when('/foo', {controller: noop, templateUrl: '/foo.html'});
                return function ($sniffer, $templateCache, $animator) {
                    vendorPrefix = '-' + $sniffer.vendorPrefix + '-';
                    $templateCache.put('/foo.html', [200, '<div>data</div>', {}]);
                    $animator.enabled(true);
                };
            }));

            it('should fire off the enter animation + add and remove the css classes',
                inject(function ($compile, $rootScope, $sniffer, $location, $templateCache) {
                    element = $compile(appendHtml('<div jqm-view ng-animate="{enter: \'custom-enter\'}"></div>'))($rootScope);

                    $location.path('/foo');
                    $rootScope.$digest();
                    //if we add the custom css stuff here then it will get picked up before the animation takes place
                    var child = jqLite(element.children()[0]);
                    applyCSS(child, 'transition', '1s linear all');

                    if ($sniffer.transitions) {
                        expect(child.attr('class')).toContain('custom-enter');
                        window.setTimeout.expect(1).process();

                        expect(child.attr('class')).toContain('custom-enter-active');
                        window.setTimeout.expect(1000).process();
                    } else {
                        expect(window.setTimeout.queue).toEqual([]);
                    }

                    expect(child.attr('class')).not.toContain('custom-enter');
                    expect(child.attr('class')).not.toContain('custom-enter-active');
                }));

            it('should fire off the leave animation + add and remove the css classes',
                inject(function ($compile, $rootScope, $sniffer, $location, $templateCache) {
                    $templateCache.put('/foo.html', [200, '<div>foo</div>', {}]);
                    element = $compile(appendHtml('<div jqm-view ng-animate="{leave: \'custom-leave\'}"></div>'))($rootScope);

                    $location.path('/foo');
                    $rootScope.$digest();

                    //if we add the custom css stuff here then it will get picked up before the animation takes place
                    var child = jqLite(element.children()[0]);
                    applyCSS(child, 'transition', '1s linear all');

                    $location.path('/');
                    $rootScope.$digest();

                    if ($sniffer.transitions) {
                        expect(child.attr('class')).toContain('custom-leave');
                        window.setTimeout.expect(1).process();

                        expect(child.attr('class')).toContain('custom-leave-active');
                        window.setTimeout.expect(1000).process();
                    } else {
                        expect(window.setTimeout.queue).toEqual([]);
                    }

                    expect(child.attr('class')).not.toContain('custom-leave');
                    expect(child.attr('class')).not.toContain('custom-leave-active');
                }));

            it('should catch and use the correct duration for animations',
                inject(function ($compile, $rootScope, $sniffer, $location, $templateCache) {
                    $templateCache.put('/foo.html', [200, '<div>foo</div>', {}]);
                    element = $compile(appendHtml(
                        '<div ' +
                            'jqm-view ' +
                            'ng-animate="{enter: \'customEnter\'}">' +
                            '</div>'
                    ))($rootScope);

                    $location.path('/foo');
                    $rootScope.$digest();

                    //if we add the custom css stuff here then it will get picked up before the animation takes place
                    var child = jqLite(element.children()[0]);
                    applyCSS(child, 'transition', '0.5s linear all');

                    if ($sniffer.transitions) {
                        window.setTimeout.expect(1).process();
                        window.setTimeout.expect($sniffer.transitions ? 500 : 0).process();
                    } else {
                        expect(window.setTimeout.queue).toEqual([]);
                    }
                }));


            it('should not double compile when route changes', function () {
                module(function ($routeProvider, $animationProvider, $provide) {
                    $routeProvider.when('/foo', {template: '<div ng-repeat="i in [1,2]">{{i}}</div>'});
                    $routeProvider.when('/bar', {template: '<div ng-repeat="i in [3,4]">{{i}}</div>'});
                    $animationProvider.register('my-animation-leave', function () {
                        return {
                            start: function (element, done) {
                                done();
                            }
                        };
                    });
                });

                inject(function ($rootScope, $compile, $location, $route, $window, $rootElement, $sniffer) {
                    element = $compile(appendHtml('<div jqm-view onload="load()" ng-animate="\'my-animation\'"></div>'))($rootScope);

                    $location.path('/foo');
                    $rootScope.$digest();
                    if ($sniffer.transitions) {
                        $window.setTimeout.expect(1).process();
                        $window.setTimeout.expect(0).process();
                    }
                    expect(element.text()).toEqual('12');

                    $location.path('/bar');
                    $rootScope.$digest();
                    expect(n(element.text())).toEqual('1234');
                    if ($sniffer.transitions) {
                        $window.setTimeout.expect(1).process();
                        $window.setTimeout.expect(1).process();
                    } else {
                        $window.setTimeout.expect(1).process();
                    }
                    expect(element.text()).toEqual('34');

                    function n(text) {
                        return text.replace(/\r\n/m, '').replace(/\r\n/m, '');
                    }
                });
            });
        });
    });
});
