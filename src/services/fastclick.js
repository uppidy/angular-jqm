jqmModule.run(['$rootElement', '$document', function($rootElement, $document) {
    /* global FastClick */
    FastClick.attach($rootElement[0]);

    $rootElement.bind('mousedown', function(e) {
        var target = angular.element(e.target);
        var btnElement = parentWithClass(target, 'ui-btn-up-' + target.scope().$theme);
        if (btnElement) {
            toggleBtnDown(btnElement, true);
            target.bind('mouseup', onBtnUp);
            target.bind('mousemove', onBtnUp);
        }
        function onBtnUp() {
            toggleBtnDown(btnElement, false);
            target.unbind('mouseup', onBtnUp);
            target.unbind('mousemove', onBtnUp);
        }
    });
    $rootElement.bind('mouseover', function(e) {
        var target = angular.element(e.target);
        var btnElement = parentWithClass(target, 'ui-btn');
        if (btnElement) {
            toggleBtnHover(btnElement, true);
            target.bind('mouseout', onBtnMouseout);
        }
        function onBtnMouseout() {
            toggleBtnHover(btnElement, false);
            target.unbind('mouseout', onBtnMouseout);
        }
    });

    function toggleBtnDown(el, isDown) {
        var theme = el.scope().$theme;
        el.toggleClass('ui-btn-down-' + theme, isDown);
        el.toggleClass('ui-btn-up-' + theme, !isDown);
    }
    function toggleBtnHover(el, isHover) {
        var theme = el.scope().$theme;
        el.toggleClass('ui-btn-hover-' + theme, isHover);
    }
    function parentWithClass(el, className) {
        var maxDepth = 5;
        var current = el;
        while (current.length && maxDepth--) {
            if (current.hasClass(className)) {
                return current;
            }
            current = current.parent();
        }
        return null;
    }
}]);
