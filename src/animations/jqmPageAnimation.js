jqmModule.config(['$provide', function ($provide) {
    $provide.decorator('$animator', ['$delegate', function ($animator) {

        patchedAnimator.enabled = $animator.enabled;
        return patchedAnimator;

        function patchedAnimator(scope, attr) {
            var animation = $animator(scope, attr),
                _leave = animation.leave,
                _enter = animation.enter;
            animation.enter = patchedEnter;
            animation.leave = patchedLeave;
            return animation;

            // if animations are disabled or we have none
            // add the "ui-page-active" css class manually.
            // E.g. needed for the initial page.
            function patchedEnter(elements) {
                var i, el;
                if (!$animator.enabled() || !animationName("enter")) {
                    forEachPage(elements, function(element) {
                        angular.element(element).addClass("ui-page-active");
                    });
                }
                /*jshint -W040:true*/
                return _enter.apply(this, arguments);
            }

            function patchedLeave(elements) {
                if (!$animator.enabled() || !animationName("leave")) {
                    forEachPage(elements, function(element) {
                        angular.element(element).removeClass("ui-page-active");
                    });
                }
                /*jshint -W040:true*/
                return _leave.apply(this, arguments);
            }

            function forEachPage(elements, callback) {
                angular.forEach(elements, function(element) {
                    if (element.className && ~element.className.indexOf('ui-page')) {
                        callback(element);
                    }
                });
            }

            function animationName(type) {
                // Copied from AnimationProvider.
                var ngAnimateValue = scope.$eval(attr.ngAnimate);
                var className = ngAnimateValue ?
                    angular.isObject(ngAnimateValue) ? ngAnimateValue[type] : ngAnimateValue + '-' + type
                    : '';
                return className;
            }
        }
    }]);
}]);

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

function registerPageAnimation(animationType, reverse, direction) {
    var ngName = "page-" + animationType;

    if (reverse) {
        ngName += "-reverse";
    }
    ngName += "-" + direction;

    jqmModule.animation(ngName, ['$animationComplete', '$sniffer', function (animationComplete, $sniffer) {
        var degradedAnimationType = maybeDegradeAnimation(animationType),
            activePageClass = "ui-page-active",
            toPreClass = "ui-page-pre-in",
            addClasses = degradedAnimationType + (reverse ? " reverse" : ""),
            removeClasses = "out in reverse " + degradedAnimationType,
            viewPortClasses = "ui-mobile-viewport-transitioning viewport-" + degradedAnimationType,
            animationDef = PAGE_ANIMATION_DEFS[degradedAnimationType];

        if (degradedAnimationType === 'none') {
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
                addClasses += " in";
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
            if (!animationDef.sequential) {
                synchronization.bindStart(addStartClasses);
            }
            synchronization.enter(function (done) {
                if (animationDef.sequential) {
                    addStartClasses();
                }
                element.css("z-index", -10);
                element.addClass(activePageClass + " " + toPreClass);
                // Browser has settled after setting the page to display:block.
                // Now start the animation and show the page.
                element.addClass(addClasses);
                // Restores visibility of the new page: added together with $to.css( "z-index", -10 );
                element.css("z-index", "");
                element.removeClass(toPreClass);
                animationComplete(element, function () {
                    element.removeClass(removeClasses);
                    done();
                }, true);
            });
            return synchronization;

            function addStartClasses() {
                // Set the new page to display:block but don't show it yet.
                // This code is from jquery mobile 1.3.1, function "createHandler".
                // Prevent flickering in phonegap container: see comments at #4024 regarding iOS
                element.css("z-index", -10);
                element.addClass(activePageClass + " " + toPreClass);
            }
        }

        function setupLeave(element) {
            var synchronization;
            element = firstElement(element);
            synchronization = createSynchronizationIfNeeded(element);
            synchronization.leave(function (done) {
                element.addClass(addClasses);
                animationComplete(element, function () {
                    element.removeClass(removeClasses);
                    done();
                }, true);
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
                if (animationDef.sequential) {
                    sync = sequentialSynchronization();
                } else {
                    sync = parallelSynchronization();
                }
                sync.bindStart(function () {
                    parent.addClass(viewPortClasses);
                });
                sync.bindEnd(function () {
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

        function maybeDegradeAnimation(animation) {
            if (!$sniffer.cssTransform3d) {
                // Fall back to simple animation in browsers that don't support
                // complex 3d animations.
                animation = PAGE_ANIMATION_DEFS[animation].fallback;
            }
            if (!$sniffer.animations) {
                animation = "none";
            }
            return animation;
        }
    }]);

    function parallelSynchronization() {
        var start = latch(),
            startAsync = latch(),
            end = latch(),
            runningCount = 0;
        start.listen(function () {
            // setTimeout to allow
            // the browser to settle after the new page
            // has been set to display:block and before the css animation starts.
            // Without this animations are sometimes not shown,
            // unless you call window.scrollTo or click on a link (weired dependency...)
            window.setTimeout(function () {
                startAsync.notify();
            }, 0);
        });

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
            runningCount++;
            start.notify();
            startAsync.listen(function () {
                delegate(function () {
                    runningCount--;
                    if (runningCount === 0) {
                        end.notify();
                    }
                });
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
            // setTimeout to detect if a leave animation has been used.
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

