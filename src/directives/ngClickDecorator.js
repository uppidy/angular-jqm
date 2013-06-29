// set the initial `ui-btn-up-<theme>` class for buttons
jqmModule.directive('ngClick', [function () {
    return function (scope, element, attr) {
        if (element.hasClass('ui-btn') || element.hasClass('jqm-active-toggle')) {
            element.addClass("ui-btn-up-" + scope.$theme);
            element.data('$$jqmActiveToggle', true);
        }
    };
}]);

// set the `ui-btn-down-<theme>` class on buttons on mouse down / touchstart
jqmModule.run([function () {
    var jqLiteProto = angular.element.prototype;
    // Note that this may be called multiple times during tests!
    jqLiteProto._addClass = jqLiteProto._addClass || jqLiteProto.addClass;
    jqLiteProto._removeClass = jqLiteProto._removeClass || jqLiteProto.removeClass;
    jqLiteProto.addClass = function (className) {
        var theme;
        if (className === 'ng-click-active' && this.data('$$jqmActiveToggle')) {
            theme = this.scope().$theme;
            this._removeClass("ui-btn-up-" + theme);
            className += " ui-btn-down-" + theme;
        }
        return this._addClass(className);
    };
    jqLiteProto.removeClass = function (className) {
        var theme;
        if (className === 'ng-click-active' && this.data('$$jqmActiveToggle')) {
            theme = this.scope().$theme;
            this._addClass("ui-btn-up-" + theme);
            className += " ui-btn-down-" + theme;
        }
        return this._removeClass(className);
    };
}]);
