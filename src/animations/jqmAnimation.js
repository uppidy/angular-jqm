
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
        var unbind, finished;
        $timeout(animate, 1, false);
        
        function animate() {
          if (!finished) {
            element.addClass(className);
            unbind = $animationComplete(element, done, true);
          }
        }

        return function cleanup() {
          finished = true;
          (unbind || noop)();
          element.removeClass(className);
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
        if (className === 'ng-hide') {
          return outAnimation(element, done);
        } else {
          return inAnimation(element, done);
        }
      },
      removeClass: function(element, className, done) {
        if (className === 'ng-hide') {
          return inAnimation(element, done);
        } else {
          return outAnimation(element, done);
        }
      }
    };
  }]);
}
