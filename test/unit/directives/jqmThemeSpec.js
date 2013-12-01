"use strict";
describe('jqmTheme directive', function () {
  beforeEach(module(function($compileProvider) {
    $compileProvider.directive('childScope', function() {
      return {
        scope: true
      }
    });
    $compileProvider.directive('isolateScope', function() {
      return {
        scope: {}
      }
    });
  }));

  it('sets the given theme in the current scope', function () {
    var div = testutils.ng.init('<div jqm-theme="someTheme"></div>');
    expect(div.scope().$theme).toBe('someTheme');

  });

  it('sets the given theme in the same scope twice if no new scope exists', function () {
    var div = testutils.ng.init('<div jqm-theme="parentTheme"><div jqm-theme="childTheme"></div></div>');
    expect(div.scope().$theme).toBe('childTheme');
    expect(div.children().scope().$theme).toBe('childTheme');
  });

  it('sets the theme to the isolate scope if it exists', function() {
    var div = testutils.ng.init('<div jqm-theme="parentTheme"><div isolate-scope jqm-theme="childTheme"></div></div>');
    expect(div.scope().$theme).toBe('parentTheme');
    expect(div.children().scope().$theme).toBe('parentTheme');
    expect(div.children().isolateScope().$theme).toBe('childTheme');
  });

  it('sets the theme to the child scope if it exists', function() {
    var div = testutils.ng.init('<div jqm-theme="parentTheme"><div child-scope jqm-theme="childTheme"></div></div>');
    expect(div.scope().$theme).toBe('parentTheme');
    expect(div.children().scope().$theme).toBe('childTheme');
  });

  it('does not set a theme if no value is given', function () {
    var div = testutils.ng.init('<div jqm-theme="parentTheme"><div isolate-scope jqm-theme=""></div></div>');
    expect(div.children().isolateScope().$theme).toBe('parentTheme');
    expect(div.children().scope().$theme).toBe('parentTheme');
  });

});
