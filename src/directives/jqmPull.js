jqmModule.directive({
  jqmPullLeftPanel: jqmPullPanelDirective('left'),
  jqmPullRightPanel: jqmPullPanelDirective('right')
});
function jqmPullPanelDirective(panelPosition) {
  return function() {
    return {
      restrict: 'A',
      link: postLink,
      require: ['jqmPage', '^?jqmPanelContainer']
    };
  };
  function postLink(scope, elm, attr, ctrls) {
    var panelContainerCtrl = ctrls[1],
    panel = panelContainerCtrl && panelContainerCtrl.getPanel(panelPosition);

    if (panel) {
      panel.scope.pullable = true;
      scope.$on('$destroy', function() {
        panel.scope.pullable = false;
      });
      scope.$on('$disconnect', function() {
        panel.scope.pullable = false;
      });
    }
  }
}
