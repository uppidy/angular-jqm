/**
 * @ngdoc directive
 * @name jqm.directive:jqmCachingView
 * @restrict ECA
 *
 * @description
 * # Overview
 * `jqmCachingView` extends `jqmView` in the following way:
 *
 * - views are only compiled once and then stored in the `jqmViewCache`. By this, changes between views are very fast.
 * - controllers are still instantiated on every route change. Their changes to the scope get cleared
 *   when the view is left.
 *
 * Side effects:
 * - For animations between multiple routes that use the same template add the attribute `allow-same-view-animation`
 *   to the root of your view. Background: The DOM nodes and scope of the compiled template are reused for every view.
 *   With this attribute `jqmCachingView` will create two instances of the template internally.
 *   Example: Click on Moby and directly after this on Gatsby. Both routes use the same template and therefore
 *   the template has to contain `allow-same-view-animation`.
 *
 * @requires jqmViewCache
 *
 * @param {expression=} jqmCachingView angular expression evaluating to a route (optional). See `jqmView` for details.
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

      <div jqm-caching-view style="height:300px"></div>
    </file>

    <file name="book.html">
    <div jqm-page allow-same-view-animation>
      <div jqm-header><h1>Book {{book.params.bookId}}</h1></div>
      The book contains ...
    </div>
    </file>

    <file name="chapter.html">
    <div jqm-page allow-same-view-animation>
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
*/
jqmModule.directive('jqmCachingView', ['jqmViewDirective', 'jqmViewCache', '$injector', '$q',
function (jqmViewDirectives, jqmViewCache, $injector, $q) {
  return {
    restrict: 'A',
    template: '<%= inlineTemplate("templates/jqmView.html") %>',
    replace: true,
    transclude: true,
    controller: ['$scope', '$element', JqmCachingViewCtrl],
    link: function(scope, element, attr, ctrl) {
      forEach(jqmViewDirectives, function (directive) {
        directive.link(scope, element, attr, ctrl);
      });
    }
  };

  function JqmCachingViewCtrl($scope, $element) {
    var self = this;
    angular.forEach(jqmViewDirectives, function (directive) {
      $injector.invoke(directive.controller, self, {
        $scope: $scope,
        $element: $element
      });
    });
    //let other directives require this like a jqmView
    $element.data('$jqmViewController', this);

    var loadViewNoCache = this.loadView;

    this.viewWatchAttr = 'jqmCachingView';
    this.loadView = loadViewCached;

    function loadViewCached(templateUrl, template, lastView) {
      var cachedView = jqmViewCache.get(templateUrl);
      if (!templateUrl && template) {
        return loadViewNoCache('', template);
      }
      if (cachedView) {
        //If we're trying to load a view that's already loaded, just create a new instance for now
        if (cachedView === lastView) {
          return loadViewNoCache(templateUrl, template);
        }
        return $q.when(cachedView);
      } else {
        return self.fetchView(templateUrl).then(function(view) {
          view.clear = cachingViewClear;
          view.scope.$destroy = scopeClearAndDisconnect;
          view.element.remove = detachNodes;
          return jqmViewCache.put(templateUrl, view);
        });
      }
    }
  }

  function cachingViewClear() {
    /*jshint -W040:true*/
    this.element.remove(); //detachNodes()
    this.scope.$destroy(); //disconnectAndClear()
    if (this.element.hasClass('ng-animate')) {
      this.element.triggerHandler('animationend');
    }
    this.element.removeClass('ui-page-active');
  }

  // Note: element.remove() would
  // destroy all data associated to those nodes,
  // e.g. widgets, ...
  function detachNodes() {
    /*jshint -W040:true*/
    var i, node, parent;
    for (i = 0; i < this.length; i++) {
      node = this[i];
      parent = node.parentNode;
      if (parent) {
        parent.removeChild(node);
      }
    }
  }
  function scopeClearAndDisconnect() {
    /*jshint -W040:true*/
    var prop;
    // clear all watchers, listeners and all non angular properties,
    // so we have a fresh scope!
    this.$$watchers = [];
    this.$$listeners = [];
    for (prop in this) {
      if (this.hasOwnProperty(prop) && prop.charAt(0) !== '$') {
        delete this[prop];
      }
    }
    this.$disconnect();
  }
}]);
