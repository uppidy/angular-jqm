
//angular 1.1.5 mocks has createMockWindow - we use it in many of our tests
//to mock things like $window.innerHeight. angular 1.2 doesn't have it, so we bring it in here.
function jqmCreateMockWindow() {
  var mockWindow = {};
  var setTimeoutQueue = [];

  mockWindow.document = window.document;
  mockWindow.getComputedStyle = angular.bind(window, window.getComputedStyle);
  mockWindow.scrollTo = angular.bind(window, window.scrollTo);
  mockWindow.navigator = window.navigator;
  mockWindow.setTimeout = function(fn, delay) {
    setTimeoutQueue.push({fn: fn, delay: delay});
  };
  mockWindow.setTimeout.queue = setTimeoutQueue;
  mockWindow.setTimeout.expect = function(delay) {
    if (setTimeoutQueue.length > 0) {
      return {
        process: function() {
          var tick = setTimeoutQueue.shift();
          expect(tick.delay).toEqual(delay);
          tick.fn();
        }
      };
    } else {
      expect('SetTimoutQueue empty. Expecting delay of ').toEqual(delay);
    }
  };

  return mockWindow;
}
