"use strict";
describe('jqmCachingView', function () {
  var someTemplateUrl = '/someTemplateUrl';
  it('creates a cache using cacheFactory', inject(function (jqmViewCache) {
    var someEntry = {};
    jqmViewCache.put('/someUrl', someEntry);
    expect(jqmViewCache.get('/someUrl')).toBe(someEntry);
  }));
});
