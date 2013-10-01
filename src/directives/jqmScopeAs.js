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
