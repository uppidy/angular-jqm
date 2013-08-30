jqmModule.run(['jqmButtonToggler', '$rootElement', function(jqmButtonToggler, $rootElement) {
    jqmButtonToggler($rootElement);
}]);
jqmModule.factory('jqmButtonToggler', function() {

    return function(element) {
        var self = {};

        //Exposed for testing
        self.$mousedown = function(e) {
            var target = angular.element(e.target);
            var btnElement = parentWithClass(target, 'ui-btn-up-' + target.scope().$theme);
            if (btnElement) {
                toggleBtnDown(btnElement, true);
                //TODO(1.2): 1.2 fixes unbind breaking on space-seperated events, so do one bind
                target.bind('mouseup', onBtnUp);
                target.bind('mousemove', onBtnUp);
            }
            function onBtnUp() {
                toggleBtnDown(btnElement, false);
                //TODO(1.2): 1.2 fixes unbind breaking on space-seperated events, so do one unbind
                target.unbind('mouseup', onBtnUp);
                target.unbind('mousemove', onBtnUp);
            }
        };

        //Exposed for testing
        self.$mouseover = function(e) {
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
        };

        element.bind('mousedown', self.$mousedown);
        element.bind('mouseover', self.$mouseover);

        return self;

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

    };
});
