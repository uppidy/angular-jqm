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
 * @param {expression} jqmLoadDialog If the expression is truthy then the element is shown or hidden respectively.
 * @param {string} icon The icon to display in the loading dialog. Default: 'ui-icon-loading'.
 *
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
