"use strict";
describe('jqmLoadDialog', function() {
  var elm, scope;
  function create(loadDialog, attr, content) {
    inject(function($compile, $rootScope) {
      scope = $rootScope.$new();
      elm = $compile('<div jqm-load-dialog="%0" %1>%2</div>'
                     .replace('%0', loadDialog||'')
                     .replace('%1', attr || '')
                     .replace('%2', content || '')
      )(scope);
      scope.$apply();
    });
  }

  it('should create a loadDialog', function() {
    create();
    expect(elm).toHaveClass('ui-loader');
  });
  
  it('should have default ui-icon-loading', function() {
    create();
    expect(elm.children().eq(0)).toHaveClass('ui-icon ui-icon-loading');
  });
  
  it('should have custom icon', function() {
    create('', 'icon="customIcon"');
    expect(elm.children().eq(0)).toHaveClass('ui-icon customIcon');
  });

  it('should transclude content', function() {
    create('','','Hi!');
    expect(elm.text().trim()).toEqual('Hi!');
  });

  it('should be hidden by default', function() {
    create();
    expect(elm).toHaveClass('ng-hide');
  });

  it('should have ui-loader-verbose class if text exists', function() {
    create('','','Hello!');
    expect(elm).toHaveClass('ui-loader-verbose');
    expect(elm).not.toHaveClass('ui-loader-default');
  });

  it('should have ui-loader-default class if no text exists', function() {
    create('','','');
    expect(elm).toHaveClass('ui-loader-default');
    expect(elm).not.toHaveClass('ui-loader-verbose');
  });

  it('should show when expression is true', function() {
    create('value');
    expect(elm).toHaveClass('ng-hide');
    scope.$apply('value = true');
    expect(elm).not.toHaveClass('ng-hide');
    scope.$apply('value = false');
    expect(elm).toHaveClass('ng-hide');
  });

});
