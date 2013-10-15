"use strict";
describe('jqmAnimation', function() {

  var elm, $timeout, doneSpy;
  beforeEach(inject(function(_$timeout_) {
    elm = angular.element('<div>');
    doneSpy = jasmine.createSpy('done');
    $timeout = _$timeout_;
  }));

  function fireAnimationEnd() {
    elm.triggerHandler('animationend');
  }
  function getAnimation(name) {
    var animation;
    inject(['.'+ name + '-animation', function(anim) {
      animation = anim;
    }]);
    return animation;
  }

  function animate(name, methodName, className) {
    elm.addClass(name);
    if (className) {
      return getAnimation(name)[methodName](elm, className, doneSpy);
    } else {
      return getAnimation(name)[methodName](elm, doneSpy);
    }
  }

  function expectIn(animationName) {
    expect(elm).not.toHaveClass('in out');

    $timeout.flush();
    expect(elm).toHaveClass(animationName + ' in');

    expect(doneSpy).not.toHaveBeenCalled();
    fireAnimationEnd();
    expect(doneSpy).toHaveBeenCalled();
  }
  function expectOut(animationName) {
    expect(elm).not.toHaveClass('in out');

    $timeout.flush();
    expect(elm).toHaveClass(animationName + ' out');

    expect(doneSpy).not.toHaveBeenCalled();
    fireAnimationEnd();
    expect(doneSpy).toHaveBeenCalled();
  }

  it('enter should animate in', function() {
    animate('slide', 'enter');
    expectIn('slide');
  });
  it('leave should animate out', function() {
    animate('fade', 'leave');
    expectOut('fade');
  });
  it('addClass in should enter', function() {
    animate('flow', 'addClass', 'in');
    expectIn('flow');
  });
  it('addClass out should leave', function() {
    animate('pop', 'addClass', 'out');
    expectOut('pop');
  });
  it('removeClass in should leave', function() {
    animate('slidefade', 'removeClass', 'in');
    expectOut('slidefade');
  });
  it('removeClass out should enter', function() {
    animate('turn', 'removeClass', 'out');
    expectIn('turn');
  });

});
