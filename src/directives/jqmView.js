/**
 * @ngdoc directive
 * @name jqm.directive:jqmView
 * @restrict ECA
 *
 * @description
 * # Overview
 * `jqmView` extends `ngView` in the following way:
 *
 * - animations can also be specified on routes using the `animation` property (see below).
 * - animations can also be specified in the template using the `view-animation` attribute on a root element.
 * - when the user hits the back button, the last animation is executed with the `-reverse` suffix.
 * - instead of using `$route` an expression can be specified as value of the directive. Whenever
 *   the value of this expression changes `jqmView` updates accordingly.
 * - content that has been declared inside of `ngView` stays there, so you can mix dynamically loaded content with
 *   fixed content.
 *
 * @param {expression=} jqmView angular expression evaluating to a route.
 *
 *   * `{string}`: This will be interpreted as the url of a template.
 *   * `{object}`: A route object with the same properties as `$route.current`:
 *   - `templateUrl` - `{string=}` - the url for the template
 *   - `controller` - `{string=|function()=}` - the controller
 *   - `controllerAs` - `{string=}` - the name of the controller in the scope
 *   - `locals` - `{object=}` - locals to be used when instantiating the controller
 *   - `back` - `{boolean=}` - whether the animation should be executed in reverse
 *   - `animation` - `{string=|function()=}` - the animation to use. If `animation` is a function it will
 *    be called using the `$injector` with the extra locals `$routeParams` (`route.params`) and `$scope` (the scope of `jqm-view`).
 *
 * @param {boolean=} viewDeepWatch If you have a route expression in `jqmView`, this will tell the
 *        $watch to use 'value-watch' to see if the view has changed instead of 'reference-watch'.
 *
 * @scope
 * @example
 <example module="jqmView">
 <file name="index.html">
 Choose:
 <a href="#/Book/Moby">Moby</a> |
 <a href="#/Book/Moby/ch/1">Moby: Ch1</a> |
 <a href="#/Book/Gatsby">Gatsby</a> |
 <a href="#/Book/Gatsby/ch/4?key=value">Gatsby: Ch4</a> |
 <a href="#/Book/Scarlet">Scarlet Letter</a><br/>

 <div jqm-view style="height:300px"></div>
 </file>

 <file name="book.html">
 <div jqm-page>
 <div jqm-header><h1>Book {{book.params.bookId}}</h1></div>
 The book contains ...
 </div>
 </file>

 <file name="chapter.html">
 <div jqm-page>
 <div jqm-header><h1>Chapter {{chapter.params.chapterId}} of {{chapter.params.bookId}}</h1></div>
 This chapter contains ...
 </div>
 </file>

 <file name="script.js">
 angular.module('jqmView', ['jqm'], function($routeProvider) {
      $routeProvider.when('/Book/:bookId', {
      templateUrl: 'book.html',
      controller: BookCntl,
      controllerAs: 'book',
      animation: 'page-slide'
      });
      $routeProvider.when('/Book/:bookId/ch/:chapterId', {
      templateUrl: 'chapter.html',
      controller: ChapterCntl,
      controllerAs: 'chapter',
      animation: 'page-slide'
      });
    });

 function BookCntl($routeParams) {
      this.params = $routeParams;
    }

 function ChapterCntl($routeParams) {
      this.params = $routeParams;
    }
 </file>
 </example>
 */jqmModule.directive('jqmView',
['$compile', '$templateCache', '$http', '$q', '$route', '$controller', '$injector', '$nextFrame', '$sniffer', '$animate', '$rootScope',
function($compile, $templateCache, $http, $q, $route, $controller, $injector, $nextFrame, $sniffer, $animate, $rootScope) {

  var SEQUENTIAL_ANIMATIONS = {
    fade: true,
    pop: true,
    slidefade: true,
    slidedown: true,
    slideup: true,
    flip: true,
    turn: true,
    flow: true
  };

  return {
    restrict: 'A',
    template: '<%= inlineTemplate("templates/jqmView.html") %>',
    replace: true,
    transclude: true,
    controller: ['$scope', '$element', JqmViewCtrl],
    link: link
  };

  function link(scope, element, attr, jqmViewCtrl) {
    var lastView,
      leavingView, //store this so we can cancel the leaving view early if need
      onloadExp = attr.onload || '',
      viewAttrGetter,
      changeCounter = 0;

    if (attr[jqmViewCtrl.viewWatchAttr]) {
      watchRouteAttr();
    } else {
      watchRoute();
    }

    //For some reason, a scope.$watch(attr[watchAttr], onChange, true) doesn't work - it always gives infinite digest error.
    //And we do need to check value, so people can do '<div jqm-view="{templateUrl: 'myTemplate.html', controller: 'MyCtrl'}"> etc
    var oldRoute, next=0;
    function watchRouteAttr() {
      scope.$watch(attr[jqmViewCtrl.viewWatchAttr], routeChanged, (!!attr.viewDeepWatch));
    }

    function watchRoute() {
      scope.$on('$routeChangeSuccess', update);
      update();
      function update() {
        routeChanged($route.current);
      }
    }

    function routeChanged(route) {
      route = route || {};

      var thisChangeId = ++changeCounter;

      var template = route.locals ? route.locals.$template : route.template;
      var templateUrl = isString(route) && route || route.loadedTemplateUrl || route.templateUrl;
      if (templateUrl || template) {
        jqmViewCtrl.loadView(templateUrl, template, lastView).then(function(view) {
          if (thisChangeId !== changeCounter) {
            return;
          }
          viewLoaded(route, view);
        });
      } else {
        changeView(null, lastView);
        lastView = null;
      }
    }

    function viewLoaded(route, view) {
      var locals = route.locals || {};
      var controller;

      var animationName = figureOutAnimation(route, view);
      var animationExists = JQM_ANIMATIONS.indexOf(animationName.replace(/^page-/,'')) > -1;
      if (!animationExists) {
        changeView(view, lastView);
      } else {
        performViewAnimation(animationName, route.back, view, lastView);
      }
      view.scope.$reconnect();

      locals.$scope = view.scope;
      if (route.controller) {
        controller = $controller(route.controller, locals);
        if (route.controllerAs) {
          view.scope[route.controllerAs] = controller;
        }
        view.element.data('$ngControllerController', controller);
      }

      $rootScope.$broadcast('$viewContentLoaded', view.element);
      view.scope.$eval(onloadExp);
      //no $anchorScroll because we don't use browser scrolling anymore

      scope.$theme = view.element.scope().$theme;
      lastView = view;
    }

    function changeView(view, lastView) {
      if (lastView) {
        lastView.clear();
      }
      if (view) {
        element.append(view.element);
        view.element.addClass('ui-page-active');
      }
    }

    function performViewAnimation(animationName, reverse, view, lastView) {
      var isSequential = SEQUENTIAL_ANIMATIONS[animationName.replace(/^page-/, '')];
      var viewportClass = 'ui-mobile-viewport-transitioning viewport-'+animationName.replace('page-', '');
      var animationClassName = animationName + (reverse ? ' reverse' : '');

      view.element.addClass(animationClassName);
      if (lastView) {
        lastView.element.addClass(animationClassName);
      }
      if (leavingView) {
        leavingView.element.triggerHandler('animationend');
      }
      leavingView = lastView;
      element.addClass(viewportClass);

      if (isSequential && lastView) {
        element.append(view.element);
        $animate.leave(lastView.element, function() {
          //animations only fire after digest
          scope.$apply(function() {
            $animate.enter(view.element, element, null, onDone);
          });
        });
      } else {
        $animate.enter(view.element, element, null, onDone);
        if (lastView) {
          $animate.leave(lastView.element);
        }
      }

      function onDone() {
        leavingView = null;
        if (lastView) {
          lastView.element.removeClass(animationClassName);
          lastView.clear();
        }
        view.element.removeClass(animationClassName);
        view.element.addClass('ui-page-active');

        element.removeClass(viewportClass);
      }
    }

    function figureOutAnimation(route, view) {
      var reverse = route.back,
      animationName = '';

      if (reverse) {
        animationName = lastView && lastView.animationName || animationName;
      }
      if (!animationName) {
        if (route.animation) {
          if (angular.isFunction(route.animation) || isArray(route.animation)) {
            animationName = $injector.invoke(route.animation, null, {
              $scope: scope,
              $routeParams: route.params
            });
          } else {
            animationName = route.animation;
          }
        } else {
          //Find animation in the new page's className
          forEach((view.element[0].className || '').split(' '), function(klass) {
            //Eg if view element has 'page-fade' on it we know to fade
            if (klass.substring(0,5) === 'page-' && $injector.has('.' + klass + '-animation')) {
              animationName = animationName || klass;
            }
          });
        }
      }
      return maybeDegradeAnimation(animationName);
    }


    function maybeDegradeAnimation(animationName) {
      if (!animationName || !$sniffer.animations) {
        return '';
      } else if (!$sniffer.cssTransform3d) {
        return 'page-fade';
      }
      return animationName;
    }
  }

  function JqmViewCtrl($scope, $element) {
    this.$scope = $scope;
    this.$element = $element;

    this.loadView = loadView;
    this.fetchView = fetchView;
    this.viewWatchAttr = 'jqmView';

    function loadView(templateUrl, template) {
      if (template) {
        return $q.when(compile(template));
      } else {
        return fetchView(templateUrl);
      }
    }

    function fetchView(templateUrl) {
      return $http.get(templateUrl, {cache:$templateCache}).then(function(response) {
        return compile(response.data);
      });
    }

    function compile(template) {
      //We compile the element as a child of our view, so that everything 'links together' correctly
      var scope = $scope.$new();

      var element = jqLite('<div></div>').html(template).children();
      $element.append(element);

      var view = {
        scope: scope,
        element: $compile(element)(scope),
        clear: viewClear
      };

      scope.$disconnect();

      //Disconnect this from the parent before finishing
      forEach(element, function(node) {
        node.parentNode.removeChild(node);
      });

      return view;
    }
  }

  function viewClear() {
    /*jshint -W040:true*/
    this.element.remove();
    this.element = null;
    this.scope.$destroy();
    this.scope = null;
  }
}]);

