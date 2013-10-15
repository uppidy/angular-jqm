/**
 * @ngdoc directive
 * @name jqm.directive:jqmHeader
 * @restrict A
 *
 * @description
 * Defines the header of a `jqm-page`. For a persistent header, put the header directly below `jqmView` / `jqmCachingView`.
 *
 * @example
 <example module="jqm">
 <file name="index.html">
 <div jqm-page class="jqm-standalone-page" style="height: 100px;">
   <div jqm-header>
   <h1>Header of Page1</h1>
   </div>
   Hello world!
 </div>
 </file>
 </example>
 */
/**
 * @ngdoc directive
 * @name jqm.directive:jqmFooter
 * @restrict A
 *
 * @description
 * Defines the footer of a `jqm-page`. For a persistent footer, put the footer directly below `jqmView` / `jqmCachingView`.
 *
 * @example
 <example module="jqm">
 <file name="index.html">
 <div jqm-page class="jqm-standalone-page" style="height: 100px;">
   Hello world!
   <div jqm-footer>
   <h1>Footer of Page1</h1>
   </div>
 </div>
 </file>
 </example>
 */
jqmModule.directive({
  jqmHeader: jqmHeaderFooterDirective('$header', 'ui-header'),
  jqmFooter: jqmHeaderFooterDirective('$footer', 'ui-footer'),
  h1: hxDirective,
  h2: hxDirective,
  h3: hxDirective,
  h4: hxDirective,
  h5: hxDirective,
  h6: hxDirective
});

function jqmHeaderFooterDirective(scopeName, className) {
  return ['jqmConfig', function(jqmConfig) {
    return {
      restrict: 'A',
      // Own scope as we have a different default theme
      // than the page.
      scope: true,
      require: ['^?jqmPage', '^?jqmView'],
      controller: noop,
      link: function(scope, element, attr, ctrls) {
        var hasExplicitTheme = scope.hasOwnProperty('$theme');
        var parentCtrl = ctrls[0] || ctrls[1];

        if (!hasExplicitTheme) {
          scope.$theme = jqmConfig.secondaryTheme;
        }
        element.addClass(className + ' ui-bar-'+scope.$theme);

        //Store header/footer existance on parent - this is so
        //headers can be added or removed with ng-if and
        //the jqm-content-with-* classes will adjust accordingly.
        //See jqmPage.js and jqmPage.html
        if (parentCtrl) {
          //Move headers outside of ui-content in jqmPages
          parentCtrl.$element.prepend(element);
          parentCtrl.$scope[scopeName] = true;

          element.bind('$destroy', function() {
            parentCtrl.$scope[scopeName] = false;
          });
        }
      }
    };
  }];
}

function hxDirective() {
  return {
    restrict: 'E',
    require: ['?^jqmHeader', '?^jqmFooter'],
    link: function(scope, element, attr, ctrls) {
      if (ctrls[0] || ctrls[1]) {
        element.addClass("ui-title");
      }
    }
  };
}
