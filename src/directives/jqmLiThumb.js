
jqmModule.directive('jqmLiThumb', [function() {
  return {
    restrict: 'A',
    replace: true,
    require: '^jqmLiLink',
    template: '<%= inlineTemplate("templates/jqmLiThumb.html") %>',
    link: function(scope, elm, attr, jqmLiLinkCtrl) {
      jqmLiLinkCtrl.$scope.hasThumb = true;
    }
  };
}]);
