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
