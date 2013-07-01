/*! angular-jqm - v0.0.1-SNAPSHOT - 2013-07-02
 * https://github.com/opitzconsulting/angular-jqm
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
var jqmModule = angular.module("jqm", ["jqm-templates", "ngMobile"]);

var PAGE_ANIMATION_DEFS = {
    none: {
        sequential: true,
        fallback: 'none'
    },
    slide: {
        sequential: false,
        fallback: 'fade'
    },
    fade: {
        sequential: true,
        fallback: 'fade'
    },
    pop: {
        sequential: true,
        fallback: 'fade'
    },
    slidefade: {
        sequential: true,
        fallback: 'fade'
    },
    slidedown: {
        sequential: true,
        fallback: 'fade'
    },
    slideup: {
        sequential: true,
        fallback: 'fade'
    },
    flip: {
        sequential: true,
        fallback: 'fade'
    },
    turn: {
        sequential: true,
        fallback: 'fade'
    },
    flow: {
        sequential: true,
        fallback: 'fade'
    }
};

registerPageAnimations(PAGE_ANIMATION_DEFS);

function registerPageAnimations(animations) {
    var type;
    for (type in animations) {
        registerPageAnimation(type, false, 'enter');
        registerPageAnimation(type, true, 'enter');
        registerPageAnimation(type, false, 'leave');
        registerPageAnimation(type, true, 'leave');
    }
}

function registerPageAnimation(transitionType, reverse, direction) {
    var ngName = "jqmPage-" + transitionType;

    if (reverse) {
        ngName += "-reverse";
    }
    ngName += "-" + direction;

    jqmModule.animation(ngName, ['$animationComplete', '$sniffer', function (animationComplete, $sniffer) {
        var degradedTransitionType = maybeDegradeTransition(transitionType),
            activePageClass = "ui-page-active",
            toPreClass = "ui-page-pre-in",
            addClasses = degradedTransitionType + (reverse ? " reverse" : ""),
            removeClasses = "out in reverse " + degradedTransitionType,
            viewPortClasses = "ui-mobile-viewport-transitioning viewport-" + degradedTransitionType,
            transitionDef = PAGE_ANIMATION_DEFS[degradedTransitionType];

        if (degradedTransitionType === 'none') {
            return {
                setup: setupNone,
                start: startNone
            };
        } else {
            if (direction === "leave") {
                addClasses += " out";
                removeClasses += " " + activePageClass;
                return {
                    setup: setupLeave,
                    start: start
                };
            } else {
                addClasses += " in " + activePageClass + " " + toPreClass;
                return {
                    setup: setupEnter,
                    start: start
                };
            }
        }

        // --------------

        function setupNone(element) {
            element = firstElement(element);
            if (direction === "leave") {
                element.removeClass(activePageClass);
            } else {
                element.addClass(activePageClass);
            }
        }

        function startNone(element, done) {
            done();
        }

        function setupEnter(element) {
            var synchronization;
            element = firstElement(element);
            synchronization = createSynchronizationIfNeeded(element);
            synchronization.enter(function(done) {
                // -----------
                // This code is from jquery mobile 1.3.1, function "createHandler".
                // Prevent flickering in phonegap container: see comments at #4024 regarding iOS
                element.css("z-index", -10);
                element.addClass(addClasses);
                // Restores visibility of the new page: added together with $to.css( "z-index", -10 );
                element.css("z-index", "");
                element.removeClass(toPreClass);
                // ------------
                animationComplete(element, function() {
                    element.removeClass(removeClasses);
                    done();
                });
            });
            return synchronization;
        }

        function setupLeave(element) {
            var synchronization;
            element = firstElement(element);
            synchronization = createSynchronizationIfNeeded(element);
            synchronization.leave(function(done) {
                element.addClass(addClasses);
                animationComplete(element, function() {
                    element.removeClass(removeClasses);
                    done();
                });
            });
            return synchronization;
        }

        function start(element, done, synchronization) {
            synchronization.bindEnd(done);
        }

        function createSynchronizationIfNeeded(el) {
            var parent = el.parent(),
                sync = parent.data("animationSync");
            if (!sync) {
                if (transitionDef.sequential) {
                    sync = sequentialSynchronization();
                } else {
                    sync = parallelSynchronization();
                }
                sync.bindStart(function() {
                    parent.addClass(viewPortClasses);
                });
                sync.bindEnd(function() {
                    parent.removeClass(viewPortClasses);
                    parent.data("animationSync", null);
                });
                parent.data("animationSync", sync);
            }
            return sync;
        }

        function firstElement(element) {
            var i;
            for (i = 0; i < element.length; i++) {
                if (element[i].nodeType === 1) {
                    return element.eq(i);
                }
            }
            return angular.element();
        }

        function maybeDegradeTransition(transition) {
            if (!$sniffer.cssTransform3d) {
                // Fall back to simple transition in browsers that don't support
                // complex 3d animations.
                transition = PAGE_ANIMATION_DEFS[transition].fallback;
            }
            if (!$sniffer.animations) {
                transition = "none";
            }
            return transition;
        }
    }]);

    function parallelSynchronization() {
        var start = latch(),
            end = latch(),
            runningCount = 0;
        return {
            enter: enter,
            leave: leave,
            bindStart: start.listen,
            bindEnd: end.listen
        };

        function enter(delegate) {
            setup(delegate);
        }

        function leave(delegate) {
            setup(delegate);
        }

        function setup(delegate) {
            start.notify();
            runningCount++;
            delegate(function () {
                runningCount--;
                if (runningCount === 0) {
                    end.notify();
                }
            });
        }

    }

    function sequentialSynchronization() {
        var start = latch(),
            end = latch(),
            enterDelegate,
            leaveDelegate;
        return {
            enter: enter,
            leave: leave,
            bindStart: start.listen,
            bindEnd: end.listen
        };

        function enter(delegate) {
            enterDelegate = delegate;
            start.notify();
            // setTimeout as the leave animation
            // to detect if a leave animation has been used.
            window.setTimeout(function () {
                if (!leaveDelegate) {
                    enterDelegate(function () {
                        end.notify();
                    });
                }
            }, 0);
        }

        function leave(delegate) {
            leaveDelegate = delegate;
            start.notify();
            delegate(function () {
                if (enterDelegate) {
                    enterDelegate(function () {
                        end.notify();
                    });
                } else {
                    end.notify();
                }
            });
        }
    }

    function latch() {
        var _listeners = [],
            _notified = false;
        return {
            listen: listen,
            notify: notify
        };

        function listen(callback) {
            if (_notified) {
                callback();
            } else {
                _listeners.push(callback);
            }
        }

        function notify() {
            if (_notified) {
                return;
            }
            var i;
            for (i = 0; i < _listeners.length; i++) {
                _listeners[i]();
            }
            _notified = true;
        }
    }
}


jqmModule.directive('html', function() {
    return {
        restrict: 'E',
        compile: function(cElement) {
            cElement.addClass("ui-mobile");
        }
    };
});

// set the initial `ui-btn-up-<theme>` class for buttons
jqmModule.directive('ngClick', [function () {
    return function (scope, element, attr) {
        if (element.hasClass('ui-btn') || element.hasClass('jqm-active-toggle')) {
            element.addClass("ui-btn-up-" + scope.$theme);
            element.data('$$jqmActiveToggle', true);
        }
    };
}]);

// set the `ui-btn-down-<theme>` class on buttons on mouse down / touchstart
jqmModule.run([function () {
    var jqLiteProto = angular.element.prototype;
    // Note that this may be called multiple times during tests!
    jqLiteProto._addClass = jqLiteProto._addClass || jqLiteProto.addClass;
    jqLiteProto._removeClass = jqLiteProto._removeClass || jqLiteProto.removeClass;
    jqLiteProto.addClass = function (className) {
        var theme;
        if (className === 'ng-click-active' && this.data('$$jqmActiveToggle')) {
            theme = this.scope().$theme;
            this._removeClass("ui-btn-up-" + theme);
            className += " ui-btn-down-" + theme;
        }
        return this._addClass(className);
    };
    jqLiteProto.removeClass = function (className) {
        var theme;
        if (className === 'ng-click-active' && this.data('$$jqmActiveToggle')) {
            theme = this.scope().$theme;
            this._addClass("ui-btn-up-" + theme);
            className += " ui-btn-down-" + theme;
        }
        return this._removeClass(className);
    };
}]);

/**
 * This directive is very similar to ngViewDirective.
 * However, it allows to cache views including their scopes using the `jqmViewCache`.
 * <p>
 * For this to work the semantics of routes were changed a little:
 *
 * 1. If a route for a cached template is activated, the template and it's scope are taken from the cache.
 *    If the template is not yet cached, it is compiled and then added to the cache.
 * 2. If a route is left, it's scope is disconnected, if it's activated, the scope gets reconnected.
 * 3. All templates that are in `$templateCache` are compiled with a new disconnected scope
 *    when this directive is created.
 * 4. Route controllers are created only on the first time it's route is activated.
 *    Afterwards, they may listen to the `$viewContentLoaded` to be notified that
 *    their route is activated again.
 * <p>
 * Implementation notes:
 *
 * - controllers are not instantiated on startup but on the first matching route, as it's not easy
 *   to determine them from the routes in advance, as routes may use default routes, functions for the
 *   `templateUrl` property, ...
 */
