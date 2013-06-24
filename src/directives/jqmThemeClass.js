jqmModule.directive('jqmThemeClass', ['jqmTheme', function (jqmTheme) {
  return function postLink(scope, element, attrs) {
      if (attrs.jqmThemeClass) {
          var theme = jqmTheme(element);
          element.addClass( attrs.jqmThemeClass.replace(/\$/g, theme) );
      }
  };
}]);
