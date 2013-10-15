/**
 * @ngdoc directive
 * @name jqm.directive:jqmPanelContainer
 * @restrict A
 *
 * @description
 * A container for jquery mobile panels.
 *
 * If you wish to use this with a view, you want the jqm-panel-container as the
 * parent of your view and your panels. For example:
 * <pre>
 * <div jqm-panel-container="myPanel">
 *   <div jqm-panel>My Panel!</div>
 *   <div jqm-view></div>
 * </div>
 * </pre>
 *
 * @param {expression=} jqmPanelContainer Assignable angular expression to data-bind the panel's open state to.
 *            This is either `left` (show left panel), `right` (show right panel) or null.
 *
 * @example
<example module="jqm">
  <file name="index.html">
   <div ng-init="state={}"></div>
   <div jqm-panel-container="state.openPanel" style="height:300px;overflow:hidden">
    <div jqm-panel position="left">
      Hello, left panel!
    </div>
    <div jqm-panel position="right" display="overlay">
     Hello, right panel!
    </div>
    <div style="background: white">
       Opened panel: {{state.openPanel}}
       <button ng-click="state.openPanel='left'">Open left</button>
       <button ng-click="state.openPanel='right'">Open right</button>
    </div>
   </div>
  </file>
</example>
 */

jqmModule.directive('jqmPanelContainer', ['$timeout', '$transitionComplete', '$sniffer', function ($timeout, $transitionComplete, $sniffer) {
  return {
    restrict: 'A',
    transclude: true,
    replace: true,
    template: '<%= inlineTemplate("templates/jqmPanelContainer.html") %>',
    scope: {
      openPanelName: '=jqmPanelContainer'
    },
    controller: ['$scope', '$element', JqmPanelContainerCtrl]
  };
  function JqmPanelContainerCtrl($scope, $element) {
    var panels = {},
      panelContent;

    this.addPanel = function (panel) {
      panels[panel.scope.position] = panel;
    };
    this.getPanel = function(position) {
      return panels[position];
    };

    $scope.$watch('$scopeAs.pc.openPanelName', openPanelChanged);
    if (!$sniffer.animations) {
      $scope.$watch('$scopeAs.pc.openPanelName', transitionComplete);
    } else {
      $transitionComplete($element, transitionComplete);
    }

    function openPanelChanged() {
      updatePanelContent();
      angular.forEach(panels, function (panel) {
        var opened = panel.scope.position === $scope.openPanelName;
        if (opened) {
          panel.element.removeClass('ui-panel-closed');
          $timeout(function () {
            $element.addClass('jqm-panel-container-open');
            panel.element.addClass('ui-panel-open');
          }, 1, false);
        } else {
          panel.element.removeClass('ui-panel-open ui-panel-opened');
          $element.removeClass('jqm-panel-container-open');
        }
      });

    }

    //Doing transition stuff in jqmPanelContainer, as
    //we need to listen for transition complete event on either the panel
    //element or the panel content wrapper element. Some panel display
    //types (overlay) only animate the panel, and some (reveal) only
    //animate the content wrapper.
    function transitionComplete() {
      angular.forEach(panels, function (panel) {
        var opened = panel.scope.position === $scope.openPanelName;
        if (opened) {
          panel.element.addClass('ui-panel-opened');
        } else {
          panel.element.addClass('ui-panel-closed');
        }
      });
    }

    function updatePanelContent() {
      var content = findPanelContent();
      var openPanel = panels[$scope.openPanelName],
        openPanelScope = openPanel && openPanel.scope;

      content.addClass('ui-panel-content-wrap ui-panel-animate');

      content.toggleClass('ui-panel-content-wrap-open', !!openPanelScope);

      content.toggleClass('ui-panel-content-wrap-position-left',
        !!(openPanelScope && openPanelScope.position === 'left'));

      content.toggleClass('ui-panel-content-wrap-position-right',
        !!(openPanelScope && openPanelScope.position === 'right'));
      content.toggleClass('ui-panel-content-wrap-display-reveal',
        !!(openPanelScope && openPanelScope.display === 'reveal'));
      content.toggleClass('ui-panel-content-wrap-display-push',
        !!(openPanelScope && openPanelScope.display === 'push'));
      content.toggleClass('ui-panel-content-wrap-display-overlay',
        !!(openPanelScope && openPanelScope.display === 'overlay'));
    }

    function findPanelContent() {
      if (!panelContent) {
        panelContent = jqLite();
        forEach($element.children(), function(node) {
          var el = jqLite(node);
          // ignore panels and the generated ui-panel-dismiss div.
          if (!el.data('$jqmPanelController') && !el.hasClass('ui-panel-dismiss')) {
            panelContent.push(node);
          }
        });
      }
      return panelContent;
    }

    /*
    $scope.$evalAsync(function() {
      setupPull();
    });
    function setupPull() {
      var panelWidth = 17 * 16; //17em
      var content = findPanelContent();
      var dragger = $dragger(content, { mouse: true });
      var contentsTransformer = $transformer(content);
      var width;

      dragger.addListener($dragger.DIRECTION_HORIZONTAL, onPullView);
      
      var panel, panelTransformer;
      function onPullView(eventType, data) {
        var newPos;
        if (eventType === 'start') {
          width = content.prop('offsetWidth');
        } else if (eventType === 'move') {
          if (!panel && (data.origin.x < 50 || data.origin.x > width - 50)) {
            if (data.delta.x > 0) {
              panel = panels.left && panels.left.scope.pullable && panels.left;
            } else if (data.delta.x < 0) {
              panel = panels.right && panels.right.scope.pullable && panels.right;
            }
            if (panel) {
              panelTransformer = $transformer(panel.element);
              panelTransformer.updatePosition();
            }
          }
          if (panel) {
            if (panel.scope.display === 'overlay' || panel.scope.display === 'push') {
              newPos = panel.scope.position === 'left' ?
                clamp(-panelWidth, -panelWidth + data.distance.x, 0) :
                clamp(0, panelWidth + data.distance.x, panelWidth);
              panelTransformer.setTo({x: newPos}, true);
            }
            if (panel.scope.display === 'push' || panel.scope.display === 'reveal') {
              newPos = panel.scope.position === 'left' ? 
                clamp(0, contentsTransformer.pos.x + data.delta.x, panelWidth) :
                clamp(-panelWidth, contentsTransformer.pos.x + data.delta.x, 0);
              contentsTransformer.setTo({x: newPos}, true);
            }
            if ($scope.openPanelName !== panel.scope.position) {
              applyOpenPanelName(panel.scope.position);
            }
          }
        } else if (eventType === 'end') {
          if (panel) {
            var percentOpen = clamp(0, Math.abs(data.distance.x) / panelWidth, 1);
            
            //If we're already there, no need to animate to open/closed spot
            if (percentOpen === 1 || percentOpen === 0) {
              done();
            } else if (percentOpen > 0.25) {
              if (panel.scope.display === 'overlay' || panel.scope.display === 'push') {
                panelTransformer.easeTo({x: 0}, 150, done);
              }
              if (panel.scope.display === 'push' || panel.scope.display === 'reveal') {
                newPos = panel.scope.position === 'left' ? panelWidth : -panelWidth;
                contentsTransformer.easeTo({x: newPos}, 150, done);
              }
            } else {
              if (panel.scope.display === 'overlay' || panel.scope.display === 'push') {
                newPos = panel.scope.position === 'left' ? -panelWidth : panelWidth;
                panelTransformer.easeTo({x: newPos}, 150, doneAndClear);
              }
              if (panel.scope.display === 'push' || panel.scope.display === 'reveal') {
                contentsTransformer.easeTo({x: 0}, 150, doneAndClear);
              }
            }
          }
        }
      }
      function done() {
        if (panel) {
          panel = null;
          panelTransformer.clear();
          contentsTransformer.clear();
        }
      }
      function doneAndClear() {
        if (panel) {
          applyOpenPanelName(null);
          done();
        }
      }
      function clamp(a,b,c) {
        return Math.max(a, Math.min(b, c));
      }
      function applyOpenPanelName(name) {
        $scope.$apply(function() {
          $scope.openPanelName = name;
        });
      }
    }
    */
  }
}]);
