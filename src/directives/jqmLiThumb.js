
jqmModule.directive('jqmLiThumb', [function() {
  return {
    restrict: 'A',
    require: '^jqmLiLink',
    compile: function(elm, attr) {
      attr.$set('class', (attr.class || '') + ' ui-li-thumb');
      return function(scope, elm, attr, jqmLiLinkCtrl) {
        jqmLiLinkCtrl.$scope.hasThumb = true;
      };
    }
  };
}]);