jqmModule.directive('jqmCachingView', ['$jqmViewCache', '$templateCache', '$route', '$anchorScroll', '$compile',
    '$controller', '$animator',
    function (jqmViewCache, $templateCache, $route, $anchorScroll, $compile, $controller, $animator) {
        return {
            restrict: 'ECA',
            terminal: true,
            link: function (scope, element, attr) {
                precompileTemplateCache();

                var lastScope,
                    onloadExp = attr.onload || '',
                    animate = $animator(scope, attr);

                scope.$on('$routeChangeSuccess', update);
                update();


                function destroyLastScope() {
                    if (lastScope) {
                        lastScope.$disconnect();
                        lastScope = null;
                    }
                }

                function clearContent() {

                    var contents = element.contents();
                    contents.remove = detachNodes;
                    animate.leave(contents, element);
                    destroyLastScope();

                    // Note: element.remove() would
                    // destroy all data associated to those nodes,
                    // e.g. widgets, ...
                    function detachNodes() {
                        /*jshint -W040:true*/
                        var i, node, parent;
                        for (i=0; i<this.length; i++) {
                            node = this[i];
                            parent = node.parentNode;
                            if (parent) {
                                parent.removeChild(node);
                            }
                        }
                    }
                }

                function update() {
                    var locals = $route.current && $route.current.locals,
                        template = locals && locals.$template;

                    if (template) {
                        clearContent();
                        var current = $route.current,
                            controller,
                            cacheEntry = compileTemplateIfNeeded(current.loadedTemplateUrl, template);

                        animate.enter(cacheEntry.elements, element);
                        lastScope = current.scope = cacheEntry.scope;
                        lastScope.$reconnect();
                        if (current.controller) {
                            controller = cacheEntry.controller;
                            locals.$scope = lastScope;
                            if (!controller) {
                                controller = cacheEntry.controller = $controller(current.controller, locals);
                                if (current.controllerAs) {
                                    lastScope[current.controllerAs] = controller;
                                }
                                element.children().data('$ngControllerController', controller);
                            }
                        }
                        lastScope.$emit('$viewContentLoaded');
                        lastScope.$eval(onloadExp);
                        // $anchorScroll might listen on event...
                        $anchorScroll();
                    } else {
                        clearContent();
                    }
                }

                function precompileTemplateCache() {
                    var urls = $templateCache.keys();
                    angular.forEach(urls, function (url) {
                        var template, ctrlFn;
                        template = stringToElement($templateCache.get(url));
                        if (angular.isDefined(template.attr('jqm-page')) || angular.isDefined(template.attr('data-jqm-page'))) {
                            compileTemplateIfNeeded(url, template);
                        }
                    });
                }

                function stringToElement(string) {
                    if (string.html) {
                        return string;
                    }
                    return angular.element('<div></div>').html(string).contents();
                }

                function compileTemplateIfNeeded(templateUrl, template) {
                    var enterElements, link, childScope,
                        locals = {},
                        cacheEntry;

                    cacheEntry = jqmViewCache.get(templateUrl);
                    if (!cacheEntry) {
                        enterElements = stringToElement(template);

                        link = $compile(enterElements);

                        childScope = scope.$new();
                        childScope.$disconnect();
                        link(childScope);
                        cacheEntry = {
                            elements: enterElements,
                            scope: childScope
                        };
                        if (templateUrl) {
                            jqmViewCache.put(templateUrl, cacheEntry);
                        }
                    }
                    return cacheEntry;
                }
            }
        };
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
        templateUrl: 'templates/jqmCheckbox.html',
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

            if (ngModelCtrl) {
                enableNgModelCollaboration();
            }

            function isMini() {
                return scope.mini || (jqmControlGroupCtrl && jqmControlGroupCtrl.$scope.mini);
            }

            function getIconPos() {
                return scope.iconpos || (jqmControlGroupCtrl && jqmControlGroupCtrl.$scope.iconpos);
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

jqmModule.directive('jqmControlgroup', function() {
    return {
        restrict: 'A',
        replace: true,
        transclude: true,
        templateUrl: 'templates/jqmControlgroup.html',
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
jqmModule.directive('jqmLiLink', [function() {
    var isdef = angular.isDefined;
    return {
        restrict: 'A',
        transclude: true,
        replace: true,
        templateUrl: 'templates/jqmLiLink.html',
        controller: ['$scope', JqmLiController],
        scope: {
            icon: '@',
            iconpos: '@',
            iconShadow: '@',
            hasThumb: '@',
            link: '@jqmLiLink'
        },
        compile: function(element, attr) {
            attr.icon = isdef(attr.icon) ? attr.icon : 'arrow-r';
            attr.iconpos = isdef(attr.iconpos) ? attr.iconpos : 'right';
            attr.iconShadow = isdef(attr.iconShadow) ? attr.iconShadow : true;
        }
    };
    function JqmLiController($scope) {
    }
}]);


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
            templateUrl: 'templates/jqmLiEntry.html',
            link: function(scope) {
                if (isDivider) {
                    scope.divider = true;
                }
            }
        };
    };
}


jqmModule.directive('jqmListview', [function() {
    var isdef = angular.isDefined;
    return {
        restrict: 'A',
        replace: true,
        transclude: true,
        templateUrl: 'templates/jqmListview.html',
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


/**
 * Sets the given class string once, with no watching.
 * @example
   <div jqm-once-class="body-{{$theme}}"></div.
 */
jqmModule.directive('jqmOnceClass', ['$interpolate', function($interpolate) {
    return {
        compile: function(element, iAttr) {
            //We have to catch the attr value before angular tries to compile it
            var classAttr = $interpolate(iAttr.jqmOnceClass);
            if (classAttr) {
                return function postLink(scope, element, attr) {
                    element.addClass( classAttr(scope) );
                };
            }
        }
    };
}]);

jqmModule.directive('jqmPage', [function () {
    return {
        restrict: 'A',
        link: function (scope, iElement) {
            iElement.addClass('ui-page ui-body-' + scope.$theme);
            scope.$root.$on('$viewContentLoaded', function () {
                // Modify the parent when this page is shown.
                iElement.parent().addClass("ui-overlay-" + scope.$theme);
            });
        }
    };
}]);

/**
 * For every child element that has an own scope this will set the property $position in the child's scope
 * and keep that value updated whenever elements are added, moved or removed from the element.
 *
 * @example
 <div jqm-position-anchor></div>
 And value of $position in the first child:
 {first: true, middle: false, last: false}
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

jqmModule.directive('jqmTheme', [function () {
    return {
        restrict: 'A',
        // Need an own scope so we can distinguish between the parent and the child scope!
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

jqmModule.directive('jqmViewport', ['jqmCachingViewDirective', '$animator', '$history', function (ngViewDirectives, $animator, $history) {
    // Note: Can't use template + replace here,
    // as this might be used on the <body>, which is not supported by angular.
    // So we are calling the ngViewDirective#link functions directly...
    return {
        restrict: 'A',
        compile: function (cElement) {
            cElement.addClass("ui-mobile-viewport");
            return link;
        },
        // for ng-view
        terminal: true
    };
    function link(scope, iElement, iAttrs, ctrl) {
        /*jshint -W040:true*/
        var self = this,
            args = arguments;
        angular.forEach(ngViewDirectives, function (directive) {
            directive.link.apply(self, args);
        });

        scope.$on('$viewContentLoaded', function (scope) {
            // if animations are disabled,
            // add the "ui-page-active" css class manually.
            // E.g. needed for the initial page.
            if (!$animator.enabled()) {
                iElement.children().addClass("ui-page-active");
            }
        });
        scope.$on('$routeChangeStart', function (scope, newRoute) {
            // Use $routeChangeStart and not $watch:
            // Need to update the animate function before
            // ngView evaluates it!
            var transition,
                reverse = $history.activeIndex < $history.previousIndex;
            if (reverse) {
                transition = $history.urlStack[$history.previousIndex].transition;
            } else {
                transition = newRoute.transition;
                if (angular.isFunction(transition)) {
                    transition = transition(newRoute.params);
                }
                $history.urlStack[$history.activeIndex].transition = transition;
            }
            transition = transition || 'none';
            iAttrs.$set('ngAnimate', "'jqmPage-" + transition + (reverse?"-reverse":"")+"'");
        });
    }
}]);

jqmModule.factory('$animationComplete', ['$sniffer', function ($sniffer) {
    return function (el, callback) {
        var eventNames = 'animationend';
        if (!$sniffer.animations) {
            throw new Error("Browser does not support css animations.");
        }
        if ($sniffer.vendorPrefix) {
            eventNames += " " + $sniffer.vendorPrefix.toLowerCase() + "AnimationEnd";
        }
        el.bind(eventNames, callback);
    };
}]);

jqmModule.config(['$provide', function ($provide) {
    $provide.decorator('$browser', ['$delegate', browserHashReplaceDecorator]);
    $provide.decorator('$browser', ['$delegate', '$history', browserHistoryDecorator]);
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

    // Integrates $browser with $history.
    function browserHistoryDecorator($browser, $history) {
        var _url = $browser.url;
        $browser.onUrlChange($history.onUrlChangeBrowser);

        $browser.url = function (url, replace) {
            if (url) {
                // setter
                var res = _url.call(this, url, replace);
                $history.onUrlChangeProgrammatically(url, replace);
                return res;
            } else {
                // getter
                return _url.apply(this, arguments);
            }
        };
        return $browser;
    }
}]);
jqmModule.factory('$history', function $historyFactory() {
    var $history;
    return $history = {
        go: go,
        urlStack: [],
        indexOf: indexOf,
        activeIndex: -1,
        previousIndex: -1,
        onUrlChangeProgrammatically: onUrlChangeProgrammatically,
        onUrlChangeBrowser: onUrlChangeBrowser
    };

    function go(relativeIndex) {
        // Always execute history.go asynchronously.
        // This is required as firefox and IE10 trigger the popstate event
        // in sync. By using a setTimeout we have the same behaviour everywhere.
        // Don't use $defer here as we don't want to trigger another digest cycle.
        // Note that we need at least 20ms to ensure that
        // the hashchange/popstate event for the current page
        // as been delivered (in IE this can take some time...).
        window.setTimeout(function () {
            window.history.go(relativeIndex);
        }, 20);
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

    function findInPast(url) {
        var index = $history.activeIndex - 1;
        while (index >= 0 && $history.urlStack[index].url !== url) {
            index--;
        }
        return index;
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
});

jqmModule.provider('jqmConfig', function() {
    var _defaultTheme = 'c';
    return {
        defaultTheme: defaultTheme,
        $get: serviceFactory
    };

    function defaultTheme(value) {
        if (value) {
            _defaultTheme = value;
        }
        return _defaultTheme;
    }

    function serviceFactory() {
        return {
            defaultTheme: _defaultTheme
        };
    }

});

/**
 * The cache that is used in `jqmCachingView`.
 */
jqmModule.factory("$jqmViewCache", ['$cacheFactory', function($cacheFactory) {
    return $cacheFactory('views');
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
        instrumentScope($rootScope, jqmConfig.defaultTheme);
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
    $provide.decorator('$sniffer', ['$delegate', '$window', function ($sniffer, $window) {
        var fakeBody = angular.element("<body>");
        angular.element($window).prepend(fakeBody);

        $sniffer.cssTransform3d = transform3dTest();

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

    }]);
}]);


jqmModule.config(['$provide', function ($provide) {
    /**
     * Adds a function called `keys` to the $templateCache so that
     * it is possible to inspect the stored templates.
     * Note that the keys might be out of date when templates have been removed.
     */
    $provide.decorator("$templateCache", ['$delegate', function ($templateCache) {
        var keys = [],
            _put = $templateCache.put;
        $templateCache.put = function (key, value) {
            keys.push(key);
            return _put.call(this, key, value);
        };
        $templateCache.keys = function () {
            return keys;
        };
        return $templateCache;

    }]);
}]);
angular.module('jqm-templates', ['templates/jqmCheckbox.html', 'templates/jqmControlgroup.html', 'templates/jqmLiEntry.html', 'templates/jqmLiLink.html', 'templates/jqmListview.html']);

angular.module("templates/jqmCheckbox.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/jqmCheckbox.html",
    "<div jqm-scope-as=\"jqmCheckbox\"\n" +
    "     class=\"ui-checkbox\" ng-class=\"{'ui-disabled': $scopeAs.jqmCheckbox.disabled}\">\n" +
    "    <label ng-class=\"{'ui-checkbox-on': $scopeAs.jqmCheckbox.checked, 'ui-checkbox-off': !$scopeAs.jqmCheckbox.checked,\n" +
    "           'ui-first-child': $scopeAs.jqmCheckbox.$position.first, 'ui-last-child': $scopeAs.jqmCheckbox.$position.last,\n" +
    "           'ui-mini':$scopeAs.jqmCheckbox.isMini(), 'ui-fullsize':!$scopeAs.jqmCheckbox.isMini(),\n" +
    "           'ui-btn-icon-left': $scopeAs.jqmCheckbox.getIconPos()!='right', 'ui-btn-icon-right': $scopeAs.jqmCheckbox.getIconPos()=='right'}\"\n" +
    "           ng-click=\"$scopeAs.jqmCheckbox.toggleChecked()\"\n" +
    "           class=\"ui-btn ui-btn-corner-all\">\n" +
    "        <span class=\"ui-btn-inner\">\n" +
    "            <span class=\"ui-btn-text\" ng-transclude></span>\n" +
    "            <span ng-class=\"{'ui-icon-checkbox-on': $scopeAs.jqmCheckbox.checked, 'ui-icon-checkbox-off': !$scopeAs.jqmCheckbox.checked}\"\n" +
    "                  class=\"ui-icon ui-icon-shadow\"></span>\n" +
    "        </span>\n" +
    "    </label>\n" +
    "    <input type=\"checkbox\" ng-model=\"$scopeAs.jqmCheckbox.checked\">\n" +
    "</div>\n" +
    "");
}]);

angular.module("templates/jqmControlgroup.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/jqmControlgroup.html",
    "<fieldset class=\"ui-controlgroup\"\n" +
    "     ng-class=\"{'ui-mini': mini, 'ui-shadow': shadow, 'ui-corner-all': corners!='false',\n" +
    "     'ui-controlgroup-vertical': type!='horizontal', 'ui-controlgroup-horizontal': type=='horizontal'}\">\n" +
    "    <div ng-if=\"legend\" class=\"ui-controlgroup-label\">\n" +
    "        <legend>{{legend}}</legend>\n" +
    "    </div>\n" +
    "    <div class=\"ui-controlgroup-controls\" ng-transclude jqm-position-anchor></div>\n" +
    "</fieldset>");
}]);

