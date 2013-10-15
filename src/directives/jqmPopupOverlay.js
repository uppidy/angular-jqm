jqmModule.directive('jqmPopupOverlay', function() {
  return {
    restrict: 'A',
    replace: true,
    template: '<%= inlineTemplate("templates/jqmPopupOverlay.html") %>'
  };
});
