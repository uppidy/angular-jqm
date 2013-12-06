/**
 * @ngdoc directive
 * @name jqm.directive:jqmLoadDialog
 * @restrict A
 *
 * @description
 * Creates a jquery mobile load dialog within the given element, which is shown based on the expression provided to the jqmLoadDialog attribute.
 *
 * Put text inside the jqmLoadDialog to have that text display inside the dialog.
 *
 * Works with animations, the same way as ngShow does.
 *
 * For a global load dialog, place it as a child of the body.
 *
 * If you would like to have loading spinners which track different http requests or promises, we recommend [angular-promise-tracker](http://github.com/ajoslin/angular-promise-tracker).
 *
 * @param {expression} jqmLoadDialog If the expression is truthy then the element is shown or hidden respectively.
 * @param {string} icon The icon to display in the loading dialog. Default: 'ui-icon-loading'.
 *
 * @example
 * <example module="jqm">
    <file name="index.html">
      <div jqm-load-dialog="showBasic"></div>
      <div jqm-button ng-click="showBasic = !showBasic">Toggle Basic Load Dialog</div>

      <div jqm-load-dialog="showAdvanced" icon="ui-icon-home" class="slidedown">
        Fancy, eh?
      </div>
      <div jqm-button ng-click="showAdvanced = !showAdvanced">Toggle Animated Load Dialog</div>
    </file>
  </example>
 */
jqmModule.directive('jqmLoadDialog', ['$animate', '$rootElement', function($animate, $rootElement) {
  return {
    restrict: 'A',
    transclude: true,
    replace: true,
    template: '<%= inlineTemplate("templates/jqmLoadDialog.html") %>',
    scope: {
      icon: '@'
    },
    compile: function(element, attr, transclude) {
      attr.icon = isDefined(attr.icon) ? attr.icon : 'ui-icon-loading';
      return function postLink(scope, element, attr) {
        var h1 = element.children().eq(1);
        scope.$parent.$watch(attr.jqmLoadDialog, function(shown) {
          if (shown) {
            $rootElement.addClass('ui-loading');
            $animate.removeClass(element, 'ng-hide');
          } else {
            $animate.addClass(element, 'ng-hide', function() {
              $rootElement.removeClass('ui-loading');
            });
          }
        });

        //If we transclude some content that actually exists, hasContent = true
        transclude(scope, function(clone) {
          if (clone.length) {
            h1.append(clone);
            scope.hasContent = true;
          }
        });
      };
    }
  };
}]);
