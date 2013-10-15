/**
 * @ngdoc directive
 * @name jqm.directive:jqmPage
 * @restrict A
 *
 * @description
 * Creates a jquery mobile page. Also adds automatic overflow scrolling for it's content.
 *
 * @example
 <example module="jqm">
 <file name="index.html">
 <div jqm-page style="height: 100px;">
 <p>Hello world!</p>
 <p>New Line</p>
 <p>New Line</p>
 <p>New Line</p>
 <p>New Line</p>
 <p>New Line</p>
 <p>New Line</p>
 <p>New Line</p>
 <p>New Line</p>
 <p>New Line</p>
 <p>New Line</p>
 </div>
 </file>
 </example>
 */
jqmModule.directive('jqmPage', ['$rootScope', '$controller', '$scroller', function ($rootScope, $controller, $scroller) {
  return {
    restrict: 'A',
    template: '<%= inlineTemplate("templates/jqmPage.html") %>',
    replace: true,
    transclude: true,
    require: '^?jqmView',
    controller: ['$scope', '$element', '$scroller', JqmPageController],
    link: function(scope, element, attr, jqmViewCtrl) {
      if (!jqmViewCtrl) {
        element.addClass('ui-page-active jqm-standalone-page');
      }
    }
  };

  function JqmPageController($scope, $element, $scroller) {
    this.$scope = $scope;
    this.$element = $element;

    var content = jqLite($element[0].querySelector('.ui-content'));
    var scroller = $scroller(content);

    this.scroll = function(newPos, easeTime) {
      if (arguments.length) {
        if (arguments.length === 2) {
          scroller.transformer.easeTo({x:0,y:newPos}, easeTime);
        } else {
          scroller.transformer.setTo({x:0,y:newPos});
        }
      }
      return scroller.transformer.pos;
    };
    this.scrollHeight = function() {
      scroller.calculateHeight();
      return scroller.scrollHeight;
    };
    this.outOfBounds = function(pos) {
      return scroller.outOfBounds(pos);
    };
  }
}]);
