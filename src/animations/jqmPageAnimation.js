
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
        unbind = $animationComplete(element, function(e) {
          //Make sure child-element animation events don't cause page animation end to fire
          if (!e.target || e.target === element[0]) {
            done();
          }
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
        unbind = $animationComplete(element, function(e) {
          //Make sure child-element animation events don't cause page animation end to fire
          if (!e.target || e.target === element[0]) {
            done();
          }
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
