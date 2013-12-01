
jqmModule.directive('jqmLiCount', [function() {
  return {
    restrict: 'A',
    require: '^jqmLiLink',
    compile: function(elm, attr) {
      attr.$set('class', (attr.class || '') + ' ui-li-count ui-btn-corner-all');
      return function(scope, elm, attr, jqmLiLinkCtrl) {
        jqmLiLinkCtrl.$scope.hasCount = true;
      };
    }
  };
}]);