angular.module("templates/jqmLiEntry.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/jqmLiEntry.html",
    "<li class=\"ui-li\"\n" +
    "  jqm-once-class=\"{{divider ? 'ui-li-divider ui-bar-'+$theme : 'ui-li-static jqm-active-toggle'}}\"\n" +
    "  ng-class=\"{'ui-first-child': $position.first, 'ui-last-child': $position.last}\"\n" +
    "  ng-click\n" +
    "  ng-transclude>\n" +
    "</li>\n" +
    "");
}]);

angular.module("templates/jqmLiLink.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/jqmLiLink.html",
    "<li class=\"ui-li ui-btn\"\n" +
    "  jqm-once-class=\"{{icon ? 'ui-li-has-arrow ui-btn-icon-'+iconpos : ''}}\"\n" +
    "  ng-class=\"{'ui-first-child': $position.first, 'ui-last-child': $position.last,\n" +
    "    'ui-li-has-thumb': hasThumb}\"\n" +
    "  ng-click>\n" +
    "  <div class=\"ui-btn-inner ui-li\">\n" +
    "    <div class=\"ui-btn-text\">\n" +
    "      <a ng-href=\"{{link}}\" class=\"ui-link-inherit\" ng-transclude>\n" +
    "      </a>\n" +
    "    </div>\n" +
    "    <span ng-if=\"icon\" class=\"ui-icon ui-icon-{{icon}}\" ng-class=\"{'ui-icon-shadow': iconShadow}\">&nbsp;</span>\n" +
    "  </div>\n" +
    "</li>\n" +
    "");
}]);

angular.module("templates/jqmListview.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/jqmListview.html",
    "<ul class=\"ui-listview\"\n" +
    "  ng-class=\"{'ui-listview-inset': inset, 'ui-corner-all': inset && corners, 'ui-shadow': inset && shadow}\"\n" +
    "  ng-transclude jqm-position-anchor>\n" +
    "</ul>\n" +
    "");
}]);
})(window, angular);