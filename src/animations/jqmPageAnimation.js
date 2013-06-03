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

        if (direction === "leave") {
            addClasses += " out";
            removeClasses += " " + activePageClass;
        } else {
            addClasses += " in " + activePageClass + " " + toPreClass;
        }

        if (degradedTransitionType === 'none') {
            return {
                setup: setupNone,
                start: startNone
            };
        } else {
            return {
                setup: setup,
                start: start
            };
        }

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


        function setup(element) {
            var parent,
                data;
            element = firstElement(element);
            parent = element.parent();
            var parentAnimationData = parent.data("animationData") || {
                finished: false,
                doneCallbacks: [],
                onLeaveDone: angular.noop,
                finish: function() {
                    this.finished = true;
                    var i;
                    for (i=0; i<this.doneCallbacks.length; i++) {
                        this.doneCallbacks[i]();
                    }
                    parent.removeClass(viewPortClasses);
                    parent.data("animationData", null);
                },
                addDoneCallback: function(done) {
                    if (this.finished) {
                        done();
                    } else {
                        this.doneCallbacks.push(done);
                    }
                }
            };
            parent.data("animationData", parentAnimationData);
            parent.addClass(viewPortClasses);

            if (direction === "leave") {
                leave(element, parent, parentAnimationData);
            } else {
                if (transitionDef.sequential) {
                    // setTimeout as we don't know if the enter or the leave
                    // animation is started first.
                    // Note: Don't do this for non sequential animations,
                    // as otherwise the animations might get out of sync
                    // (e.g. for slide).
                    parentAnimationData.onLeaveDone = function() {
                        enter(element, parent, parentAnimationData);
                    };
                    window.setTimeout(function() {
                        if (!parentAnimationData.hasLeave) {
                            enter(element, parent, parentAnimationData);
                        }
                    },0);
                } else {
                    enter(element, parent, parentAnimationData);
                }
            }
            return parentAnimationData;
        }

        function start(element, done, parentAnimationData) {
            parentAnimationData.addDoneCallback(done);
        }

        function leave(element, parent, parentAnimationData) {
            parentAnimationData.hasLeave = true;
            element.addClass(addClasses);
            animationComplete(element, function () {
                element.removeClass(removeClasses);
                parentAnimationData.onLeaveDone();
            });
        }

        function enter(element, parent, parentAnimationData) {
            // -----------
            // This code is from jquery mobile 1.3.1, function "createHandler".
            // Prevent flickering in phonegap container: see comments at #4024 regarding iOS
            element.css("z-index", -10);
            element.addClass(addClasses);
            // Restores visibility of the new page: added together with $to.css( "z-index", -10 );
            element.css("z-index", "");
            element.removeClass(toPreClass);
            // ------------
            animationComplete(element, function () {
                element.removeClass(removeClasses);
                // Do the cleanup only during the "enter" event,
                // as that may have been delayed!
                parentAnimationData.finish();
            });
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
}

