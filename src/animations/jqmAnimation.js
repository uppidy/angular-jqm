
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
        $timeout(function() {
          element.addClass(className);
          unbind = $animationComplete(element, function() {
            cleanup();
            done();
          }, true);
        }, 1, false);

        function cleanup() {
          (unbind || noop)();
          element.removeClass('in out');
        };

        return cleanup;
      };
    }
    var inAnimation = makeAnimationFn('in');
    var outAnimation = makeAnimationFn('out');
    return {
      enter: inAnimation,
      leave: outAnimation,
      move: inAnimation,
      addClass: function(element, className, done) {
        if (className === 'out' || className === 'ng-hide') {
          outAnimation(element, done);
        } else {
          inAnimation(element, done);
        }
      },
      removeClass: function(element, className, done) {
        if (className === 'out' || className === 'ng-hide') {
          inAnimation(element, done);
        } else {
          outAnimation(element, done);
        }
      }
    };
  }]);
}
