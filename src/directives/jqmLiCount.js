
jqmModule.directive('jqmLiCount', [function() {
  return {
    restrict: 'A',
    replace: true,
    transclude: true,
    require: '^jqmLiLink',
    template: '<%= inlineTemplate("templates/jqmLiCount.html")  %>',
    link: function(scope, elm, attr, jqmLiLinkCtrl) {
      jqmLiLinkCtrl.$scope.hasCount = true;
    }
  };
}]);
