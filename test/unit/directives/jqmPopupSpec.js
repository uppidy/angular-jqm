"use strict";
describe('jqmPopup', function() {
  //We can't really test us versus jqm popups because jqm popups are different
  var el, scope, parent, $timeout;
  function compile(popupModel, attr) {
    var elm;
    inject(function($rootScope, $compile, _$timeout_) {
      scope = $rootScope.$new();
      elm = el = angular.element('<div jqm-popup="'+popupModel+'" '+(attr||'')+'>');
      $timeout = _$timeout_;
      parent.append(elm);
      $compile(elm)(scope);
      scope.$apply();
    });
    return elm;
  }

  var target;
  beforeEach(function() {
    parent = angular.element('<div>');
    target = angular.element('<div>');
    compile('poppy', 'class="pop"');
  });

  it('should create a popup scope with show, hide, opened', function() {
    expect(scope.poppy).toBeDefined();
    expect(scope.poppy.opened).toBe(false);
    expect(typeof scope.poppy.show).toBe('function');
    expect(typeof scope.poppy.hide).toBe('function');
  });

  it('should be hidden by default', function() {
    expect(el).toHaveClass('ng-hide');
  });

  it('should create one overlay per popup', function() {
    expect(parent[0].querySelectorAll('.ui-popup-screen').length).toBe(1);
    var popup1 = compile('p2');
    expect(parent[0].querySelectorAll('.ui-popup-screen').length).toBe(2);
  });

  describe('show and hide', function() {

    it('should show', function() {
      scope.poppy.show(target);
      scope.$apply();
      expect(scope.poppy.opened).toBe(true);
      expect(scope.poppy.target[0]).toBe(target[0]);
      expect(el).toHaveClass('ui-popup-open');
    });
    it('should hide', function() {
      scope.poppy.show(target);
      el.triggerHandler('animationend');

      scope.poppy.hide();
      scope.$apply();
      expect(scope.poppy.opened).toBe(false);
      expect(scope.poppy.target).toBeFalsy();
      expect(el).not.toHaveClass('ui-popup-open');
    });
    it('hideForElement should only hide if given element is current target', function() {
      spyOn(scope.poppy, 'hide').andCallThrough();
      scope.poppy.show(target);

      scope.poppy.hideForElement(null);
      expect(scope.poppy.hide).not.toHaveBeenCalled();

      scope.poppy.hideForElement(angular.element('<div>'));
      expect(scope.poppy.hide).not.toHaveBeenCalled();

      scope.poppy.hideForElement(target);
      expect(scope.poppy.hide).toHaveBeenCalled();
    });
  });

  describe('overlay', function() {
    var overlay;
    beforeEach(function() {
      overlay = angular.element(parent[0].querySelector('.ui-popup-screen'));
    });

    it('should show and hide overlay with popup', function() {
      scope.poppy.show(target);
      scope.$apply();
      expect(overlay).toHaveClass('in');
      expect(overlay).not.toHaveClass('ui-screen-hidden');
      scope.poppy.hide();
      scope.$apply();
      expect(overlay).not.toHaveClass('in');
      expect(overlay).toHaveClass('ui-screen-hidden');
    });
  });

  describe('event broadcast', function() {
    var spy;
    beforeEach(inject(function($rootScope) {
      //Don't make the spy be called with the $event object for
      //easier testing
      spy = jasmine.createSpy('$panelStateChanged');
      $rootScope.$on('$popupStateChanged', function($e, popup) {
        spy(popup);
      });
    }));

    it('should broadcast event on open', function() {
      scope.poppy.show(target);
      expect(spy).toHaveBeenCalledWith(scope.poppy);
    });
    it('should broadcast event on close', function() {
      scope.poppy.hide(target);
      expect(spy).toHaveBeenCalledWith(scope.poppy);

      spy.reset();
      scope.poppy.show(target);
      expect(spy).toHaveBeenCalledWith(scope.poppy);

      spy.reset();
      scope.poppy.hide(target);
      expect(spy).toHaveBeenCalledWith(scope.poppy);
    });
  });

  describe('positioning', function() {
    //TODO test positioning with insane mocking 
  });
});
