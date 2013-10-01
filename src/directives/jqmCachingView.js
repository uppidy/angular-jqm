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
jqmModule.directive('jqmCachingView', ['jqmViewDirective', 'jqmViewCache', '$injector',
  function (jqmViewDirectives, jqmViewCache, $injector) {
    return {
      restrict: 'ECA',
      controller: ['$scope', JqmCachingViewCtrl],
      require: 'jqmCachingView',
      compile: function(element, attr) {
        var links = [];
        angular.forEach(jqmViewDirectives, function (directive) {
          links.push(directive.compile(element, attr));
        });
        return function (scope, element, attr, ctrl) {
          angular.forEach(links, function (link) {
            link(scope, element, attr, ctrl);
          });
        };
      }
    };

    function JqmCachingViewCtrl($scope) {
      var self = this;
      angular.forEach(jqmViewDirectives, function (directive) {
        $injector.invoke(directive.controller, self, {$scope: $scope});
      });
      this.loadAndCompile = loadAndCompile;
      this.watchAttrName = 'jqmCachingView';
      this.onClearContent = onClearContent;

      // --------

      function loadAndCompile(templateUrl) {
        return jqmViewCache.load($scope, templateUrl).then(function (cacheEntry) {
          var templateInstance = cacheEntry.next();
          templateInstance.scope.$reconnect();
          return templateInstance;
        });
      }

      function onClearContent(contents) {
        // Don't destroy the data of the elements when they are removed
        contents.remove = detachNodes;
      }

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
}]);
