"use strict";
describe('jqmPageAnimation', function () {
  /*global JQM_PAGE_ANIMTIONS */

  var elm, parent, $timeout;
  beforeEach(inject(function(_$timeout_) {
    elm = angular.element('<span>');
    parent = angular.element('<div>');
    parent.append(elm);
    $timeout = _$timeout_;
  }));

  function getAnimation(name) {
    var animation;
    inject(['.'+ name + '-animation', function(anim) {
      animation = anim;
    }]);
    return animation;
  }
  function fireAnimationEnd() {
    elm.triggerHandler('animationend');
  }

  describe('enter', function() {
    testEnter('flip', false);
  });
  describe('leave', function() {
    testLeave('fade', false);
  });
  describe('class', function() {
    var anim;
    beforeEach(function() {
      elm.addClass('page-flip');
      anim = getAnimation('page-flip');
    });
    it('addClass("in") should enter', function() {
      anim.addClass(elm, 'in');
      $timeout.flush();
      expect(elm).toHaveClass('flip in'); //enter was called
    });
    it('addClass("out") should leave', function() {
      anim.addClass(elm, 'out');
      $timeout.flush();
      expect(elm).toHaveClass('flip out'); //leave was called
    });
  });

  function testEnter(className) {
    var animationName = 'page-'+className;
    it(animationName + ' enter', function() {
      var doneSpy = jasmine.createSpy('done');
      var anim = getAnimation(animationName);
      var onDone = anim.enter(elm, doneSpy);
      expect(elm).toHaveClass('ui-page-pre-in ui-page-active');
      expect(elm.css('z-index')).toEqual('-10');

      $timeout.flush();
      expect(elm).toHaveClass(className + ' in');

      elm.triggerHandler('animationend');
      expect(doneSpy).toHaveBeenCalled();
      onDone();
      expect(elm).not.toHaveClass('ui-page-pre-in in ' + animationName +' reverse '+className);
    });
  }
  function testLeave(className) {
    var animationName = 'page-'+className;
    it(animationName + ' leave', function() {
      var doneSpy = jasmine.createSpy('done');
      var anim = getAnimation(animationName);
      var onDone = anim.leave(elm, doneSpy);

      $timeout.flush();
      expect(elm).toHaveClass(className + ' out');

      elm.triggerHandler('animationend');
      onDone();
      expect(doneSpy).toHaveBeenCalled();
      expect(elm).not.toHaveClass('ui-page-active out reverse ' + className + ' ' + animationName);
    });
  }
});
