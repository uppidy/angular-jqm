/*
 * This is intentionally not documented; internal use only
 */
jqmModule.directive('jqmOnceClass', ['$interpolate', function($interpolate) {
  return {
    compile: function(cElm, cAttr) {
      //catch the attr with $interpolate before $compile catches it and changes it
      var interpolated = $interpolate(cAttr.jqmOnceClass);
      return function(scope, elm, attr) {
        elm.addClass(interpolated(scope));
      };
    }
  };
}]);
