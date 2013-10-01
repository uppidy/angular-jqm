
jqmModule.directive('jqmLiCount', [function() {
  return {
    restrict: 'A',
    require: '^jqmLiLink',
    link: function(scope, elm, attr, jqmLiLinkCtrl) {
      jqmLiLinkCtrl.$scope.hasCount = true;
      elm.addClass('ui-li-count ui-btn-corner-all ui-btn-up-' + scope.$theme);
    }
  };
}]);
