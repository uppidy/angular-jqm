/*! angular-jqm - v0.0.1-SNAPSHOT - 2013-10-16
 * https://github.com/angular-widgets/angular-jqm
 * Copyright (c) 2013 OPITZ CONSULTING GmbH; Licensed MIT */
(function(window, angular) {
    "use strict";
/**
 * @ngdoc overview
 * @name jqm
 * @description
 *
 * 'jqm' is the one module that contains all jqm code.
 */

//Save bytes and make code more readable - these vars will be minifed. Angularjs does this
var jqmModule = angular.module("jqm", ["ngTouch", "ngRoute", "ngAnimate", "ajoslin.scrolly", "ui.bootstrap.position"]),
  noop = angular.noop,
  isDefined = angular.isDefined,
  jqLite = angular.element,
  forEach = angular.forEach,
  isString = angular.isString,
  equals = angular.equals,
  isObject = angular.isObject,
  isArray = angular.isArray,
  extend = angular.extend;

var JQM_ANIMATIONS = [
  'slide',
  'fade',
  'pop',
  'slidefade',
  'slidedown',
  'slideup',
  'flip',
  'turn',
  'flow',
  'modal'
];


registerJqmAnimations(JQM_ANIMATIONS);

function registerJqmAnimations(animations) {
  for (var i=0; i<animations.length; i++) {
    registerJqmAnimation(animations[i]);
  }
}

function registerJqmAnimation(animationName) {
  jqmModule.animation('.' + animationName, ['$timeout', '$animationComplete', function($timeout, $animationComplete) {
    function makeAnimationFn(className) {
      return function(element, done) {
        var unbind;
        element.removeClass('in out');
        $timeout(function() {
          element.addClass(className);
          unbind = $animationComplete(element, done, true);
        }, 1, false);
        return function done(cancelled) {
          //Might be cancelled before timeout
          (unbind || noop)();
        };
      };
    }
    var inAnimation = makeAnimationFn('in');
    var outAnimation = makeAnimationFn('out');
    return {
      enter: inAnimation,
      leave: outAnimation,
      move: inAnimation,
      addClass: function(element, className, done) {
        if (className === 'out') {
          outAnimation(element, done);
        } else {
          inAnimation(element, done);
        }
      },
      removeClass: function(element, className, done) {
        if (className === 'out') {
          inAnimation(element, done);
        } else {
          outAnimation(element, done);
        }
      }
    };
  }]);
}


registerJqmPageAnimations(JQM_ANIMATIONS);

function registerJqmPageAnimations(animations) {
  for (var i=0; i<animations.length; i++) {
    registerAnimation(animations[i], 'page-' + animations[i]);
  }
}

function registerAnimation(animationName, ngAnimationName) {

  jqmModule.animation('.' + ngAnimationName, ['$animationComplete', '$timeout', function($animationComplete, $timeout) {

    return {
      enter: animateIn,
      leave: animateOut,
      move: animateIn,
      addClass: function(element, className, done) {
        if (className === "in") {
          animateIn(element, done);
        } else {
          animateOut(element, done);
        }
      },
      removeClass: function(element, className, done) {
        if (className === "out") {
          animateIn(element, done);
        } else {
          animateOut(element, done);
        }
      },
    };

    function animateIn(element, done) {
      var unbind, finished;
      // Set the new page to display:block but don't show it yet.
      // This code is from jquery mobile 1.3.1, function "createHandler".
      // Prevent flickering in phonegap container: see comments at #4024 regarding iOS
      element.addClass('ui-page-pre-in ui-page-active ' + animationName);
      element.css('z-index', -10);

      $timeout(function() {
        if (!finished) {
          animate();
        }
      }, 1, false);

      function animate() {
        element.removeClass('ui-page-pre-in');
        element.css('z-index', '');
        element.addClass('in');
        unbind = $animationComplete(element, function() {
          done();
        });
      }

      function cleanup(cancelled) {
        finished = true;
        (unbind || noop)();
        element.removeClass('ui-page-pre-in in ' + animationName);
        element.css('z-index', '');
      }

      return cleanup;
    }

    function animateOut(element, done) {
      var unbind, finished;
      element.addClass(animationName);

      $timeout(function() {
        if (!finished) {
          animate();
        }
      }, 1, false);

      function animate() {
        element.addClass('out');
        unbind = $animationComplete(element, function() {
          done();
        });
      }

      function cleanup(cancelled) {
        finished = true;
        (unbind || noop)();
        element.removeClass('ui-page-active out ' + animationName);
      }
      
      return cleanup;
    }

  }]);
}

/**
 * @ngdoc directive
 * @name jqm.directive:jqmButton
 * @restrict A
 *
 * @description
 * Creates a jquery mobile button on the given element.
 *
 * If created on an anchor `<a>` tag, the button will be treated as a link button.
 *
 * @param {submit|reset=} jqmButton The button type - if specified, the button will be treated as an input with the given value as its type. Otherwise, the button will just be a normal button.
 * @param {string=} icon Defines an icon for the button
 * @param {left|right|top|bottom=} iconpos Defines the Position of the icon, default is 'left'
 * @param {boolean=} mini Whether or not to use the mini layout
 * @param {boolean=} inline Whether or not to make the button inline (smaller)
 * @param {boolean=} shadow Whether or not to give the button shadows (default true)
 * @param {boolean=} corners Whether or not to give the button shadows (default true)
 *
 * @example
<example module="jqm">
  <file name="index.html">
  <div>
    <div jqm-button icon="ui-icon-search" ng-click>Do some search</div>
    <a jqm-button icon="ui-icon-home" data-mini="true" href="#/api" ng-click>Go home, mini!</a>
    <hr />
    <h3>Form With Vertical Group</h3>
    <form action="http://foobar3000.com/echo" method="GET">
      <div jqm-textinput ng-model="$root.value" ng-init="$root.value='banana'" name="stuff"></div>
      <div jqm-controlgroup>
      <div jqm-button="submit" ng-click icon="ui-icon-check" iconpos="right">Submit to foobar3030.com</div>
      <div jqm-button="reset" ng-click icon="ui-icon-minus" iconpos="right">"reset" it away!</div>
      </div>
    </form>
    <hr />
    <h3>Horizontal Group</h3>
    <div jqm-controlgroup type="horizontal">
      <div jqm-button ng-click>One</div>
      <div jqm-button ng-click>Two</div>
      <div jqm-button ng-click>Three</div>
    </div>
  </div>
  </file>
</example>
 */
jqmModule.directive('jqmButton', ['jqmClassDirective', 'jqmOnceClassDirective', function(jqmClassDirectives, jqmOnceClassDirectives) {
  var isDef = angular.isDefined;
  return {
    restrict: 'A',
    transclude: true,
    template: '<span class="ui-btn-inner">  <span class="ui-btn-text" ng-transclude></span>  <span ng-if="$scopeAs.jqmBtn.icon" class="ui-icon {{$parent.icon}}">&nbsp;</span></span>',
    scope: {
      iconpos: '@',
      icon: '@',
      mini: '@',
      shadow: '@',
      corners: '@',
      inline: '@'
    },
    require: '^?jqmControlGroup',
    compile: function(elm, attr) {
      attr.shadow = isDef(attr.shadow) ? attr.shadow==='true' : 'true';
      attr.corners = isDef(attr.corners) ? attr.corners==='true' : 'true';

      elm[0].className += ' ui-btn';
      attr.$set('jqmOnceClass', "{{$scopeAs.jqmBtn.getIconPos() ? 'ui-btn-icon-'+$scopeAs.jqmBtn.getIconPos() : ''}}");
      attr.$set('jqmClass',
        "{'ui-first-child': $scopeAs.jqmBtn.$position.first," +
        "'ui-submit': $scopeAs.jqmBtn.type," +
        "'ui-last-child': $scopeAs.jqmBtn.$position.last," +
        "'ui-shadow': $scopeAs.jqmBtn.shadow," +
        "'ui-btn-corner-all': $scopeAs.jqmBtn.corners," +
        "'ui-mini': $scopeAs.jqmBtn.isMini()," +
        "'ui-btn-inline': $scopeAs.jqmBtn.isInline()}"
      );

      if (elm[0].tagName.toLowerCase() === 'input') {
        //Inputs can't have templates inside of them so throw an error
        throw new Error("Cannot have jqm-button <input> - use <button> instead!");
      }

      //Eg <div jqm-button="submit"> --> we put a <input type="submit"> inside
      var buttonEl;
      if (attr.jqmButton) {
        buttonEl = angular.element('<button>');
        buttonEl.addClass('ui-btn-hidden');
        buttonEl.attr("type", attr.jqmButton);
        if (attr.name) {
          buttonEl.attr("name", attr.name);
        }
        if (attr.ngDisabled) {
          buttonEl.attr('ngDisabled', attr.ngDisabled);
        } else if (attr.disabled) {
          buttonEl.attr('disabled', attr.disabled);
        }
        elm.append(buttonEl);
      }

      return function(scope, elm, attr, controlGroup) {
        elm.addClass('ui-btn-up-' + scope.$theme);

        scope.$$scopeAs = 'jqmBtn';
        scope.isMini = isMini;
        scope.getIconPos = getIconPos;
        scope.isInline = isInline;
        scope.type = attr.jqmButton;

        angular.forEach(jqmClassDirectives, function(directive) {
          directive.link(scope, elm, attr);
        });
        angular.forEach(jqmOnceClassDirectives, function(directive) {
          directive.link(scope, elm, attr);
        });

        function isMini() {
          return scope.mini || (controlGroup && controlGroup.$scope.mini);
        }
        function getIconPos() {
          return scope.iconpos || (controlGroup && controlGroup.$scope.iconpos) || (scope.icon ? 'left' : '');
        }
        function isInline() {
          return (controlGroup && controlGroup.$scope.type === "horizontal") || scope.inline;
        }

      };
    }
  };
}]);

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
    template: '<div class="ui-mobile-viewport" jqm-class="\'ui-overlay-\'+$theme" jqm-transclude></div>',
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

/**
 * @ngdoc directive
 * @name jqm.directive:jqmCheckbox
 * @restrict A
 *
 * @description 
 * Creates a jquery mobile checkbox on the given element.
 * 
 * Anything inside the `jqm-checkbox` tag will be a label.
 *
 * @param {string=} ngModel Assignable angular expression to data-bind to.
 * @param {string=} disabled Whether this checkbox is disabled.
 * @param {string=} mini Whether this checkbox is mini.
 * @param {string=} iconpos The position of the icon for this element. "left" or "right".
 * @param {string=} ngTrueValue The value to which the expression should be set when selected.
 * @param {string=} ngFalseValue The value to which the expression should be set when not selected.
 *
 * @example
<example module="jqm">
  <file name="index.html">
  <div jqm-checkbox ng-model="checky">
    My value is: {{checky}}
  </div>
  <div jqm-checkbox mini="true" iconpos="right" ng-model="isDisabled">
    I've got some options. Toggle me to disable the guy below.
  </div>
  <div jqm-checkbox disabled="{{isDisabled ? 'disabled' : ''}}" 
    ng-model="disably" ng-true-value="YES" ng-false-value="NO">
    I can be disabled! My value is: {{disably}}
  </div>
  </file>
</example>
 */
jqmModule.directive('jqmCheckbox', [function () {
  return {
    restrict: 'A',
    transclude: true,
    replace: true,
    template: '<div jqm-scope-as="jqmCheckbox"   class="ui-checkbox" jqm-class="{\'ui-disabled\': $scopeAs.jqmCheckbox.disabled}">  <label jqm-class="{\'ui-checkbox-on\': $scopeAs.jqmCheckbox.checked, \'ui-checkbox-off\': !$scopeAs.jqmCheckbox.checked,       \'ui-first-child\': $scopeAs.jqmCheckbox.$position.first, \'ui-last-child\': $scopeAs.jqmCheckbox.$position.last,       \'ui-mini\':$scopeAs.jqmCheckbox.isMini(), \'ui-fullsize\':!$scopeAs.jqmCheckbox.isMini(),       \'ui-btn-active\':$scopeAs.jqmCheckbox.isActive(),       \'ui-btn-icon-left\': $scopeAs.jqmCheckbox.getIconPos()!=\'right\', \'ui-btn-icon-right\': $scopeAs.jqmCheckbox.getIconPos()==\'right\'}"       ng-click="$scopeAs.jqmCheckbox.toggleChecked()"       jqm-once-class="ui-btn-up-{{$scopeAs.jqmCheckbox.$theme}}"       class="ui-btn ui-btn-corner-all">    <span class="ui-btn-inner">      <span class="ui-btn-text" ng-transclude></span>      <span jqm-class="{\'ui-icon-checkbox-on\': $scopeAs.jqmCheckbox.checked, \'ui-icon-checkbox-off\': !$scopeAs.jqmCheckbox.checked}"          class="ui-icon ui-icon-shadow"></span>    </span>  </label>  <input type="checkbox" ng-model="$scopeAs.jqmCheckbox.checked"></div>',
    scope: {
      disabled: '@',
      mini: '@',
      iconpos: '@'
    },
    require: ['?ngModel','^?jqmControlgroup'],
    link: function (scope, element, attr, ctrls) {
      var ngModelCtrl = ctrls[0],
        jqmControlGroupCtrl = ctrls[1];
      scope.toggleChecked = toggleChecked;
      scope.isMini = isMini;
      scope.getIconPos = getIconPos;
      scope.isActive = isActive;

      if (ngModelCtrl) {
        enableNgModelCollaboration();
      }

      function isMini() {
        return scope.mini || (jqmControlGroupCtrl && jqmControlGroupCtrl.$scope.mini);
      }

      function getIconPos() {
        return scope.iconpos || (jqmControlGroupCtrl && jqmControlGroupCtrl.$scope.iconpos);
      }

      function isActive() {
        return (jqmControlGroupCtrl && jqmControlGroupCtrl.$scope.type === "horizontal") && scope.checked;
      }

      function toggleChecked() {
        if (scope.disabled) {
          return;
        }
        scope.checked = !scope.checked;
        if (ngModelCtrl) {
          ngModelCtrl.$setViewValue(scope.checked);
        }
      }

      function enableNgModelCollaboration() {
        // For the following code, see checkboxInputType in angular's sources
        var trueValue = attr.ngTrueValue,
          falseValue = attr.ngFalseValue;

        if (!angular.isString(trueValue)) {
          trueValue = true;
        }
        if (!angular.isString(falseValue)) {
          falseValue = false;
        }

        ngModelCtrl.$render = function () {
          scope.checked = ngModelCtrl.$viewValue;
        };

        ngModelCtrl.$formatters.push(function (value) {
          return value === trueValue;
        });

        ngModelCtrl.$parsers.push(function (value) {
          return value ? trueValue : falseValue;
        });
      }

    }
  };
}]);

jqmModule.directive('jqmClass', [function() {
  return {
    link: function(scope, element, attr) {
      var oldVal;

      scope.$watch(attr.jqmClass, jqmClassWatchAction, true);

      attr.$observe('class', function(value) {
        var jqmClass = scope.$eval(attr.jqmClass);
        jqmClassWatchAction(jqmClass);
      });

      function jqmClassWatchAction(newVal) {
        if (oldVal && !angular.equals(newVal,oldVal)) {
          changeClass('removeClass', oldVal);
        }
        changeClass('addClass', newVal);
        oldVal = angular.copy(newVal);
      }

      function changeClass(fn, classVal) {
        if (angular.isObject(classVal) && !angular.isArray(classVal)) {
          var classes = [];
          angular.forEach(classVal, function(v, k) {
            if (v) { classes.push(k); }
          });
          classVal = classes;
        }
        element[fn](angular.isArray(classVal) ? classVal.join(' ') : classVal);
      }
    }
  };
}]);

jqmModule.directive('jqmControlgroup', function() {
  return {
    restrict: 'A',
    replace: true,
    transclude: true,
    template: '<fieldset class="ui-controlgroup"   jqm-class="{\'ui-mini\': mini, \'ui-shadow\': shadow, \'ui-corner-all\': corners!=\'false\',   \'ui-controlgroup-vertical\': type!=\'horizontal\', \'ui-controlgroup-horizontal\': type==\'horizontal\'}">  <div ng-if="legend" class="ui-controlgroup-label">    <legend>{{legend}}</legend>  </div>  <div class="ui-controlgroup-controls" ng-transclude jqm-position-anchor></div></fieldset>',
    scope: {
      mini: '@',
      iconpos: '@',
      type: '@',
      shadow: '@',
      corners: '@',
      legend: '@'
    },
    controller: ['$scope', JqmControlGroupCtrl]
  };

  function JqmControlGroupCtrl($scope) {
    this.$scope = $scope;
  }
});

/**
 * @ngdoc directive
 * @name jqm.directive:jqmFieldcontain
 * @restrict A
 *
 * @description
 * Used to wrap a label/form element pair.
 *
 * @example
 <example module="jqm">
 <file name="index.html">
  <div jqm-fieldcontain>
    <label for="name">Your Name:</label>
    <div jqm-textinput ng-model="name" />
  </div>
 </file>
 </example>
 */
jqmModule.directive('jqmFieldcontain', function() {
  return {
    restrict: 'A',
    compile: function(elm, attr) {
      elm[0].className += ' ui-field-contain ui-body ui-br';
    }
  };
});

/**
 * @ngdoc directive
 * @name jqm.directive:jqmFlip
 * @restrict A
 *
 * @description
 * Creates a jquery mobile flip switch on the given element.
 *
 * Anything inside the `jqm-flip` tag will be a label.
 *
 * Labels for the on and off state can be omitted.
 * If no values for the on and off state are specified on will be bound to true and off to false.
 *
 * A theme can be set with the jqm-theme directive and specific styles can be set with the ng-style parameter.
 * This is necessary to extend the width of the flip for long labels.
 *
 * @param {expression=} ngModel Assignable angular expression to data-bind to.
 * @param {string=} disabled Whether this flip switch is disabled.
 * @param {string=} mini Whether this flip should be displayed minified.
 * @param {string=} ngOnLabel The label which should be shown when fliped on (optional).
 * @param {string=} ngOnValue The value to which the expression should be set when fliped on (optional, default: true).
 * @param {string=} ngOffLabel The label which should be shown when fliped off (optional).
 * @param {string=} ngOffValue The value to which the expression should be set when fliped off (optional, default:false).
 *
 * @example
<example module="jqm">
  <file name="index.html">
   <p>Selected value is: {{flip}}</p>
   <div jqm-flip ng-model="flip">
   Default values true/false
   </div>
   <div jqm-flip ng-model="flip" jqm-theme="e">
   With theme
   </div>
   <div jqm-flip ng-model="flip2" on-label="On" on-value="On" off-label="Off" off-value="Off">
   My value is {{flip2}}
   </div>
  </file>
</example>
 */
jqmModule.directive('jqmFlip', [function () {
  return {
    restrict: 'A',
    transclude: true,
    replace: true,
    template: '<div jqm-scope-as="jqmFlip">    <label class="ui-slider" ng-transclude></label>    <div class="ui-slider ui-slider-switch ui-btn-down-{{$scopeAs.jqmFlip.theme}} ui-btn-corner-all"       jqm-class="{\'ui-disabled\': $scopeAs.jqmFlip.disabled,            \'ui-mini\': $scopeAs.jqmFlip.isMini()}"       ng-click="$scopeAs.jqmFlip.toggle()">       <span class="ui-slider-label ui-slider-label-a ui-btn-active ui-btn-corner-all" ng-style="{width: $scopeAs.jqmFlip.onStyle + \'%\'}">{{$scopeAs.jqmFlip.onLabel}}</span>       <span class="ui-slider-label ui-slider-label-b ui-btn-down-{{$scopeAs.jqmFlip.theme}} ui-btn-corner-all" ng-style="{width: $scopeAs.jqmFlip.offStyle + \'%\'}">{{$scopeAs.jqmFlip.offLabel}}</span>        <div class="ui-slider-inneroffset">          <a class="ui-slider-handle ui-slider-handle-snapping ui-btn ui-btn-corner-all ui-btn-up-{{$scopeAs.jqmFlip.theme}} ui-shadow"           title="{{$scopeAs.jqmFlip.toggleLabel}}"           ng-style="{left: $scopeAs.jqmFlip.onStyle + \'%\'}">          <span class="ui-btn-inner"><span class="ui-btn-text"></span></span>          </a>        </div>    </div></div>',
    scope: {
      onLabel: '@',
      onValue: '@',
      offLabel: '@',
      offValue: '@',
      mini: '@',
      disabled: '@'
    },
    require: ['?ngModel', '^?jqmControlgroup'],
    link: function (scope, element, attr, ctrls) {
      var ngModelCtrl = ctrls[0];
      var jqmControlGroupCtrl = ctrls[1];
      var parsedOn;
      var parsedOff;

      scope.theme = scope.$theme || 'c';
      scope.isMini = isMini;
      scope.onValue = angular.isDefined(attr.onValue) ? scope.onValue : true;
      scope.offValue = angular.isDefined(attr.offValue) ? scope.offValue : false;

      initToggleState();
      bindClick();

      function initToggleState () {
        ngModelCtrl.$parsers.push(parseBoolean);
        parsedOn = parseBoolean(scope.onValue);
        parsedOff = parseBoolean(scope.offValue);
        ngModelCtrl.$render = updateToggleStyle;
        ngModelCtrl.$viewChangeListeners.push(updateToggleStyle);
      }

      function updateToggleStyle () {
        updateNaNAsOffValue();
        var toggled = isToggled();
        scope.toggleLabel = toggled ? scope.onLabel : scope.offLabel;
        scope.onStyle = toggled ? 100 : 0;
        scope.offStyle = toggled ? 0 : 100;
      }

      // this has to be done in the change listener,
      // otherwise the potential scope value would be overwritten with the off value
      function updateNaNAsOffValue () {
        if (!ngModelCtrl.$viewValue) {
          ngModelCtrl.$setViewValue(parsedOff);
        }
      }

      function bindClick () {
        scope.toggle = function () {
          ngModelCtrl.$setViewValue(isToggled() ? parsedOff : parsedOn);
        };
      }

      function isToggled () {
        return ngModelCtrl.$viewValue === parsedOn;
      }

      function isMini() {
        return scope.mini || (jqmControlGroupCtrl && jqmControlGroupCtrl.$scope.mini);
      }

      function parseBoolean(value) {
        if (value === 'true') {
          return true;
        } else if (value === 'false') {
          return false;
        }
        return value;
      }
    }
  };
}]);

/**
 * @ngdoc directive
 * @name jqm.directive:jqmHeader
 * @restrict A
 *
 * @description
 * Defines the header of a `jqm-page`. For a persistent header, put the header directly below `jqmView` / `jqmCachingView`.
 *
 * @example
 <example module="jqm">
 <file name="index.html">
 <div jqm-page class="jqm-standalone-page" style="height: 100px;">
   <div jqm-header>
   <h1>Header of Page1</h1>
   </div>
   Hello world!
 </div>
 </file>
 </example>
 */
/**
 * @ngdoc directive
 * @name jqm.directive:jqmFooter
 * @restrict A
 *
 * @description
 * Defines the footer of a `jqm-page`. For a persistent footer, put the footer directly below `jqmView` / `jqmCachingView`.
 *
 * @example
 <example module="jqm">
 <file name="index.html">
 <div jqm-page class="jqm-standalone-page" style="height: 100px;">
   Hello world!
   <div jqm-footer>
   <h1>Footer of Page1</h1>
   </div>
 </div>
 </file>
 </example>
 */
jqmModule.directive({
  jqmHeader: jqmHeaderFooterDirective('$header', 'ui-header'),
  jqmFooter: jqmHeaderFooterDirective('$footer', 'ui-footer'),
  h1: hxDirective,
  h2: hxDirective,
  h3: hxDirective,
  h4: hxDirective,
  h5: hxDirective,
  h6: hxDirective
});

function jqmHeaderFooterDirective(scopeName, className) {
  return ['jqmConfig', function(jqmConfig) {
    return {
      restrict: 'A',
      // Own scope as we have a different default theme
      // than the page.
      scope: true,
      require: ['^?jqmPage', '^?jqmView'],
      controller: noop,
      link: function(scope, element, attr, ctrls) {
        var hasExplicitTheme = scope.hasOwnProperty('$theme');
        var parentCtrl = ctrls[0] || ctrls[1];

        if (!hasExplicitTheme) {
          scope.$theme = jqmConfig.secondaryTheme;
        }
        element.addClass(className + ' ui-bar-'+scope.$theme);

        //Store header/footer existance on parent - this is so
        //headers can be added or removed with ng-if and
        //the jqm-content-with-* classes will adjust accordingly.
        //See jqmPage.js and jqmPage.html
        if (parentCtrl) {
          //Move headers outside of ui-content in jqmPages
          parentCtrl.$element.prepend(element);
          parentCtrl.$scope[scopeName] = true;

          element.bind('$destroy', function() {
            parentCtrl.$scope[scopeName] = false;
          });
        }
      }
    };
  }];
}

function hxDirective() {
  return {
    restrict: 'E',
    require: ['?^jqmHeader', '?^jqmFooter'],
    link: function(scope, element, attr, ctrls) {
      if (ctrls[0] || ctrls[1]) {
        element.addClass("ui-title");
      }
    }
  };
}

/*
function jqmWrappedDirective(directiveName, templateUrl, directiveObject) {
  var actualDirectiveName = directiveName + 'Actual';
  
  jqmModule.directive(directiveName, wrapperDirective);
  jqmModule.directive(actualDirectiveName, directiveObject);

  return jqmModule;
  
  function wrapperDirective($compile, $http, $templateCache) {
  return {
    restrict: 'A',
    //We need to run *before* the other directives on this element
    priority: -Number.MAX_VALUE, 
    //Isolate scope removes side effects of linking other directives on this elm
    scope: {},
    compile: function(cElement, attr) {
    var templatePromise = $http.get(templateUrl, {cache:$templateCache})
      .then(function(response) { return response.data; });
    
    //We're going to wrap our directive, then re-compile.  
    //When we re-compile, we want to put on the *real*  directive
    attr.$set(actualDirectiveName, attr[directiveName]);
    attr.$set(directiveName, null);
    
    var clone = cElement.clone();
    
    return function postLink(scope, element, attr) {
      templatePromise.then(function(tpl) {
      var wrapper = angular.element(tpl);
      element.replaceWith(wrapper);
      
      //We want the actual directive to compile on the original element, then share
      //scope with its wrapper elements. 
      $compile(clone)(scope.$parent);
      $compile(wrapper)(clone.scope());
      wrapper.append(clone);
      });
    };
    }
  };
  }
}

jqmWrappedDirective('jqmInput', 'templates/jqmInput.html', [function() {
  return {
    scope: {
      clearBtn: '@',
      clearnBtnText: '@',
      disabled: '@ngDisabled',
      mini: '@'
    },
    template: '<input class="ui-input-text ui-body-{{$scopeAs.jqmTextinput.$theme}}" jqm-class="{\'mobile-textinput-disabled ui-disabled\': $scopeAs.jqmTextinput.disabled}">',
    replace: true,
    controller: angular.noop, //just to be required
    require: '?ngModel',
    link: function(scope, elm, attr, modelCtrl) {
      scope.$$scopeAs= 'jqmTextinput';

      scope.showClearBtn = function() {
        return modelCtrl ? modelCtrl.$viewValue : elm.val();
      };
      scope.clearBtnClicked = function() {
        elm.val('');
        if (modelCtrl) {
          modelCtrl.$setViewValue('');
        }
      };
    }
  };
}]);
*/


jqmModule.directive('jqmLiCount', [function() {
  return {
    restrict: 'A',
    require: '^jqmLiLink',
    link: function(scope, elm, attr, jqmLiLinkCtrl) {
      jqmLiLinkCtrl.$scope.hasCount = true;
      elm.addClass('ui-li-count ui-btn-corner-all ui-btn-up-' + scope.$theme);
    }
  };
}]);


/**
 * @ngdoc directive
 * @name jqm.directive:jqmLiEntry
 * @restrict A
 *
 * @description
 * Creates a jQuery mobile entry list item. This is just a plain entry, instead of a
 * {@link jqm.directive:jqmLiLink jqmLiLink}.
 *
 * Must be inside of a {@link jqm.direcitve:jqmListview jqmListview}.
 */

/**
 * @ngdoc directive
 * @name jqm.directive:jqmLiDivider
 * @restrict A
 *
 * @description
 * Creates a jQuery mobile list divider.
 *
 * Must be inside of a {@link jqm.direcitve:jqmListview jqmListview}
 */
jqmModule.directive({
  jqmLiEntry: jqmLiEntryDirective(false),
  jqmLiDivider: jqmLiEntryDirective(true)
});
function jqmLiEntryDirective(isDivider) {
  return function() {
    return {
      restrict: 'A',
      replace: true,
      transclude: true,
      scope: {},
      template: isDivider ?
        '<li jqm-scope-as="jqmLi"  class="ui-li ui-li-divider ui-bar-{{$scopeAs.jqmLi.$theme}}"  jqm-class="{\'ui-first-child\': $scopeAs.jqmLi.$position.first, \'ui-last-child\': $scopeAs.jqmLi.$position.last}"  ng-transclude></li>' :
        '<li jqm-scope-as="jqmLi"  class="ui-li ui-li-static ui-btn-up-{{$scopeAs.jqmLi.$theme}}"  jqm-class="{\'ui-first-child\': $scopeAs.jqmLi.$position.first, \'ui-last-child\': $scopeAs.jqmLi.$position.last}"  ng-transclude></li>'
    };
  };
}

/**
 * @ngdoc directive
 * @name jqm.directive:jqmLiLink
 * @restrict A
 *
 * @description
 * Creates a jquery mobile list item link entry.
 *
 * Must be inside of a {@link jqm.directive:jqmListview jqmListview}
 *
 * - Add a `<img jqm-li-thumb>` inside for a thumbnail.
 * - Add a `<span jqm-li-count>` inside for a count.
 *
 * @param {string=} jqmLiLInk The link, or href, that this listitem should go to when clicked.
 * @param {string=} icon What icon to use for the link.  Default 'ui-icon-arrow-r'.
 * @param {string=} iconpos Where to put the icon. Default 'right'.
 * @param {string=} iconShadow Whether the icon should have a shadow or not. Default true.
 *
 */
jqmModule.directive('jqmLiLink', [function() {
  var isdef = angular.isDefined;
  return {
    restrict: 'A',
    transclude: true,
    replace: true,
    template: '<li class="ui-li ui-btn" jqm-scope-as="jqmLiLink"jqm-once-class="{{$scopeAs.jqmLiLink.icon ? \'ui-li-has-arrow ui-btn-icon-\'+$scopeAs.jqmLiLink.iconpos : \'\'}} ui-btn-up-{{$theme}}"  jqm-class="{\'ui-first-child\': $scopeAs.jqmLiLink.$position.first,   \'ui-last-child\': $scopeAs.jqmLiLink.$position.last,   \'ui-li-has-thumb\': $scopeAs.jqmLiLink.hasThumb,   \'ui-li-has-count\': $scopeAs.jqmLiLink.hasCount}">  <div class="ui-btn-inner ui-li">    <div class="ui-btn-text">    <a ng-href="{{$scopeAs.jqmLiLink.link}}" class="ui-link-inherit" ng-transclude>    </a>  </div>  <span ng-show="$scopeAs.jqmLiLink.icon"     class="ui-icon {{$scopeAs.jqmLiLink.icon}}"     jqm-class="{\'ui-icon-shadow\': $scopeAs.jqmLiLink.iconShadow}">    &nbsp;  </span>  </div></li>',
    controller: ['$scope', JqmLiController],
    scope: {
      icon: '@',
      iconpos: '@',
      iconShadow: '@',
      link: '@jqmLiLink',
      //hasThumb and hasCount set by jqmLiCount and jqmLiThumb
    },
    compile: function(element, attr) {
      attr.icon = isdef(attr.icon) ? attr.icon : 'ui-icon-arrow-r';
      attr.iconpos = isdef(attr.iconpos) ? attr.iconpos : 'right';
      attr.iconShadow = isdef(attr.iconShadow) ? attr.iconShadow : true;
    }
  };
  function JqmLiController($scope) {
    this.$scope = $scope;
  }
}]);


jqmModule.directive('jqmLiThumb', [function() {
  return {
    restrict: 'A',
    require: '^jqmLiLink',
    link: function(scope, elm, attr, jqmLiLinkCtrl) {
      jqmLiLinkCtrl.$scope.hasThumb = true;
      elm.addClass('ui-li-thumb');
    }
  };
}]);

/**
 * @ngdoc directive
 * @name jqm.directive:jqmListview
 * @restrict A
 *
 * @description 
 * Creates a jQuery mobile listview.  Add jqmLiDivider, jqmLiEntry, and/or jqmLiLinks inside.
 *
 * @param {string=} inset Whether this listview should be inset or not. Default false.
 * @param {string=} shadow Whether this listview should have a shadow or not (only applies if inset). Default true.
 * @param {string=} shadow Whether this listview should have corners or not (only applies if inset). Default true.
 *
 * @example
<example module="jqm">
  <file name="index.html">
  <div ng-init="list=[1,2,3,4,5,6]"></div>
  <h3>Entries</h3>
  <ul jqm-listview>
    <li jqm-li-entry>Hello, entry!</li>
    <li jqm-li-entry>Another entry!</li>
    <li jqm-li-entry>More!! entry!</li>
    <li jqm-li-divider jqm-theme="b">Divider</li>
    <li jqm-li-entry>Hello, entry!</li>
    <li jqm-li-entry>Another entry!</li>
    <li jqm-li-entry>More!! entry!</li>
  </ul>
  <h3>Links</h3>
  <ul jqm-listview>
    <li ng-repeat="i in list" jqm-li-link="#/{{i}}">{{i}}</li>
    <li jqm-li-divider jqm-theme="b">Here's a thumbnail with a count</li>
    <li jqm-li-link icon="ui-icon-home">
    <img jqm-li-thumb src="http://placekitten.com/80/80">
    <h2 class="ui-li-heading">Kitten!</h2>
    <p class="ui-li-desc">Subtext here. Yeah.</p>
    <span jqm-li-count>44</span>
    </li>
  </ul>
  </file>
</example>
 */
jqmModule.directive('jqmListview', [function() {
  var isdef = angular.isDefined;
  return {
    restrict: 'A',
    replace: true,
    transclude: true,
    template: '<ul class="ui-listview" jqm-scope-as="jqmListview"  jqm-class="{\'ui-listview-inset\': $scopeAs.jqmListview.inset,  \'ui-corner-all\': $scopeAs.jqmListview.inset && $scopeAs.jqmListview.corners,   \'ui-shadow\': $scopeAs.jqmListview.inset && $scopeAs.jqmListview.shadow}"  ng-transclude jqm-position-anchor></ul>',
    scope: {
      inset: '@'
    },
    link: function(scope, element, attr) {
      //We do this instead of '@' binding because "false" is actually truthy
      //And these default to true
      scope.shadow = isdef(attr.shadow) ? (attr.shadow==='true') : true;
      scope.corners = isdef(attr.corners) ? (attr.corners==='true') : true;
    }
  };
}]);

/*
 * This is intentionally not documented; internal use only
 */
jqmModule.directive('jqmOnceClass', ['$interpolate', function($interpolate) {
  return {
    link: function(scope, elm, attr) {
      elm.addClass( $interpolate(attr.jqmOnceClass)(scope) );
    }
  };
}]);

/**
 * @ngdoc directive
 * @name jqm.directive:jqmPage
 * @restrict A
 *
 * @description
 * Creates a jquery mobile page. Also adds automatic overflow scrolling for it's content.
 *
 * @example
 <example module="jqm">
 <file name="index.html">
 <div jqm-page style="height: 100px;">
 <p>Hello world!</p>
 <p>New Line</p>
 <p>New Line</p>
 <p>New Line</p>
 <p>New Line</p>
 <p>New Line</p>
 <p>New Line</p>
 <p>New Line</p>
 <p>New Line</p>
 <p>New Line</p>
 <p>New Line</p>
 </div>
 </file>
 </example>
 */
jqmModule.directive('jqmPage', ['$rootScope', '$controller', '$scroller', function ($rootScope, $controller, $scroller) {
  return {
    restrict: 'A',
    template: '<div class="ui-page" jqm-class="\'ui-body-\'+$theme">  <div class="ui-content"    jqm-class="{\'jqm-content-with-header\': $header, \'jqm-content-with-footer\': $footer}"    jqm-transclude>  </div></div>',
    replace: true,
    transclude: true,
    require: '^?jqmView',
    controller: ['$scope', '$element', '$scroller', JqmPageController],
    link: function(scope, element, attr, jqmViewCtrl) {
      if (!jqmViewCtrl) {
        element.addClass('ui-page-active jqm-standalone-page');
      }
    }
  };

  function JqmPageController($scope, $element, $scroller) {
    this.$scope = $scope;
    this.$element = $element;

    var content = jqLite($element[0].querySelector('.ui-content'));
    var scroller = $scroller(content);

    this.scroll = function(newPos, easeTime) {
      if (arguments.length) {
        if (arguments.length === 2) {
          scroller.transformer.easeTo({x:0,y:newPos}, easeTime);
        } else {
          scroller.transformer.setTo({x:0,y:newPos});
        }
      }
      return scroller.transformer.pos;
    };
    this.scrollHeight = function() {
      scroller.calculateHeight();
      return scroller.scrollHeight;
    };
    this.outOfBounds = function(pos) {
      return scroller.outOfBounds(pos);
    };
  }
}]);

/**
 * @ngdoc directive
 * @name jqm.directive:jqmPanel
 * @restrict A
 *
 * @description
 * Creates a jquery mobile panel.  Must be placed inside of a jqm-panel-container.
 *
 * @param {expression=} opened Assignable angular expression to data-bind the panel's open state to.
 * @param {string=} display Default 'reveal'.  What display type the panel has. Available: 'reveal', 'overlay', 'push'.
 * @param {string=} position Default 'left'. What position the panel is in. Available: 'left', 'right'.
 *
 * @require jqmPanelContainer.
 */
jqmModule.directive('jqmPanel', function() {
  var isDef = angular.isDefined;
  return {
    restrict: 'A',
    require: '^jqmPanelContainer',
    replace: true,
    transclude: true,
    template: '<div class="ui-panel ui-panel-closed"  ng-class="\'ui-panel-position-\'+position+\' ui-panel-display-\'+display+\' ui-body-\'+$theme+\' ui-panel-animate\'">  <div class="ui-panel-inner" ng-transclude></div></div>',
    // marker controller.
    controller: angular.noop,
    scope: {
      display: '@',
      position: '@'
    },
    compile: function(element, attr) {
      attr.display = isDef(attr.display) ? attr.display : 'reveal';
      attr.position = isDef(attr.position) ? attr.position : 'left';

      return function(scope, element, attr, jqmPanelContainerCtrl) {
        if (scope.position !== 'left' && scope.position !== 'right') {
          throw new Error("jqm-panel position is invalid. Expected 'left' or 'right', got '"+scope.position+"'");
        }
        jqmPanelContainerCtrl.addPanel({
          scope: scope,
          element: element
        });
      };
    }
  };
});

/**
 * @ngdoc directive
 * @name jqm.directive:jqmPanelContainer
 * @restrict A
 *
 * @description
 * A container for jquery mobile panels.
 *
 * If you wish to use this with a view, you want the jqm-panel-container as the
 * parent of your view and your panels. For example:
 * <pre>
 * <div jqm-panel-container="myPanel">
 *   <div jqm-panel>My Panel!</div>
 *   <div jqm-view></div>
 * </div>
 * </pre>
 *
 * @param {expression=} jqmPanelContainer Assignable angular expression to data-bind the panel's open state to.
 *            This is either `left` (show left panel), `right` (show right panel) or null.
 *
 * @example
<example module="jqm">
  <file name="index.html">
   <div ng-init="state={}"></div>
   <div jqm-panel-container="state.openPanel" style="height:300px;overflow:hidden">
    <div jqm-panel position="left">
      Hello, left panel!
    </div>
    <div jqm-panel position="right" display="overlay">
     Hello, right panel!
    </div>
    <div style="background: white">
       Opened panel: {{state.openPanel}}
       <button ng-click="state.openPanel='left'">Open left</button>
       <button ng-click="state.openPanel='right'">Open right</button>
    </div>
   </div>
  </file>
</example>
 */

jqmModule.directive('jqmPanelContainer', ['$timeout', '$transitionComplete', '$sniffer', function ($timeout, $transitionComplete, $sniffer) {
  return {
    restrict: 'A',
    transclude: true,
    replace: true,
    template: '<div jqm-scope-as="pc" jqm-transclude class="jqm-panel-container">  <div class="ui-panel-dismiss"    ng-click="$scopeAs.pc.openPanelName = null"     ng-class="$scopeAs.pc.openPanelName ? \'ui-panel-dismiss-open ui-panel-dismiss-\'+$scopeAs.pc.openPanelName : \'\'">  </div></div>',
    scope: {
      openPanelName: '=jqmPanelContainer'
    },
    controller: ['$scope', '$element', JqmPanelContainerCtrl]
  };
  function JqmPanelContainerCtrl($scope, $element) {
    var panels = {},
      panelContent;

    this.addPanel = function (panel) {
      panels[panel.scope.position] = panel;
    };
    this.getPanel = function(position) {
      return panels[position];
    };

    $scope.$watch('$scopeAs.pc.openPanelName', openPanelChanged);
    if (!$sniffer.animations) {
      $scope.$watch('$scopeAs.pc.openPanelName', transitionComplete);
    } else {
      $transitionComplete($element, transitionComplete);
    }

    function openPanelChanged() {
      updatePanelContent();
      angular.forEach(panels, function (panel) {
        var opened = panel.scope.position === $scope.openPanelName;
        if (opened) {
          panel.element.removeClass('ui-panel-closed');
          $timeout(function () {
            $element.addClass('jqm-panel-container-open');
            panel.element.addClass('ui-panel-open');
          }, 1, false);
        } else {
          panel.element.removeClass('ui-panel-open ui-panel-opened');
          $element.removeClass('jqm-panel-container-open');
        }
      });

    }

    //Doing transition stuff in jqmPanelContainer, as
    //we need to listen for transition complete event on either the panel
    //element or the panel content wrapper element. Some panel display
    //types (overlay) only animate the panel, and some (reveal) only
    //animate the content wrapper.
    function transitionComplete() {
      angular.forEach(panels, function (panel) {
        var opened = panel.scope.position === $scope.openPanelName;
        if (opened) {
          panel.element.addClass('ui-panel-opened');
        } else {
          panel.element.addClass('ui-panel-closed');
        }
      });
    }

    function updatePanelContent() {
      var content = findPanelContent();
      var openPanel = panels[$scope.openPanelName],
        openPanelScope = openPanel && openPanel.scope;

      content.addClass('ui-panel-content-wrap ui-panel-animate');

      content.toggleClass('ui-panel-content-wrap-open', !!openPanelScope);

      content.toggleClass('ui-panel-content-wrap-position-left',
        !!(openPanelScope && openPanelScope.position === 'left'));

      content.toggleClass('ui-panel-content-wrap-position-right',
        !!(openPanelScope && openPanelScope.position === 'right'));
      content.toggleClass('ui-panel-content-wrap-display-reveal',
        !!(openPanelScope && openPanelScope.display === 'reveal'));
      content.toggleClass('ui-panel-content-wrap-display-push',
        !!(openPanelScope && openPanelScope.display === 'push'));
      content.toggleClass('ui-panel-content-wrap-display-overlay',
        !!(openPanelScope && openPanelScope.display === 'overlay'));
    }

    function findPanelContent() {
      if (!panelContent) {
        panelContent = jqLite();
        forEach($element.children(), function(node) {
          var el = jqLite(node);
          // ignore panels and the generated ui-panel-dismiss div.
          if (!el.data('$jqmPanelController') && !el.hasClass('ui-panel-dismiss')) {
            panelContent.push(node);
          }
        });
      }
      return panelContent;
    }

    /*
    $scope.$evalAsync(function() {
      setupPull();
    });
    function setupPull() {
      var panelWidth = 17 * 16; //17em
      var content = findPanelContent();
      var dragger = $dragger(content, { mouse: true });
      var contentsTransformer = $transformer(content);
      var width;

      dragger.addListener($dragger.DIRECTION_HORIZONTAL, onPullView);
      
      var panel, panelTransformer;
      function onPullView(eventType, data) {
        var newPos;
        if (eventType === 'start') {
          width = content.prop('offsetWidth');
        } else if (eventType === 'move') {
          if (!panel && (data.origin.x < 50 || data.origin.x > width - 50)) {
            if (data.delta.x > 0) {
              panel = panels.left && panels.left.scope.pullable && panels.left;
            } else if (data.delta.x < 0) {
              panel = panels.right && panels.right.scope.pullable && panels.right;
            }
            if (panel) {
              panelTransformer = $transformer(panel.element);
              panelTransformer.updatePosition();
            }
          }
          if (panel) {
            if (panel.scope.display === 'overlay' || panel.scope.display === 'push') {
              newPos = panel.scope.position === 'left' ?
                clamp(-panelWidth, -panelWidth + data.distance.x, 0) :
                clamp(0, panelWidth + data.distance.x, panelWidth);
              panelTransformer.setTo({x: newPos}, true);
            }
            if (panel.scope.display === 'push' || panel.scope.display === 'reveal') {
              newPos = panel.scope.position === 'left' ? 
                clamp(0, contentsTransformer.pos.x + data.delta.x, panelWidth) :
                clamp(-panelWidth, contentsTransformer.pos.x + data.delta.x, 0);
              contentsTransformer.setTo({x: newPos}, true);
            }
            if ($scope.openPanelName !== panel.scope.position) {
              applyOpenPanelName(panel.scope.position);
            }
          }
        } else if (eventType === 'end') {
          if (panel) {
            var percentOpen = clamp(0, Math.abs(data.distance.x) / panelWidth, 1);
            
            //If we're already there, no need to animate to open/closed spot
            if (percentOpen === 1 || percentOpen === 0) {
              done();
            } else if (percentOpen > 0.25) {
              if (panel.scope.display === 'overlay' || panel.scope.display === 'push') {
                panelTransformer.easeTo({x: 0}, 150, done);
              }
              if (panel.scope.display === 'push' || panel.scope.display === 'reveal') {
                newPos = panel.scope.position === 'left' ? panelWidth : -panelWidth;
                contentsTransformer.easeTo({x: newPos}, 150, done);
              }
            } else {
              if (panel.scope.display === 'overlay' || panel.scope.display === 'push') {
                newPos = panel.scope.position === 'left' ? -panelWidth : panelWidth;
                panelTransformer.easeTo({x: newPos}, 150, doneAndClear);
              }
              if (panel.scope.display === 'push' || panel.scope.display === 'reveal') {
                contentsTransformer.easeTo({x: 0}, 150, doneAndClear);
              }
            }
          }
        }
      }
      function done() {
        if (panel) {
          panel = null;
          panelTransformer.clear();
          contentsTransformer.clear();
        }
      }
      function doneAndClear() {
        if (panel) {
          applyOpenPanelName(null);
          done();
        }
      }
      function clamp(a,b,c) {
        return Math.max(a, Math.min(b, c));
      }
      function applyOpenPanelName(name) {
        $scope.$apply(function() {
          $scope.openPanelName = name;
        });
      }
    }
    */
  }
}]);

/**
 * @ngdoc directive
 * @name jqm.directive:jqmPopup
 * @restrict A
 *
 * @description
 * Creates a popup with the given content.  The popup can be opened and closed on an element using {@link jqm.directive:jqmPopupTarget jqmPopupTarget}.
 *
 * Tip: put a {@link jqm.directive:jqmView jqmView} inside a popup to have full scrollable pages inside.
 * <pre>
 * <div jqm-popup="myPopup" class="fade">
 *   <div jqm-view="{
 *   templateUrl: 'views/my-popup-content-page.html',
 *   controller: 'MyPopupController'
 *   }"></div>
 * </div>
 * </pre>
 *
 * @param {expression} jqmPopup Assignable angular expression to bind this popup to.  jqmPopupTargets will point to this model.
 * @param {expression=} placement Where to put the popup relative to its target.  Available: 'left', 'right', 'top', 'bottom', 'inside'. Default: 'inside'.
 * @param {expression=} overlay-theme The theme to use for the overlay behind the popup. Defaults to the popup's theme.
 * @param {expression=} corners Whether the popup has corners. Default true.
 * @param {expression=} shadow Whether the popup has shadows. Default true.
 *
 * @example
<example module="jqm">
  <file name="index.html">
    <div jqm-popup="myPopup">
    Hey guys, here's a popup!
    </div>
    <div style="padding: 50px;"
     jqm-popup-target="myPopup"
     jqm-popup-model="pageCenterPop">

     <div jqm-button ng-click="pageCenterPop = true">
      Open Page Center Popup
     </div>
     <div jqm-button
       jqm-popup-target="myPopup"
       jqm-popup-model="buttonPop"
       jqm-popup-placement="left"
       ng-click="buttonPop = true">
       Open popup left of this button!
     </div>
    </div>
  </file>
</example>
 */
jqmModule.directive('jqmPopup', ['$position', '$animationComplete', '$parse', '$rootElement', '$timeout', '$compile', '$rootScope',
function($position, animationComplete, $parse, $rootElement, $timeout, $compile, $rootScope) {
  var isDef = angular.isDefined;
  var popupOverlayTemplate = '<div jqm-popup-overlay></div>';

  return {
    restrict: 'A',
    replace: true,
    transclude: true,
    template: '<div jqm-scope-as="jqmPopup" class="ui-popup-container {{$scopeAs.jqmPopup.animation}}" jqm-class="{\'ui-popup-hidden\': !$scopeAs.jqmPopup.opened}">  <div jqm-scope-as="jqmPopup" class="ui-popup ui-body-{{$theme}}"  jqm-class="{\'ui-overlay-shadow\': $scopeAs.jqmPopup.shadow,  \'ui-corner-all\': $scopeAs.jqmPopup.corners}"  ng-transclude></div>',
    require: '^?jqmPage',
    scope: {
      corners: '@',
      shadow: '@',
      placement: '@',
      animation: '@',
      overlayTheme: '@'
    },
    compile: function(elm, attr) {
      attr.animation = isDef(attr.animation) ? attr.animation : 'fade';
      attr.corners = isDef(attr.corners) ? attr.corners==='true' : true;
      attr.shadow = isDef(attr.shadow) ? attr.shadow==='true' : true;

      return postLink;
    }
  };
  function postLink(scope, elm, attr, pageCtrl) {
    animationComplete(elm, onAnimationComplete);

    var popupModel = $parse(attr.jqmPopup);
    if (!popupModel.assign) {
      throw new Error("jqm-popup expected assignable expression for jqm-popup attribute, got '" + attr.jqmPopup + "'");
    }
    popupModel.assign(scope.$parent, scope);

    elm.parent().prepend( $compile(popupOverlayTemplate)(scope) );

    //Publicly expose show, hide methods
    scope.show = show;
    scope.hideForElement = hideForElement;
    scope.hide = hide;
    scope.target = null;
    scope.opened = false;

    function show(target, placement) {
      scope.target = target;
      scope.opened = true;
      placement = placement || scope.placement;

      elm.css( getPosition(elm, target, placement) );
      scope.$root.$broadcast('$popupStateChanged', scope);
      if (scope.animation === 'none') {
        onAnimationComplete();
      } else {
        elm.addClass('in').removeClass('out');
      }

    }
    function hideForElement(target) {
      if (scope.target && target && scope.target[0] === target[0]) {
        scope.hide();
      }
    }
    function hide() {
      scope.target = null;
      scope.opened = false;
      elm.addClass('out').removeClass('in');

      scope.$root.$broadcast('$popupStateChanged', scope);
      if (scope.animation === 'none') {
        onAnimationComplete();
      } else {
        elm.addClass('out').removeClass('in');
      }
    }

    function onAnimationComplete() {
      elm.toggleClass('ui-popup-active', scope.opened);
      elm.toggleClass('ui-popup-hidden', !scope.opened);
      if (!scope.opened) {
        elm.css('left', '');
        elm.css('top', '');
      }
    }

    function getPosition(elm, target, placement) {
      var popWidth = elm.prop( 'offsetWidth' );
      var popHeight = elm.prop( 'offsetHeight' );
      var pos = $position.position(target);

      var newPosition = {};
      switch (placement) {
        case 'right':
          newPosition = {
            top: pos.top + pos.height / 2 - popHeight / 2,
            left: pos.left + pos.width
          };
          break;
        case 'bottom':
          newPosition = {
            top: pos.top + pos.height,
            left: pos.left + pos.width / 2 - popWidth / 2
          };
          break;
        case 'left':
          newPosition = {
            top: pos.top + pos.height / 2 - popHeight / 2,
            left: pos.left - popWidth
          };
          break;
        case 'top':
          newPosition = {
            top: pos.top - popHeight,
            left: pos.left + pos.width / 2 - popWidth / 2
          };
          break;
        default:
          newPosition = {
            top: pos.top + pos.height / 2 - popHeight / 2,
            left: pos.left + pos.width / 2 - popWidth / 2
          };
          break;
      }

      newPosition.top = Math.max(newPosition.top, 0);
      newPosition.left = Math.max(newPosition.left, 0);

      newPosition.top += 'px';
      newPosition.left += 'px';

      return newPosition;
    }
  }
}]);

jqmModule.directive('jqmPopupOverlay', function() {
  return {
    restrict: 'A',
    replace: true,
    template: '<div view-fixed="true" class="ui-popup-screen ui-overlay-{{$scopeAs.jqmPopup.overlayTheme || $scopeAs.jqmPopup.$theme}}"   jqm-class="{\'ui-screen-hidden\': !$scopeAs.jqmPopup.opened, \'in\': $scopeAs.jqmPopup.opened}"  ng-click="$scopeAs.jqmPopup.hide()"></div>'
  };
});


/**
 * @ngdoc directive
 * @name jqm.directive:jqmPopupTarget
 * @restrict A
 *
 * @description
 * Marks an element as a target for a {@link jqm.directive:jqmPopup jqmPopup}, and assigns a model to toggle to show or hide that popup on the element.
 *
 * See {@link jqm.directive:jqmPopup jqmPopup} for an example.
 *
 * @param {expression} jqmPopupTarget Model of a jqmPopup that this element will be linked to.
 * @param {expression=} jqm-popup-model Assignable angular boolean expression that will say whether the popup from jqmPopupTarget is opened on this element. Default '$popup'.
 * @param {string=} jqm-popup-placement The placement for the popup to pop over this element.  Overrides jqmPopup's placement attribute.  See {@link jqm.directive:jqmPopup jqmPopup} for the available values.
 *
 * @require jqmPopup
 */
jqmModule.directive('jqmPopupTarget', ['$parse', function($parse) {
  return {
    restrict: 'A',
    link: function(scope, elm, attr) {
      var jqmPopup;
      var popupModel = $parse(attr.jqmPopupModel || '$popup');

      var placement;
      attr.$observe('jqmPopupPlacement', function(p) {
        placement = p;
      });

      scope.$watch(attr.jqmPopupTarget, setPopup);
      scope.$watch(popupModel, popupModelWatch);
      scope.$on('$popupStateChanged', popupStateChanged);

      function setPopup(newPopup) {
        jqmPopup = newPopup;
        popupModelWatch( popupModel(scope) );
      }
      function popupModelWatch(isOpen) {
        if (jqmPopup) {
          if (isOpen) {
            jqmPopup.show(elm, placement);
          } else if (jqmPopup.opened) {
            jqmPopup.hideForElement(elm);
          }
        }
      }
      function popupStateChanged($e, popup) {
        //We only care if we're getting change from our popupTarget
        if (popup === jqmPopup) {
          popupModel.assign(
            scope,
            popup.opened && popup.target && popup.target[0] === elm[0]
          );
        }
      }

    }
  };
}]);

/**
 * @ngdoc directive
 * @name jqm.directive:jqmPositionAnchor
 * @restrict A
 *
 * @description
 * For every child element that has an own scope this will set the property $position in the child's scope
 * and keep that value updated whenever elements are added, moved or removed from the element.
 *
 * @example
 <example module="jqm">
 <file name="index.html">
 <div jqm-position-anchor>
   <div ng-controller="angular.noop">First child: {{$position}}</div>
   <div ng-controller="angular.noop">Middle child: {{$position}}</div>
   <div ng-controller="angular.noop">Last child: {{$position}}</div>
 </div>
 </file>
 </example>
 */
jqmModule.directive('jqmPositionAnchor', [ '$rootScope', function ($rootScope) {
  return {
    restrict: 'A',
    link: function (scope, element) {
      var elementNode = element[0];
      afterFn(elementNode, 'appendChild', enqueueUpdate);
      afterFn(elementNode, 'insertBefore', enqueueUpdate);
      afterFn(elementNode, 'removeChild', enqueueUpdate);

      enqueueUpdate();

      function afterFn(context, fnName, afterCb) {
        var fn = context[fnName];
        context[fnName] = function (arg1, arg2) {
          fn.call(context, arg1, arg2);
          afterCb(arg1, arg2);
        };
      }

      function enqueueUpdate() {
        if (!enqueueUpdate.started) {
          enqueueUpdate.started = true;
          $rootScope.$evalAsync(function () {
            updateChildren();
            enqueueUpdate.started = false;
          });
        }
      }

      function updateChildren() {
        var children = element.children(),
          length = children.length,
          i, child, newPos, childScope;
        for (i = 0; i < length; i++) {
          child = children.eq(i);
          childScope = child.scope();
          if (childScope !== scope) {
            childScope.$position = getPosition(i, length);
          }
        }
      }

      function getPosition(index, length) {
        return {
          first: index === 0,
          last: index === length - 1,
          middle: index > 0 && index < length - 1
        };
      }

    }
  };
}]);

jqmModule.directive({
  jqmPullLeftPanel: jqmPullPanelDirective('left'),
  jqmPullRightPanel: jqmPullPanelDirective('right')
});
function jqmPullPanelDirective(panelPosition) {
  return function() {
    return {
      restrict: 'A',
      link: postLink,
      require: ['jqmPage', '^?jqmPanelContainer']
    };
  };
  function postLink(scope, elm, attr, ctrls) {
    var panelContainerCtrl = ctrls[1],
    panel = panelContainerCtrl && panelContainerCtrl.getPanel(panelPosition);

    if (panel) {
      panel.scope.pullable = true;
      scope.$on('$destroy', function() {
        panel.scope.pullable = false;
      });
      scope.$on('$disconnect', function() {
        panel.scope.pullable = false;
      });
    }
  }
}

jqmModule.directive('jqmScopeAs', [function () {
  return {
    restrict: 'A',
    compile: function (element, attrs) {
      var scopeAs = attrs.jqmScopeAs;
      return {
        pre: function (scope) {
          scope.$$scopeAs = scopeAs;
        }
      };
    }
  };
}]);

/**
 * @ngdoc directive
 * @name jqm.directive:jqmTextarea
 * @restrict A
 *
 * @description
 * Creates an jquery mobile textarea on the given elemen.
 *
 * @param {string} ngModel Assignable angular expression to data-bind to.
 * @param {string=} disabled Whether this input is disabled.
 *
 * @example
 <example module="jqm">
 <file name="index.html">
 Textarea with ng-model:
 <div ng-model="model" jqm-textarea></div>

 Value: {{model}}
 <p/>
 Textarea disabled:
 <div data-disabled="disabled" jqm-textarea>Hello World</div>
 <p/>
 </file>
 </example>
 */
jqmModule.directive('jqmTextarea', ['textareaDirective', function (textareaDirective) {
  return {
    template: '<textarea    jqm-scope-as="jqmTextarea"    ng-class="{\'ui-disabled mobile-textinput-disabled ui-state-disabled\' : $scopeAs.jqmTextarea.disabled}"    class="ui-input-text ui-corner-all ui-shadow-inset ui-body-{{$scopeAs.jqmTextarea.$theme}}"></textarea>',
    replace: true,
    restrict: 'A',
    require: '?ngModel',
    scope: {
      disabled: '@'
    },
    link: function (scope, element, attr, ngModelCtrl) {
      var textarea = angular.element(element[0]);

      linkInput();

      function linkInput() {
        textarea.bind('focus', function () {
          element.addClass('ui-focus');
        });
        textarea.bind('blur', function () {
          element.removeClass('ui-focus');
        });

        angular.forEach(textareaDirective, function (directive) {
          directive.link(scope, textarea, attr, ngModelCtrl);
        });
        return textarea;
      }
    }
  };
}]);

/**
 * @ngdoc directive
 * @name jqm.directive:jqmTextinput
 * @restrict A
 *
 * @description
 * Creates an jquery mobile input on the given element.
 *
 * @param {string} ngModel Assignable angular expression to data-bind to.
 * @param {string=} type Defines the type attribute for the resulting input. Default is 'text'.
 * @param {string=} disabled Whether this input is disabled.
 * @param {string=} mini Whether this input is mini.
 * @param {boolean=} clearBtn Whether this input should show a clear button to clear the input.
 * @param {string=} clearBtnText Defines the tooltip text for the clear Button. Default is 'clear text'.
 * @param {string=} placeholder Defines the placholder value for the input Element.
 *
 * @example
 <example module="jqm">
 <file name="index.html">
 Text Input:
 <div jqm-textinput ng-model="value"></div>
 <p/>
 Text Input: clear-btn="true"
 <div jqm-textinput ng-model="value" clear-btn="true"></div>
 <hl/>
 Search Input:
 <div jqm-textinput ng-model="search" type="search"></div>
 </file>
 </example>
 */
jqmModule.directive('jqmTextinput', ['inputDirective', function (inputDirective) {
  return {
    template: '<div jqm-scope-as="jqmTextinput"   ng-class="{    \'ui-input-has-clear\': ($scopeAs.jqmTextinput.clearBtn && !$scopeAs.jqmTextinput.isSearch()),    \'ui-disabled\': $scopeAs.jqmTextinput.disabled,    \'ui-mini\': $scopeAs.jqmTextinput.mini,    \'ui-input-search ui-btn-corner-all ui-icon-searchfield\': $scopeAs.jqmTextinput.type === \'search\',    \'ui-input-text ui-corner-all\': !$scopeAs.jqmTextinput.isSearch()}"   class="ui-shadow-inset ui-btn-shadow ui-body-{{$scopeAs.jqmTextinput.$theme}}">  <input type="{{$scopeAs.jqmTextinput.typeValue}}" class="ui-input-text ui-body-{{$scopeAs.jqmTextinput.$theme}}"       ng-class="{\'mobile-textinput-disabled ui-state-disabled\': $scopeAs.jqmTextinput.disabled}" placeholder="{{$scopeAs.jqmTextinput.placeholder}}">  <a ng-if="$scopeAs.jqmTextinput.clearBtn || $scopeAs.jqmTextinput.type === \'search\'" href="#" ng-class="{\'ui-input-clear-hidden\': !getValue()}"     ng-click="clearValue($event)"     class="ui-input-clear ui-btn ui-shadow ui-btn-corner-all ui-fullsize ui-btn-icon-notext"     jqm-once-class="ui-btn-up-{{$theme}}"     title="{{clearBtnTextValue}}">   <span class="ui-btn-inner">           <span class="ui-btn-text" ng-bind="clearBtnTextValue"></span>           <span class="ui-icon ui-icon-delete ui-icon-shadow">&nbsp;</span>         </span>  </a></div>',
    replace: true,
    restrict: 'A',
    require: '?ngModel',
    scope: {
      clearBtn: '@',
      type: '@',
      clearBtnText: '@',
      disabled: '@',
      mini: '@',
      placeholder: '@'
    },
    link: function (scope, element, attr, ngModelCtrl) {
      var input = angular.element(element[0].getElementsByTagName("input"));

      scope.typeValue = type();
      scope.clearBtnTextValue = scope.clearBtnText || 'clear text';

      linkInput();
      scope.getValue = getValue;
      scope.clearValue = clearValue;
      scope.isSearch = isSearch;

      function type() {
        var inputType = scope.type || 'text';
        return (inputType === 'search') ? 'text' : inputType;
      }

      function getValue() {
        return scope.type === 'color' || (ngModelCtrl && ngModelCtrl.$viewValue);
      }

      function clearValue(event) {
        event.preventDefault();


        input[0].value = '';
        if (ngModelCtrl) {
          ngModelCtrl.$setViewValue('');
        }
      }

      function isSearch() {
        return scope.type === 'search';
      }

      function linkInput() {
        input.bind('focus', function () {
          element.addClass('ui-focus');
        });
        input.bind('blur', function () {
          element.removeClass('ui-focus');
        });

        angular.forEach(inputDirective, function (directive) {
          directive.link(scope, input, attr, ngModelCtrl);
        });
        return input;
      }
    }
  };
}]);

/**
 * @ngdoc directive
 * @name jqm.directive:jqmTheme
 * @restrict A
 *
 * @description
 * Sets the jqm theme for this element and it's children by adding a `$theme` property to the scope.
 * Other directives like `jqmCheckbox` evaluate that property.
 *
 * @example
 <example module="jqm">
 <file name="index.html">
 <div>
   <div jqm-checkbox jqm-theme="a">Theme a</div>
   <div jqm-checkbox jqm-theme="b">Theme b</div>
 </div>
 </file>
 </example>
 */
jqmModule.directive('jqmTheme', [function () {
  return {
    restrict: 'A',
    priority: 1,
    scope: true,
    compile: function compile() {
      return {
        pre: function preLink(scope, iElement, iAttrs) {
          // Set the theme before all other link functions of children
          var theme = iAttrs.jqmTheme;
          if (theme) {
            scope.$theme = theme;
          }
        }
      };
    }
  };
}]);


//In angularJS 1.2, they made ng-transclude erase all content
//inside a directive before inserting transcluded content.
//We just act like 1.1.x transclude, appending transclusion.
jqmModule.directive('jqmTransclude', function() {
  return {
    controller: ['$transclude', function($transclude) {
      this.$transclude = $transclude;
    }],
    link: function(scope, elm, attr, controller) {
      controller.$transclude(function(clone) {
        elm.append(clone);
      });
    }
  };
});

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
    template: '<div class="ui-mobile-viewport" jqm-class="\'ui-overlay-\'+$theme" jqm-transclude></div>',
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


/**
 * @ngdoc function
 * @name jqm.$anchorScroll
 * @requires $hideAddressBar
 *
 * @description
 * This overrides the default `$anchorScroll` of angular and calls `$hideAddressBar` instead.
 * By this, the address bar is hidden on every view change, orientation change, ...
 */
jqmModule.factory('$anchorScroll', ['$hideAddressBar', function ($hideAddressBar) {
  return deferredHideAddressBar;

  // We almost always want to allow the browser to settle after
  // showing a page, orientation change, ... before we hide the address bar.
  function deferredHideAddressBar() {
    window.setTimeout($hideAddressBar, 50);
  }
}]);
jqmModule.run(['$anchorScroll', '$rootScope', function($anchorScroll, $rootScope) {
  $rootScope.$on('$orientationChanged', function(event) {
    $anchorScroll();
  });
}]);

jqmModule.factory('$animationComplete', ['$sniffer', function ($sniffer) {
  return function (el, callback, once) {
    var eventNames = 'animationend';
    if (!$sniffer.animations) {
      throw new Error("Browser does not support css animations.");
    }
    if ($sniffer.vendorPrefix) {
      eventNames += " " + $sniffer.vendorPrefix.toLowerCase() + "AnimationEnd";
    }
    var _callback = callback;
    if (once) {
      callback = function() {
        unbind();
        _callback();
      };
    }
    //We have to split because unbind doesn't support multiple event names in one string
    //This will be fixed in 1.2, PR opened https://github.com/angular/angular.js/pull/3256
    angular.forEach(eventNames.split(' '), function(eventName) {
      el.bind(eventName, callback);
    });

    return unbind;

    function unbind() {
      angular.forEach(eventNames.split(' '), function(eventName) {
        el.unbind(eventName, callback);
      });
    }
  };
}]);

jqmModule.config(['$provide', function ($provide) {
  $provide.decorator('$browser', ['$delegate', browserHashReplaceDecorator]);
  return;

  // ---------------
  // implementation functions
  function browserHashReplaceDecorator($browser) {
    // On android and non html5mode, the hash in a location
    // is returned as %23.
    var _url = $browser.url;
    $browser.url = function () {
      var res = _url.apply(this, arguments);
      if (arguments.length === 0) {
        res = res.replace(/%23/g, '#');
        res = res.replace(/ /g, '%20');
      }
      return res;
    };
    return $browser;
  }
}]);

/**
 * @ngdoc function
 * @name jqm.$hideAddressBar
 * @requires $window
 * @requires $rootElement
 * @requires $orientation
 *
 * @description
 * When called, this will hide the address bar on mobile devices that support it.
 */
jqmModule.factory('$hideAddressBar', ['$window', '$rootElement', '$orientation', function ($window, $rootElement, $orientation) {
  var MIN_SCREEN_HEIGHT_WIDTH_OPT_OUT = 500,
    MAX_SCREEN_HEIGHT = 800,
    scrollToHideAddressBar,
    cachedHeights = {};
  if (!$window.addEventListener || addressBarHidingOptOut()) {
    return noopCallback;
  } else {
    return hideAddressBar;
  }

  function noopCallback(done) {
    if (done) {
      done();
    }
  }

  // -----------------
  function hideAddressBar(done) {
    var orientation = $orientation(),
    docHeight = cachedHeights[orientation];
    if (!docHeight) {
      // if we don't know the exact height of the document without the address bar,
      // start with one that is always higher than the screen to be
      // sure the address bar can be hidden.
      docHeight = MAX_SCREEN_HEIGHT;
    }
    setDocumentHeight(docHeight);
    if (!angular.isDefined(scrollToHideAddressBar)) {
      // iOS needs a scrollTo(0,0) and android a scrollTo(0,1).
      // We always do a scrollTo(0,1) at first and check the scroll position
      // afterwards for future scrolls.
      $window.scrollTo(0, 1);
    } else {
      $window.scrollTo(0, scrollToHideAddressBar);
    }
    // Wait for a scroll event or a timeout, whichever is first.
    $window.addEventListener('scroll', afterScrollOrTimeout, false);
    var timeoutHandle = $window.setTimeout(afterScrollOrTimeout, 400);

    function afterScrollOrTimeout() {
      $window.removeEventListener('scroll', afterScrollOrTimeout, false);
      $window.clearTimeout(timeoutHandle);
      if (!cachedHeights[orientation]) {
        cachedHeights[orientation] = getViewportHeight();
        setDocumentHeight(cachedHeights[orientation]);
      }
      if (!angular.isDefined(scrollToHideAddressBar)) {
        if ($window.pageYOffset === 1) {
          // iOS
          scrollToHideAddressBar = 0;
          $window.scrollTo(0, 0);
        } else {
          // Android
          scrollToHideAddressBar = 1;
        }
      }
      if (done) {
        done();
      }
    }
  }

  function addressBarHidingOptOut() {
    return Math.max(getViewportHeight(), getViewportWidth()) > MIN_SCREEN_HEIGHT_WIDTH_OPT_OUT;
  }

  function getViewportWidth() {
    return $window.innerWidth;
  }

  function getViewportHeight() {
    return $window.innerHeight;
  }

  function setDocumentHeight(height) {
    $rootElement.css('height', height + 'px');
  }
}]);

jqmModule.config(['$provide', function($provide) {
  var lastLocationChangeByProgram = false;
  $provide.decorator('$location', ['$delegate', '$browser', '$history', '$rootScope', function($location, $browser, $history, $rootScope) {
    instrumentBrowser();

    $rootScope.$on('$locationChangeSuccess', function () {
      if (!lastLocationChangeByProgram) {
        $history.onUrlChangeBrowser($location.url());
      }
    });

    $history.onUrlChangeProgrammatically($location.url() || '/', false);

    return $location;

    function instrumentBrowser() {
      var _url = $browser.url;
      $browser.url = function (url, replace) {
        if (url) {
          // setter
          $history.onUrlChangeProgrammatically($location.url(), replace);
          lastLocationChangeByProgram = true;
          $rootScope.$evalAsync(function () {
            lastLocationChangeByProgram = false;
          });
        }
        return _url.apply(this, arguments);
      };
    }
  }]);
}]);

jqmModule.factory('$history', ['$window', '$timeout', function $historyFactory($window, $timeout) {
  var $history = {
    go: go,
    urlStack: [],
    indexOf: indexOf,
    activeIndex: -1,
    previousIndex: -1,
    onUrlChangeBrowser: onUrlChangeBrowser,
    onUrlChangeProgrammatically: onUrlChangeProgrammatically
  };

  return $history;

  function go(relativeIndex) {
    // Always execute history.go asynchronously.
    // This is required as firefox and IE10 trigger the popstate event
    // in sync. By using a setTimeout we have the same behaviour everywhere.
    // Don't use $defer here as we don't want to trigger another digest cycle.
    // Note that we need at least 20ms to ensure that
    // the hashchange/popstate event for the current page
    // as been delivered (in IE this can take some time...).
    $timeout(function () {
      $window.history.go(relativeIndex);
    }, 20, false);
  }

  function indexOf(url) {
    var i,
      urlStack = $history.urlStack;
    for (i = 0; i < urlStack.length; i++) {
      if (urlStack[i].url === url) {
        return i;
      }
    }
    return -1;
  }

  function onUrlChangeBrowser(url) {
    var oldIndex = $history.activeIndex;
    $history.activeIndex = indexOf(url);
    if ($history.activeIndex === -1) {
      onUrlChangeProgrammatically(url, false);
    } else {
      $history.previousIndex = oldIndex;
    }
  }

  function onUrlChangeProgrammatically(url, replace) {
    var currentEntry = $history.urlStack[$history.activeIndex];
    if (!currentEntry || currentEntry.url !== url) {
      $history.previousIndex = $history.activeIndex;
      if (!replace) {
        $history.activeIndex++;
      }
      $history.urlStack.splice($history.activeIndex, $history.urlStack.length - $history.activeIndex);
      $history.urlStack.push({url: url});
    }
  }
}]);

jqmModule.run(['jqmButtonToggler', '$rootElement', function(jqmButtonToggler, $rootElement) {
  jqmButtonToggler($rootElement);
}]);
jqmModule.factory('jqmButtonToggler', function() {

  return function(element) {
    var self = {};

    //Exposed for testing
    self.$mousedown = function(e) {
      var unbindEvents = e.type === 'mousedown' ?
        'mouseup mousemove' :
        'touchmove touchend touchcancel';
      var target = angular.element(e.target);
      var btnElement = parentWithClass(target, 'ui-btn-up-' + target.scope().$theme);
      if (btnElement) {
        toggleBtnDown(btnElement, true);
        target.bind(unbindEvents, onBtnUp);
      }
      function onBtnUp() {
        toggleBtnDown(btnElement, false);
        //TODO(1.2): 1.2 fixes unbind breaking on space-seperated events, so do one unbind
        angular.forEach(unbindEvents.split(' '), function(eventName) {
          target.unbind(eventName, onBtnUp);
        });
      }
    };

    //Exposed for testing
    self.$mouseover = function(e) {
      var target = angular.element(e.target);
      var btnElement = parentWithClass(target, 'ui-btn');
      if (btnElement && !btnElement.hasClass('ui-btn-down-' + target.scope().$theme)) {
        toggleBtnHover(btnElement, true);
        target.bind('mouseout', onBtnMouseout);
      }
      function onBtnMouseout() {
        toggleBtnHover(btnElement, false);
        target.unbind('mouseout', onBtnMouseout);
      }
    };

    element[0].addEventListener('touchstart', self.$mousedown, true);
    element[0].addEventListener('mousedown', self.$mousedown, true);
    element[0].addEventListener('mouseover', self.$mouseover, true);

    return self;

    function toggleBtnDown(el, isDown) {
      var theme = el.scope().$theme;
      el.toggleClass('ui-btn-down-' + theme, isDown);
      el.toggleClass('ui-btn-up-' + theme, !isDown);
    }
    function toggleBtnHover(el, isHover) {
      var theme = el.scope().$theme;
      el.toggleClass('ui-btn-hover-' + theme, isHover);
    }
    function parentWithClass(el, className) {
      var maxDepth = 5;
      var current = el;
      while (current.length && maxDepth--) {
        if (current.hasClass(className)) {
          return current;
        }
        current = current.parent();
      }
      return null;
    }

  };
});

/**
 * @ngdoc object
 * @name jqm.jqmConfigProvider
 *
 * @description Used to configure the default theme.
 */

jqmModule.provider('jqmConfig', function() {
  /**
   * @ngdoc method
   * @name jqm.jqmConfigProvider#primaryTheme
   * @methodOf jqm.jqmConfigProvider
   *
   * @description Sets/gets the default primary theme (used if jqm-theme is
   * not set on the element). Default: 'c'
   *
   * @param {string=} newTheme The new primary theme to set.
   * @returns {string} The current primary theme.
   */
  /**
   * @ngdoc method
   * @name jqm.jqmConfigProvider#secondaryTheme
   * @methodOf jqm.jqmConfigProvider
   * 
   * @description Sets/gets the secondary theme (used on footers, headers, etc 
   * if not theme is set on the element). Default: 'a'
   *
   * @param {string=} newTheme The new secondary theme to set.
   * @returns {string} The current secondary theme.
   */

  var _primaryTheme = 'c';
  var _secondaryTheme = 'a';
  return {
    primaryTheme: primaryTheme,
    secondaryTheme: secondaryTheme,
    $get: serviceFactory
  };

  function primaryTheme(value) {
    if (value) { _primaryTheme = value; }
    return _primaryTheme;
  }
  function secondaryTheme(value) {
    if (value) { _secondaryTheme = value; }
    return _secondaryTheme;
  }

  /**
   * @ngdoc object
   * @name jqm.jqmConfig
   * @description
   * A service used to tell the default primary and secondary theme. 
   */
  /**
   * @ngdoc property
   * @name jqm.jqmConfig#primaryTheme
   * @propertyOf jqm.jqmConfig
   *
   * @description {string} The current primary theme.  See {@link jqm.jqmConfigProvider#primaryTheme}.
   */
  /**
   * @ngdoc property
   * @name jqm.jqmConfig#secondaryTheme
   * @propertyOf jqm.jqmConfig
   *
   * @description {string} The current secondary theme.  See {@link jqm.jqmConfigProvider#secondaryTheme}.
   */
  function serviceFactory() {
    return {
      primaryTheme: _primaryTheme,
      secondaryTheme: _secondaryTheme
    };
  }

});

jqmModule.factory('jqmViewCache', ['$cacheFactory', function($cacheFactory) {
  return $cacheFactory('jqmCachingView');
}]);

/**
 * @ngdoc function
 * @name jqm.$loadDialog
 * @requires $rootElement
 * @requires $rootScope
 *
 * @description
 * Shows a wait dialog to indicate some long running work.
 * @example
<example module="jqm">
  <file name="index.html">
  <div ng-controller="DemoCtrl">
    <button ng-click="$loadDialog.hide()">Hide</button>
    <hr />
    <div jqm-textinput placeholder="Dialog Text" ng-model="dialogText"></div>
    <button ng-click="$loadDialog.show(dialogText)">Show{{dialogText && ' with text' || ''}}</button>
    <hr />
    <button ng-click="showForPromise()">waitFor promise</button>
  </div>
  </file>
  <file name="script.js">
  function DemoCtrl($scope, $loadDialog, $timeout, $q) {
    $scope.$loadDialog = $loadDialog;   

    $scope.showForPromise = function() {
    var deferred = $q.defer();
    $timeout(deferred.resolve, 1000);

    $loadDialog.waitFor(deferred.promise, 'Showing for 1000ms promise...');
    };
  }
  </file>
</example>
 */
jqmModule.factory('$loadDialog', ['$rootElement', '$rootScope', function ($rootElement, $rootScope) {

  var rootElement = $rootElement.clone();

  var showCalls = [];
  var loadingClass = 'ui-loading';

  var defaultTemplate = angular.element("<div class='ui-loader ui-corner-all ui-body-d'>" +
    "   <span class='ui-icon ui-icon-loading'></span>" +
    "   <h1></h1>" +
    "</div>");

  $rootElement.append(defaultTemplate);
  defaultTemplate.bind("click", onClick);

  function onClick(event) {
    var lastCall = showCalls[showCalls.length - 1];
    if (lastCall.callback) {
      $rootScope.$apply(function () {
        lastCall.callback.apply(this, arguments);
      });
    }
    // This is required to prevent a second
    // click event, see
    // https://github.com/jquery/jquery-mobile/issues/1787
    event.preventDefault();
  }


  function updateUI() {
    if (showCalls.length > 0) {
      var lastCall = showCalls[showCalls.length - 1];
      var message = lastCall.msg;

      defaultTemplate.removeClass('ui-loader-verbose ui-loader-default');

      if (message) {
        defaultTemplate.addClass('ui-loader-verbose');
        defaultTemplate.find('h1').text(message);
      } else {
        defaultTemplate.addClass('ui-loader-default');
      }

      $rootElement.addClass(loadingClass);
    } else {
      $rootElement.removeClass(loadingClass);
    }
  }

  /**
   * @ngdoc method
   * @name jqm.$loadDialog#show
   * @methodOf jqm.$loadDialog
   *
   * @description
   * Opens the wait dialog and shows the given message (if existing).
   * If the user clicks on the wait dialog the given callback is called.
   * This can be called even if the dialog is currently showing. It will
   * then change the message and revert back to the last message when
   * the hide function is called.
   *
   * @param {string=} message The message to be shown when the wait dialog is displayed.
   * @param {function=} callback The Callback that is executed when the wait dialog is clicked.
   *
   */
  function show() {
    var msg, tapCallback;
    if (typeof arguments[0] === 'string') {
      msg = arguments[0];
    }
    if (typeof arguments[0] === 'function') {
      tapCallback = arguments[0];
    }
    if (typeof arguments[1] === 'function') {
      tapCallback = arguments[1];
    }

    showCalls.push({msg: msg, callback: tapCallback});
    updateUI();
  }

  /**
   * @ngdoc method
   * @name jqm.$loadDialog#hide
   * @methodOf jqm.$loadDialog
   *
   * @description
   * Restores the dialog state before the show function was called.
   *
   */
  function hide() {
    showCalls.pop();
    updateUI();
  }

  function always(promise, callback) {
    promise.then(callback, callback);
  }

  /**
   * @ngdoc method
   * @name jqm.$loadDialog#waitFor
   * @methodOf jqm.$loadDialog
   *
   * @description
   * Shows the dialog as long as the given promise runs. Shows the given message
   * if defined.
   *
   * @param {Promise} promise The Promise.
   * @param {string=} message The message to be show.
   * */
  function waitFor(promise, msg) {
    show(msg);
    always(promise, function () {
      hide();
    });
  }

  /**
   * @ngdoc method
   * @name jqm.$loadDialog#waitForWithCancel
   * @methodOf jqm.$loadDialog
   *
   * @description
   * Same as jqm.$loadDialog#waitFor, but rejects the promise with the given
   * cancelData when the user clicks on the wait dialog.
   *
   * @param {Deferred} The deferred object to cancel the promise.
   * @param {*} cancelData To reject the promise with.
   * @param {string=} message The message to be show.
   */
  function waitForWithCancel(deferred, cancelData, msg) {
    show(msg, function () {
      deferred.reject(cancelData);
    });
    always(deferred.promise, function () {
      hide();
    });
  }

  return {
    show: show,
    hide: hide,
    waitFor: waitFor,
    waitForWithCancel: waitForWithCancel
  };
}]);

/**
 * @ngdoc function
 * @name jqm.$orientation
 * @requires $window
 * @requires $rootScope
 *
 * @description
 * Provides access to the orientation of the browser. This will also
 * broadcast a `$orientationChanged` event on the root scope and do a digest whenever the orientation changes.
 */
jqmModule.factory('$orientation', ['$window', '$rootScope', function($window, $rootScope) {
  if (!$window.addEventListener) {
    // For tests
    return angular.noop;
  }
  var lastOrientation = getOrientation(),
    VERTICAL = "vertical",
    HORIZONTAL = "horizontal";

  initOrientationChangeListening();

  return getOrientation;

  // ------------------

  function initOrientationChangeListening() {
    // Start listening for orientation changes
    $window.addEventListener('resize', resizeListener, false);

    function resizeListener() {
      if (!orientationChanged()) {
        return;
      }
      $rootScope.$apply(function() {
        $rootScope.$broadcast('$orientationChanged', getOrientation());
      });
    }
  }

  function getOrientation() {
    var w = $window.innerWidth,
      h = $window.innerHeight;
    if (h < 200) {
      // In case of the Android screen size bug we assume
      // vertical, as the keyboard takes the whole screen
      // when horizontal.
      // See http://stackoverflow.com/questions/7958527/jquery-mobile-footer-or-viewport-size-wrong-after-android-keyboard-show
      // and http://android-developers.blogspot.mx/2009/04/updating-applications-for-on-screen.html
      return VERTICAL;
    }
    if (w > h) {
      return HORIZONTAL;
    } else {
      return VERTICAL;
    }
  }

  function orientationChanged() {
    var newOrientation = getOrientation();
    if (lastOrientation === newOrientation) {
      return false;
    }
    lastOrientation = newOrientation;
    return true;
  }
}]);

jqmModule.config(['$provide', function ($provide) {
  $provide.decorator('$parse', ['$delegate', jqmScopeAsParseDecorator]);

  function jqmScopeAsParseDecorator($parse) {
    return function (expression) {
      if (!angular.isString(expression)) {
        // $parse is also used for calling functions (e.g. from $scope.eval),
        // which we don't want to intercept.
        return $parse(expression);
      }

      var evalFn = $parse(expression),
        assignFn = evalFn.assign;
      if (assignFn) {
        patchedEvalFn.assign = patchedAssign;
      }
      return patchedEvalFn;

      function patchedEvalFn(context, locals) {
        return callInContext(evalFn, context, locals);
      }

      function patchedAssign(context, value) {
        return callInContext(assignFn, context, value);
      }

      function callInContext(fn, context, secondArg) {
        var scopeAs = {},
          earlyExit = true;
        while (context && context.hasOwnProperty("$$scopeAs")) {
          scopeAs[context.$$scopeAs] = context;
          context = context.$parent;
          earlyExit = false;
        }
        if (earlyExit) {
          return fn(context, secondArg);
        }
        // Temporarily add a property in the parent scope
        // to reference the child scope.
        // Needed as the assign function does not allow locals, otherwise
        // we could use the locals here (which would be more efficient!).
        context.$scopeAs = scopeAs;
        try {
          /*jshint -W040:true*/
          return fn.call(this, context, secondArg);
        } finally {
          delete context.$scopeAs;
        }
      }
    };
  }
}]);

// Note: We don't create a directive for the html element,
// as sometimes people add the ng-app to the body element.
jqmModule.run(['$window', function($window) {
  angular.element($window.document.documentElement).addClass("ui-mobile");
}]);

jqmModule.config(['$provide', function($provide) {
  $provide.decorator('$route', ['$delegate', '$rootScope', '$history', function($route, $rootScope, $history) {
    $rootScope.$on('$routeChangeStart', function(event, newRoute) {
      if (newRoute) {
        newRoute.back = $history.activeIndex < $history.previousIndex;
      }
    });
    return $route;
  }]);
}]);

/**
 * In the docs, an embedded angular app is used. However, due to a bug,
 * the docs don't disconnect the embedded $rootScope from the real $rootScope.
 * By this, our embedded app will never get freed and it's watchers will still fire.
 */
jqmModule.run(['$rootElement', '$rootScope', function clearRootScopeOnRootElementDestroy($rootElement, $rootScope) {
  $rootElement.bind('$destroy', function() {
    $rootScope.$destroy();
    $rootScope.$$watchers = [];
    $rootScope.$$listeners = [];
  });
}]);

jqmModule.config(['$provide', function ($provide) {
  $provide.decorator('$rootScope', ['$delegate', scopeReconnectDecorator]);
  $provide.decorator('$rootScope', ['$delegate', 'jqmConfig', inheritThemeDecorator]);

  function scopeReconnectDecorator($rootScope) {
    $rootScope.$disconnect = function () {
      if (this.$root === this) {
        return; // we can't disconnect the root node;
      }
      var parent = this.$parent;
      this.$$disconnected = true;
      // See Scope.$destroy
      if (parent.$$childHead === this) {
        parent.$$childHead = this.$$nextSibling;
      }
      if (parent.$$childTail === this) {
        parent.$$childTail = this.$$prevSibling;
      }
      if (this.$$prevSibling) {
        this.$$prevSibling.$$nextSibling = this.$$nextSibling;
      }
      if (this.$$nextSibling) {
        this.$$nextSibling.$$prevSibling = this.$$prevSibling;
      }
      this.$$nextSibling = this.$$prevSibling = null;
    };
    $rootScope.$reconnect = function () {
      if (this.$root === this) {
        return; // we can't disconnect the root node;
      }
      var child = this;
      if (!child.$$disconnected) {
        return;
      }
      var parent = child.$parent;
      child.$$disconnected = false;
      // See Scope.$new for this logic...
      child.$$prevSibling = parent.$$childTail;
      if (parent.$$childHead) {
        parent.$$childTail.$$nextSibling = child;
        parent.$$childTail = child;
      } else {
        parent.$$childHead = parent.$$childTail = child;
      }

    };
    return $rootScope;
  }

  function inheritThemeDecorator($rootScope, jqmConfig) {
    instrumentScope($rootScope, jqmConfig.primaryTheme);
    return $rootScope;

    function instrumentScope(scope, theme) {
      scope.$theme = theme;
      var _new = scope.$new;
      scope.$new = function (isolate) {
        var res = _new.apply(this, arguments);
        if (isolate) {
          instrumentScope(res, this.$theme);
        }
        return res;

      };
    }
  }
}]);

(function () {
  /*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas. Dual MIT/BSD license */
  window.matchMedia = window.matchMedia || (function (doc) {
    var bool,
    docElem = doc.documentElement,
    refNode = docElem.firstElementChild || docElem.firstChild,
    // fakeBody required for <FF4 when executed in <head>
    fakeBody = doc.createElement("body"),
    div = doc.createElement("div");

    div.id = "mq-test-1";
    div.style.cssText = "position:absolute;top:-100em";
    fakeBody.style.background = "none";
    fakeBody.appendChild(div);

    return function (q) {

      div.innerHTML = "&shy;<style media=\"" + q + "\"> #mq-test-1 { width: 42px; }</style>";

      docElem.insertBefore(fakeBody, refNode);
      bool = div.offsetWidth === 42;
      docElem.removeChild(fakeBody);

      return {
        matches: bool,
        media: q
      };

    };

  }(window.document));
})();

jqmModule.config(['$provide', function ($provide) {
  $provide.decorator('$sniffer', ['$delegate', '$window', '$document', function ($sniffer, $window, $document) {
    var fakeBody = angular.element("<body>");
    angular.element($window.document.body).prepend(fakeBody);

    $sniffer.cssTransform3d = transform3dTest();

    android2Transitions();

    fakeBody.remove();

    return $sniffer;

    function media(q) {
      return window.matchMedia(q).matches;
    }

    // This is a copy of jquery mobile 1.3.1 detection for transform3dTest
    function transform3dTest() {
      var mqProp = "transform-3d",
      vendors = [ "Webkit", "Moz", "O" ],
      // Because the `translate3d` test below throws false positives in Android:
      ret = media("(-" + vendors.join("-" + mqProp + "),(-") + "-" + mqProp + "),(" + mqProp + ")");

      if (ret) {
        return !!ret;
      }

      var el = $window.document.createElement("div"),
      transforms = {
        // We’re omitting Opera for the time being; MS uses unprefixed.
        'MozTransform': '-moz-transform',
        'transform': 'transform'
      };

      fakeBody.append(el);

      for (var t in transforms) {
        if (el.style[ t ] !== undefined) {
          el.style[ t ] = 'translate3d( 100px, 1px, 1px )';
          ret = window.getComputedStyle(el).getPropertyValue(transforms[ t ]);
        }
      }
      return ( !!ret && ret !== "none" );
    }

    //Fix android 2 not reading transitions correct.
    //https://github.com/angular/angular.js/pull/3086
    //https://github.com/angular-widgets/angular-jqm/issues/89
    function android2Transitions() {
      if (!$sniffer.transitions || !$sniffer.animations) {
        $sniffer.transitions = angular.isString($document[0].body.style.webkitTransition);
        $sniffer.animations = angular.isString($document[0].body.style.webkitAnimation);
        if ($sniffer.animations || $sniffer.transitions) {
          $sniffer.vendorPrefix = 'webkit';
          $sniffer.cssTransform3d = true;
        }
      }
    }

  }]);
}]);

jqmModule.factory('$transitionComplete', ['$sniffer', function ($sniffer) {
  return function (el, callback, once) {
    var eventNames = 'transitionend';
    if (!$sniffer.transitions) {
      throw new Error("Browser does not support css transitions.");
    }
    if ($sniffer.vendorPrefix) {
      eventNames += " " + $sniffer.vendorPrefix.toLowerCase() + "TransitionEnd";
    }
    var _callback = callback;
    if (once) {
      callback = function() {
        unbind();
        _callback();
      };
    }
    //We have to split because unbind doesn't support multiple event names in one string
    //This will be fixed in 1.2, PR opened https://github.com/angular/angular.js/pull/3256
    angular.forEach(eventNames.split(' '), function(eventName) {
      el.bind(eventName, callback);
    });

    return unbind;

    function unbind() {
      angular.forEach(eventNames.split(' '), function(eventName) {
        el.unbind(eventName, callback);
      });
    }
  };
}]);

angular.element(window.document).find('head').append('<style type="text/css">*{-webkit-backface-visibility:hidden}html,body{-webkit-user-select:none;-moz-user-select:none;user-select:none}.ui-mobile,.ui-mobile html,.ui-mobile body{height:100%;margin:0}@-webkit-keyframes still{from{opacity:.99}to{opacity:1}}@-moz-keyframes still{from{opacity:.99}to{opacity:1}}@keyframes still{from{opacity:.99}to{opacity:1}}.modal.out{-webkit-animation:still 450ms;-moz-animation:still 450ms;animation:still 450ms;z-index:-1}.modal.in.reverse{-webkit-animation:still 450ms;-moz-animation:still 450ms;animation:still 450ms;z-index:-1}.modal.in{-webkit-transform:translateY(0);-webkit-animation:slideinfrombottom 450ms;-moz-transform:translateY(0);-moz-animation:slideinfrombottom 450ms;transform:translateY(0);animation:slideinfrombottom 450ms;z-index:0}.modal.out.reverse{-webkit-transform:translateY(0);-webkit-animation:slideouttobottom 450ms;-moz-transform:translateY(0);-moz-animation:slideouttobottom 450ms;transform:translateY(0);animation:slideouttobottom 450ms;z-index:0}.ui-footer{position:absolute;bottom:0;width:100%;z-index:1}.ui-header{position:absolute;top:0;width:100%;z-index:1}.ui-mobile .ui-page{height:100%;min-height:0;overflow:hidden}.ui-content{position:relative;margin:0;padding:0}.ui-content.jqm-content-with-header{top:42px}.ui-content.jqm-content-with-footer{bottom:43px}.jqm-standalone-page{display:block;position:relative}.ui-panel{position:absolute}.ui-panel-closed{display:none}.ui-panel-content-wrap{height:100%}.jqm-panel-container{position:relative;width:100%;height:100%}.ui-panel-dismiss-open{-webkit-transition:-webkit-transform 350ms ease;-moz-transition:-moz-transform 350ms ease;transition:transform 350ms ease;-webkit-transform:translateX(0em);-moz-transform:translateX(0em);transform:translateX(0em);display:block}.jqm-panel-container-open .ui-panel-dismiss-open.ui-panel-dismiss-left{-webkit-transform:translateX(17em);-moz-transform:translateX(17em);transform:translateX(17em)}.jqm-panel-container-open .ui-panel-dismiss-open.ui-panel-dismiss-right{-webkit-transform:translateX(-17em);-moz-transform:translateX(-17em);transform:translateX(-17em)}.ui-mobile-viewport{position:relative;height:100%}</style>');})(window, angular);