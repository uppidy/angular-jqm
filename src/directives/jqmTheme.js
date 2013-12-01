/**
 * @ngdoc directive
 * @name jqm.directive:jqmTheme
 * @restrict A
 *
 * @description
 * Sets the jqm theme for this element and it's children by adding a `$theme` property to the scope.
 * Other directives like `jqmCheckbox` evaluate that property.
 *
 * jqmTheme will modify the scope of whichever element you give it, adding `$theme`.  
 * That means if you apply jqmTheme to an element that shares its scope with its parent, 
 * it will set the theme for that element and its parent.  
 * If you explicitly want jqmTheme to set a theme for only itself and its children, 
 * share it with a directive that creates its own scope. 
 *
 * (think this is bad?  come discuss it at [the issue](https://github.com/angular-widgets/angular-jqm/issues/177))
 *
 * @example
 <example module="jqm">
 <file name="index.html">
 <div>
   <div jqm-checkbox jqm-theme="a">Theme a</div>
   <div jqm-checkbox jqm-theme="b">Theme b</div>
 </div>
 </file>
 </example>
 */
jqmModule.directive('jqmTheme', [function () {
  return {
    restrict: 'A',
    compile: function compile() {
      return {
        pre: function preLink(scope, iElement, iAttrs) {
          var themeScope = iElement.isolateScope() || iElement.scope();
          // Set the theme before all other link functions of children
          var theme = iAttrs.jqmTheme;
          if (theme) {
            themeScope.$theme = theme;
          }
        }
      };
    }
  };
}]);
