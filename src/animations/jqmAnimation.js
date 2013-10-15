
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
