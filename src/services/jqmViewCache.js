jqmModule.factory('jqmViewCache', ['$cacheFactory', function($cacheFactory) {
  return $cacheFactory('jqmCachingView');
}]);
