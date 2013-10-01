/**
 * @ngdoc function
 * @name jqm.$loadDialog
 * @requires $rootElement
 * @requires $rootScope
 *
 * @description
 * Shows a wait dialog to indicate some long running work.
 * @example
<example module="jqm">
  <file name="index.html">
  <div ng-controller="DemoCtrl">
    <button ng-click="$loadDialog.hide()">Hide</button>
    <hr />
    <div jqm-textinput placeholder="Dialog Text" ng-model="dialogText"></div>
    <button ng-click="$loadDialog.show(dialogText)">Show{{dialogText && ' with text' || ''}}</button>
    <hr />
    <button ng-click="showForPromise()">waitFor promise</button>
  </div>
  </file>
  <file name="script.js">
  function DemoCtrl($scope, $loadDialog, $timeout, $q) {
    $scope.$loadDialog = $loadDialog;   

    $scope.showForPromise = function() {
    var deferred = $q.defer();
    $timeout(deferred.resolve, 1000);

    $loadDialog.waitFor(deferred.promise, 'Showing for 1000ms promise...');
    };
  }
  </file>
</example>
 */
jqmModule.factory('$loadDialog', ['$rootElement', '$rootScope', function ($rootElement, $rootScope) {

  var rootElement = $rootElement.clone();

  var showCalls = [];
  var loadingClass = 'ui-loading';

  var defaultTemplate = angular.element("<div class='ui-loader ui-corner-all ui-body-d'>" +
    "   <span class='ui-icon ui-icon-loading'></span>" +
    "   <h1></h1>" +
    "</div>");

  $rootElement.append(defaultTemplate);
  defaultTemplate.bind("click", onClick);

  function onClick(event) {
    var lastCall = showCalls[showCalls.length - 1];
    if (lastCall.callback) {
      $rootScope.$apply(function () {
        lastCall.callback.apply(this, arguments);
      });
    }
    // This is required to prevent a second
    // click event, see
    // https://github.com/jquery/jquery-mobile/issues/1787
    event.preventDefault();
  }


  function updateUI() {
    if (showCalls.length > 0) {
      var lastCall = showCalls[showCalls.length - 1];
      var message = lastCall.msg;

      defaultTemplate.removeClass('ui-loader-verbose ui-loader-default');

      if (message) {
        defaultTemplate.addClass('ui-loader-verbose');
        defaultTemplate.find('h1').text(message);
      } else {
        defaultTemplate.addClass('ui-loader-default');
      }

      $rootElement.addClass(loadingClass);
    } else {
      $rootElement.removeClass(loadingClass);
    }
  }

  /**
   * @ngdoc method
   * @name jqm.$loadDialog#show
   * @methodOf jqm.$loadDialog
   *
   * @description
   * Opens the wait dialog and shows the given message (if existing).
   * If the user clicks on the wait dialog the given callback is called.
   * This can be called even if the dialog is currently showing. It will
   * then change the message and revert back to the last message when
   * the hide function is called.
   *
   * @param {string=} message The message to be shown when the wait dialog is displayed.
   * @param {function=} callback The Callback that is executed when the wait dialog is clicked.
   *
   */
  function show() {
    var msg, tapCallback;
    if (typeof arguments[0] === 'string') {
      msg = arguments[0];
    }
    if (typeof arguments[0] === 'function') {
      tapCallback = arguments[0];
    }
    if (typeof arguments[1] === 'function') {
      tapCallback = arguments[1];
    }

    showCalls.push({msg: msg, callback: tapCallback});
    updateUI();
  }

  /**
   * @ngdoc method
   * @name jqm.$loadDialog#hide
   * @methodOf jqm.$loadDialog
   *
   * @description
   * Restores the dialog state before the show function was called.
   *
   */
  function hide() {
    showCalls.pop();
    updateUI();
  }

  function always(promise, callback) {
    promise.then(callback, callback);
  }

  /**
   * @ngdoc method
   * @name jqm.$loadDialog#waitFor
   * @methodOf jqm.$loadDialog
   *
   * @description
   * Shows the dialog as long as the given promise runs. Shows the given message
   * if defined.
   *
   * @param {Promise} promise The Promise.
   * @param {string=} message The message to be show.
   * */
  function waitFor(promise, msg) {
    show(msg);
    always(promise, function () {
      hide();
    });
  }

  /**
   * @ngdoc method
   * @name jqm.$loadDialog#waitForWithCancel
   * @methodOf jqm.$loadDialog
   *
   * @description
   * Same as jqm.$loadDialog#waitFor, but rejects the promise with the given
   * cancelData when the user clicks on the wait dialog.
   *
   * @param {Deferred} The deferred object to cancel the promise.
   * @param {*} cancelData To reject the promise with.
   * @param {string=} message The message to be show.
   */
  function waitForWithCancel(deferred, cancelData, msg) {
    show(msg, function () {
      deferred.reject(cancelData);
    });
    always(deferred.promise, function () {
      hide();
    });
  }

  return {
    show: show,
    hide: hide,
    waitFor: waitFor,
    waitForWithCancel: waitForWithCancel
  };
}]);
