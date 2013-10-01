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
